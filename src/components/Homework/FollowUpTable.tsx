import React from 'react';
import {
    FileText,
    Edit,
    Trash2
} from 'lucide-react';
import '../../styles/pages/homework.css';

export interface FollowUpRecord {
    id: string;
    date: string;
    day: string;
    hifz: { surah: string; from: string; to: string; grade: string };
    revision: { surah: string; from: string; to: string; grade: string };
    notes?: string;
}

interface FollowUpTableProps {
    records: FollowUpRecord[];
    isTeacher?: boolean;
    onEdit?: (record: FollowUpRecord) => void;
    onDelete?: (id: string) => void;
}

const getGradeClass = (grade: string) => {
    if (grade.includes('ممتاز')) return 'excellent';
    if (grade.includes('جيد جداً') || grade.includes('جيد جدا')) return 'very-good';
    if (grade.includes('جيد')) return 'good';
    return 'neutral';
};

const FollowUpTable: React.FC<FollowUpTableProps> = ({
    records,
    isTeacher = false,
    onEdit,
    onDelete
}) => {
    if (records.length === 0) {
        return (
            <div className="empty-state">
                <FileText size={48} className="empty-state-icon" />
                <p>لا توجد سجلات متابعة حتى الآن</p>
            </div>
        );
    }

    return (
        <div className="follow-up-table-container card">
            <div className="table-responsive">
                <table className="follow-up-table">
                    <thead>
                        <tr>
                            <th rowSpan={2} className="col-day">اليوم / التاريخ</th>
                            <th colSpan={4} className="col-group">الحفظ الجديد</th>
                            <th colSpan={4} className="col-group">المراجعة</th>
                            <th rowSpan={2} className="col-notes">ملاحظات المعلمة</th>
                            {isTeacher && <th rowSpan={2} className="col-actions">إجراءات</th>}
                        </tr>
                        <tr>
                            {/* Hifz Columns */}
                            <th>السورة</th>
                            <th>من</th>
                            <th>إلى</th>
                            <th>التقدير</th>

                            {/* Revision Columns */}
                            <th>السورة</th>
                            <th>من</th>
                            <th>إلى</th>
                            <th>التقدير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(record => (
                            <tr key={record.id}>
                                <td className="cell-day">
                                    <div className="day-name">{record.day}</div>
                                    <div className="date-value">{record.date}</div>
                                </td>

                                {/* Hifz Data */}
                                <td>{record.hifz.surah}</td>
                                <td>{record.hifz.from}</td>
                                <td>{record.hifz.to}</td>
                                <td>
                                    <span className={`grade-badge grade-${getGradeClass(record.hifz.grade)}`}>
                                        {record.hifz.grade}
                                    </span>
                                </td>

                                {/* Revision Data */}
                                <td>{record.revision.surah}</td>
                                <td>{record.revision.from}</td>
                                <td>{record.revision.to}</td>
                                <td>
                                    <span className={`grade-badge grade-${getGradeClass(record.revision.grade)}`}>
                                        {record.revision.grade}
                                    </span>
                                </td>

                                <td className="cell-notes">{record.notes || '-'}</td>

                                {isTeacher && (
                                    <td className="cell-actions">
                                        <div className="actions-wrapper">
                                            <button
                                                className="icon-btn"
                                                onClick={() => onEdit?.(record)}
                                                title="تعديل"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="icon-btn danger"
                                                onClick={() => onDelete?.(record.id)}
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FollowUpTable;
