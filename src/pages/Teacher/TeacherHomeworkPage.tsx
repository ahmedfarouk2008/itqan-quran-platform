import React, { useState, useMemo } from 'react';
import {
    Search,
    ChevronLeft,
    Plus,
    User,
    BookOpen,
    Save,
    X,
    Loader
} from 'lucide-react';
import FollowUpTable, { FollowUpRecord } from '../../components/Homework/FollowUpTable';
import '../../styles/pages/teacher-homework.css';
import { useStudents } from '../../hooks/useStudents';
import { useFollowUpRecords } from '../../hooks/useFollowUpRecords';

// ==============================================
// Teacher Homework Page - متابعة الحفظ والمراجعة
// ==============================================

interface TeacherHomeworkPageProps {
    onNavigate: (page: string) => void;
}

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    level: string;
    lastUpdate: string;
}

const emptyRecordData = {
    date: new Date().toISOString().split('T')[0],
    hifzSurah: '',
    hifzFrom: '',
    hifzTo: '',
    hifzGrade: 'جيد جداً',
    revSurah: '',
    revFrom: '',
    revTo: '',
    revGrade: 'جيد جداً',
    notes: ''
};

const TeacherHomeworkPage: React.FC<TeacherHomeworkPageProps> = ({ onNavigate: _onNavigate }) => {
    // 1. Fetch Students
    const { students: firebaseStudents, isLoading: studentsLoading } = useStudents();

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 2. Fetch Records for Selected Student
    // Hooks must be called unconditionally. We pass null if no student selected.
    const {
        records,
        isLoading: recordsLoading,
        addRecord,
        updateRecord,
        deleteRecord
    } = useFollowUpRecords(selectedStudent?.id || null);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyRecordData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter & Map Students
    const filteredStudents = useMemo(() => {
        const mapped = firebaseStudents.map(s => ({
            id: s.id,
            name: s.name,
            avatar: s.avatar_url,
            level: s.level || 'غير محدد',
            lastUpdate: s.updated_at ? new Date(s.updated_at).toLocaleDateString('ar-EG') : 'جديد'
        }));

        return mapped.filter(student =>
            student.name.includes(searchQuery)
        );
    }, [firebaseStudents, searchQuery]);

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
    };

    const handleBack = () => {
        setSelectedStudent(null);
    };

    // --- Actions ---

    const handleAddClick = () => {
        setFormData(emptyRecordData);
        setEditingRecordId(null);
        setShowAddModal(true);
    };

    const handleEditRecord = (record: FollowUpRecord) => {
        setFormData({
            date: record.date,
            hifzSurah: record.hifz.surah,
            hifzFrom: record.hifz.from,
            hifzTo: record.hifz.to,
            hifzGrade: record.hifz.grade,
            revSurah: record.revision.surah,
            revFrom: record.revision.from,
            revTo: record.revision.to,
            revGrade: record.revision.grade,
            notes: record.notes || ''
        });
        setEditingRecordId(record.id);
        setShowAddModal(true);
    };

    const handleDeleteRecord = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            await deleteRecord(id);
        }
    };

    const handleSaveRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dateObj = new Date(formData.date);
            const dayName = dateObj.toLocaleDateString('ar-EG', { weekday: 'long' });

            const recordData = {
                date: formData.date,
                day: dayName,
                hifz: {
                    surah: formData.hifzSurah,
                    from: formData.hifzFrom,
                    to: formData.hifzTo,
                    grade: formData.hifzGrade
                },
                revision: {
                    surah: formData.revSurah,
                    from: formData.revFrom,
                    to: formData.revTo,
                    grade: formData.revGrade
                },
                notes: formData.notes
            };

            if (editingRecordId) {
                await updateRecord(editingRecordId, recordData);
            } else {
                await addRecord(recordData);
            }

            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to save record", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (studentsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="teacher-homework-page animate-fadeIn">
            {!selectedStudent ? (
                /* Students Grid View */
                <>
                    <header className="page-header">
                        <div className="header-content">
                            <h1>
                                <BookOpen size={28} />
                                سجلات المتابعة
                            </h1>
                            <p>اختر طالباً لعرض وتحديث سجل الحفظ والمراجعة</p>
                        </div>
                    </header>

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
                    </div>

                    <div className="students-grid">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="student-card"
                                    onClick={() => handleStudentClick(student)}
                                >
                                    <div className="student-avatar">
                                        {student.avatar ? (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div className="student-info">
                                        <h3>{student.name}</h3>
                                        <span className="student-level">{student.level}</span>
                                        <span className="last-update">آخر تحديث: {student.lastUpdate}</span>
                                    </div>
                                    <ChevronLeft size={20} className="arrow-icon" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                لا يوجد طلاب يطابقون بحثك
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Student Follow-up Details */
                <div className="student-details-view">
                    <header className="details-header">
                        <button className="back-btn" onClick={handleBack}>
                            <ChevronLeft size={20} />
                            رجوع
                        </button>
                        <div className="student-header-info">
                            <h2>{selectedStudent.name}</h2>
                            <span className="level-badge">{selectedStudent.level}</span>
                        </div>
                        <button
                            className="add-record-btn"
                            onClick={handleAddClick}
                        >
                            <Plus size={18} />
                            إضافة سجل يومي
                        </button>
                    </header>

                    {recordsLoading ? (
                        <div className="flex justify-center p-10">
                            <Loader className="animate-spin text-primary-600" size={32} />
                        </div>
                    ) : (
                        <FollowUpTable
                            records={records}
                            isTeacher={true}
                            onEdit={handleEditRecord}
                            onDelete={handleDeleteRecord}
                        />
                    )}
                </div>
            )}

            {/* Add/Edit Record Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="add-session-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>{editingRecordId ? 'تعديل السجل' : 'إضافة سجل يومي'}</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRecord} className="session-form">
                            {/* Date */}
                            <div className="form-group">
                                <label>التاريخ</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Two Columns: Hifz & Revision */}
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Hifz Column */}
                                <div className="column-group">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-600)' }}>الحفظ الجديد</h3>
                                    <div className="form-group">
                                        <label>السورة</label>
                                        <input
                                            type="text"
                                            placeholder="اسم السورة"
                                            value={formData.hifzSurah}
                                            onChange={e => setFormData({ ...formData, hifzSurah: e.target.value })}
                                            style={{ color: 'var(--color-neutral-800)' }}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>من آية</label>
                                            <input
                                                type="text"
                                                value={formData.hifzFrom}
                                                onChange={e => setFormData({ ...formData, hifzFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>إلى آية</label>
                                            <input
                                                type="text"
                                                value={formData.hifzTo}
                                                onChange={e => setFormData({ ...formData, hifzTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>التقدير</label>
                                        <select
                                            value={formData.hifzGrade}
                                            onChange={e => setFormData({ ...formData, hifzGrade: e.target.value })}
                                        >
                                            <option value="ممتاز">ممتاز</option>
                                            <option value="جيد جداً">جيد جداً</option>
                                            <option value="جيد">جيد</option>
                                            <option value="مقبول">مقبول</option>
                                            <option value="إعادة">إعادة</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Revision Column */}
                                <div className="column-group">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary-600)' }}>المراجعة</h3>
                                    <div className="form-group">
                                        <label>السورة</label>
                                        <input
                                            type="text"
                                            placeholder="اسم السورة"
                                            value={formData.revSurah}
                                            onChange={e => setFormData({ ...formData, revSurah: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>من آية</label>
                                            <input
                                                type="text"
                                                value={formData.revFrom}
                                                onChange={e => setFormData({ ...formData, revFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>إلى آية</label>
                                            <input
                                                type="text"
                                                value={formData.revTo}
                                                onChange={e => setFormData({ ...formData, revTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>التقدير</label>
                                        <select
                                            value={formData.revGrade}
                                            onChange={e => setFormData({ ...formData, revGrade: e.target.value })}
                                        >
                                            <option value="ممتاز">ممتاز</option>
                                            <option value="جيد جداً">جيد جداً</option>
                                            <option value="جيد">جيد</option>
                                            <option value="مقبول">مقبول</option>
                                            <option value="إعادة">إعادة</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="form-group">
                                <label>ملاحظات</label>
                                <textarea
                                    rows={3}
                                    placeholder="أية ملاحظات إضافية..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ color: 'var(--color-neutral-800)' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="upload-btn primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="animate-spin" size={18} />
                                        جاري الحفظ...
                                    </span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        حفظ السجل
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherHomeworkPage;
