
import React from 'react';
import { User } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Book, Star, Flame, Trophy, Calendar, ChevronLeft } from 'lucide-react';

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl" alt="Avatar" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">مرحباً، {user.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">المستوى: {user.level}</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                {user.points} نقطة
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase">سلسلة الالتزام</p>
              <p className="text-xl font-black text-orange-700">12 يوم</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="السورة الحالية" value="البقرة" icon={Book} color="bg-emerald-500" trend="تم الوصول للآية 145" />
        <DashboardCard title="موعد الحلقة القادمة" value="اليوم 4:00 م" icon={Calendar} color="bg-blue-500" trend="مع الشيخ عبد الله" />
        <DashboardCard title="الترتيب العالمي" value="#42" icon={Trophy} color="bg-amber-500" trend="أعلى 5% هذا الأسبوع" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Tracker */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-8">رحلة الحفظ والتفوق</h3>
          <div className="space-y-12">
            {[
              { part: 'الجزء الأول', progress: 100, status: 'مكتمل' },
              { part: 'الجزء الثاني', progress: 65, status: 'جاري الحفظ' },
              { part: 'الجزء الثالث', progress: 0, status: 'لم يبدأ' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-lg font-bold text-slate-800">{item.part}</span>
                    <span className={`mr-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'مكتمل' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'جاري الحفظ' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>{item.status}</span>
                  </div>
                  <span className="text-slate-400 font-medium">{item.progress}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      item.status === 'مكتمل' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges and Rewards */}
        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6">الأوسمة المحققة</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'المواظب', icon: Flame, color: 'text-orange-400' },
                { label: 'الفصيح', icon: Star, color: 'text-amber-400' },
                { label: 'الخاتم', icon: Book, color: 'text-emerald-400' },
                { label: 'بطل الشهر', icon: Trophy, color: 'text-blue-400' },
              ].map((badge, idx) => (
                <div key={idx} className="bg-emerald-800/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-emerald-700 transition-colors">
                  <badge.icon className={`w-8 h-8 ${badge.color}`} />
                  <span className="text-xs font-bold">{badge.label}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 bg-white text-emerald-900 py-3 rounded-xl font-black text-sm hover:bg-emerald-50 transition-colors shadow-lg">
              متجر الجوائز
            </button>
          </div>
          <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
