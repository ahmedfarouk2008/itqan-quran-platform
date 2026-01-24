import React, { useState } from 'react';
import {
    ClipboardCheck,
    Clock,
    Calendar,
    CheckCircle,
    AlertCircle,
    Mic,
    Play,
    Pause,
    Upload,
    X,
    FileText
} from 'lucide-react';
import { HomeworkStatus } from '../../types';
import '../../styles/pages/homework.css';

// ==============================================
// Homework Page - صفحة الواجبات (للطالب)
// ==============================================

interface HomeworkPageProps {
    onNavigate: (tab: string) => void;
}

// Mock data
const mockHomework = [
    {
        id: '1',
        title: 'تسميع سورة الملك ١-١٥',
        description: 'تسميع الآيات مع مراعاة أحكام التجويد، خاصة النون الساكنة والمدود',
        type: 'حفظ',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        status: HomeworkStatus.NOT_STARTED,
        teacherName: 'أ. فاطمة أحمد',
    },
    {
        id: '2',
        title: 'تطبيق أحكام الإدغام',
        description: 'سجّل ٥ أمثلة من سورة الملك تحتوي على إدغام بغنة وبدون غنة',
        type: 'تجويد',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: HomeworkStatus.NOT_STARTED,
        teacherName: 'أ. فاطمة أحمد',
    },
    {
        id: '3',
        title: 'تسميع سورة الفاتحة',
        description: 'مراجعة سورة الفاتحة مع التركيز على مخارج الحروف',
        type: 'حفظ',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        status: HomeworkStatus.SUBMITTED,
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        teacherName: 'أ. فاطمة أحمد',
    },
    {
        id: '4',
        title: 'تسميع آية الكرسي',
        description: 'تسميع آية الكرسي مع شرح معاني الكلمات',
        type: 'حفظ',
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: HomeworkStatus.REVIEWED,
        submittedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        feedback: {
            text: 'أحسنت! التسميع ممتاز. استمر على هذا المستوى.',
            rating: 5,
            errorTags: [],
        },
        teacherName: 'أ. فاطمة أحمد',
    },
    {
        id: '5',
        title: 'تسميع سورة الإخلاص والمعوذتين',
        description: 'تسميع السور الثلاث مع التركيز على القلقلة',
        type: 'حفظ',
        dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        status: HomeworkStatus.REVIEWED,
        submittedAt: new Date(Date.now() - 86400000 * 11).toISOString(),
        feedback: {
            text: 'جيد جداً. لاحظي الغنة في "من" و"عن".',
            rating: 4,
            errorTags: ['الغنة'],
        },
        teacherName: 'أ. فاطمة أحمد',
    },
];

type HomeworkTab = 'pending' | 'submitted' | 'reviewed';

