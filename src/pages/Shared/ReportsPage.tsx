import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import {
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    BookOpen,
    Award,
    Clock,
    Download,
    Filter,
    ChevronDown,
    Star,
    Target,
    Zap,
} from 'lucide-react';
import '../../styles/pages/reports.css';

// ==============================================
// Reports Page - التقارير والإحصائيات المتقدمة
// ==============================================

interface ReportsPageProps {
    onNavigate: (page: string) => void;
    userRole: 'student' | 'teacher';
}

// Demo data for charts
const weeklyProgressData = [
    { name: 'الأحد', حفظ: 4, مراجعة: 2, تجويد: 1 },
    { name: 'الإثنين', حفظ: 3, مراجعة: 4, تجويد: 2 },
    { name: 'الثلاثاء', حفظ: 5, مراجعة: 3, تجويد: 1 },
    { name: 'الأربعاء', حفظ: 2, مراجعة: 5, تجويد: 3 },
    { name: 'الخميس', حفظ: 6, مراجعة: 2, تجويد: 2 },
    { name: 'الجمعة', حفظ: 1, مراجعة: 1, تجويد: 0 },
    { name: 'السبت', حفظ: 4, مراجعة: 3, تجويد: 2 },
];

const monthlySessionsData = [
    { name: 'يناير', جلسات: 45, ساعات: 34 },
    { name: 'فبراير', جلسات: 52, ساعات: 41 },
    { name: 'مارس', جلسات: 48, ساعات: 38 },
    { name: 'أبريل', جلسات: 61, ساعات: 48 },
    { name: 'مايو', جلسات: 55, ساعات: 44 },
    { name: 'يونيو', جلسات: 67, ساعات: 52 },
];

const surahProgressData = [
    { name: 'البقرة', completed: 85, total: 286 },
    { name: 'آل عمران', completed: 120, total: 200 },
    { name: 'النساء', completed: 45, total: 176 },
    { name: 'المائدة', completed: 0, total: 120 },
    { name: 'الكهف', completed: 110, total: 110 },
];

const studentPerformanceData = [
    { name: 'أحمد', score: 92, sessions: 45 },
    { name: 'فاطمة', score: 88, sessions: 38 },
    { name: 'محمد', score: 95, sessions: 52 },
    { name: 'سارة', score: 78, sessions: 28 },
    { name: 'يوسف', score: 85, sessions: 35 },
];

const sessionTypeDistribution = [
    { name: 'حفظ', value: 45, color: '#059669' },
    { name: 'مراجعة', value: 30, color: '#f59e0b' },
    { name: 'تجويد', value: 15, color: '#6366f1' },
    { name: 'تفسير', value: 10, color: '#ec4899' },
];

const attendanceData = [
    { name: 'الأسبوع 1', حضور: 95, غياب: 5 },
    { name: 'الأسبوع 2', حضور: 88, غياب: 12 },
    { name: 'الأسبوع 3', حضور: 92, غياب: 8 },
    { name: 'الأسبوع 4', حضور: 97, غياب: 3 },
];

