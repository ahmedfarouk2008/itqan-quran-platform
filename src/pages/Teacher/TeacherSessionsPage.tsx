import React, { useState } from 'react';
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
    Play,
} from 'lucide-react';
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
    status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
    notes?: string;
}


// Demo data
const sessions: Session[] = [
    {
        id: '1',
        studentName: 'أحمد محمد',
        studentAvatar: null,
        date: '2026-01-25',
        time: '10:00',
        duration: 45,
        type: 'حفظ',
        surah: 'سورة البقرة (آية 100-120)',
        status: 'scheduled',
    },
    {
        id: '2',
        studentName: 'فاطمة علي',
        studentAvatar: null,
        date: '2026-01-25',
        time: '11:00',
        duration: 30,
        type: 'مراجعة',
        surah: 'سورة آل عمران',
        status: 'scheduled',
    },
    {
        id: '3',
        studentName: 'محمد أحمد',
        studentAvatar: null,
        date: '2026-01-25',
        time: '12:30',
        duration: 45,
        type: 'تجويد',
        surah: 'أحكام النون الساكنة',
        status: 'scheduled',
    },
    {
        id: '4',
        studentName: 'سارة أحمد',
        studentAvatar: null,
        date: '2026-01-24',
        time: '10:00',
        duration: 45,
        type: 'حفظ',
        surah: 'سورة الكهف (آية 1-20)',
        status: 'completed',
        notes: 'أداء ممتاز، يحتاج مراجعة آية 15',
    },
    {
        id: '5',
        studentName: 'يوسف محمد',
        studentAvatar: null,
        date: '2026-01-24',
        time: '14:00',
        duration: 30,
        type: 'مراجعة',
        surah: 'سورة يس',
        status: 'cancelled',
    },
];

const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const TeacherSessionsPage: React.FC<TeacherSessionsPageProps> = ({ onNavigate: _onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'slots'>('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

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
                                            <Clock size={16} />
                                            <span>{session.time}</span>
                                            <span className="duration">{session.duration} دقيقة</span>
                                        </div>
                                        <div className="session-info">
                                            <div className="student-avatar">
                                                {session.studentName.charAt(0)}
                                            </div>
                                            <div className="session-details">
                                                <span className="student-name">{session.studentName}</span>
                                                <span className="surah">{session.surah}</span>
                                            </div>
                                            {getTypeBadge(session.type)}
                                            {getStatusBadge(session.status)}
                                        </div>
                                        <div className="session-actions">
                                            {session.status === 'scheduled' && (
                                                <>
                                                    <button className="action-btn primary">
                                                        <Play size={16} />
                                                        بدء
                                                    </button>
                                                    <button className="action-btn">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn danger">
                                                        <X size={16} />
                                                    </button>
                                                </>
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
                    </div>

                    <div className="sessions-table">
                        <div className="table-header">
                            <span>الطالبة</span>
                            <span>التاريخ</span>
                            <span>الوقت</span>
                            <span>النوع</span>
                            <span>الحالة</span>
                            <span>إجراءات</span>
                        </div>
                        {filteredSessions.map((session) => (
                            <div key={session.id} className="table-row">
                                <div className="student-cell">
                                    <div className="student-avatar small">
                                        {session.studentName.charAt(0)}
                                    </div>
                                    <span>{session.studentName}</span>
                                </div>
                                <span>{session.date}</span>
                                <span>{session.time}</span>
                                <span>{getTypeBadge(session.type)}</span>
                                <span>{getStatusBadge(session.status)}</span>
                                <div className="actions-cell">
                                    <button className="icon-btn">
                                        <Edit size={16} />
                                    </button>
                                    <button className="icon-btn danger">
                                        <Trash2 size={16} />
                                    </button>
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
                        <p>حدد الأوقات التي تكونين متاحة فيها للجلسات</p>
                    </div>

                    <div className="slots-grid">
                        {weekDays.map((day) => (
                            <div key={day} className="day-column">
                                <div className="day-header">{day}</div>
                                <div className="time-slots">
                                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                                        <button key={time} className="time-slot available">
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="slots-footer">
                        <button className="save-btn">
                            <Check size={18} />
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            )}

            {/* Add Session Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="add-session-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>إضافة جلسة جديدة</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="session-form">
                            <div className="form-group">
                                <label>
                                    <User size={18} />
                                    الطالبة
                                </label>
                                <select>
                                    <option value="">اختر الطالبة</option>
                                    <option value="1">أحمد محمد</option>
                                    <option value="2">فاطمة علي</option>
                                    <option value="3">محمد أحمد</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <Calendar size={18} />
                                        التاريخ
                                    </label>
                                    <input type="date" />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <Clock size={18} />
                                        الوقت
                                    </label>
                                    <input type="time" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>نوع الجلسة</label>
                                    <select>
                                        <option value="حفظ">حفظ</option>
                                        <option value="مراجعة">مراجعة</option>
                                        <option value="تجويد">تجويد</option>
                                        <option value="تفسير">تفسير</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>المدة (دقيقة)</label>
                                    <select>
                                        <option value="30">30 دقيقة</option>
                                        <option value="45">45 دقيقة</option>
                                        <option value="60">60 دقيقة</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <BookOpen size={18} />
                                    المحتوى
                                </label>
                                <input type="text" placeholder="مثال: سورة البقرة (آية 1-20)" />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    إلغاء
                                </button>
                                <button type="submit" className="submit-btn">
                                    <Plus size={18} />
                                    إضافة الجلسة
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
