import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    Calendar,
    MessageSquare,
    Star,
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    Clock,
    Award,
    Eye,
} from 'lucide-react';
import '../../styles/pages/teacher-students.css';

// ==============================================
// Teacher Students Page - إدارة الطالبات
// ==============================================

interface TeacherStudentsPageProps {
    onNavigate: (page: string) => void;
}

interface Student {
    id: string;
    name: string;
    avatar: string | null;
    level: string;
    progress: number;
    lastSession: string;
    nextSession: string | null;
    totalSessions: number;
    memorizedSurahs: number;
    rating: number;
    status: 'active' | 'inactive' | 'new';
    trend: 'up' | 'down' | 'stable';
    joinedAt: string;
}

// Demo data
const students: Student[] = [
    {
        id: '1',
        name: 'أحمد محمد',
        avatar: null,
        level: 'متوسط',
        progress: 75,
        lastSession: 'أمس',
        nextSession: 'اليوم 10:00 ص',
        totalSessions: 45,
        memorizedSurahs: 12,
        rating: 4.5,
        status: 'active',
        trend: 'up',
        joinedAt: 'منذ 3 أشهر',
    },
    {
        id: '2',
        name: 'فاطمة علي',
        avatar: null,
        level: 'مبتدئ',
        progress: 35,
        lastSession: 'منذ 3 أيام',
        nextSession: 'غداً 11:00 ص',
        totalSessions: 12,
        memorizedSurahs: 5,
        rating: 4.8,
        status: 'active',
        trend: 'up',
        joinedAt: 'منذ شهر',
    },
    {
        id: '3',
        name: 'محمد أحمد',
        avatar: null,
        level: 'متقدم',
        progress: 90,
        lastSession: 'اليوم',
        nextSession: null,
        totalSessions: 120,
        memorizedSurahs: 25,
        rating: 4.9,
        status: 'active',
        trend: 'stable',
        joinedAt: 'منذ سنة',
    },
    {
        id: '4',
        name: 'سارة أحمد',
        avatar: null,
        level: 'مبتدئ',
        progress: 20,
        lastSession: 'منذ أسبوع',
        nextSession: null,
        totalSessions: 8,
        memorizedSurahs: 3,
        rating: 4.2,
        status: 'inactive',
        trend: 'down',
        joinedAt: 'منذ شهرين',
    },
    {
        id: '5',
        name: 'يوسف محمد',
        avatar: null,
        level: 'متوسط',
        progress: 55,
        lastSession: 'أمس',
        nextSession: 'بعد غد 9:00 ص',
        totalSessions: 32,
        memorizedSurahs: 10,
        rating: 4.6,
        status: 'active',
        trend: 'up',
        joinedAt: 'منذ 4 أشهر',
    },
    {
        id: '6',
        name: 'نور الدين',
        avatar: null,
        level: 'مبتدئ',
        progress: 15,
        lastSession: 'لم يبدأ',
        nextSession: 'اليوم 2:00 م',
        totalSessions: 0,
        memorizedSurahs: 0,
        rating: 0,
        status: 'new',
        trend: 'stable',
        joinedAt: 'اليوم',
    },
];

