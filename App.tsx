
import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import Layout from './components/Layout';
import Landing from './views/Landing';
import TeacherDashboard from './views/TeacherDashboard';
import StudentDashboard from './views/StudentDashboard';
import MushafView from './views/MushafView';
import TeacherSessions from './views/TeacherSessions';
import BookingView from './views/BookingView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('itqan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.TEACHER ? 'د. محمد الأحمد' : 'أحمد خالد',
      role,
      avatar: `https://picsum.photos/seed/${role}/200`,
      points: role === UserRole.STUDENT ? 450 : undefined,
      level: role === UserRole.STUDENT ? 'متوسط' : undefined
    };
    setUser(newUser);
    localStorage.setItem('itqan_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('itqan_user');
  };

  if (!user) {
    return <Landing onSelectRole={handleLogin} />;
  }

  const renderContent = () => {
    if (user.role === UserRole.TEACHER) {
      switch (activeTab) {
        case 'dashboard': return <TeacherDashboard user={user} />;
        case 'sessions': return <TeacherSessions />;
        default: return <div className="p-8 text-center text-slate-400">قريباً...</div>;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <StudentDashboard user={user} />;
        case 'mushaf': return <MushafView />;
        case 'booking': return <BookingView student={user} />;
        default: return <div className="p-8 text-center text-slate-400">قريباً...</div>;
      }
    }
  };

  return (
    <Layout role={user.role} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
