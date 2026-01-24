import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Video,
    ChevronLeft,
    ChevronRight,
    Plus,
    Edit3,
    Check,
    X
} from 'lucide-react';
import { Session, SessionStatus, SessionType, SessionDuration } from '../../types';
import '../../styles/pages/sessions.css';

// ==============================================
// Sessions Page - صفحة الجلسات (للطالب)
// ==============================================

interface SessionsPageProps {
    onNavigate: (tab: string) => void;
}

// Mock data
const mockSessions: Session[] = [
    {
        id: '1',
        studentId: '1',
        teacherId: '1',
        type: SessionType.HIFZ,
        status: SessionStatus.CONFIRMED,
        duration: SessionDuration.FORTY_FIVE,
        scheduledAt: new Date(Date.now() + 3600000 * 4).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        studentId: '1',
        teacherId: '1',
        type: SessionType.TAJWEED,
        status: SessionStatus.PENDING,
        duration: SessionDuration.THIRTY,
        scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        notes: 'أريد التركيز على أحكام النون الساكنة',
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        studentId: '1',
        teacherId: '1',
        type: SessionType.HIFZ,
        status: SessionStatus.COMPLETED,
        duration: SessionDuration.SIXTY,
        scheduledAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        summary: {
            whatWasCovered: 'تسميع سورة الملك 1-15',
            mistakes: ['مد الألف في "مالك"', 'الغنة في "إنّ"'],
            homework: 'مراجعة الآيات 1-15 مع التركيز على المدود',
        },
        createdAt: new Date().toISOString(),
    },
];

