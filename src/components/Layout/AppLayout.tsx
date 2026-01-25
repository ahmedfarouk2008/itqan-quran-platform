import React, { useState } from 'react';
import {
    BookOpen,
    LayoutDashboard,
    Calendar,
    GraduationCap,
    ClipboardCheck,
    MessageSquare,
    LogOut,
    Menu,
    X,
    BarChart3,
} from 'lucide-react';
import { UserRole, User as UserType } from '../../types';
import '../../styles/layout.css';

// ==============================================
// App Layout - التخطيط الرئيسي
// ==============================================

interface AppLayoutProps {
    children: React.ReactNode;
    user: UserType;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    user,
    activeTab,
    onTabChange,
    onLogout
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Navigation items based on role
    const getNavItems = () => {
        if (user.role === UserRole.TEACHER) {
            return [
                { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
                { id: 'sessions', label: 'الجلسات', icon: Calendar },
                { id: 'students', label: 'الطلاب', icon: GraduationCap },
                { id: 'homework', label: 'الواجبات', icon: ClipboardCheck },
                { id: 'messages', label: 'الرسائل', icon: MessageSquare, badge: 2 },
                { id: 'reports', label: 'التقارير', icon: BarChart3 },
            ];
        } else {
            return [
                { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
                { id: 'sessions', label: 'الجلسات', icon: Calendar },
                { id: 'learning', label: 'التعلّم', icon: BookOpen },
                { id: 'homework', label: 'الواجب', icon: ClipboardCheck },
                { id: 'messages', label: 'الرسائل', icon: MessageSquare },
                { id: 'reports', label: 'التقارير', icon: BarChart3 },
            ];
        }
    };

    // Mobile bottom nav (limited to 5 items)
    const getMobileNavItems = () => {
        const items = getNavItems();
        return items.slice(0, 5);
    };

    const navItems = getNavItems();
    const mobileNavItems = getMobileNavItems();

    const handleNavClick = (tabId: string) => {
        onTabChange(tabId);
        setIsSidebarOpen(false);
    };

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="mobile-header-logo">
                    <BookOpen size={28} />
                    <span>إتقان</span>
                </div>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <BookOpen size={32} className="sidebar-logo" />
                    <span className="sidebar-title">إتقان</span>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <item.icon className="nav-item-icon" size={20} />
                            <span className="nav-item-label">{item.label}</span>
                            {item.badge && (
                                <span className="nav-item-badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                            alt={user.name}
                            className="sidebar-user-avatar"
                        />
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user.name}</span>
                            <span className="sidebar-user-role">
                                {user.role === UserRole.TEACHER ? 'معلمة' : 'طالب'}
                            </span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        <LogOut size={18} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="bottom-nav">
                {mobileNavItems.map(item => (
                    <button
                        key={item.id}
                        className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                    >
                        <item.icon className="bottom-nav-item-icon" size={22} />
                        <span className="bottom-nav-item-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AppLayout;
