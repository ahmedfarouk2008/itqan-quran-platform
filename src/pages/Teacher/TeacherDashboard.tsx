import React, { useState, useMemo } from 'react';
import {
    Users,
    Calendar,
    BookOpen,
    Clock,
    ChevronLeft,
    Play,
    AlertCircle,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSessions, useStudents, useHomework } from '../../hooks';
import '../../styles/pages/teacher-dashboard.css';

// ==============================================
// Teacher Dashboard - لوحة تحكم المعلمة
// ==============================================

interface TeacherDashboardProps {
    onNavigate: (page: string) => void;
}

// ... imports remain the same

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
    const { profile } = useAuth();
    const { upcomingSessions: firebaseSessions, sessions: allSessions, isLoading: sessionsLoading } = useSessions();
    const { students: firebaseStudents, isLoading: studentsLoading } = useStudents();
    const { submittedHomework: firebasePending, isLoading: homeworkLoading } = useHomework();
    const [currentDate] = useState(new Date());

    const isLoading = sessionsLoading || studentsLoading || homeworkLoading;

    // Compute real dashboard stats from Firebase data
    const dashboardStats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = firebaseSessions.filter(s =>
            s.scheduled_at.split('T')[0] === today
        ).length;

        const pendingHomeworkCount = firebasePending.length;

        return {
            totalStudents: firebaseStudents.length,
            activeStudents: firebaseStudents.length, // All students are considered active for now
            todaySessions: todaySessions,
            pendingHomework: pendingHomeworkCount,
        };
    }, [firebaseStudents, firebaseSessions, firebasePending]);

    // Map Firebase sessions to display format
    const upcomingSessions = useMemo(() => {
        return firebaseSessions.slice(0, 3).map((session, index) => {
            const student = firebaseStudents.find(s => s.id === session.student_id);
            return {
                id: session.id,
                studentName: student ? student.name : 'طالب/ة',
                time: new Date(session.scheduled_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                duration: session.duration,
                type: session.type,
                surah: session.notes || 'غير محدد',
                isNext: index === 0,
            };
        });
    }, [firebaseSessions, firebaseStudents]);

    // Map submitted homework (pending teacher review) to reviews
    const pendingReviews = useMemo(() => {
        return firebasePending.slice(0, 3).map(hw => {
            const student = firebaseStudents.find(s => s.id === hw.student_id);
            return {
                id: hw.id,
                studentName: student ? student.name : 'طالب/ة',
                type: hw.type || 'حفظ',
                surah: hw.title || 'غير محدد',
                submittedAt: hw.created_at ? new Date(hw.created_at).toLocaleDateString('ar-EG') : 'غير محدد',
            };
        });
    }, [firebasePending, firebaseStudents]);

    // Dynamic Date Formatting
    const formattedDate = currentDate.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Weekly Calendar Helper
    const renderWeeklyCalendar = () => {
        const days = [];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isToday = date.getDate() === today.getDate();
            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
            const dayNum = date.getDate();
            const dateStr = date.toISOString().split('T')[0];

            // Real sessions count per day
            const sessionsCount = allSessions.filter(s => s.scheduled_at.startsWith(dateStr)).length;

            days.push(
                <div key={i} className={`calendar-day-widget ${isToday ? 'active' : ''}`}>
                    <span className="day-name">{dayName}</span>
                    <span className="day-num">{dayNum}</span>
                    {sessionsCount > 0 && (
                        <span className="session-dot" title={`${sessionsCount} جلسات`}></span>
                    )}
                </div>
            );
        }
        return days;
    };

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
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>مرحباً، {profile?.name || 'يا معلمة'} 👋</h1>
                    <p>لديك {dashboardStats.todaySessions} جلسات اليوم</p>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                        ID: {profile?.id}
                    </div>
                </div>
                <div className="header-date">
                    <Calendar size={18} />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Weekly Calendar Widget */}
            <div className="weekly-calendar-widget">
                <div className="widget-header">
                    <h3>جدول الأسبوع</h3>
                    <div className="nav-arrows">
                        <button><ChevronRight size={16} /></button>
                        <button><ChevronLeft size={16} /></button>
                    </div>
                </div>
                <div className="days-container">
                    {renderWeeklyCalendar()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card students" onClick={() => onNavigate('teacher-students')}>
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.totalStudents}</span>
                        <span className="stat-label">طالباتي</span>
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

                <div className="stat-card homework" onClick={() => onNavigate('teacher-homework')}>
                    <div className="stat-icon">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.pendingHomework}</span>
                        <span className="stat-label">المراجعة</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {/* ... (rest of the render remains the same) */}
            <div className="dashboard-content">
                {/* Today's Sessions */}
                <div className="content-section sessions-section">
                    <div className="section-header">
                        <h2>
                            <Clock size={20} />
                            جلسات اليوم
                        </h2>
                        <button className="view-all-btn" onClick={() => onNavigate('teacher-sessions')}>
                            عرض الكل
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="sessions-list">
                        {upcomingSessions.length === 0 ? (
                            <div className="empty-state">
                                <p>لا توجد جلسات قادمة اليوم</p>
                            </div>
                        ) : upcomingSessions.map((session) => (
                            <div key={session.id} className={`session-card ${session.isNext ? 'next' : ''}`}>
                                {session.isNext && <div className="next-badge">التالية</div>}
                                <div className="session-time">
                                    <span className="time">{session.time}</span>
                                    <span className="duration">{session.duration} دقيقة</span>
                                </div>
                                <div className="session-info">
                                    <div className="student-avatar">
                                        {session.studentName.charAt(0)}
                                    </div>
                                    <div className="session-details">
                                        <span className="student-name">{session.studentName}</span>
                                        <span className="session-type">
                                            {session.type} - {session.surah}
                                        </span>
                                    </div>
                                </div>
                                <button className="start-session-btn" onClick={() => onNavigate('teacher-sessions')}>
                                    <Play size={16} />
                                    {session.isNext ? 'بدء' : 'تفاصيل'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="content-section reviews-section">
                    <div className="section-header">
                        <h2>
                            <AlertCircle size={20} />
                            تنتظر المراجعة
                        </h2>
                        <button className="view-all-btn" onClick={() => onNavigate('teacher-homework')}>
                            المزيد
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="reviews-list">
                        {pendingReviews.length === 0 ? (
                            <div className="empty-state">
                                <p>لا يوجد واجبات للمراجعة</p>
                            </div>
                        ) : pendingReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-avatar">
                                    {review.studentName.charAt(0)}
                                </div>
                                <div className="review-info">
                                    <span className="student-name">{review.studentName}</span>
                                    <span className="review-meta">{review.type} • {review.submittedAt}</span>
                                </div>
                                <button className="review-btn" onClick={() => onNavigate('teacher-homework')}>
                                    مراجعة
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
