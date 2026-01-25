import React from 'react';
import {
    Users,
    Calendar,
    BookOpen,
    Clock,
    TrendingUp,
    Star,
    MessageSquare,
    Bell,
    ChevronLeft,
    Play,
    CheckCircle,
    AlertCircle,
    BarChart3,
} from 'lucide-react';
import '../../styles/pages/teacher-dashboard.css';

// ==============================================
// Teacher Dashboard - لوحة تحكم المعلمة
// ==============================================

interface TeacherDashboardProps {
    onNavigate: (page: string) => void;
}

// Demo data
const dashboardStats = {
    totalStudents: 24,
    activeStudents: 18,
    todaySessions: 5,
    pendingHomework: 12,
    completedSessions: 156,
    averageRating: 4.8,
};

const upcomingSessions = [
    {
        id: '1',
        studentName: 'أحمد محمد',
        studentAvatar: null,
        time: '10:00 ص',
        duration: 45,
        type: 'حفظ',
        surah: 'سورة البقرة',
        isNext: true,
    },
    {
        id: '2',
        studentName: 'فاطمة علي',
        studentAvatar: null,
        time: '11:00 ص',
        duration: 30,
        type: 'مراجعة',
        surah: 'سورة آل عمران',
        isNext: false,
    },
    {
        id: '3',
        studentName: 'محمد أحمد',
        studentAvatar: null,
        time: '12:30 م',
        duration: 45,
        type: 'تجويد',
        surah: 'أحكام النون الساكنة',
        isNext: false,
    },
];

const recentActivities = [
    {
        id: '1',
        type: 'homework_submitted',
        studentName: 'سارة أحمد',
        description: 'أرسلت واجب حفظ سورة الكهف',
        time: 'منذ 10 دقائق',
    },
    {
        id: '2',
        type: 'session_completed',
        studentName: 'يوسف محمد',
        description: 'أكمل جلسة المراجعة بنجاح',
        time: 'منذ ساعة',
    },
    {
        id: '3',
        type: 'new_message',
        studentName: 'نور الدين',
        description: 'أرسل رسالة جديدة',
        time: 'منذ ساعتين',
    },
];

const pendingReviews = [
    {
        id: '1',
        studentName: 'أحمد محمد',
        type: 'تسميع صوتي',
        surah: 'سورة يس',
        submittedAt: 'منذ 30 دقيقة',
    },
    {
        id: '2',
        studentName: 'فاطمة علي',
        type: 'واجب حفظ',
        surah: 'سورة الرحمن',
        submittedAt: 'منذ ساعة',
    },
    {
        id: '3',
        studentName: 'محمد أحمد',
        type: 'تسميع صوتي',
        surah: 'سورة الواقعة',
        submittedAt: 'منذ 3 ساعات',
    },
];

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'homework_submitted':
                return <BookOpen size={18} />;
            case 'session_completed':
                return <CheckCircle size={18} />;
            case 'new_message':
                return <MessageSquare size={18} />;
            default:
                return <Bell size={18} />;
        }
    };

    return (
        <div className="teacher-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>مرحباً، أستاذة نورة 👋</h1>
                    <p>لديك {dashboardStats.todaySessions} جلسات اليوم</p>
                </div>
                <div className="header-date">
                    <button className="view-reports-header-btn" onClick={() => onNavigate('reports')}>
                        <BarChart3 size={16} />
                        عرض التقارير
                    </button>
                    <div className="date-display">
                        <span className="day">السبت</span>
                        <span className="date">25 يناير 2026</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card students">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.totalStudents}</span>
                        <span className="stat-label">إجمالي الطالبات</span>
                    </div>
                    <div className="stat-badge">{dashboardStats.activeStudents} نشط</div>
                </div>

                <div className="stat-card sessions">
                    <div className="stat-icon">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.todaySessions}</span>
                        <span className="stat-label">جلسات اليوم</span>
                    </div>
                </div>

                <div className="stat-card homework">
                    <div className="stat-icon">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.pendingHomework}</span>
                        <span className="stat-label">واجبات تنتظر المراجعة</span>
                    </div>
                </div>

                <div className="stat-card rating">
                    <div className="stat-icon">
                        <Star size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{dashboardStats.averageRating}</span>
                        <span className="stat-label">متوسط التقييم</span>
                    </div>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={14}
                                fill={star <= Math.floor(dashboardStats.averageRating) ? '#f59e0b' : 'none'}
                                stroke={star <= Math.floor(dashboardStats.averageRating) ? '#f59e0b' : '#d1d5db'}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
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
                        {upcomingSessions.map((session) => (
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
                                <button className="start-session-btn">
                                    <Play size={16} />
                                    {session.isNext ? 'بدء الجلسة' : 'تفاصيل'}
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
                            عرض الكل
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="reviews-list">
                        {pendingReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-avatar">
                                    {review.studentName.charAt(0)}
                                </div>
                                <div className="review-info">
                                    <span className="student-name">{review.studentName}</span>
                                    <span className="review-type">{review.type}</span>
                                    <span className="review-surah">{review.surah}</span>
                                </div>
                                <div className="review-meta">
                                    <span className="submitted-time">{review.submittedAt}</span>
                                    <button className="review-btn">مراجعة</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="content-section activity-section">
                    <div className="section-header">
                        <h2>
                            <TrendingUp size={20} />
                            آخر النشاطات
                        </h2>
                    </div>

                    <div className="activity-list">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="activity-info">
                                    <span className="activity-student">{activity.studentName}</span>
                                    <span className="activity-description">{activity.description}</span>
                                </div>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="quick-action-btn primary" onClick={() => onNavigate('teacher-sessions')}>
                    <Calendar size={20} />
                    إدارة الجلسات
                </button>
                <button className="quick-action-btn" onClick={() => onNavigate('teacher-students')}>
                    <Users size={20} />
                    إدارة الطالبات
                </button>
                <button className="quick-action-btn" onClick={() => onNavigate('teacher-homework')}>
                    <BookOpen size={20} />
                    مراجعة الواجبات
                </button>
                <button className="quick-action-btn" onClick={() => onNavigate('messages')}>
                    <MessageSquare size={20} />
                    الرسائل
                </button>
                <button className="quick-action-btn" onClick={() => onNavigate('reports')}>
                    <BarChart3 size={20} />
                    التقارير
                </button>
            </div>
        </div>
    );
};

export default TeacherDashboard;
