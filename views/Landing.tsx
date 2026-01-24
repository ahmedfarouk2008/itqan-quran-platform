
import React from 'react';
import { UserRole } from '../types';
import { BookOpen, GraduationCap, UserCheck, ChevronLeft } from 'lucide-react';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-emerald-100 rounded-3xl shadow-inner">
            <BookOpen className="w-16 h-16 text-emerald-700" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 tracking-tight">إتقان</h1>
          <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            منصة متكاملة لربط طلاب العلم بمعلمي القرآن الكريم لتسهيل الحفظ والتجويد والتفسير.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Teacher Option */}
          <button
            onClick={() => onSelectRole(UserRole.TEACHER)}
            className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-emerald-500 text-right flex flex-col items-center md:items-start"
          >
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform mb-4">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">أنا معلم</h2>
            <p className="text-slate-500 mb-6">إدارة الحلقات، تقييم الطلاب، ورفع المحتوى التعليمي.</p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:translate-x-[-8px] transition-transform">
              <span>ابدأ الآن كمعلم</span>
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>

          {/* Student Option */}
          <button
            onClick={() => onSelectRole(UserRole.STUDENT)}
            className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-emerald-500 text-right flex flex-col items-center md:items-start"
          >
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform mb-4">
              <UserCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">أنا طالب</h2>
            <p className="text-slate-500 mb-6">متابعة الحفظ، المصحف التفاعلي، ونظام النقاط التحفيزي.</p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:translate-x-[-8px] transition-transform">
              <span>ابدأ رحلة التعلم</span>
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-sm">© 2024 إتقان لتعليم القرآن الكريم - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
