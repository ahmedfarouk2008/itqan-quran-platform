import React, { useState, useMemo } from 'react';
import {
    Calendar,
    Clock,
    Plus,
    ChevronRight,
    ChevronLeft,
    User,
    BookOpen,
    Check,
    X,
    Edit,
    Trash2,
    Link,
} from 'lucide-react';
import { useSessions, useStudents } from '../../hooks';
import '../../styles/pages/teacher-sessions.css';

// ==============================================
// Teacher Sessions Page - إدارة الجلسات
// ==============================================

interface TeacherSessionsPageProps {
    onNavigate: (page: string) => void;
}

interface Session {
    id: string;
    studentName: string;
    studentAvatar: string | null;
    date: string;
    time: string;
    duration: number;
    type: 'حفظ' | 'مراجعة' | 'تجويد' | 'تفسير';
    surah: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress' | 'pending';
    notes?: string;
    meetingLink?: string;
}

const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const TeacherSessionsPage: React.FC<TeacherSessionsPageProps> = ({ onNavigate: _onNavigate }) => {
    const { sessions: firebaseSessions, updateSession, createSession, deleteSession } = useSessions();
    const { students } = useStudents();
    const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'slots'>('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled' | 'pending'>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

    // Form state for new session
    const [newSessionData, setNewSessionData] = useState({
        studentId: '',
        date: '',
        time: '',
        type: 'حفظ' as 'حفظ' | 'تجويد' | 'تفسير',
        content: '',
        meetingLink: '',
        duration: 60
    });

    // Handle form submission for creating or updating session
    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSessionData.studentId || !newSessionData.date || !newSessionData.time) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        const scheduledAt = `${newSessionData.date}T${newSessionData.time}:00`;

        if (editingSessionId) {
            const { error } = await updateSession(editingSessionId, {
                student_id: newSessionData.studentId,
                type: newSessionData.type,
                duration: newSessionData.duration,
                scheduled_at: scheduledAt,
                notes: newSessionData.content,
                meeting_link: newSessionData.meetingLink
            });

            if (error) {
                alert('حدث خطأ أثناء تحديث الجلسة');
            } else {
                handleCloseModal();
            }
        } else {
            const { error } = await createSession({
                teacher_id: '', // Will be set by the hook using auth
                student_id: newSessionData.studentId,
                type: newSessionData.type,
                duration: newSessionData.duration,
                scheduled_at: scheduledAt,
                notes: newSessionData.content,
                meeting_link: newSessionData.meetingLink
            });

            if (error) {
                alert('حدث خطأ أثناء إنشاء الجلسة');
            } else {
                handleCloseModal();
            }
        }

        setIsSubmitting(false);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingSessionId(null);
        setNewSessionData({
            studentId: '',
            date: '',
            time: '',
            type: 'حفظ',
            content: '',
            meetingLink: '',
            duration: 60
        });
    };

    const handleEditClick = (session: Session) => {
        const student = students.find(s => s.name === session.studentName);
        setNewSessionData({
            studentId: student ? student.id : '',
            date: session.date,
            time: session.time,
            type: session.type === 'مراجعة' ? 'حفظ' : session.type, // Map 'review' back if needed or handle types strictly
            content: session.surah,
            meetingLink: session.meetingLink || '',
            duration: session.duration
        });
        setEditingSessionId(session.id);
        setShowAddModal(true);
    };

    // Map Firebase status to local status
    function mapStatus(fbStatus: string): Session['status'] {
        switch (fbStatus) {
            case 'مؤكدة': return 'scheduled';
            case 'مكتملة': return 'completed';
            case 'ملغاة': return 'cancelled';
            case 'جارية': return 'in-progress';
            case 'قيد المراجعة': return 'pending';
            default: return 'scheduled';
        }
    }

    // Map Firebase sessions to local Session interface
    const sessions: Session[] = useMemo(() => {
        return firebaseSessions.map(s => {
            const student = students.find(st => st.id === s.student_id);
            return {
                id: s.id,
                studentName: student ? student.name : 'Unknown Student',
                studentAvatar: student?.avatar_url || null,
                date: s.scheduled_at.split('T')[0],
                time: new Date(s.scheduled_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                duration: s.duration,
                type: s.type as Session['type'],
                surah: s.notes || 'غير محدد',
                status: mapStatus(s.status),
                notes: s.notes || undefined,
                meetingLink: s.meeting_link || undefined
            };
        });
    }, [firebaseSessions, students]);

    const handleAcceptSession = async (id: string) => {
        const { error } = await updateSession(id, { status: 'مؤكدة' });
        if (error) {
            alert('حدث خطأ أثناء قبول الجلسة');
            console.error(error);
        }
    };

    const handleRejectSession = async (id: string): Promise<boolean> => {
        const { error } = await updateSession(id, { status: 'ملغاة' });
        if (error) {
            alert('حدث خطأ أثناء إلغاء الجلسة');
            console.error(error);
            return false;
        }
        return true;
    };

    const handleDeleteClick = async (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (!session) return;

        if (session.status === 'cancelled') {
            if (window.confirm('هل أنت متأكد من حذف هذه الجلسة الملغاة نهائياً؟')) {
                const { error } = await deleteSession(id);
                if (error) {
                    alert('حدث خطأ أثناء حذف الجلسة');
                }
            }
        } else {
            if (window.confirm('هل أنت متأكد من إلغاء هذه الجلسة؟')) {
                const success = await handleRejectSession(id);
                if (success) {
                    // Optional: alert('تم إلغاء الجلسة بنجاح'); 
                }
            }
        }
    };

    // Slots persistence
    const [selectedSlots, setSelectedSlots] = useState<string[]>(() => {
        const saved = localStorage.getItem('teacher_available_slots');
        return saved ? JSON.parse(saved) : [
            'الأحد-10:00', 'الأحد-11:00',
            'الإثنين-09:00',
            'الثلاثاء-14:00', 'الثلاثاء-15:00'
        ];
    });

    const toggleSlot = (slotId: string) => {
        const newSlots = selectedSlots.includes(slotId)
            ? selectedSlots.filter(id => id !== slotId)
            : [...selectedSlots, slotId];

        setSelectedSlots(newSlots);
        localStorage.setItem('teacher_available_slots', JSON.stringify(newSlots));
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: Session['status']) => {
        switch (status) {
            case 'scheduled':
                return <span className="status-badge scheduled">مجدولة</span>;
            case 'completed':
                return <span className="status-badge completed">مكتملة</span>;
            case 'cancelled':
                return <span className="status-badge cancelled">ملغية</span>;
            case 'in-progress':
                return <span className="status-badge in-progress">جارية</span>;
            case 'pending':
                return <span className="status-badge pending">طلب جديد</span>;
        }
    };

    const getTypeBadge = (type: Session['type']) => {
        const colors: Record<Session['type'], string> = {
            'حفظ': 'hifz',
            'مراجعة': 'review',
            'تجويد': 'tajweed',
            'تفسير': 'tafseer',
        };
        return <span className={`type-badge ${colors[type]}`}>{type}</span>;
    };

    const todaySessions = sessions.filter(
        (s) => s.date === selectedDate.toISOString().split('T')[0]
    );

    const filteredSessions = sessions.filter(
        (s) => filterStatus === 'all' || s.status === filterStatus
    );

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        setSelectedDate(newDate);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const daySessions = sessions.filter((s) => s.date === dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate.toISOString().split('T')[0];

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${daySessions.length > 0 ? 'has-sessions' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-number">{day}</span>
                    {daySessions.length > 0 && (
                        <span className="sessions-count">{daySessions.length}</span>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="teacher-sessions-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Calendar size={28} />
                        إدارة الجلسات
                    </h1>
                    <p>تنظيم وإدارة جلساتك التعليمية</p>
                </div>
                <button className="add-session-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    إضافة جلسة
                </button>
            </div>

            {/* Error Message */}
            {/* We can expose error from useSessions if needed, though mostly handled in hook */}

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    <Calendar size={18} />
                    التقويم
                </button>
                <button
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    <Clock size={18} />
                    القائمة
                </button>
                <button
                    className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
                    onClick={() => setActiveTab('slots')}
                >
                    <Edit size={18} />
                    الأوقات المتاحة
                </button>
            </div>

            {/* Calendar View */}
            {activeTab === 'calendar' && (
                <div className="calendar-view">
                    <div className="calendar-header">
                        <button className="nav-btn" onClick={() => navigateDate('next')}>
                            <ChevronRight size={20} />
                        </button>
                        <h2>
                            {selectedDate.toLocaleDateString('ar-EG', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </h2>
                        <button className="nav-btn" onClick={() => navigateDate('prev')}>
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <div className="calendar-grid">
                        <div className="calendar-weekdays">
                            {weekDays.map((day) => (
                                <div key={day} className="weekday">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="calendar-days">{generateCalendarDays()}</div>
                    </div>

                    <div className="day-sessions">
                        <h3>{formatDate(selectedDate)}</h3>
                        {todaySessions.length === 0 ? (
                            <div className="no-sessions">
                                <Calendar size={48} />
                                <p>لا توجد جلسات في هذا اليوم</p>
                                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                                    <Plus size={18} />
                                    إضافة جلسة
                                </button>
                            </div>
                        ) : (
                            <div className="sessions-list">
                                {todaySessions.map((session) => (
                                    <div key={session.id} className="session-card">
                                        <div className="session-time">
                                            <span className="time">{session.time}</span>
                                            <span className="duration text-xs text-gray-500">{session.duration} دقيقة</span>
                                        </div>

                                        <div className="session-info">
                                            <div className="student-info-group">
                                                <div className="student-avatar">
                                                    {session.studentAvatar ? (
                                                        <img src={session.studentAvatar} alt={session.studentName} />
                                                    ) : (
                                                        session.studentName.charAt(0)
                                                    )}
                                                </div>
                                                <div className="session-details">
                                                    <span className="student-name text-sm font-bold block">{session.studentName}</span>
                                                    <span className="surah text-xs text-gray-500 block">{session.surah}</span>
                                                </div>
                                            </div>

                                            <div className="session-badges">
                                                {getStatusBadge(session.status)}
                                            </div>
                                        </div>

                                        <div className="session-actions">
                                            {session.status !== 'pending' && (
                                                <>

                                                    <button className="action-btn" onClick={() => handleEditClick(session)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn danger" onClick={() => handleDeleteClick(session.id)}>
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {session.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button className="action-btn success" onClick={() => handleAcceptSession(session.id)}>
                                                        <Check size={16} />
                                                        قبول
                                                    </button>
                                                    <button className="action-btn danger" onClick={() => handleRejectSession(session.id)}>
                                                        <X size={16} />
                                                        رفض
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* List View */}
            {activeTab === 'list' && (
                <div className="list-view">
                    <div className="filter-bar">
                        <button
                            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            الكل
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'scheduled' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('scheduled')}
                        >
                            مجدولة
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('completed')}
                        >
                            مكتملة
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('cancelled')}
                        >
                            ملغية
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('pending')}
                        >
                            تنتظر الموافقة
                        </button>
                    </div>

                    <div className="sessions-table">
                        <div className="table-header">
                            <span>الطالبة</span>
                            <span>التاريخ</span>
                            <span>الوقت</span>
                            <span>الحالة</span>
                            <span>إجراءات</span>
                        </div>
                        {filteredSessions.map((session) => (
                            <div key={session.id} className="table-row">
                                <div className="student-cell">
                                    <div className="student-avatar small">
                                        {session.studentAvatar ? (
                                            <img src={session.studentAvatar} alt={session.studentName} />
                                        ) : (
                                            session.studentName.charAt(0)
                                        )}
                                    </div>
                                    <span>{session.studentName}</span>
                                </div>
                                <span>{session.date}</span>
                                <span>{session.time}</span>
                                <span>{getStatusBadge(session.status)}</span>
                                <div className="actions-cell">
                                    {session.status === 'pending' ? (
                                        <>
                                            <button className="icon-btn success" title="قبول" onClick={() => handleAcceptSession(session.id)}>
                                                <Check size={16} />
                                            </button>
                                            <button className="icon-btn danger" title="رفض" onClick={() => handleRejectSession(session.id)}>
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="icon-btn" onClick={() => handleEditClick(session)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="icon-btn danger" onClick={() => handleDeleteClick(session.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Time Slots View */}
            {activeTab === 'slots' && (
                <div className="slots-view">
                    <div className="slots-header">
                        <h3>أوقاتك المتاحة للحجز</h3>
                        <p>حدد الأوقات التي تكونين متاحة فيها للجلسات (اضغط للتفعيل/التعطيل)</p>
                    </div>

                    <div className="slots-grid">
                        {weekDays.map((day) => (
                            <div key={day} className="day-column">
                                <div className="day-header">{day}</div>
                                <div className="time-slots">
                                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => {
                                        const slotId = `${day}-${time}`;
                                        const isSelected = selectedSlots.includes(slotId);
                                        return (
                                            <button
                                                key={time}
                                                className={`time-slot ${isSelected ? 'available' : ''}`}
                                                onClick={() => toggleSlot(slotId)}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="slots-footer">
                        <button className="save-btn" onClick={() => alert('تم حفظ الأوقات المتاحة')}>
                            <Check size={18} />
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            )}

            {/* Add Session Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="add-session-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingSessionId ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="session-form" onSubmit={handleCreateSession}>
                            <div className="form-group">
                                <label>
                                    <User size={18} />
                                    الطالبة
                                </label>
                                <select
                                    value={newSessionData.studentId}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, studentId: e.target.value })}
                                    required
                                >
                                    <option value="">اختر الطالبة</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>{student.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <Calendar size={18} />
                                        التاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={newSessionData.date}
                                        onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <Clock size={18} />
                                        الوقت
                                    </label>
                                    <input
                                        type="time"
                                        value={newSessionData.time}
                                        onChange={(e) => setNewSessionData({ ...newSessionData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <BookOpen size={18} />
                                    المحتوى
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: سورة البقرة (آية 1-20)"
                                    value={newSessionData.content}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, content: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Link size={18} />
                                    رابط الجلسة (Zoom/Google Meet)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://"
                                    className="p-3 border border-gray-200 rounded-lg w-full text-right"
                                    value={newSessionData.meetingLink}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, meetingLink: e.target.value })}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                                    إلغاء
                                </button>
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    <Plus size={18} />
                                    {isSubmitting ? 'جاري الحفظ...' : (editingSessionId ? 'حفظ التغييرات' : 'إضافة الجلسة')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherSessionsPage;
