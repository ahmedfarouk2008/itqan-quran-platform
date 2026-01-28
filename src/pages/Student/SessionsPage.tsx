import React, { useState } from 'react';
import {
    Calendar,
    Video,
    Plus,
    Edit3,
    Clock,
    X,
    Loader,
    User as UserIcon
} from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { useTeachers } from '../../hooks/useTeachers';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/sessions.css';

interface SessionsPageProps {
    onNavigate: (tab: string) => void;
}

const SessionsPage: React.FC<SessionsPageProps> = () => {
    const { sessions, isLoading: sessionsLoading } = useSessions();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Filter sessions
    const upcomingSessions = sessions.filter(
        s => new Date(s.scheduled_at).getTime() > new Date().getTime() && s.status !== 'ملغاة'
    );

    const pastSessions = sessions.filter(
        s => new Date(s.scheduled_at).getTime() <= new Date().getTime() || s.status === 'مكتملة'
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

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; class: string }> = {
            'مؤكدة': { label: 'مؤكدة', class: 'badge-confirmed' },
            'قيد المراجعة': { label: 'في انتظار الموافقة', class: 'badge-pending' },
            'ملغاة': { label: 'ملغاة', class: 'badge-cancelled' },
            'مكتملة': { label: 'مكتملة', class: 'badge-completed' },
            'جارية': { label: 'جارية', class: 'badge-confirmed' },
        };
        return statusMap[status] || { label: status, class: '' };
    };

    const currentSessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

    if (sessionsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

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
                {currentSessions.length > 0 ? (
                    currentSessions.map(session => {
                        const statusBadge = getStatusBadge(session.status);
                        const isUpcoming = new Date(session.scheduled_at).getTime() > new Date().getTime();
                        const canJoin = isUpcoming && session.status === 'مؤكدة';

                        return (
                            <div key={session.id} className="session-card card">
                                <div className="session-card-header">
                                    <div className="session-badges">
                                        <span className="badge badge-hifz">{session.type || 'حفظ'}</span>
                                        <span className={`badge ${statusBadge.class}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="session-card-body">
                                    <div className="session-datetime">
                                        <div className="session-date">
                                            <Calendar size={18} />
                                            <span>{formatDate(session.scheduled_at)}</span>
                                        </div>
                                        <div className="session-time">
                                            <Clock size={18} className="ml-2" />
                                            {formatTime(session.scheduled_at)}
                                        </div>
                                    </div>

                                    {session.notes && (
                                        <div className="session-notes">
                                            <Edit3 size={14} />
                                            <span>{session.notes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="session-card-footer">
                                    {canJoin ? (
                                        <button
                                            className={`btn w-full ${session.meeting_link ? 'btn-primary' : 'btn-disabled opacity-50 cursor-not-allowed'}`}
                                            onClick={() => {
                                                if (session.meeting_link) {
                                                    window.open(session.meeting_link, '_blank');
                                                } else {
                                                    alert('لم يتم إضافة رابط للجلسة بعد من قبل المعلمة');
                                                }
                                            }}
                                            disabled={!session.meeting_link}
                                        >
                                            <Video size={18} />
                                            <span>انضم للجلسة</span>
                                        </button>
                                    ) : isUpcoming && (session.status === 'قيد المراجعة') ? (
                                        <div className="session-pending-actions w-full">
                                            <div className="pending-status">
                                                <Loader size={16} className="animate-spin" />
                                                <span>بانتظار موافقة المعلمة</span>
                                            </div>
                                        </div>
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
    const { success, error: showError } = useToast();
    const { createSession } = useSessions();
    const { teachers, isLoading: teachersLoading } = useTeachers();

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-select first teacher or handle if none
    // FALLBACK: Use a placeholder ID if no teachers found to allow booking in demo/single-teacher mode
    const teacherId = teachers.length > 0 ? teachers[0].id : 'teacher_placeholder_id';

    const handleSubmit = async () => {
        if (!date || !time || !teacherId) return;

        setIsSubmitting(true);
        try {
            // Combine date and time to ISO string
            const scheduledAt = new Date(`${date}T${time}`).toISOString();

            const { error } = await createSession({
                teacher_id: teacherId,
                type: 'حفظ',
                duration: 30, // Default duration
                scheduled_at: scheduledAt,
                notes: notes
            });

            if (error) throw error;

            success('تم إرسال طلب الحجز للمعلمة بنجاح');
            onClose();
        } catch (err) {
            console.error(err);
            showError('حدث خطأ أثناء حجز الجلسة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit = date && time && teacherId && !teachersLoading;

    return (
        <>
            <div className="modal-backdrop open" onClick={onClose} />
            <div className="modal open booking-modal">
                <div className="modal-header">
                    <h2>حجز موعد جديد</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="booking-form p-4">
                        {/* Teacher Info (Optional display since auto-selected) */}
                        {teachersLoading ? (
                            <div className="flex justify-center p-4"><Loader className="animate-spin" /></div>
                        ) : (
                            <div className="teacher-info mb-6 p-4 bg-gray-50 rounded-lg flex items-center border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 ml-3">
                                    <UserIcon size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">ميعاد مع المعلمة</span>
                                    <span className="font-semibold text-gray-900">
                                        {teachers.length > 0 ? teachers[0].name : (teacherId === 'teacher_placeholder_id' ? 'المعلمة المشرفة (حساب افتراضي)' : 'المعلمة المشرفة')}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="form-group">
                                <label className="block mb-2 text-sm font-medium text-gray-700">تاريخ الجلسة</label>
                                <input
                                    type="date"
                                    className="form-input w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="block mb-2 text-sm font-medium text-gray-700">وقت الجلسة</label>
                                <input
                                    type="time"
                                    className="form-input w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">ملاحظات (اختياري)</label>
                            <textarea
                                className="form-input w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="مثال: مراجعة سورة الملك..."
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer flexjustify-end gap-2 p-4 border-t">
                    <button
                        className="btn btn-secondary px-4 py-2 rounded-lg"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        إلغاء
                    </button>
                    <button
                        className="btn btn-primary px-6 py-2 rounded-lg flex items-center gap-2"
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                <span>جاري الحجز...</span>
                            </>
                        ) : (
                            <span>تأكيد الحجز</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SessionsPage;
