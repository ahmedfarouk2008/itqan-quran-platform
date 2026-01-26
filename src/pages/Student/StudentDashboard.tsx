import React from 'react';
import {
    Calendar,
    Clock,
    BookOpen,
    Video,
    ChevronLeft,
    Flame,
    Star,
    Mic,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { User, Session, Homework, SessionStatus, HomeworkStatus } from '../../types';
import '../../styles/pages/student-dashboard.css';

// ==============================================
// Student Dashboard - لوحة تحكم الطالب
// ==============================================

interface StudentDashboardProps {
    user: User;
    onNavigate: (tab: string) => void;
}

// Mock data - will be replaced with real data from Firebase
const mockNextSession: Session | null = {
    id: '1',
    studentId: '1',
    teacherId: '1',
    type: 'حفظ' as any,
    status: SessionStatus.CONFIRMED,
    duration: 45,
    scheduledAt: new Date(Date.now() + 3600000 * 4).toISOString(), // 4 hours from now
    createdAt: new Date().toISOString(),
};

const mockHomework: Homework | null = {
    id: '1',
    studentId: '1',
    teacherId: '1',
    title: 'تسميع سورة الملك ١-١٥',
    description: 'تسميع الآيات مع مراعاة أحكام التجويد',
    type: 'حفظ' as any,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    status: HomeworkStatus.NOT_STARTED,
    createdAt: new Date().toISOString(),
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onNavigate }) => {
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

    const getHomeworkStatusLabel = (status: HomeworkStatus) => {
        switch (status) {
            case HomeworkStatus.NOT_STARTED:
                return { label: 'لم يبدأ', class: 'status-pending' };
            case HomeworkStatus.SUBMITTED:
                return { label: 'تم الإرسال', class: 'status-submitted' };
            case HomeworkStatus.REVIEWED:
                return { label: 'تم المراجعة', class: 'status-completed' };
            default:
                return { label: status, class: '' };
        }
    };

    const sessionTime = mockNextSession ? formatSessionTime(mockNextSession.scheduledAt) : null;
    const homeworkStatus = mockHomework ? getHomeworkStatusLabel(mockHomework.status) : null;

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
                        {/* Streak Badge */}
                        <div className="streak-badge">
                            <Flame size={14} />
                            <span>12</span>
                        </div>
                    </div>
                    <div className="welcome-text">
                        <h1 className="welcome-title">مرحباً، {user.name.split(' ')[0]}</h1>
                        <p className="welcome-subtitle">
                            واصل رحلتك مع القرآن الكريم
                        </p>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <Star size={18} className="stat-icon" />
                        <span className="stat-value">450</span>
                        <span className="stat-label">نقطة</span>
                    </div>
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

                    {mockNextSession ? (
                        <div className="card-content">
                            <div className="session-time">
                                <span className="time-day">{sessionTime?.dayLabel}</span>
                                <span className="time-hour">{sessionTime?.time}</span>
                            </div>
                            <div className="session-details">
                                <span className="badge badge-hifz">{mockNextSession.type}</span>
                                <span className="session-duration">
                                    <Clock size={14} />
                                    {mockNextSession.duration} دقيقة
                                </span>
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

                        <button
                            className="btn btn-secondary w-full"
                            onClick={() => onNavigate('learning')}
                        >
                            <Mic size={18} />
                            <span>أرسل تسميع صوتي</span>
                        </button>
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

                    {mockHomework ? (
                        <div className="card-content">
                            <div className="homework-info">
                                <h4 className="homework-title">{mockHomework.title}</h4>
                                <div className="homework-meta">
                                    <span className={`badge ${homeworkStatus?.class}`}>
                                        {homeworkStatus?.label}
                                    </span>
                                    <span className="homework-due">
                                        <Clock size={14} />
                                        {getDaysUntilDue(mockHomework.dueDate)}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-full"
                                onClick={() => onNavigate('homework')}
                            >
                                {mockHomework.status === HomeworkStatus.NOT_STARTED ? 'ابدأ الآن' : 'عرض التفاصيل'}
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

                    <button
                        className="quick-action-btn"
                        onClick={() => onNavigate('learning')}
                    >
                        <div className="quick-action-icon">
                            <Mic size={24} />
                        </div>
                        <span>ارفع تسميع</span>
                    </button>

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