const SessionsPage: React.FC<SessionsPageProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [showBookingModal, setShowBookingModal] = useState(false);

    const upcomingSessions = mockSessions.filter(
        s => new Date(s.scheduledAt) > new Date() && s.status !== SessionStatus.CANCELLED
    );

    const pastSessions = mockSessions.filter(
        s => new Date(s.scheduledAt) <= new Date() || s.status === SessionStatus.COMPLETED
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'اليوم';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'غداً';
        } else {
            return date.toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadge = (status: SessionStatus) => {
        const statusMap: Record<SessionStatus, { label: string; class: string }> = {
            [SessionStatus.CONFIRMED]: { label: 'مؤكدة', class: 'badge-confirmed' },
            [SessionStatus.PENDING]: { label: 'قيد المراجعة', class: 'badge-pending' },
            [SessionStatus.CANCELLED]: { label: 'ملغاة', class: 'badge-cancelled' },
            [SessionStatus.COMPLETED]: { label: 'مكتملة', class: 'badge-completed' },
            [SessionStatus.IN_PROGRESS]: { label: 'جارية', class: 'badge-confirmed' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const getTypeBadge = (type: SessionType) => {
        const typeMap: Record<SessionType, string> = {
            [SessionType.HIFZ]: 'badge-hifz',
            [SessionType.TAJWEED]: 'badge-tajweed',
            [SessionType.TAFSEER]: 'badge-tafseer',
        };
        return typeMap[type] || '';
    };

    const sessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

    return (
        <div className="sessions-page animate-fadeIn">
            {/* Page Header */}
            <header className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">الجلسات</h1>
                    <p className="page-subtitle">إدارة جلساتك التعليمية وحجز مواعيد جديدة</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowBookingModal(true)}
                >
                    <Plus size={18} />
                    <span>احجز جلسة</span>
                </button>
            </header>

            {/* Tabs */}
            <div className="tabs sessions-tabs">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    القادمة ({upcomingSessions.length})
                </button>
                <button
                    className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    السابقة ({pastSessions.length})
                </button>
            </div>

            {/* Sessions List */}
            <div className="sessions-list">
                {sessions.length > 0 ? (
                    sessions.map(session => {
                        const statusBadge = getStatusBadge(session.status);
                        const isUpcoming = new Date(session.scheduledAt) > new Date();
                        const canJoin = isUpcoming && session.status === SessionStatus.CONFIRMED;

                        return (
                            <div key={session.id} className="session-card card">
                                <div className="session-card-header">
                                    <div className="session-badges">
                                        <span className={`badge ${getTypeBadge(session.type)}`}>
                                            {session.type}
                                        </span>
                                        <span className={`badge ${statusBadge.class}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                    <div className="session-duration">
                                        <Clock size={14} />
                                        <span>{session.duration} دقيقة</span>
                                    </div>
                                </div>

                                <div className="session-card-body">
                                    <div className="session-datetime">
                                        <div className="session-date">
                                            <Calendar size={18} />
                                            <span>{formatDate(session.scheduledAt)}</span>
                                        </div>
                                        <div className="session-time">
                                            {formatTime(session.scheduledAt)}
                                        </div>
                                    </div>

                                    {session.notes && (
                                        <div className="session-notes">
                                            <Edit3 size={14} />
                                            <span>{session.notes}</span>
                                        </div>
                                    )}

                                    {session.summary && (
                                        <div className="session-summary">
                                            <h4>ملخص الجلسة</h4>
                                            <p>{session.summary.whatWasCovered}</p>
                                            {session.summary.mistakes && session.summary.mistakes.length > 0 && (
                                                <div className="summary-mistakes">
                                                    <span className="mistakes-label">الأخطاء:</span>
                                                    <div className="mistakes-tags">
                                                        {session.summary.mistakes.map((mistake, i) => (
                                                            <span key={i} className="mistake-tag">{mistake}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="session-card-footer">
                                    {canJoin ? (
                                        <button className="btn btn-primary w-full">
                                            <Video size={18} />
                                            <span>انضم للجلسة</span>
                                        </button>
                                    ) : isUpcoming && session.status === SessionStatus.PENDING ? (
                                        <div className="session-pending-actions">
                                            <span className="pending-text">في انتظار تأكيد المعلمة</span>
                                        </div>
                                    ) : isUpcoming ? (
                                        <button className="btn btn-secondary w-full">
                                            <Edit3 size={18} />
                                            <span>طلب تغيير الموعد</span>
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        <Calendar size={48} className="empty-state-icon" />
                        <h3 className="empty-state-title">
                            {activeTab === 'upcoming' ? 'لا توجد جلسات قادمة' : 'لا توجد جلسات سابقة'}
                        </h3>
                        <p className="empty-state-description">
                            {activeTab === 'upcoming'
                                ? 'احجز جلسة جديدة مع معلمتك للبدء'
                                : 'ستظهر هنا جلساتك المكتملة'
                            }
                        </p>
                        {activeTab === 'upcoming' && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowBookingModal(true)}
                            >
                                <Plus size={18} />
                                <span>احجز جلسة الآن</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal onClose={() => setShowBookingModal(false)} />
            )}
        </div>
    );
};

// ==============================================
// Booking Modal Component
// ==============================================

interface BookingModalProps {
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<SessionType | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<SessionDuration | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    const sessionTypes = [
        { id: SessionType.HIFZ, label: 'حفظ', icon: '📖', description: 'تسميع ومراجعة الحفظ' },
        { id: SessionType.TAJWEED, label: 'تجويد', icon: '🎤', description: 'تعلم أحكام التجويد' },
        { id: SessionType.TAFSEER, label: 'تفسير', icon: '📚', description: 'فهم معاني الآيات' },
    ];

    const durations = [
        { id: SessionDuration.THIRTY, label: '٣٠ دقيقة' },
        { id: SessionDuration.FORTY_FIVE, label: '٤٥ دقيقة' },
        { id: SessionDuration.SIXTY, label: '٦٠ دقيقة' },
    ];

    // Mock available slots
    const availableSlots = [
        { id: '1', date: 'الأحد ٢٦ يناير', time: '٤:٠٠ م' },
        { id: '2', date: 'الأحد ٢٦ يناير', time: '٥:٠٠ م' },
        { id: '3', date: 'الاثنين ٢٧ يناير', time: '٤:٠٠ م' },
        { id: '4', date: 'الاثنين ٢٧ يناير', time: '٦:٠٠ م' },
        { id: '5', date: 'الثلاثاء ٢٨ يناير', time: '٣:٠٠ م' },
    ];

    const canProceed = () => {
        switch (step) {
            case 1: return !!selectedType;
            case 2: return !!selectedDuration;
            case 3: return !!selectedSlot;
            case 4: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            // Submit booking
            console.log('Booking submitted:', {
                type: selectedType,
                duration: selectedDuration,
                slot: selectedSlot,
                notes,
            });
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <>
            <div className="modal-backdrop open" onClick={onClose} />
            <div className="modal open booking-modal">
                <div className="modal-header">
                    <h2>حجز جلسة جديدة</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="booking-progress">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`booking-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                        >
                            {s < step ? <Check size={14} /> : s}
                        </div>
                    ))}
                </div>

                <div className="modal-body">
                    {/* Step 1: Select Type */}
                    {step === 1 && (
                        <div className="booking-step-content animate-fadeIn">
                            <h3 className="step-title">اختر نوع الجلسة</h3>
                            <div className="type-options">
                                {sessionTypes.map(type => (
                                    <button
                                        key={type.id}
                                        className={`type-option ${selectedType === type.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedType(type.id)}
                                    >
                                        <span className="type-icon">{type.icon}</span>
                                        <span className="type-label">{type.label}</span>
                                        <span className="type-description">{type.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Duration */}
                    {step === 2 && (
                        <div className="booking-step-content animate-fadeIn">
                            <h3 className="step-title">اختر مدة الجلسة</h3>
                            <div className="duration-options">
                                {durations.map(duration => (
                                    <button
                                        key={duration.id}
                                        className={`duration-option ${selectedDuration === duration.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedDuration(duration.id)}
                                    >
                                        <Clock size={20} />
                                        <span>{duration.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Select Time Slot */}
                    {step === 3 && (
                        <div className="booking-step-content animate-fadeIn">
                            <h3 className="step-title">اختر الموعد</h3>
                            <div className="slots-list">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot.id}
                                        className={`slot-option ${selectedSlot === slot.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedSlot(slot.id)}
                                    >
                                        <div className="slot-date">{slot.date}</div>
                                        <div className="slot-time">{slot.time}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Notes */}
                    {step === 4 && (
                        <div className="booking-step-content animate-fadeIn">
                            <h3 className="step-title">ملاحظات للمعلمة (اختياري)</h3>
                            <textarea
                                className="form-input booking-notes"
                                placeholder="مثال: أريد التركيز على سورة..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step > 1 && (
                        <button className="btn btn-secondary" onClick={handleBack}>
                            <ChevronRight size={18} />
                            <span>السابق</span>
                        </button>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!canProceed()}
                    >
                        <span>{step === 4 ? 'تأكيد الحجز' : 'التالي'}</span>
                        {step < 4 && <ChevronLeft size={18} />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SessionsPage;
