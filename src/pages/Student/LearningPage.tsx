import React from 'react';
import {
  Star,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/learning.css';

// ==============================================
// Learning Page - صفحة التعلّم (حفظ فقط)
// ==============================================

interface LearningPageProps {
  onNavigate: (tab: string) => void;
}

const LearningPage: React.FC<LearningPageProps> = () => {
  const { profile } = useAuth();

  // Use profile data or defaults
  const data = {
    currentSurah: profile?.current_surah || 'لم يبدأ',
    surahNumber: 0, // Could be mapped if needed, simplified for now
    totalAyahs: 30, // Default or could be dynamic
    currentStart: 1, // Simplified
    memorizedAyahs: profile?.memorized_ayahs || 0, // Now represents Juz
    teacherNotes: profile?.teacher_notes || []
  };

  return (
    <div className="learning-page animate-fadeIn">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">الحفظ</h1>
        <p className="page-subtitle">تابع رحلتك في حفظ القرآن الكريم</p>
      </header>

      {/* Content */}
      <div className="learning-content">
        <div className="hifz-content">
          {/* Current Target Card */}
          <div className="current-target-card card">
            <div className="card-header">
              <h3>الهدف الحالي</h3>
              <span className="badge badge-hifz">حفظ</span>
            </div>
            <div className="card-body">
              <div className="surah-info">
                <h2 className="surah-name">سورة {data.currentSurah}</h2>
                <div className="ayah-range">
                  <span>الجزء الحالي: {data.memorizedAyahs}</span>
                </div>
              </div>

              {/* Progress Removed */}
            </div>
          </div>

          {/* Teacher Notes */}
          <div className="notes-card card">
            <div className="card-header">
              <h3>ملاحظات المعلمة</h3>
            </div>
            <div className="card-body">
              {data.teacherNotes.length > 0 ? (
                <div className="notes-list">
                  {data.teacherNotes.map((note, index) => (
                    <div key={index} className={`note-item note-${note.type}`}>
                      {note.type === 'warning' ? (
                        <AlertCircle size={18} />
                      ) : (
                        <Star size={18} />
                      )}
                      <span>{note.text}</span>
                      <span className="text-xs text-gray-400 block mt-1">{new Date(note.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm p-4 text-center">لا توجد ملاحظات حالياً</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