const TeacherStudentsPage: React.FC<TeacherStudentsPageProps> = ({ onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'new'>('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.includes(searchQuery);
        const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: students.length,
        active: students.filter((s) => s.status === 'active').length,
        inactive: students.filter((s) => s.status === 'inactive').length,
        new: students.filter((s) => s.status === 'new').length,
    };

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'active':
                return <span className="status-badge active">نشط</span>;
            case 'inactive':
                return <span className="status-badge inactive">غير نشط</span>;
            case 'new':
                return <span className="status-badge new">جديد</span>;
        }
    };

    const getTrendIcon = (trend: Student['trend']) => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={16} className="trend-icon up" />;
            case 'down':
                return <TrendingDown size={16} className="trend-icon down" />;
            default:
                return null;
        }
    };

    return (
        <div className="teacher-students-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Users size={28} />
                        إدارة الطالبات
                    </h1>
                    <p>إجمالي {stats.total} طالبة</p>
                </div>
            </div>

            {/* Stats */}
            <div className="students-stats">
                <div className={`stat-item ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">الكل</span>
                </div>
                <div className={`stat-item ${filterStatus === 'active' ? 'active' : ''}`} onClick={() => setFilterStatus('active')}>
                    <span className="stat-value">{stats.active}</span>
                    <span className="stat-label">نشط</span>
                </div>
                <div className={`stat-item ${filterStatus === 'inactive' ? 'active' : ''}`} onClick={() => setFilterStatus('inactive')}>
                    <span className="stat-value">{stats.inactive}</span>
                    <span className="stat-label">غير نشط</span>
                </div>
                <div className={`stat-item ${filterStatus === 'new' ? 'active' : ''}`} onClick={() => setFilterStatus('new')}>
                    <span className="stat-value">{stats.new}</span>
                    <span className="stat-label">جديد</span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="search-filter-bar">
                <div className="search-input">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن طالبة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="filter-btn">
                    <Filter size={20} />
                    فلتر
                </button>
            </div>

            {/* Students Grid */}
            <div className="students-grid">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="student-card">
                        <div className="card-header">
                            <div className="student-avatar">
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} />
                                ) : (
                                    student.name.charAt(0)
                                )}
                            </div>
                            <div className="student-info">
                                <h3>{student.name}</h3>
                                <span className="level-badge">{student.level}</span>
                            </div>
                            {getStatusBadge(student.status)}
                            <button className="more-btn">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <span>التقدم العام</span>
                                <span className="progress-value">
                                    {student.progress}%
                                    {getTrendIcon(student.trend)}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                            </div>
                        </div>

                        <div className="student-stats">
                            <div className="stat">
                                <Calendar size={16} />
                                <span>{student.totalSessions} جلسة</span>
                            </div>
                            <div className="stat">
                                <BookOpen size={16} />
                                <span>{student.memorizedSurahs} سورة</span>
                            </div>
                            {student.rating > 0 && (
                                <div className="stat">
                                    <Star size={16} fill="#f59e0b" stroke="#f59e0b" />
                                    <span>{student.rating}</span>
                                </div>
                            )}
                        </div>

                        <div className="session-info">
                            <div className="last-session">
                                <Clock size={14} />
                                <span>آخر جلسة: {student.lastSession}</span>
                            </div>
                            {student.nextSession && (
                                <div className="next-session">
                                    <span>القادمة: {student.nextSession}</span>
                                </div>
                            )}
                        </div>

                        <div className="card-actions">
                            <button className="action-btn primary" onClick={() => setSelectedStudent(student)}>
                                <Eye size={16} />
                                عرض التفاصيل
                            </button>
                            <button className="action-btn" onClick={() => onNavigate('messages')}>
                                <MessageSquare size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="student-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="student-avatar large">
                                {selectedStudent.name.charAt(0)}
                            </div>
                            <div className="student-info">
                                <h2>{selectedStudent.name}</h2>
                                <span className="level-badge">{selectedStudent.level}</span>
                                {getStatusBadge(selectedStudent.status)}
                            </div>
                            <button className="close-btn" onClick={() => setSelectedStudent(null)}>
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="detail-section">
                                <h3>إحصائيات التقدم</h3>
                                <div className="detail-stats">
                                    <div className="detail-stat">
                                        <Calendar size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.totalSessions}</span>
                                            <span className="label">جلسة مكتملة</span>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <BookOpen size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.memorizedSurahs}</span>
                                            <span className="label">سورة محفوظة</span>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <Award size={20} />
                                        <div>
                                            <span className="value">{selectedStudent.progress}%</span>
                                            <span className="label">التقدم العام</span>
                                        </div>
                                    </div>
                                    <div className="detail-stat">
                                        <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
                                        <div>
                                            <span className="value">{selectedStudent.rating || '-'}</span>
                                            <span className="label">التقييم</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>معلومات الانضمام</h3>
                                <p>انضم {selectedStudent.joinedAt}</p>
                            </div>

                            <div className="modal-actions">
                                <button className="action-btn primary">
                                    <Calendar size={18} />
                                    جدولة جلسة
                                </button>
                                <button className="action-btn">
                                    <BookOpen size={18} />
                                    إضافة واجب
                                </button>
                                <button className="action-btn" onClick={() => onNavigate('messages')}>
                                    <MessageSquare size={18} />
                                    إرسال رسالة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentsPage;
