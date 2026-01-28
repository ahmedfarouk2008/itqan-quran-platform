import React, { useMemo } from 'react';
import {
    Calendar,
    Clock,
    BookOpen,
    Video,
    ChevronLeft,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { User, HomeworkStatus } from '../../types';
import { useSessions, useHomework, useTeachers } from '../../hooks';
import '../../styles/pages/student-dashboard.css';

// ==============================================
// Student Dashboard - لوحة تحكم الطالب
// ==============================================

interface StudentDashboardProps {
    user: User;
    onNavigate: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onNavigate }) => {
    const { upcomingSessions, isLoading: sessionsLoading } = useSessions();
    const { pendingHomework, isLoading: homeworkLoading } = useHomework();
    const { teachers, isLoading: teachersLoading } = useTeachers();

    const isLoading = sessionsLoading || homeworkLoading || teachersLoading;

    // Get next session
    const nextSession = useMemo(() => {
        if (!upcomingSessions || upcomingSessions.length === 0) return null;
        const session = upcomingSessions[0]; // Assuming sorted by date in hook
        // Find teacher
        const teacher = teachers.find(t => t.id === session.teacher_id);

        return {
            ...session,
            teacherName: teacher ? teacher.name : 'المعلمة'
        };
    }, [upcomingSessions, teachers]);

    // Get next homework
    const nextHomework = useMemo(() => {
        if (!pendingHomework || pendingHomework.length === 0) return null;
        return pendingHomework[0]; // Get first pending homework
    }, [pendingHomework]);

    const formatSessionTime = (date: string) => {
        const d = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dayLabel = '';
        if (d.toDateString() === today.toDateString()) {
            dayLabel = 'اليوم';
        } else if (d.toDateString() === tomorrow.toDateString()) {
            dayLabel = 'غداً';
        } else {
            dayLabel = d.toLocaleDateString('ar-EG', { weekday: 'long' });
        }

        const time = d.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return { dayLabel, time };
    };

    const getHomeworkStatusLabel = (status: HomeworkStatus | string) => {
        switch (status) {
            case HomeworkStatus.NOT_STARTED:
            case 'لم يبدأ':
                return { label: 'لم يبدأ', class: 'status-pending' };
            case HomeworkStatus.SUBMITTED:
            case 'تم الإرسال':
                return { label: 'تم الإرسال', class: 'status-submitted' };
            case HomeworkStatus.REVIEWED:
            case 'تم المراجعة':
                return { label: 'تم المراجعة', class: 'status-completed' };
            default:
                return { label: status, class: '' };
        }
    };

    const sessionTime = nextSession ? formatSessionTime(nextSession.scheduled_at) : null;
    const homeworkStatus = nextHomework ? getHomeworkStatusLabel(nextHomework.status) : null;

    // Calculate days until due
    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'اليوم';
        if (diff === 1) return 'غداً';
        if (diff < 0) return 'متأخر';
        return `بعد ${diff} أيام`;
    };

    if (isLoading) {
        return (
            <div className="student-dashboard animate-fadeIn">
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-dashboard animate-fadeIn">
            {/* Welcome Header */}
            <header className="dashboard-header">
                <div className="header-welcome">
                    <div className="welcome-avatar">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                            alt={user.name}
                            className="avatar avatar-lg"
                        />
                        {/* Streak Badge removed */}
                    </div>
                    <div className="welcome-text">
                        <h1 className="welcome-title">مرحباً، {user.name.split(' ')[0]}</h1>
                        <p className="welcome-subtitle">
                            واصل رحلتك مع القرآن الكريم
                        </p>
                    </div>
                </div>
                <div className="header-stats">
                    {/* Stats removed as per request */}
                </div>
            </header>

            {/* Main Dashboard Cards */}
            <div className="dashboard-cards">
                {/* Next Session Card */}
                <div className="dashboard-card session-card">
                    <div className="card-header">
                        <div className="card-icon card-icon-session">
                            <Video size={20} />
                        </div>
                        <h3 className="card-title">الجلسة القادمة</h3>
                    </div>

                    {nextSession ? (
                        <div className="card-content">
                            <div className="session-time">
                                <span className="time-day">{sessionTime?.dayLabel}</span>
                                <span className="time-hour">{sessionTime?.time}</span>
                            </div>
                            <div className="session-details">
                                <span className="badge badge-hifz">{nextSession.type}</span>
                                <span className="session-duration">
                                    <Clock size={14} />
                                    {nextSession.duration} دقيقة
                                </span>
                            </div>
                            <div className="teacher-info" style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                مع {nextSession.teacherName}
                            </div>
                            <button
                                className="btn btn-primary w-full session-join-btn"
                                onClick={() => onNavigate('sessions')}
                            >
                                <span>انضم للجلسة</span>
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="card-empty">
                            <Calendar size={32} className="empty-icon" />
                            <p>لا توجد جلسات قادمة</p>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => onNavigate('sessions')}
                            >
                                احجز جلسة
                            </button>
                        </div>
                    )}
                </div>

                {/* Progress Card */}
                <div className="dashboard-card progress-card">
                    <div className="card-header">
                        <div className="card-icon card-icon-progress">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="card-title">تقدّم الحفظ</h3>
                    </div>

                    <div className="card-content">
                        <div className="current-target">
                            <span className="target-label">الهدف الحالي</span>
                            <span className="target-surah">سورة الملك</span>
                        </div>

                        <div className="progress-info">
                            <div className="progress-stats">
                                <span className="progress-current">الآية ١٥</span>
                                <span className="progress-total">من ٣٠</span>
                            </div>
                            <div className="progress progress-lg">
                                <div className="progress-bar" style={{ width: '50%' }} />
                            </div>
                        </div>

                        {/* Audio button removed */}
                    </div>
                </div>

                {/* Homework Card */}
                <div className="dashboard-card homework-card">
                    <div className="card-header">
                        <div className="card-icon card-icon-homework">
                            <CheckCircle size={20} />
                        </div>
                        <h3 className="card-title">آخر واجب</h3>
                    </div>

                    {nextHomework ? (
                        <div className="card-content">
                            <div className="homework-info">
                                <h4 className="homework-title">{nextHomework.title}</h4>
                                <div className="homework-meta">
                                    <span className={`badge ${homeworkStatus?.class}`}>
                                        {homeworkStatus?.label}
                                    </span>
                                    <span className="homework-due">
                                        <Clock size={14} />
                                        {getDaysUntilDue(nextHomework.due_date)}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-full"
                                onClick={() => onNavigate('homework')}
                            >
                                {nextHomework.status === 'لم يبدأ' ? 'ابدأ الآن' : 'عرض التفاصيل'}
                            </button>
                        </div>
                    ) : (
                        <div className="card-empty">
                            <CheckCircle size={32} className="empty-icon" />
                            <p>لا توجد واجبات حالياً</p>
                        </div>
                    )}
                </div>

                {/* Teacher Note Card */}
                <div className="dashboard-card note-card">
                    <div className="card-header">
                        <div className="card-icon card-icon-note">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="card-title">ملاحظة المعلمة</h3>
                    </div>

                    <div className="card-content">
                        <div className="teacher-note">
                            <p className="note-text">
                                "أحسنت يا أحمد! تحسّن ملحوظ في مخارج الحروف. ركّز على الغنة في 'إنّ' و'أنّ'."
                            </p>
                            <span className="note-date">منذ يومين</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3 className="quick-actions-title">إجراءات سريعة</h3>
                <div className="quick-actions-grid">
                    <button
                        className="quick-action-btn"
                        onClick={() => onNavigate('sessions')}
                    >
                        <div className="quick-action-icon">
                            <Calendar size={24} />
                        </div>
                        <span>احجز جلسة</span>
                    </button>

                    {/* Audio action removed */}

                    <button
                        className="quick-action-btn"
                        onClick={() => onNavigate('learning')}
                    >
                        <div className="quick-action-icon">
                            <BookOpen size={24} />
                        </div>
                        <span>راجع الأخطاء</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
