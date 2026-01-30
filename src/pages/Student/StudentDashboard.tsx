import React, { useMemo } from 'react';
import {
    Calendar,
    Clock,
    BookOpen,
    Video,
    ChevronLeft,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useSessions, useTeachers } from '../../hooks';
import { useFollowUpRecords } from '../../hooks/useFollowUpRecords';
import '../../styles/pages/student-dashboard.css';

// ==============================================
// Student Dashboard - لوحة تحكم الطالب
// ==============================================

import { useTour } from '../../contexts/TourContext';

interface StudentDashboardProps {
    user: {
        id: string;
        name: string;
        // ... other props
        [key: string]: any;
    };
    onNavigate: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onNavigate }) => {
    const { upcomingSessions, isLoading: sessionsLoading } = useSessions();
    const { teachers, isLoading: teachersLoading } = useTeachers();
    const { records: followUpRecords, isLoading: recordsLoading } = useFollowUpRecords(user.id);
    const { startTour } = useTour();

    // Start tour on mount
    React.useEffect(() => {
        startTour('student');
    }, []);

    const isLoading = sessionsLoading || teachersLoading || recordsLoading;

    // Get latest teacher note
    const latestNote = useMemo(() => {
        if (!followUpRecords || followUpRecords.length === 0) return null;
        // Find first record with notes
        const recordWithNote = followUpRecords.find(r => r.notes && r.notes.trim().length > 0);
        return recordWithNote ? { text: recordWithNote.notes, date: recordWithNote.date } : null;
    }, [followUpRecords]);

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

    const sessionTime = nextSession ? formatSessionTime(nextSession.scheduled_at) : null;

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
                    <div className="welcome-text" id="tour-student-welcome">
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
                <div className="dashboard-card session-card" id="tour-student-session">
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
                <div className="dashboard-card progress-card" id="tour-student-progress">
                    <div className="card-header">
                        <div className="card-icon card-icon-progress">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="card-title">تقدّم الحفظ</h3>
                    </div>

                    <div className="card-content">
                        <div className="current-target">
                            <span className="target-label">الهدف الحالي</span>
                            <span className="target-surah">{(user as any).currentSurah || 'الفاتحة'}</span>
                        </div>

                        <div className="progress-info">
                            <div className="progress-stats">
                                <span className="progress-current">الآية {(user as any).currentAyah || 1}</span>
                                <span className="progress-total">الجزء {(user as any).totalMemorized || 1}</span>
                            </div>
                            {/* Progress bar removed as it doesn't map 1:1 anymore or needs complex calc */}
                        </div>

                        {/* Audio button removed */}
                    </div>
                </div>

                {/* Teacher Note Card */}
                {/* Note card moved up to fill the gap, effectively just removing the homework card div before it */}

                {/* Teacher Note Card */}
                <div className="dashboard-card note-card" id="tour-student-latest-record">
                    <div className="card-header">
                        <div className="card-icon card-icon-note">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="card-title">ملاحظة المعلمة</h3>
                    </div>

                    <div className="card-content">
                        {latestNote ? (
                            <div className="teacher-note">
                                <p className="note-text cancel-quote">
                                    "{latestNote.text}"
                                </p>
                                <span className="note-date">{latestNote.date}</span>
                            </div>
                        ) : (
                            <div className="card-empty">
                                <p>لا توجد ملاحظات جديدة</p>
                            </div>
                        )}
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
                        <span>جلساتي</span>
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
