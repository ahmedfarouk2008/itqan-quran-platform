import React, { useState } from 'react';
import {
    BookOpen,
    Search,
    Clock,
    Play,
    Pause,
    CheckCircle,
    XCircle,
    Star,
    MessageSquare,
    ChevronLeft,
    Volume2,
    Send,
    RotateCcw,
} from 'lucide-react';
import '../../styles/pages/teacher-homework.css';

// ==============================================
// Teacher Homework Page - مراجعة الواجبات
// ==============================================

interface TeacherHomeworkPageProps {
    onNavigate: (page: string) => void;
}

interface Homework {
    id: string;
    studentName: string;
    studentAvatar: string | null;
    type: 'حفظ' | 'مراجعة' | 'تسميع صوتي' | 'تجويد';
    surah: string;
    ayahRange?: string;
    submittedAt: string;
    dueDate: string;
    status: 'pending' | 'reviewed' | 'returned';
    audioUrl?: string;
    feedback?: {
        rating: number;
        notes: string;
        mistakes: string[];
    };
}

// Demo data
const homeworkList: Homework[] = [
    {
        id: '1',
        studentName: 'أحمد محمد',
        studentAvatar: null,
        type: 'تسميع صوتي',
        surah: 'سورة يس',
        ayahRange: 'آية 1-20',
        submittedAt: 'منذ 30 دقيقة',
        dueDate: 'اليوم',
        status: 'pending',
        audioUrl: '#',
    },
    {
        id: '2',
        studentName: 'فاطمة علي',
        studentAvatar: null,
        type: 'حفظ',
        surah: 'سورة الرحمن',
        ayahRange: 'آية 1-30',
        submittedAt: 'منذ ساعة',
        dueDate: 'اليوم',
        status: 'pending',
        audioUrl: '#',
    },
    {
        id: '3',
        studentName: 'محمد أحمد',
        studentAvatar: null,
        type: 'تسميع صوتي',
        surah: 'سورة الواقعة',
        ayahRange: 'كاملة',
        submittedAt: 'منذ 3 ساعات',
        dueDate: 'أمس',
        status: 'pending',
        audioUrl: '#',
    },
    {
        id: '4',
        studentName: 'سارة أحمد',
        studentAvatar: null,
        type: 'مراجعة',
        surah: 'سورة الكهف',
        ayahRange: 'آية 1-50',
        submittedAt: 'منذ يوم',
        dueDate: 'أمس',
        status: 'reviewed',
        feedback: {
            rating: 4,
            notes: 'أداء جيد جداً، يحتاج تحسين في مخارج الحروف',
            mistakes: ['آية 15 - تكرار خاطئ', 'آية 23 - وقف غير صحيح'],
        },
    },
    {
        id: '5',
        studentName: 'يوسف محمد',
        studentAvatar: null,
        type: 'تجويد',
        surah: 'أحكام المد',
        submittedAt: 'منذ يومين',
        dueDate: 'منذ 3 أيام',
        status: 'returned',
    },
];