const ReportsPage: React.FC<ReportsPageProps> = ({ userRole }) => {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
    const [activeSection, setActiveSection] = useState<'overview' | 'students' | 'sessions' | 'progress'>('overview');

    const stats = {
        totalStudents: 24,
        activeSessions: 156,
        completedHours: 234,
        averageRating: 4.8,
        memorizedPages: 45,
        reviewedSurahs: 12,
    };

    return (
        <div className="reports-page">
            {/* Header */}
            <div className="reports-header">
                <div className="header-content">
                    <h1>
                        <BarChart3 size={28} />
                        التقارير والإحصائيات
                    </h1>
                    <p>تحليل شامل لأداء {userRole === 'teacher' ? 'الطالبات' : 'التعلم'}</p>
                </div>
                <div className="header-actions">
                    <div className="time-filter">
                        <button
                            className={timeRange === 'week' ? 'active' : ''}
                            onClick={() => setTimeRange('week')}
                        >
                            أسبوعي
                        </button>
                        <button
                            className={timeRange === 'month' ? 'active' : ''}
                            onClick={() => setTimeRange('month')}
                        >
                            شهري
                        </button>
                        <button
                            className={timeRange === 'year' ? 'active' : ''}
                            onClick={() => setTimeRange('year')}
                        >
                            سنوي
                        </button>
                    </div>
                    <button className="export-btn">
                        <Download size={18} />
                        تصدير التقرير
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-card gradient-green">
                    <div className="stat-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalStudents}</span>
                        <span className="stat-label">
                            {userRole === 'teacher' ? 'إجمالي الطالبات' : 'جلسة هذا الشهر'}
                        </span>
                    </div>
                    <div className="stat-trend up">
                        <TrendingUp size={16} />
                        +12%
                    </div>
                </div>

                <div className="stat-card gradient-blue">
                    <div className="stat-icon">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.activeSessions}</span>
                        <span className="stat-label">الجلسات المكتملة</span>
                    </div>
                    <div className="stat-trend up">
                        <TrendingUp size={16} />
                        +8%
                    </div>
                </div>

                <div className="stat-card gradient-purple">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.completedHours}</span>
                        <span className="stat-label">ساعات التعلم</span>
                    </div>
                    <div className="stat-trend up">
                        <TrendingUp size={16} />
                        +15%
                    </div>
                </div>

                <div className="stat-card gradient-orange">
                    <div className="stat-icon">
                        <Star size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.averageRating}</span>
                        <span className="stat-label">متوسط التقييم</span>
                    </div>
                    <div className="stat-trend stable">
                        ثابت
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
                <button
                    className={activeSection === 'overview' ? 'active' : ''}
                    onClick={() => setActiveSection('overview')}
                >
                    <BarChart3 size={18} />
                    نظرة عامة
                </button>
                {userRole === 'teacher' && (
                    <button
                        className={activeSection === 'students' ? 'active' : ''}
                        onClick={() => setActiveSection('students')}
                    >
                        <Users size={18} />
                        أداء الطالبات
                    </button>
                )}
                <button
                    className={activeSection === 'sessions' ? 'active' : ''}
                    onClick={() => setActiveSection('sessions')}
                >
                    <Calendar size={18} />
                    الجلسات
                </button>
                <button
                    className={activeSection === 'progress' ? 'active' : ''}
                    onClick={() => setActiveSection('progress')}
                >
                    <Target size={18} />
                    التقدم
                </button>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Overview Section */}
                {activeSection === 'overview' && (
                    <>
                        <div className="charts-grid">
                            {/* Weekly Activity Chart */}
                            <div className="chart-card large">
                                <div className="chart-header">
                                    <h3>النشاط الأسبوعي</h3>
                                    <div className="chart-legend">
                                        <span className="legend-item">
                                            <span className="dot green"></span> حفظ
                                        </span>
                                        <span className="legend-item">
                                            <span className="dot orange"></span> مراجعة
                                        </span>
                                        <span className="legend-item">
                                            <span className="dot purple"></span> تجويد
                                        </span>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyProgressData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                                        <YAxis tick={{ fill: '#6b7280' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="حفظ" fill="#059669" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="مراجعة" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="تجويد" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Session Distribution Pie Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>توزيع أنواع الجلسات</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={sessionTypeDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sessionTypeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pie-legend">
                                    {sessionTypeDistribution.map((item) => (
                                        <div key={item.name} className="pie-legend-item">
                                            <span className="dot" style={{ background: item.color }}></span>
                                            <span>{item.name}</span>
                                            <span className="value">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Trend Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>الاتجاه الشهري</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={monthlySessionsData}>
                                        <defs>
                                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                                        <YAxis tick={{ fill: '#6b7280' }} />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="جلسات"
                                            stroke="#059669"
                                            fillOpacity={1}
                                            fill="url(#colorSessions)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="achievements-section">
                            <h3>
                                <Award size={20} />
                                الإنجازات الأخيرة
                            </h3>
                            <div className="achievements-grid">
                                <div className="achievement-card gold">
                                    <div className="achievement-icon">🏆</div>
                                    <div className="achievement-info">
                                        <span className="title">أول جزء كامل</span>
                                        <span className="desc">إتمام حفظ جزء عم</span>
                                    </div>
                                </div>
                                <div className="achievement-card silver">
                                    <div className="achievement-icon">⭐</div>
                                    <div className="achievement-info">
                                        <span className="title">100 جلسة</span>
                                        <span className="desc">إكمال 100 جلسة</span>
                                    </div>
                                </div>
                                <div className="achievement-card bronze">
                                    <div className="achievement-icon">🎯</div>
                                    <div className="achievement-info">
                                        <span className="title">التزام أسبوعي</span>
                                        <span className="desc">حضور كل الجلسات</span>
                                    </div>
                                </div>
                                <div className="achievement-card">
                                    <div className="achievement-icon">📖</div>
                                    <div className="achievement-info">
                                        <span className="title">سورة الكهف</span>
                                        <span className="desc">إتمام حفظ السورة</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Students Performance Section (Teacher Only) */}
                {activeSection === 'students' && userRole === 'teacher' && (
                    <div className="students-performance">
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h3>أداء الطالبات</h3>
                                <div className="filter-dropdown">
                                    <button>
                                        <Filter size={16} />
                                        فلتر
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={studentPerformanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" tick={{ fill: '#6b7280' }} />
                                    <YAxis dataKey="name" type="category" tick={{ fill: '#6b7280' }} width={80} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="score" fill="#059669" name="الدرجة" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="students-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>الطالبة</th>
                                        <th>الجلسات</th>
                                        <th>الدرجة</th>
                                        <th>التقدم</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentPerformanceData.map((student, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="student-cell">
                                                    <div className="avatar">{student.name.charAt(0)}</div>
                                                    {student.name}
                                                </div>
                                            </td>
                                            <td>{student.sessions} جلسة</td>
                                            <td>
                                                <span className={`score ${student.score >= 90 ? 'excellent' : student.score >= 80 ? 'good' : 'average'}`}>
                                                    {student.score}%
                                                </span>
                                            </td>
                                            <td>
                                                <div className="progress-bar">
                                                    <div className="fill" style={{ width: `${student.score}%` }}></div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status ${student.score >= 85 ? 'active' : 'needs-attention'}`}>
                                                    {student.score >= 85 ? 'ممتاز' : 'يحتاج متابعة'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Sessions Section */}
                {activeSection === 'sessions' && (
                    <div className="sessions-analytics">
                        <div className="charts-grid">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>الجلسات الشهرية</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={monthlySessionsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                                        <YAxis tick={{ fill: '#6b7280' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="جلسات"
                                            stroke="#059669"
                                            strokeWidth={3}
                                            dot={{ fill: '#059669', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="ساعات"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            dot={{ fill: '#6366f1', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>نسبة الحضور</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={attendanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                                        <YAxis tick={{ fill: '#6b7280' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="حضور" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="غياب" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="sessions-summary">
                            <div className="summary-card">
                                <Zap size={24} className="icon green" />
                                <div className="info">
                                    <span className="value">45</span>
                                    <span className="label">دقيقة متوسط الجلسة</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <Clock size={24} className="icon blue" />
                                <div className="info">
                                    <span className="value">98%</span>
                                    <span className="label">نسبة الحضور</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <Target size={24} className="icon purple" />
                                <div className="info">
                                    <span className="value">4.9</span>
                                    <span className="label">تقييم الجلسات</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Section */}
                {activeSection === 'progress' && (
                    <div className="progress-analytics">
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h3>تقدم حفظ السور</h3>
                            </div>
                            <div className="surah-progress-list">
                                {surahProgressData.map((surah, index) => (
                                    <div key={index} className="surah-progress-item">
                                        <div className="surah-info">
                                            <span className="surah-name">{surah.name}</span>
                                            <span className="surah-stats">
                                                {surah.completed} / {surah.total} آية
                                            </span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="fill"
                                                    style={{
                                                        width: `${(surah.completed / surah.total) * 100}%`,
                                                        background: surah.completed === surah.total
                                                            ? 'linear-gradient(90deg, #10b981, #059669)'
                                                            : 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="percentage">
                                                {Math.round((surah.completed / surah.total) * 100)}%
                                            </span>
                                        </div>
                                        {surah.completed === surah.total && (
                                            <span className="completed-badge">✓ مكتمل</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="progress-summary">
                            <div className="summary-item">
                                <div className="big-number">
                                    <BookOpen size={32} />
                                    <span>45</span>
                                </div>
                                <span className="label">صفحة محفوظة</span>
                            </div>
                            <div className="summary-item">
                                <div className="big-number">
                                    <Award size={32} />
                                    <span>5</span>
                                </div>
                                <span className="label">سور مكتملة</span>
                            </div>
                            <div className="summary-item">
                                <div className="big-number">
                                    <Target size={32} />
                                    <span>2</span>
                                </div>
                                <span className="label">أجزاء مراجعة</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