const HomeworkPage: React.FC<HomeworkPageProps> = () => {
    const [activeTab, setActiveTab] = useState<HomeworkTab>('pending');
    const [selectedHomework, setSelectedHomework] = useState<typeof mockHomework[0] | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const pendingHomework = mockHomework.filter(h => h.status === HomeworkStatus.NOT_STARTED);
    const submittedHomework = mockHomework.filter(h => h.status === HomeworkStatus.SUBMITTED);
    const reviewedHomework = mockHomework.filter(h => h.status === HomeworkStatus.REVIEWED);

    const getCurrentHomework = () => {
        switch (activeTab) {
            case 'pending': return pendingHomework;
            case 'submitted': return submittedHomework;
            case 'reviewed': return reviewedHomework;
        }
    };

    const formatDueDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'اليوم';
        if (diff === 1) return 'غداً';
        if (diff === -1) return 'أمس';
        if (diff < -1) return `منذ ${Math.abs(diff)} أيام`;
        return `بعد ${diff} أيام`;
    };

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'حفظ': return 'badge-hifz';
            case 'تجويد': return 'badge-tajweed';
            case 'تفسير': return 'badge-tafseer';
            default: return '';
        }
    };

    const handleStartHomework = (homework: typeof mockHomework[0]) => {
        setSelectedHomework(homework);
        setShowSubmitModal(true);
    };

    return (
        <div className="homework-page animate-fadeIn">
            {/* Page Header */}
            <header className="page-header">
                <h1 className="page-title">الواجبات</h1>
                <p className="page-subtitle">متابعة الواجبات والتسميعات المطلوبة</p>
            </header>

            {/* Stats Cards */}
            <div className="homework-stats">
                <div className="stat-card pending">
                    <div className="stat-icon">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{pendingHomework.length}</span>
                        <span className="stat-label">قيد الانتظار</span>
                    </div>
                </div>
                <div className="stat-card submitted">
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{submittedHomework.length}</span>
                        <span className="stat-label">تم الإرسال</span>
                    </div>
                </div>
                <div className="stat-card reviewed">
                    <div className="stat-icon">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{reviewedHomework.length}</span>
                        <span className="stat-label">تم المراجعة</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs homework-tabs">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    قيد الانتظار ({pendingHomework.length})
                </button>
                <button
                    className={`tab ${activeTab === 'submitted' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submitted')}
                >
                    تم الإرسال ({submittedHomework.length})
                </button>
                <button
                    className={`tab ${activeTab === 'reviewed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviewed')}
                >
                    تم المراجعة ({reviewedHomework.length})
                </button>
            </div>

            {/* Homework List */}
            <div className="homework-list">
                {getCurrentHomework().length > 0 ? (
                    getCurrentHomework().map(homework => (
                        <HomeworkCard
                            key={homework.id}
                            homework={homework}
                            onStart={() => handleStartHomework(homework)}
                            getTypeBadgeClass={getTypeBadgeClass}
                            formatDueDate={formatDueDate}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <ClipboardCheck size={48} className="empty-state-icon" />
                        <h3 className="empty-state-title">لا توجد واجبات</h3>
                        <p className="empty-state-description">
                            {activeTab === 'pending'
                                ? 'لا توجد واجبات معلقة حالياً'
                                : activeTab === 'submitted'
                                    ? 'لا توجد واجبات في انتظار المراجعة'
                                    : 'لا توجد واجبات تمت مراجعتها'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Submit Modal */}
            {showSubmitModal && selectedHomework && (
                <SubmitHomeworkModal
                    homework={selectedHomework}
                    onClose={() => {
                        setShowSubmitModal(false);
                        setSelectedHomework(null);
                    }}
                />
            )}
        </div>
    );
};

// ==============================================
// Homework Card Component
// ==============================================

interface HomeworkCardProps {
    homework: typeof mockHomework[0];
    onStart: () => void;
    getTypeBadgeClass: (type: string) => string;
    formatDueDate: (date: string) => string;
}

const HomeworkCard: React.FC<HomeworkCardProps> = ({
    homework,
    onStart,
    getTypeBadgeClass,
    formatDueDate
}) => {
    const isOverdue = new Date(homework.dueDate) < new Date() && homework.status === HomeworkStatus.NOT_STARTED;

    return (
        <div className={`homework-card card ${isOverdue ? 'overdue' : ''}`}>
            <div className="homework-card-header">
                <span className={`badge ${getTypeBadgeClass(homework.type)}`}>
                    {homework.type}
                </span>
                <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                    <Calendar size={14} />
                    <span>{formatDueDate(homework.dueDate)}</span>
                </div>
            </div>

            <div className="homework-card-body">
                <h3 className="homework-title">{homework.title}</h3>
                <p className="homework-description">{homework.description}</p>
                <div className="homework-teacher">
                    <span>المعلمة: {homework.teacherName}</span>
                </div>
            </div>

            {/* Feedback for reviewed homework */}
            {homework.status === HomeworkStatus.REVIEWED && homework.feedback && (
                <div className="homework-feedback">
                    <div className="feedback-header">
                        <span className="feedback-label">تقييم المعلمة</span>
                        <div className="feedback-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`star ${i < (homework.feedback?.rating || 0) ? 'filled' : ''}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="feedback-text">{homework.feedback.text}</p>
                    {homework.feedback.errorTags && homework.feedback.errorTags.length > 0 && (
                        <div className="feedback-tags">
                            {homework.feedback.errorTags.map((tag, i) => (
                                <span key={i} className="error-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="homework-card-footer">
                {homework.status === HomeworkStatus.NOT_STARTED && (
                    <button className="btn btn-primary w-full" onClick={onStart}>
                        <Mic size={18} />
                        <span>ابدأ الآن</span>
                    </button>
                )}
                {homework.status === HomeworkStatus.SUBMITTED && (
                    <div className="submitted-status">
                        <Clock size={16} />
                        <span>في انتظار مراجعة المعلمة</span>
                    </div>
                )}
                {homework.status === HomeworkStatus.REVIEWED && (
                    <button className="btn btn-secondary w-full">
                        <FileText size={18} />
                        <span>عرض التفاصيل</span>
                    </button>
                )}
            </div>
        </div>
    );
};

// ==============================================
// Submit Homework Modal
// ==============================================

interface SubmitHomeworkModalProps {
    homework: typeof mockHomework[0];
    onClose: () => void;
}

const SubmitHomeworkModal: React.FC<SubmitHomeworkModalProps> = ({ homework, onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecording, setHasRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
        // In real app, upload recording and submit homework
        onClose();
    };

    return (
        <>
            <div className="modal-backdrop open" onClick={onClose} />
            <div className="modal open submit-homework-modal">
                <div className="modal-header">
                    <h2>تسليم الواجب</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="homework-info-section">
                        <h3>{homework.title}</h3>
                        <p>{homework.description}</p>
                    </div>

                    <div className="recording-section">
                        {!hasRecording ? (
                            <>
                                <div className={`recording-circle ${isRecording ? 'recording' : ''}`}>
                                    <Mic size={36} />
                                </div>
                                <div className="recording-time">{formatTime(recordingTime)}</div>
                                {!isRecording ? (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => setIsRecording(true)}
                                    >
                                        <Mic size={20} />
                                        <span>ابدأ التسجيل</span>
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-secondary btn-lg"
                                        onClick={() => {
                                            setIsRecording(false);
                                            setHasRecording(true);
                                        }}
                                    >
                                        <Pause size={20} />
                                        <span>إيقاف</span>
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="playback-controls">
                                    <button className="btn btn-outline btn-icon">
                                        <Play size={24} />
                                    </button>
                                    <div className="playback-bar">
                                        <div className="progress">
                                            <div className="progress-bar" style={{ width: '0%' }} />
                                        </div>
                                        <span>{formatTime(recordingTime)}</span>
                                    </div>
                                </div>
                                <div className="submit-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setHasRecording(false);
                                            setRecordingTime(0);
                                        }}
                                    >
                                        إعادة التسجيل
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        <Upload size={18} />
                                        <span>إرسال الواجب</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeworkPage;
