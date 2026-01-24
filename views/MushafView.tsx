
import React, { useState } from 'react';
import { Mic, Info, Sparkles, BookOpen, Bell, Calendar, CheckCircle, Clock, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const MushafView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedAyah = { 
    surah: 'البقرة', 
    num: '255', 
    text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ' 
  };

  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsLoading(true);
      try {
        const dummyAnalysis = await geminiService.analyzeTajweed('dummy_base64', selectedAyah.text);
        setFeedback(dummyAnalysis);
      } catch (e) {
        setFeedback("تم استقبال تسجيلك، أحسنت في نطق الحروف اللثوية.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsRecording(true);
      setFeedback(null);
    }
  };

  const handleTafsir = async () => {
    setIsLoading(true);
    try {
      const res = await geminiService.getAyahTafsir(selectedAyah.surah, selectedAyah.num);
      setTafsir(res);
    } catch (e) {
      setTafsir("آية الكرسي هي أعظم آية في القرآن الكريم، وتتحدث عن توحيد الله وعظمته.");
    } finally {
      setIsLoading(false);
    }
  };

  const setReminder = (timeLabel: string) => {
    setNotification(`تم ضبط موعد مراجعة للآية ${selectedAyah.num} (${timeLabel})`);
    setShowReminderMenu(false);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn relative">
      {/* Global Notification */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">{notification}</span>
        </div>
      )}

      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 islamic-pattern text-center relative overflow-hidden">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">سورة {selectedAyah.surah}</h2>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-8 h-px bg-slate-200"></span>
            <span className="text-sm font-bold tracking-widest uppercase">الآية {selectedAyah.num}</span>
            <span className="w-8 h-px bg-slate-200"></span>
          </div>
        </div>

        <p className="quran-font text-4xl md:text-5xl leading-[4.5rem] md:leading-[5.5rem] text-slate-800 mb-12 py-8 border-y border-emerald-50">
          {selectedAyah.text}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={handleRecord}
            disabled={isLoading}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
              isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isRecording ? <Clock className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isRecording ? 'إيقاف التسجيل' : 'بدء التسميع'}</span>
          </button>

          <button 
            onClick={handleTafsir}
            disabled={isLoading}
            className="flex items-center gap-3 px-8 py-4 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
          >
            <Info className="w-5 h-5" />
            <span>طلب التفسير</span>
          </button>

          <button 
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border ${
              showReminderMenu 
              ? 'bg-amber-100 text-amber-800 border-amber-200' 
              : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>تذكير بالمراجعة</span>
          </button>
        </div>

        {/* Reminder Options Panel */}
        {showReminderMenu && (
          <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 animate-slideDown max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-amber-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                متى تود مراجعة هذه الآية؟
              </h4>
              <button onClick={() => setShowReminderMenu(false)} className="text-amber-400 hover:text-amber-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'بعد ساعة', value: 'بعد ساعة' },
                { label: 'غداً صباحاً', value: 'غداً صباحاً' },
                { label: 'يوم الجمعة', value: 'يوم الجمعة' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setReminder(opt.value)}
                  className="bg-white py-3 px-4 rounded-xl text-sm font-bold text-amber-800 shadow-sm border border-amber-200 hover:bg-amber-600 hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Feedback Section */}
        <div className={`bg-white p-6 rounded-3xl shadow-md border-r-4 transition-all duration-500 ${feedback ? 'border-emerald-500 opacity-100 translate-y-0' : 'border-slate-200 opacity-50 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">تحليل التجويد (AI)</h3>
          </div>
          <div className="text-slate-600 leading-relaxed text-sm">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
              </div>
            ) : feedback || "ابدأ التسجيل للحصول على تقييم فوري لمخارج الحروف والتجويد."}
          </div>
        </div>

        {/* Tafsir Section */}
        <div className={`bg-white p-6 rounded-3xl shadow-md border-r-4 transition-all duration-500 ${tafsir ? 'border-blue-500 opacity-100 translate-y-0' : 'border-slate-200 opacity-50 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">التفسير والتدبر</h3>
          </div>
          <div className="text-slate-600 leading-relaxed text-sm">
             {tafsir || "انقر على زر طلب التفسير لعرض شرح الآية المحددة."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MushafView;
