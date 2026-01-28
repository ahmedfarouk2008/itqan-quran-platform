import React from 'react';
import FollowUpTable, { FollowUpRecord } from '../../components/Homework/FollowUpTable';
import '../../styles/pages/homework.css';

// ==============================================
// Homework Page - صفحة الواجبات (جدول المتابعة)
// ==============================================

interface HomeworkPageProps {
    onNavigate: (tab: string) => void;
}

// Mock data for the follow-up table
const followUpRecords: FollowUpRecord[] = [
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
    },
    {
        id: '3',
        date: '2024-01-22',
        day: 'الاثنين',
        hifz: { surah: 'القلم', from: '21', to: '40', grade: 'ممتاز' },
        revision: { surah: 'البقرة', from: '21', to: '30', grade: 'ممتاز' },
        notes: 'ما شاء الله تبارك الله'
    }
];

const HomeworkPage: React.FC<HomeworkPageProps> = () => {
    return (
        <div className="homework-page animate-fadeIn">
            {/* Page Header */}
            <header className="page-header">
                <h1 className="page-title">جدول المتابعة</h1>
                <p className="page-subtitle">سجل الحفظ والمراجعة اليومي</p>
            </header>

            {/* Follow-up Table */}
            <FollowUpTable records={followUpRecords} />
        </div>
    );
};

export default HomeworkPage;
