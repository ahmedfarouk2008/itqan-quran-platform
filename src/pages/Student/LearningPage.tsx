import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Volume2,
  ChevronLeft,
  Check,
  X,
  Play,
  Pause,
  Upload,
  BookMarked,
  Star,
  AlertCircle
} from 'lucide-react';
import '../../styles/pages/learning.css';

// ==============================================
// Learning Page - صفحة التعلّم (حفظ/تجويد/تفسير)
// ==============================================

type LearningTab = 'hifz' | 'tajweed' | 'tafseer';

interface LearningPageProps {
  onNavigate: (tab: string) => void;
}

// Mock data for memorization progress
const mockMemorizationData = {
  currentSurah: 'الملك',
  surahNumber: 67,
  totalAyahs: 30,
  currentTarget: { start: 1, end: 15 },
  memorizedAyahs: 10,
  checkpoints: [
    { start: 1, end: 5, completed: true },
    { start: 6, end: 10, completed: true },
    { start: 11, end: 15, completed: false },
    { start: 16, end: 20, completed: false },
    { start: 21, end: 25, completed: false },
    { start: 26, end: 30, completed: false },
  ],
  teacherNotes: [
    { type: 'warning', text: 'ركّز على الغنة في "إنّ" و"أنّ"' },
    { type: 'success', text: 'تحسّن ملحوظ في مخارج الحروف' },
  ],
};

// Mock Tajweed modules
const tajweedModules = [
  { id: 1, title: 'أحكام النون الساكنة والتنوين', lessons: 5, completed: 3, icon: '📚' },
  { id: 2, title: 'أحكام الميم الساكنة', lessons: 3, completed: 3, icon: '📖' },
  { id: 3, title: 'المدود', lessons: 6, completed: 2, icon: '🎯' },
  { id: 4, title: 'مخارج الحروف', lessons: 8, completed: 0, icon: '🗣️' },
  { id: 5, title: 'صفات الحروف', lessons: 4, completed: 0, icon: '✨' },
];

// Mock Tafseer lessons
const tafseerLessons = [
  { id: 1, surah: 'الفاتحة', title: 'تفسير سورة الفاتحة', completed: true },
  { id: 2, surah: 'الملك', title: 'تفسير الآيات 1-5', completed: true },
  { id: 3, surah: 'الملك', title: 'تفسير الآيات 6-10', completed: false },
  { id: 4, surah: 'الملك', title: 'تفسير الآيات 11-15', completed: false },
];

const LearningPage: React.FC<LearningPageProps> = () => {
  const [activeTab, setActiveTab] = useState<LearningTab>('hifz');
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  const tabs = [
    { id: 'hifz' as LearningTab, label: 'الحفظ', icon: BookOpen },
    { id: 'tajweed' as LearningTab, label: 'التجويد', icon: Volume2 },
    { id: 'tafseer' as LearningTab, label: 'التفسير', icon: BookMarked },
  ];

  return (
    <div className="learning-page animate-fadeIn">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">التعلّم</h1>
        <p className="page-subtitle">تابع رحلتك في تعلم القرآن الكريم</p>
      </header>

      {/* Tabs */}
      <div className="learning-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`learning-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      <div className="learning-content">
        {activeTab === 'hifz' && (
          <HifzContent
            data={mockMemorizationData}
            onRecordClick={() => setShowRecordingModal(true)}
          />
        )}
        {activeTab === 'tajweed' && <TajweedContent modules={tajweedModules} />}
        {activeTab === 'tafseer' && <TafseerContent lessons={tafseerLessons} />}
      </div>

      {/* Recording Modal */}
      {showRecordingModal && (
        <RecordingModal
          surah={mockMemorizationData.currentSurah}
          ayahs={mockMemorizationData.currentTarget}
          onClose={() => setShowRecordingModal(false)}
        />
      )}
    </div>
  );
};

// ==============================================
// Hifz (Memorization) Content
// ==============================================

interface HifzContentProps {
  data: typeof mockMemorizationData;
  onRecordClick: () => void;
}

