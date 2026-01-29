import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    Calendar,
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    Clock,
    Award,
    Eye,
    Save, // Import Save icon
} from 'lucide-react';
import { useStudents, useSessions } from '../../hooks'; // Import useSessions
import { UserLevel } from '../../types'; // Import UserLevel enum
import '../../styles/pages/teacher-students.css';

// ==============================================
// Teacher Students Page - إدارة الطلاب
// ==============================================

interface TeacherStudentsPageProps {
    onNavigate: (page: string) => void;
}

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    level: string;
    progress: number;
    lastSession: string;
    nextSession: string | null;
    totalSessions: number;
    memorizedSurahs: number;
    rating: number;
    status: 'active' | 'inactive' | 'new';
    trend: 'up' | 'down' | 'stable';
    joinedAt: string;
    currentSurah: string;
    teacherNotes: Array<{ type: 'warning' | 'success'; text: string; date: string }>;
}

// ... (imports remain the same)

const TeacherStudentsPage: React.FC<TeacherStudentsPageProps> = ({ onNavigate }) => {
    const { students: firebaseStudents, isLoading: studentsLoading, updateStudent } = useStudents();
    const { sessions, isLoading: sessionsLoading } = useSessions(); // Fetch sessions
    const isLoading = studentsLoading || sessionsLoading;

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'new'>('all');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Map Firebase profiles to local Student interface
    const students: Student[] = useMemo(() => {
        return firebaseStudents.map(p => {
            // Calculate session stats dynamically
            const studentSessions = sessions.filter(s => s.student_id === p.id && s.status === 'مكتملة');
            const totalSessions = studentSessions.length;

            // Find last session date
            const lastSessionDate = studentSessions.length > 0
                ? studentSessions.reduce((latest, current) =>
                    new Date(current.scheduled_at) > new Date(latest.scheduled_at) ? current : latest
                ).scheduled_at
                : null;

            return {
                id: p.id,
                name: p.name,
                avatar: p.avatar_url,
                level: p.level || UserLevel.BEGINNER, // Use UserLevel enum or default
                progress: Math.round(((p.memorized_ayahs || 0) / (p.total_surahs ? p.total_surahs * 20 : 6000)) * 100) || 0,
                lastSession: lastSessionDate ? new Date(lastSessionDate).toLocaleDateString('ar-EG') : 'غير محدد',
                nextSession: null, // Could also calculate next session from 'upcomingSessions' if needed
                totalSessions: totalSessions,
                memorizedSurahs: p.memorized_ayahs ? Math.floor(p.memorized_ayahs / 20) : 0,
                rating: p.rating || 0,
                status: p.status || 'active',
                trend: 'stable' as const,
                joinedAt: p.created_at ? new Date(p.created_at).toLocaleDateString('ar-EG') : 'غير محدد',
                currentSurah: p.current_surah || 'لم يبدأ',
                teacherNotes: p.teacher_notes || []
            };
        });
    }, [firebaseStudents, sessions]);

    const selectedStudent = useMemo(() =>
        students.find(s => s.id === selectedStudentId) || null,
        [students, selectedStudentId]);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.includes(searchQuery);
        const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: students.length,
        active: students.filter((s) => s.status === 'active').length,
        inactive: students.filter((s) => s.status === 'inactive').length,
        new: students.filter((s) => s.status === 'new').length,
    };

    // ... (helper functions getStatusBadge, getTrendIcon remain the same)

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'active':
                return <span className="status-badge active">نشط</span>;
            case 'inactive':
                return <span className="status-badge inactive">غير نشط</span>;
            case 'new':
                return <span className="status-badge new">جديد</span>;
        }
    };

    const getTrendIcon = (trend: Student['trend']) => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={16} className="trend-icon up" />;
            case 'down':
                return <TrendingDown size={16} className="trend-icon down" />;
            default:
                return null;
        }
    };

    // Local state for editing form
    const [editForm, setEditForm] = useState<{
        currentSurah: string;
        memorizedAyahs: number;
        status: 'active' | 'inactive' | 'new';
        level: string; // Add level to form state
        newNote: string;
    } | null>(null);

    // Initialize edit form when student is selected
    React.useEffect(() => {
        if (selectedStudent) {
            setEditForm({
                currentSurah: selectedStudent.currentSurah,
                memorizedAyahs: selectedStudent.memorizedSurahs * 20,
                status: selectedStudent.status,
                level: selectedStudent.level, // Init level
                newNote: ''
            });
        }
    }, [selectedStudent]);

    const handleSave = async () => {
        if (!selectedStudent || !editForm) return;

        const updates: any = {};
        if (editForm.currentSurah !== selectedStudent.currentSurah) updates.current_surah = editForm.currentSurah;
        if (editForm.memorizedAyahs !== selectedStudent.memorizedSurahs * 20) updates.memorized_ayahs = editForm.memorizedAyahs;
        if (editForm.status !== selectedStudent.status) updates.status = editForm.status;
        if (editForm.level !== selectedStudent.level) updates.level = editForm.level; // Add level update

        if (Object.keys(updates).length > 0) {
            await updateStudent(selectedStudent.id, updates);
        }

        // Notes handled separately for now, or could be batched
        // If note exists, add it
        if (editForm.newNote.trim()) {
            const newNoteObj = { type: 'warning' as const, text: editForm.newNote, date: new Date().toISOString() };
            const updatedNotes = [...selectedStudent.teacherNotes, newNoteObj];
            await updateStudent(selectedStudent.id, { teacher_notes: updatedNotes });
            setEditForm(prev => prev ? ({ ...prev, newNote: '' }) : null);
        }

        // Close modal after save
        setSelectedStudentId(null);
    };

    return (
        <div className="teacher-students-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Users size={28} />
                        إدارة الطلاب
                    </h1>
                    <p>إجمالي {stats.total} طالب</p>
                </div>
            </div>

            {/* Stats */}
            <div className="students-stats">
                <div className={`stat-item ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">الكل</span>
                </div>
                <div className={`stat-item ${filterStatus === 'active' ? 'active' : ''}`} onClick={() => setFilterStatus('active')}>
                    <span className="stat-value">{stats.active}</span>
                    <span className="stat-label">نشط</span>
                </div>
                <div className={`stat-item ${filterStatus === 'inactive' ? 'active' : ''}`} onClick={() => setFilterStatus('inactive')}>
                    <span className="stat-value">{stats.inactive}</span>
                    <span className="stat-label">غير نشط</span>
                </div>
                <div className={`stat-item ${filterStatus === 'new' ? 'active' : ''}`} onClick={() => setFilterStatus('new')}>
                    <span className="stat-value">{stats.new}</span>
                    <span className="stat-label">جديد</span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="search-filter-bar">
                <div className="search-input">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن طالب..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="filter-btn">
                    <Filter size={20} />
                    فلتر
                </button>
            </div>

            {/* Students Grid */}
            <div className="students-grid">
                {filteredStudents.length === 0 && !isLoading ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3>لا يوجد طالبات</h3>
                        <p>لم يتم العثور على طالبات تطابق بحثك حالياً</p>
                    </div>
                ) : filteredStudents.map((student) => (
                    <div
                        key={student.id}
                        className="student-card"
                        onClick={() => setSelectedStudentId(student.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-header">
                            <div className="student-avatar">
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} />
                                ) : (
                                    student.name.charAt(0)
                                )}
                            </div>
                            <div className="student-info">
                                <h3>{student.name}</h3>
                                <span className="level-badge">{student.level}</span>
                            </div>
                            {getStatusBadge(student.status)}
                            <button className="more-btn" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <span>التقدم العام</span>
                                <span className="progress-value">
                                    {student.progress}%
                                    {getTrendIcon(student.trend)}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                            </div>
                        </div>

                        <div className="student-stats">
                            <div className="stat">
                                <Calendar size={16} />
                                <span>{student.totalSessions} جلسة</span>
                            </div>
                            <div className="stat">
                                <BookOpen size={16} />
                                <span>{student.memorizedSurahs} سورة</span>
                            </div>
                        </div>

                        <div className="session-info">
                            <div className="last-session">
                                <Clock size={14} />
                                <span>آخر جلسة: {student.lastSession}</span>
                            </div>
                            {student.nextSession && (
                                <div className="next-session">
                                    <span>القادمة: {student.nextSession}</span>
                                </div>
                            )}
                        </div>

                        <div className="card-actions">
                            <button className="action-btn primary">
                                <Eye size={16} />
                                عرض التفاصيل
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && editForm && (
                <div className="modal-overlay" onClick={() => setSelectedStudentId(null)}>
                    <div className="student-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            {/* Header content */}
                            <div className="student-info">
                                <h2>{selectedStudent.name}</h2>
                                <span className="level-badge">{selectedStudent.level}</span>
                                {getStatusBadge(editForm.status)}
                            </div>
                            <button className="close-btn" onClick={() => setSelectedStudentId(null)}>
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="detail-section">
                                <h3>إحصائيات التقدم</h3>
                                <div className="detail-stats">
                                    <div className="detail-stat">
                                        <Calendar size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.totalSessions}</span>
                                            <span className="label">جلسة مكتملة</span>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <BookOpen size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.memorizedSurahs}</span>
                                            <span className="label">سورة محفوظة</span>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <Award size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.progress}%</span>
                                            <span className="label">التقدم العام</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3>معلومات الانضمام</h3>
                        <p>انضم {selectedStudent.joinedAt}</p>

                        <div className="detail-section">
                            <h3>تعديل البيانات</h3>
                            <div className="edit-form grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>السورة الحالية</label>
                                    <input
                                        type="text"
                                        className="form-input w-full p-2 border rounded"
                                        value={editForm.currentSurah}
                                        onChange={(e) => setEditForm({ ...editForm, currentSurah: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>عدد الآيات المحفوظة</label>
                                    <input
                                        type="number"
                                        className="form-input w-full p-2 border rounded"
                                        value={editForm.memorizedAyahs}
                                        onChange={(e) => setEditForm({ ...editForm, memorizedAyahs: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>الحالة</label>
                                    <select
                                        className="form-input w-full p-2 border rounded"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                                    >
                                        <option value="active">نشط</option>
                                        <option value="inactive">غير نشط</option>
                                        <option value="new">جديد</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>المستوى</label>
                                    <select
                                        className="form-input w-full p-2 border rounded"
                                        value={editForm.level}
                                        onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                                    >
                                        <option value={UserLevel.BEGINNER}>{UserLevel.BEGINNER}</option>
                                        <option value={UserLevel.INTERMEDIATE}>{UserLevel.INTERMEDIATE}</option>
                                        <option value={UserLevel.ADVANCED}>{UserLevel.ADVANCED}</option>
                                    </select>
                                </div>
                                <div className="form-group col-span-2">
                                    <label>ملاحظات المعلمة (ستظهر للطالب)</label>
                                    <div className="flex gap-2">
                                        <textarea
                                            className="form-input w-full p-2 border rounded"
                                            rows={2}
                                            placeholder="أضف ملاحظة جديدة..."
                                            value={editForm.newNote}
                                            onChange={(e) => setEditForm({ ...editForm, newNote: e.target.value })}
                                        />
                                    </div>

                                    <div className="notes-list mt-2">
                                        {selectedStudent.teacherNotes.map((note, idx) => (
                                            <div key={idx} className="text-sm bg-gray-50 p-2 rounded mb-1 flex justify-between">
                                                <span>{note.text}</span>
                                                <button
                                                    className="text-red-500 text-xs"
                                                    onClick={() => {
                                                        const updated = selectedStudent.teacherNotes.filter((_, i) => i !== idx);
                                                        updateStudent(selectedStudent.id, { teacher_notes: updated });
                                                    }}
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    className="action-btn primary w-full text-center justify-center py-3 text-lg font-bold"
                                    onClick={handleSave}
                                >
                                    <Save size={20} />
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="action-btn primary" onClick={() => onNavigate('teacher-sessions')}>
                                <Calendar size={18} />
                                جدولة جلسة
                            </button>
                            <button className="action-btn" onClick={() => onNavigate('teacher-homework')}>
                                <BookOpen size={18} />
                                إضافة واجب
                            </button>
                            <button className="action-btn" onClick={() => onNavigate('teacher-homework')}>
                                <BookOpen size={18} />
                                متابعة الحفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentsPage;
