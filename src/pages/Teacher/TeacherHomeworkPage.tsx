import React, { useState } from 'react';
import {
    Search,
    ChevronLeft,
    Plus,
    User,
    BookOpen,
    Save,
    X
} from 'lucide-react';
import FollowUpTable, { FollowUpRecord } from '../../components/Homework/FollowUpTable';
import '../../styles/pages/teacher-homework.css';

// ==============================================
// Teacher Homework Page - متابعة الحفظ والمراجعة
// ==============================================

interface TeacherHomeworkPageProps {
    onNavigate: (page: string) => void;
}

interface Student {
    id: string;
    name: string;
    level: string;
    lastUpdate: string;
}

// Mock Students Data
const students: Student[] = [
    { id: '1', name: 'أحمد محمد', level: 'المستوى الثالث', lastUpdate: 'اليوم' },
    { id: '2', name: 'فاطمة علي', level: 'المستوى الرابع', lastUpdate: 'أمس' },
    { id: '3', name: 'نور الدين', level: 'المستوى الثاني', lastUpdate: 'منذ يومين' },
    { id: '4', name: 'سارة أحمد', level: 'المستوى الثالث', lastUpdate: 'منذ 3 أيام' },
    { id: '5', name: 'يوسف محمد', level: 'المستوى الأول', lastUpdate: 'منذ 5 أيام' },
];

// Mock Records Initial Data
const initialRecords: FollowUpRecord[] = [
    {
        id: '1',
        date: '2024-01-27',
        day: 'السبت',
        hifz: { surah: 'الملك', from: '1', to: '15', grade: 'ممتاز' },
        revision: { surah: 'البقرة', from: '1', to: '10', grade: 'جيد جداً' },
        notes: 'انتبه للغنة'
    },
    {
        id: '2',
        date: '2024-01-24',
        day: 'الأربعاء',
        hifz: { surah: 'القلم', from: '1', to: '20', grade: 'جيد' },
        revision: { surah: 'البقرة', from: '11', to: '20', grade: 'ممتاز' },
        notes: ''
    }
];

const emptyRecordData = {
    date: new Date().toISOString().split('T')[0],
    hifzSurah: '',
    hifzFrom: '',
    hifzTo: '',
    hifzGrade: 'جيد جداً',
    revSurah: '',
    revFrom: '',
    revTo: '',
    revGrade: 'جيد جداً',
    notes: ''
};

