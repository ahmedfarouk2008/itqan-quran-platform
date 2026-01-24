
import React from 'react';
import { User } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Users, Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'السبت', value: 12 },
  { name: 'الأحد', value: 18 },
  { name: 'الاثنين', value: 15 },
  { name: 'الثلاثاء', value: 20 },
  { name: 'الأربعاء', value: 25 },
  { name: 'الخميس', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'];

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">أهلاً بك، {user.name}</h1>
          <p className="text-slate-500 mt-1">إليك إحصائيات حلقاتك التعليمية لهذا الأسبوع.</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200">
          <Clock className="w-5 h-5" />
          <span>جدولة حلقة جديدة</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="الطلاب النشطون" value="124" icon={Users} color="bg-blue-500" trend="+12% من الشهر الماضي" />
        <DashboardCard title="ساعات التدريس" value="32" icon={Clock} color="bg-emerald-500" trend="متوسط 4.5 ساعة/يوم" />
        <DashboardCard title="الأجزاء المراجعة" value="156" icon={BookOpen} color="bg-purple-500" trend="تقدم ملحوظ في الحفظ" />
        <DashboardCard title="شهادات ممنوحة" value="18" icon={Award} color="bg-amber-500" trend="2 تم تسليمها اليوم" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">نشاط الطلاب الأسبوعي</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>أداء مرتفع</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Students List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">تنبيهات المتابعة</h3>
          <div className="space-y-4">
            {[
              { name: 'ياسين علي', task: 'لم يحضر حلقة التجويد', time: 'منذ ساعتين', status: 'missed' },
              { name: 'عمر خالد', task: 'أتم حفظ جزء عم', time: 'منذ 5 ساعات', status: 'completed' },
              { name: 'سارة محمود', task: 'بانتظار تقييم التسميع', time: 'منذ 10 ساعات', status: 'pending' },
              { name: 'ليلى أحمد', task: 'سجلت في حلقة التفسير', time: 'أمس', status: 'new' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                <div className={`w-2 h-10 rounded-full ${
                  item.status === 'missed' ? 'bg-red-400' : 
                  item.status === 'completed' ? 'bg-emerald-400' :
                  item.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.task}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-emerald-600 text-sm font-bold border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors">
            عرض كل التنبيهات
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