const TeacherHomeworkPage: React.FC<TeacherHomeworkPageProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'returned'>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        notes: '',
        mistakes: '',
    });

    const filteredHomework = homeworkList.filter(
        (hw) => hw.status === activeTab && hw.studentName.includes(searchQuery)
    );

    const stats = {
        pending: homeworkList.filter((hw) => hw.status === 'pending').length,
        reviewed: homeworkList.filter((hw) => hw.status === 'reviewed').length,
        returned: homeworkList.filter((hw) => hw.status === 'returned').length,
    };

    const getTypeBadge = (type: Homework['type']) => {
        const colors: Record<Homework['type'], string> = {
            'حفظ': 'hifz',
            'مراجعة': 'review',
            'تسميع صوتي': 'audio',
            'تجويد': 'tajweed',
        };
        return <span className={`type-badge ${colors[type]}`}>{type}</span>;
    };

    const handleSubmitReview = () => {
        // Submit review logic
        console.log('Submitting review:', reviewData);
        setSelectedHomework(null);
        setReviewData({ rating: 0, notes: '', mistakes: '' });
    };

    return (
        <div className="teacher-homework-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <BookOpen size={28} />
                        مراجعة الواجبات
                    </h1>
                    <p>{stats.pending} واجب ينتظر المراجعة</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <Clock size={18} />
                    قيد الانتظار
                    <span className="count">{stats.pending}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviewed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviewed')}
                >
                    <CheckCircle size={18} />
                    تمت المراجعة
                    <span className="count">{stats.reviewed}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'returned' ? 'active' : ''}`}
                    onClick={() => setActiveTab('returned')}
                >
                    <RotateCcw size={18} />
                    مُعاد
                    <span className="count">{stats.returned}</span>
                </button>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder="ابحث عن طالبة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Homework List */}
            <div className="homework-list">
                {filteredHomework.length === 0 ? (
                    <div className="empty-state">
                        <BookOpen size={48} />
                        <p>لا توجد واجبات في هذا القسم</p>
                    </div>
                ) : (
                    filteredHomework.map((homework) => (
                        <div key={homework.id} className="homework-card">
                            <div className="card-header">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {homework.studentName.charAt(0)}
                                    </div>
                                    <div className="student-details">
                                        <span className="student-name">{homework.studentName}</span>
                                        <span className="submitted-time">{homework.submittedAt}</span>
                                    </div>
                                </div>
                                {getTypeBadge(homework.type)}
                            </div>

                            <div className="homework-content">
                                <div className="surah-info">
                                    <BookOpen size={18} />
                                    <span>{homework.surah}</span>
                                    {homework.ayahRange && (
                                        <span className="ayah-range">({homework.ayahRange})</span>
                                    )}
                                </div>

                                {homework.audioUrl && (
                                    <div className="audio-player">
                                        <button
                                            className="play-btn"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <div className="audio-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '30%' }} />
                                            </div>
                                            <span className="time">1:23 / 4:30</span>
                                        </div>
                                        <Volume2 size={18} />
                                    </div>
                                )}

                                {homework.feedback && (
                                    <div className="feedback-preview">
                                        <div className="rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    fill={star <= homework.feedback!.rating ? '#f59e0b' : 'none'}
                                                    stroke={star <= homework.feedback!.rating ? '#f59e0b' : '#d1d5db'}
                                                />
                                            ))}
                                        </div>
                                        <p className="notes">{homework.feedback.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                {homework.status === 'pending' ? (
                                    <>
                                        <button
                                            className="action-btn primary"
                                            onClick={() => setSelectedHomework(homework)}
                                        >
                                            <CheckCircle size={16} />
                                            مراجعة
                                        </button>
                                        <button className="action-btn" onClick={() => onNavigate('messages')}>
                                            <MessageSquare size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="action-btn"
                                        onClick={() => setSelectedHomework(homework)}
                                    >
                                        عرض التفاصيل
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Review Modal */}
            {selectedHomework && (
                <div className="modal-overlay" onClick={() => setSelectedHomework(null)}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>مراجعة الواجب</h2>
                            <button className="close-btn" onClick={() => setSelectedHomework(null)}>
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Student & Homework Info */}
                            <div className="homework-info-section">
                                <div className="student-info">
                                    <div className="student-avatar large">
                                        {selectedHomework.studentName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3>{selectedHomework.studentName}</h3>
                                        {getTypeBadge(selectedHomework.type)}
                                    </div>
                                </div>
                                <div className="surah-details">
                                    <BookOpen size={20} />
                                    <span>{selectedHomework.surah}</span>
                                    {selectedHomework.ayahRange && (
                                        <span>({selectedHomework.ayahRange})</span>
                                    )}
                                </div>
                            </div>

                            {/* Audio Player */}
                            {selectedHomework.audioUrl && (
                                <div className="audio-section">
                                    <h4>
                                        <Volume2 size={18} />
                                        التسميع الصوتي
                                    </h4>
                                    <div className="audio-player large">
                                        <button
                                            className="play-btn large"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                        </button>
                                        <div className="audio-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '30%' }} />
                                            </div>
                                            <div className="time-display">
                                                <span>1:23</span>
                                                <span>4:30</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Review Form */}
                            {selectedHomework.status === 'pending' && (
                                <div className="review-form">
                                    <div className="form-group">
                                        <label>التقييم</label>
                                        <div className="rating-input">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-btn ${star <= reviewData.rating ? 'active' : ''}`}
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                >
                                                    <Star
                                                        size={28}
                                                        fill={star <= reviewData.rating ? '#f59e0b' : 'none'}
                                                        stroke={star <= reviewData.rating ? '#f59e0b' : '#d1d5db'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>ملاحظات عامة</label>
                                        <textarea
                                            placeholder="أضف ملاحظاتك على أداء الطالبة..."
                                            value={reviewData.notes}
                                            onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>الأخطاء (سطر لكل خطأ)</label>
                                        <textarea
                                            placeholder="آية 5 - خطأ في المد&#10;آية 12 - وقف غير صحيح"
                                            value={reviewData.mistakes}
                                            onChange={(e) => setReviewData({ ...reviewData, mistakes: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="return-btn"
                                            onClick={() => {
                                                // Return homework
                                                setSelectedHomework(null);
                                            }}
                                        >
                                            <RotateCcw size={18} />
                                            إعادة للطالبة
                                        </button>
                                        <button className="submit-btn" onClick={handleSubmitReview}>
                                            <Send size={18} />
                                            إرسال التقييم
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Show Feedback for reviewed */}
                            {selectedHomework.feedback && (
                                <div className="feedback-display">
                                    <h4>التقييم المُرسل</h4>
                                    <div className="rating-display">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={24}
                                                fill={star <= selectedHomework.feedback!.rating ? '#f59e0b' : 'none'}
                                                stroke={star <= selectedHomework.feedback!.rating ? '#f59e0b' : '#d1d5db'}
                                            />
                                        ))}
                                    </div>
                                    <p className="notes">{selectedHomework.feedback.notes}</p>
                                    {selectedHomework.feedback.mistakes.length > 0 && (
                                        <div className="mistakes-list">
                                            <h5>الأخطاء:</h5>
                                            <ul>
                                                {selectedHomework.feedback.mistakes.map((mistake, i) => (
                                                    <li key={i}>{mistake}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherHomeworkPage;