const TeacherHomeworkPage: React.FC<TeacherHomeworkPageProps> = ({ onNavigate }) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [records, setRecords] = useState<FollowUpRecord[]>(initialRecords);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyRecordData);

    const filteredStudents = students.filter(student =>
        student.name.includes(searchQuery)
    );

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student);
        // In real app, fetch records for this student here
    };

    const handleBack = () => {
        setSelectedStudent(null);
    };

    // --- Actions ---

    const handleAddClick = () => {
        setFormData(emptyRecordData);
        setEditingRecordId(null);
        setShowAddModal(true);
    };

    const handleEditRecord = (record: FollowUpRecord) => {
        setFormData({
            date: record.date,
            hifzSurah: record.hifz.surah,
            hifzFrom: record.hifz.from,
            hifzTo: record.hifz.to,
            hifzGrade: record.hifz.grade,
            revSurah: record.revision.surah,
            revFrom: record.revision.from,
            revTo: record.revision.to,
            revGrade: record.revision.grade,
            notes: record.notes || ''
        });
        setEditingRecordId(record.id);
        setShowAddModal(true);
    };

    const handleDeleteRecord = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            setRecords(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleSaveRecord = (e: React.FormEvent) => {
        e.preventDefault();

        const dateObj = new Date(formData.date);
        const dayName = dateObj.toLocaleDateString('ar-EG', { weekday: 'long' });

        const newRecord: FollowUpRecord = {
            id: editingRecordId || Date.now().toString(),
            date: formData.date,
            day: dayName,
            hifz: {
                surah: formData.hifzSurah,
                from: formData.hifzFrom,
                to: formData.hifzTo,
                grade: formData.hifzGrade
            },
            revision: {
                surah: formData.revSurah,
                from: formData.revFrom,
                to: formData.revTo,
                grade: formData.revGrade
            },
            notes: formData.notes
        };

        if (editingRecordId) {
            setRecords(prev => prev.map(r => r.id === editingRecordId ? newRecord : r));
        } else {
            setRecords(prev => [newRecord, ...prev]);
        }

        setShowAddModal(false);
    };

    return (
        <div className="teacher-homework-page animate-fadeIn">
            {!selectedStudent ? (
                /* Students Grid View */
                <>
                    <header className="page-header">
                        <div className="header-content">
                            <h1>
                                <BookOpen size={28} />
                                سجلات المتابعة
                            </h1>
                            <p>اختر طالباً لعرض وتحديث سجل الحفظ والمراجعة</p>
                        </div>
                    </header>

                    <div className="controls-bar">
                        <div className="search-wrapper">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن طالب..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="students-grid">
                        {filteredStudents.map(student => (
                            <div
                                key={student.id}
                                className="student-card"
                                onClick={() => handleStudentClick(student)}
                            >
                                <div className="student-avatar">
                                    <User size={24} />
                                </div>
                                <div className="student-info">
                                    <h3>{student.name}</h3>
                                    <span className="student-level">{student.level}</span>
                                    <span className="last-update">آخر تحديث: {student.lastUpdate}</span>
                                </div>
                                <ChevronLeft size={20} className="arrow-icon" />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* Student Follow-up Details */
                <div className="student-details-view">
                    <header className="details-header">
                        <button className="back-btn" onClick={handleBack}>
                            <ChevronLeft size={20} />
                            رجوع
                        </button>
                        <div className="student-header-info">
                            <h2>{selectedStudent.name}</h2>
                            <span className="level-badge">{selectedStudent.level}</span>
                        </div>
                        <button
                            className="add-record-btn"
                            onClick={handleAddClick}
                        >
                            <Plus size={18} />
                            إضافة سجل يومي
                        </button>
                    </header>

                    <FollowUpTable
                        records={records}
                        isTeacher={true}
                        onEdit={handleEditRecord}
                        onDelete={handleDeleteRecord}
                    />
                </div>
            )}

            {/* Add/Edit Record Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="add-session-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>{editingRecordId ? 'تعديل السجل' : 'إضافة سجل يومي'}</h2>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRecord} className="session-form">
                            {/* Date */}
                            <div className="form-group">
                                <label>التاريخ</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Two Columns: Hifz & Revision */}
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Hifz Column */}
                                <div className="column-group">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-600)' }}>الحفظ الجديد</h3>
                                    <div className="form-group">
                                        <label>السورة</label>
                                        <input
                                            type="text"
                                            placeholder="اسم السورة"
                                            value={formData.hifzSurah}
                                            onChange={e => setFormData({ ...formData, hifzSurah: e.target.value })}
                                            style={{ color: 'var(--color-neutral-800)' }}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>من آية</label>
                                            <input
                                                type="text"
                                                value={formData.hifzFrom}
                                                onChange={e => setFormData({ ...formData, hifzFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>إلى آية</label>
                                            <input
                                                type="text"
                                                value={formData.hifzTo}
                                                onChange={e => setFormData({ ...formData, hifzTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>التقدير</label>
                                        <select
                                            value={formData.hifzGrade}
                                            onChange={e => setFormData({ ...formData, hifzGrade: e.target.value })}
                                        >
                                            <option value="ممتاز">ممتاز</option>
                                            <option value="جيد جداً">جيد جداً</option>
                                            <option value="جيد">جيد</option>
                                            <option value="مقبول">مقبول</option>
                                            <option value="إعادة">إعادة</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Revision Column */}
                                <div className="column-group">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary-600)' }}>المراجعة</h3>
                                    <div className="form-group">
                                        <label>السورة</label>
                                        <input
                                            type="text"
                                            placeholder="اسم السورة"
                                            value={formData.revSurah}
                                            onChange={e => setFormData({ ...formData, revSurah: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>من آية</label>
                                            <input
                                                type="text"
                                                value={formData.revFrom}
                                                onChange={e => setFormData({ ...formData, revFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>إلى آية</label>
                                            <input
                                                type="text"
                                                value={formData.revTo}
                                                onChange={e => setFormData({ ...formData, revTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>التقدير</label>
                                        <select
                                            value={formData.revGrade}
                                            onChange={e => setFormData({ ...formData, revGrade: e.target.value })}
                                        >
                                            <option value="ممتاز">ممتاز</option>
                                            <option value="جيد جداً">جيد جداً</option>
                                            <option value="جيد">جيد</option>
                                            <option value="مقبول">مقبول</option>
                                            <option value="إعادة">إعادة</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="form-group">
                                <label>ملاحظات</label>
                                <textarea
                                    rows={3}
                                    placeholder="أية ملاحظات إضافية..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ color: 'var(--color-neutral-800)' }}
                                />
                            </div>

                            <button type="submit" className="upload-btn primary" style={{ width: '100%', marginTop: '1rem' }}>
                                <Save size={18} />
                                حفظ السجل
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherHomeworkPage;
