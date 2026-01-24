
import React from 'react';
import { Plus, Video, PlayCircle, Users, Settings } from 'lucide-react';

const TeacherSessions: React.FC = () => {
  const sessions = [
    { title: 'حلقة تجويد - المستوى المبتدئ', time: 'اليوم، 05:00 م', students: 12, type: 'LIVE' },
    { title: 'دورة مخارج الحروف - المسجلة', time: 'تاريخ الرفع: 12 مارس', students: 85, type: 'RECORDED' },
    { title: 'جلسة تسميع فردية - عمر خالد', time: 'غداً، 08:30 م', students: 1, type: 'PRIVATE' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">إدارة الحلقات</h1>
          <p className="text-slate-500">قم بإنشاء غرف تعليمية مباشرة أو رفع دروس مسجلة.</p>
        </div>
        <button className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg transition-all">
            <div className={`h-3 ${s.type === 'LIVE' ? 'bg-red-500' : s.type === 'RECORDED' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${s.type === 'LIVE' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {s.type === 'LIVE' ? <Video className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </div>
                <span className="text-xs font-bold text-slate-400">{s.time}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{s.students} طالب</span>
                </div>
                <button className="mr-auto p-2 text-slate-400 hover:text-slate-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 text-slate-600 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
              {s.type === 'LIVE' ? 'بدء البث المباشر' : 'إدارة المحتوى'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSessions;
