import React, { useState, useMemo } from 'react';
import {
    Users,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Play,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSessions, useStudents } from '../../hooks';
import { useTour } from '../../contexts/TourContext';
import '../../styles/pages/teacher-dashboard.css';

// ==============================================
// Teacher Dashboard - لوحة تحكم المعلمة
// ==============================================

interface TeacherDashboardProps {
    onNavigate: (page: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
    const { profile } = useAuth();
    const { sessions, isLoading: sessionsLoading } = useSessions();
    const { students, isLoading: studentsLoading } = useStudents();
    const { startTour } = useTour();
    const [currentDate] = useState(new Date());
    const isLoading = sessionsLoading || studentsLoading;

    // Start tour on mount
    React.useEffect(() => {
        startTour('teacher');
    }, []);

    // Compute real dashboard stats from Firebase data
    const dashboardStats = useMemo(() => {
        const today = new Date();
        const todaySessions = sessions.filter(s => {
            const date = new Date(s.scheduled_at);
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }).length;
        return {
            totalStudents: students.length,
            activeStudents: students.length,
            todaySessions: todaySessions,
            pendingHomework: 0,
        };
    }, [students, sessions]);





    // Dynamic Date Formatting
    const formattedDate = currentDate.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Weekly Calendar Helper
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => {
        setCurrentMonth(prev => {
            const next = new Date(prev);
            next.setMonth(prev.getMonth() + 1);
            return next;
        });
    };

    const prevMonth = () => {
        setCurrentMonth(prev => {
            const prevDate = new Date(prev);
            prevDate.setMonth(prev.getMonth() - 1);
            return prevDate;
        });
    };

    const renderWeeklyCalendar = () => {
        const days = [];
        const today = new Date();
        const currentSelection = selectedDate;

        // Get start and end of the current viewed month
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);

            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            const isSelected = date.getDate() === currentSelection.getDate() &&
                date.getMonth() === currentSelection.getMonth() &&
                date.getFullYear() === currentSelection.getFullYear();

            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
            const dayNum = date.getDate();
            // Real sessions count per day
            const sessionsCount = sessions.filter(s => {
                const sDate = new Date(s.scheduled_at);
                return sDate.getDate() === date.getDate() &&
                    sDate.getMonth() === date.getMonth() &&
                    sDate.getFullYear() === date.getFullYear();
            }).length;

            days.push(
                <div
                    key={i}
                    className={`calendar-day-widget ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDate(date)}
                >
                    <span className="day-name">{dayName}</span>
                    <span className="day-num">{dayNum}</span>
                    <div className="dots-container">
                        {sessionsCount > 0 && <span className="session-dot"></span>}
                        {sessionsCount > 2 && <span className="session-dot"></span>}
                    </div>
                </div>
            );
        }
        return days;
    };

    // Filter sessions based on selected date
    const displayedSessions = useMemo(() => {
        const sessionsForDate = sessions.filter(s => {
            const sDate = new Date(s.scheduled_at);
            return sDate.getDate() === selectedDate.getDate() &&
                sDate.getMonth() === selectedDate.getMonth() &&
                sDate.getFullYear() === selectedDate.getFullYear();
        });

        return sessionsForDate.map((session) => {
            const student = students.find(s => s.id === session.student_id);
            return {
                id: session.id,
                studentName: student ? student.name : 'طالب/ة',
                time: new Date(session.scheduled_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                duration: session.duration,
                type: session.type,
                surah: session.notes || 'غير محدد',
                isNext: false, // Only relevant for future sessions logic if needed
            };
        });
    }, [selectedDate, sessions, students]);

    if (isLoading) {
        return (
            <div className="teacher-dashboard animate-fadeIn">
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard animate-fadeIn">
            {/* Header */}
            <header className="dashboard-header" id="tour-teacher-welcome">
                <div className="header-welcome">
                    <h1 style={{ color: 'white' }}>مرحباً، {profile?.name || 'يا معلمة'} 👋</h1>
                    <p style={{ color: 'white' }}>لديك {dashboardStats.todaySessions} جلسات اليوم</p>
                </div>
                <div className="header-date">
                    <Calendar size={18} />
                    <span>{formattedDate}</span>
                </div>
            </header>

            {/* Weekly Calendar Widget */}
            <div className="weekly-calendar-widget">
                <div className="widget-header">
                    <h3>جدول الأسبوع</h3>
                    {/* Calendar Navigation Header */}
                    <div className="calendar-navigation" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={nextMonth}
                            className="nav-btn"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ChevronRight size={20} />
                        </button>
                        <span className="selected-date-label">
                            {currentMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={prevMonth}
                            className="nav-btn"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>
                <div className="days-scroll-container">
                    {renderWeeklyCalendar()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" id="tour-teacher-stats">
                <div className="stat-card students" onClick={() => onNavigate('teacher-students')}>
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.totalStudents}</span>
                        <span className="stat-label">طلابي</span>
                    </div>
                </div>

                <div className="stat-card sessions" onClick={() => onNavigate('teacher-sessions')}>
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.todaySessions}</span>
                        <span className="stat-label">جلسات اليوم</span>
                    </div>
                </div>

            </div>
            {/* Main Content */}
            <div className="dashboard-content">
                {/* Daily Sessions */}
                <div className="content-section sessions-section">
                    <div className="section-header">
                        <h2>
                            <Clock size={20} />
                            جلسات {selectedDate.getDate() === new Date().getDate() ? 'اليوم' : selectedDate.toLocaleDateString('ar-EG', { weekday: 'long' })}
                        </h2>
                        <button className="view-all-btn" onClick={() => onNavigate('teacher-sessions')}>
                            عرض الكل
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="sessions-list">
                        {displayedSessions.length === 0 ? (
                            <div className="empty-state">
                                <p>لا توجد جلسات في هذا اليوم</p>
                            </div>
                        ) : displayedSessions.map((session) => (
                            <div key={session.id} className={`session-card ${session.isNext ? 'next' : ''}`} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                marginBottom: '0.8rem',
                                gap: '1rem'
                            }}>
                                {session.isNext && <div className="next-badge">التالية</div>}

                                <div className="session-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <h4 className="student-name" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{session.studentName}</h4>
                                    <div className="session-details" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span className="session-type">{session.type}</span>
                                        <span>•</span>
                                        <span className="session-surah">{session.surah}</span>
                                    </div>
                                </div>

                                <div className="session-time" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span className="time" style={{ fontWeight: 600, color: 'var(--primary)' }}>{session.time}</span>
                                    <span className="duration" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{session.duration} دقيقة</span>
                                </div>

                                <button className="start-session-btn" onClick={() => onNavigate('teacher-sessions')} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--primary-light)',
                                    background: 'var(--primary-bg)',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}>
                                    {session.isNext ? 'بدء' : 'تفاصيل'}
                                    <Play size={14} style={{ transform: 'rotate(180deg)' }} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