const HifzContent: React.FC<HifzContentProps> = ({ data, onRecordClick }) => {
  const progressPercent = Math.round((data.memorizedAyahs / data.totalAyahs) * 100);

  return (
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
            <p className="ayah-range">
              الآيات {data.currentTarget.start} - {data.currentTarget.end}
            </p>
          </div>

          {/* Progress */}
          <div className="progress-section">
            <div className="progress-header">
              <span>التقدم في السورة</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>
            <div className="progress progress-lg">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-stats">
              <span>{data.memorizedAyahs} آية محفوظة</span>
              <span>من {data.totalAyahs} آية</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary btn-lg" onClick={onRecordClick}>
              <Mic size={20} />
              <span>أرسل تسميع صوتي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checkpoints */}
      <div className="checkpoints-card card">
        <div className="card-header">
          <h3>نقاط الإنجاز</h3>
        </div>
        <div className="card-body">
          <div className="checkpoints-grid">
            {data.checkpoints.map((cp, index) => (
              <div
                key={index}
                className={`checkpoint ${cp.completed ? 'completed' : ''}`}
              >
                <div className="checkpoint-icon">
                  {cp.completed ? <Check size={16} /> : <span>{index + 1}</span>}
                </div>
                <span className="checkpoint-range">
                  {cp.start} - {cp.end}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Notes */}
      <div className="notes-card card">
        <div className="card-header">
          <h3>ملاحظات المعلمة</h3>
        </div>
        <div className="card-body">
          <div className="notes-list">
            {data.teacherNotes.map((note, index) => (
              <div key={index} className={`note-item note-${note.type}`}>
                {note.type === 'warning' ? (
                  <AlertCircle size={18} />
                ) : (
                  <Star size={18} />
                )}
                <span>{note.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================
// Tajweed Content
// ==============================================

interface TajweedContentProps {
  modules: typeof tajweedModules;
}

const TajweedContent: React.FC<TajweedContentProps> = ({ modules }) => {
  return (
    <div className="tajweed-content">
      <div className="modules-grid">
        {modules.map(module => {
          const progressPercent = Math.round((module.completed / module.lessons) * 100);
          const isCompleted = module.completed === module.lessons;

          return (
            <div key={module.id} className={`module-card card ${isCompleted ? 'completed' : ''}`}>
              <div className="module-icon">{module.icon}</div>
              <div className="module-info">
                <h3 className="module-title">{module.title}</h3>
                <div className="module-progress">
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="progress-text">
                    {module.completed} / {module.lessons} درس
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">
                {isCompleted ? 'مراجعة' : 'متابعة'}
                <ChevronLeft size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==============================================
// Tafseer Content
// ==============================================

interface TafseerContentProps {
  lessons: typeof tafseerLessons;
}

const TafseerContent: React.FC<TafseerContentProps> = ({ lessons }) => {
  return (
    <div className="tafseer-content">
      <div className="lessons-list">
        {lessons.map(lesson => (
          <div key={lesson.id} className={`lesson-card card ${lesson.completed ? 'completed' : ''}`}>
            <div className="lesson-status">
              {lesson.completed ? (
                <div className="status-icon completed">
                  <Check size={16} />
                </div>
              ) : (
                <div className="status-icon">
                  <span>{lesson.id}</span>
                </div>
              )}
            </div>
            <div className="lesson-info">
              <span className="lesson-surah">{lesson.surah}</span>
              <h3 className="lesson-title">{lesson.title}</h3>
            </div>
            <button className="btn btn-ghost btn-icon">
              <ChevronLeft size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================================
// Recording Modal
// ==============================================

interface RecordingModalProps {
  surah: string;
  ayahs: { start: number; end: number };
  onClose: () => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ surah, ayahs, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In real app, start actual recording here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const handleSubmit = () => {
    // In real app, upload recording here
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop open" onClick={onClose} />
      <div className="modal open recording-modal">
        <div className="modal-header">
          <h2>تسميع صوتي</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="recording-info">
            <h3>سورة {surah}</h3>
            <p>الآيات {ayahs.start} - {ayahs.end}</p>
          </div>

          <div className="recording-area">
            {!hasRecording ? (
              <>
                <div className={`recording-circle ${isRecording ? 'recording' : ''}`}>
                  <Mic size={40} />
                </div>
                <div className="recording-time">{formatTime(recordingTime)}</div>
                {!isRecording ? (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStartRecording}
                  >
                    <Mic size={20} />
                    <span>ابدأ التسجيل</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={handleStopRecording}
                  >
                    <Pause size={20} />
                    <span>إيقاف التسجيل</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="playback-area">
                  <button className="btn btn-outline btn-icon">
                    <Play size={24} />
                  </button>
                  <div className="playback-progress">
                    <div className="progress">
                      <div className="progress-bar" style={{ width: '0%' }} />
                    </div>
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                </div>
                <div className="recording-actions">
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
                    <span>إرسال</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="recording-tips">
            <h4>نصائح للتسميع:</h4>
            <ul>
              <li>تأكد من الهدوء في المكان</li>
              <li>سمّع بصوت واضح ومسموع</li>
              <li>راعِ أحكام التجويد</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPage;
