import React from 'react';
import FollowUpTable from '../../components/Homework/FollowUpTable';
import '../../styles/pages/homework.css';
import { useFollowUpRecords } from '../../hooks/useFollowUpRecords';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from 'lucide-react';

// ==============================================
// Homework Page - صفحة الواجبات (جدول المتابعة)
// ==============================================

interface HomeworkPageProps {
    onNavigate: (tab: string) => void;
}

const HomeworkPage: React.FC<HomeworkPageProps> = () => {
    const { user } = useAuth();
    const { records: followUpRecords, isLoading } = useFollowUpRecords(user?.uid || null);

    return (
        <div className="homework-page animate-fadeIn">
            {/* Page Header */}
            <header className="page-header">
                <h1 className="page-title">جدول المتابعة</h1>
                <p className="page-subtitle">سجل الحفظ والمراجعة اليومي</p>
            </header>

            {/* Follow-up Table */}
            {isLoading ? (
                <div className="flex justify-center p-10">
                    <Loader className="animate-spin text-primary-600" size={32} />
                </div>
            ) : (
                <FollowUpTable records={followUpRecords} />
            )}
        </div>
    );
};

export default HomeworkPage;
