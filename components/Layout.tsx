
import React from 'react';
import { LogOut, BookOpen, LayoutDashboard, Calendar, Book, Award, Users, Menu, X } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const teacherNav = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'sessions', label: 'إدارة الحلقات', icon: Calendar },
    { id: 'students', label: 'الطلاب والتقييم', icon: Users },
    { id: 'content', label: 'المكتبة التعليمية', icon: Book },
  ];

  const studentNav = [
    { id: 'dashboard', label: 'إنجازاتي', icon: LayoutDashboard },
    { id: 'mushaf', label: 'المصحف التفاعلي', icon: BookOpen },
    { id: 'booking', label: 'حجز حصة', icon: Calendar },
    { id: 'library', label: 'المصادر', icon: Book },
  ];

  const navItems = role === UserRole.TEACHER ? teacherNav : studentNav;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold">اتقان</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
        md:translate-x-0 fixed md:relative w-64 h-full bg-emerald-900 text-white p-6 transition-transform duration-300 z-40
        flex flex-col border-l border-emerald-700
      `}>
        <div className="hidden md:flex items-center gap-3 mb-10">
          <BookOpen className="w-10 h-10 text-emerald-400" />
          <h1 className="text-2xl font-bold">اتقان</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-emerald-600 shadow-lg' : 'hover:bg-emerald-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto flex items-center gap-4 px-4 py-3 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
