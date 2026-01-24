
import React, { useState } from 'react';
import { User } from '../types';
import { Search, Filter, Star, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const BookingView: React.FC<{ student: User }> = ({ student }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const teachers = [
    { name: 'الشيخ عبدالله محمود', specialty: 'تجويد وقراءات', rating: 4.9, bio: 'خبرة 15 عاماً في الإقراء بمختلف القراءات.', price: 'مجاني' },
    { name: 'أ. مريم يوسف', specialty: 'تلقين وحفظ للأطفال', rating: 4.8, bio: 'متخصصة في تحفيظ الأطفال بأساليب مبتكرة.', price: 'مجاني' },
    { name: 'د. عثمان علي', specialty: 'تفسير وعلوم القرآن', rating: 5.0, bio: 'دكتوراه في التفسير وعلوم القرآن الكريم.', price: 'مجاني' },
  ];

  const getAiSuggestions = async () => {
    setLoading(true);
    try {
      const res = await geminiService.getTeacherSuggestions(student.level || 'متوسط', 'التجويد والإتقان');
      setSuggestions(res);
    } catch (e) {
      setSuggestions([
        { specialty: 'مخارج الحروف', reason: 'لتقوية الأساسيات في التجويد.' },
        { specialty: 'الحفظ المكثف', reason: 'لمساعدتك في الوصول لخاتم القرآن.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">حجز حصة تعليمية</h1>
          <p className="text-slate-500">اختر المعلم المناسب لأهدافك التعليمية.</p>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن معلم أو تخصص..." 
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </header>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-l from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 md:flex items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-300" />
              توصيات ذكية مخصصة لك
            </h2>
            <p className="text-emerald-50 opacity-90 mb-6">دع الذكاء الاصطناعي يحلل مستواك الحالي ويقترح عليك أفضل التخصصات التي ستسرع من رحلة حفظك.</p>
            <button 
              onClick={getAiSuggestions}
              disabled={loading}
              className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              {loading ? 'جاري التحليل...' : 'اكتشف التخصص المناسب لك'}
            </button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-8 md:mt-0 flex-1 grid gap-4">
              {suggestions.map((s, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="font-bold text-emerald-300">{s.specialty}</p>
                  <p className="text-xs text-white/80">{s.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((t, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center group hover:shadow-xl transition-all border-b-8 border-b-transparent hover:border-b-emerald-500">
            <div className="relative mb-6">
              <img src={`https://picsum.photos/seed/${t.name}/200`} className="w-24 h-24 rounded-full border-4 border-slate-50 group-hover:scale-110 transition-transform" alt={t.name} />
              <div className="absolute bottom-0 right-0 bg-amber-400 text-white p-1 rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{t.name}</h3>
            <span className="text-emerald-600 font-bold text-sm mb-4">{t.specialty}</span>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {t.bio}
            </p>
            <div className="w-full flex gap-3 mt-auto">
              <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                حجز موعد
              </button>
              <button className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingView;
