import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import OnboardingPage from './pages/Auth/OnboardingPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import SessionsPage from './pages/Student/SessionsPage';
import LearningPage from './pages/Student/LearningPage';
import HomeworkPage from './pages/Student/HomeworkPage';
import MessagesPage from './pages/Shared/MessagesPage';
import {
    TeacherDashboard,
    TeacherStudentsPage,
    TeacherSessionsPage,
    TeacherHomeworkPage,
} from './pages/Teacher';
import AppLayout from './components/Layout/AppLayout';

// Styles
import './styles/globals.css';

// ==============================================
// App Component with Supabase Auth
// ==============================================

type AppView =
    | 'landing'
    | 'login'
    | 'signup'
    | 'onboarding'
    | 'app';

const AppContent: React.FC = () => {
    const { profile, isLoading, isAuthenticated, signIn, signUp, signOut, completeOnboarding } = useAuth();
    const { success, error: showError } = useToast();
    const [currentView, setCurrentView] = useState<AppView>('landing');
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [activeTab, setActiveTab] = useState('dashboard');

    // Check if user needs onboarding or should be redirected
    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && profile) {
                setCurrentView('app');
            } else if (!isAuthenticated) {
                // Return to landing page if not authenticated
                setCurrentView('landing');
            }
        }
    }, [isAuthenticated, profile, isLoading]);

    // Handle role selection from landing
    const handleSelectRole = (role: 'student' | 'teacher') => {
        setSelectedRole(role);
        setCurrentView('signup');
    };

    // Handle login
    const handleLogin = async (email: string, password: string) => {
        const { error } = await signIn(email, password);
        if (error) {
            showError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            throw error;
        }
        success('تم تسجيل الدخول بنجاح!');
    };

    // Handle signup
    const handleSignup = async (data: { name: string; username: string; phone?: string; password: string; role: 'student' | 'teacher' }) => {
        const { error } = await signUp({
            name: data.name,
            username: data.username,
            password: data.password,
            role: data.role,
            phone: data.phone,
        });

        if (error) {
            showError('حدث خطأ أثناء إنشاء الحساب');
            throw error;
        }

        success('تم إنشاء الحساب بنجاح!');
        setCurrentView('app');
    };

    // Handle onboarding complete
    const handleOnboardingComplete = async (goals: string[], level: string) => {
        const { error } = await completeOnboarding(goals, level);
        if (error) {
            showError('حدث خطأ أثناء حفظ البيانات');
            return;
        }
        success('مرحباً بك في إتقان!');
        setCurrentView('app');
        setActiveTab('dashboard');
    };

    // Handle logout
    const handleLogout = async () => {
        await signOut();
        setCurrentView('landing');
        success('تم تسجيل الخروج');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner" />
                    <span>جاري التحميل...</span>
                </div>
            </div>
        );
    }

    // Render based on current view
    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return (
                    <LandingPage
                        onGetStarted={() => setCurrentView('login')}
                        onSelectRole={(role) => handleSelectRole(role as 'student' | 'teacher')}
                    />
                );

            case 'login':
                return (
                    <LoginPage
                        onLogin={handleLogin}
                        onNavigateToSignup={() => setCurrentView('signup')}
                        onBack={() => setCurrentView('landing')}
                    />
                );

            case 'signup':
                return (
                    <SignupPage
                        selectedRole={selectedRole as any}
                        onSignup={handleSignup as any}
                        onNavigateToLogin={() => setCurrentView('login')}
                        onBack={() => setCurrentView('landing')}
                    />
                );

            case 'onboarding':
                return (
                    <OnboardingPage
                        onComplete={handleOnboardingComplete as any}
                        onBack={() => setCurrentView('signup')}
                    />
                );

            case 'app':
                if (!profile) return null;

                // Create user object for layout
                const layoutUser = {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email || undefined,
                    role: profile.role as any,
                    avatar: profile.avatar_url || undefined,
                    level: profile.level as any,
                    goals: profile.goals as any,
                    createdAt: profile.created_at,
                };

                return (
                    <AppLayout
                        user={layoutUser as any}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onLogout={handleLogout}
                    >
                        {profile.role === 'teacher'
                            ? renderTeacherContent()
                            : renderStudentContent(layoutUser)
                        }
                    </AppLayout>
                );

            default:
                return <LandingPage onGetStarted={() => setCurrentView('login')} onSelectRole={handleSelectRole as any} />;
        }
    };

    // Render student content based on active tab
    const renderStudentContent = (layoutUser: any) => {
        switch (activeTab) {
            case 'dashboard':
                return <StudentDashboard user={layoutUser} onNavigate={setActiveTab} />;
            case 'sessions':
                return <SessionsPage onNavigate={setActiveTab} />;
            case 'learning':
                return <LearningPage onNavigate={setActiveTab} />;
            case 'homework':
                return <HomeworkPage onNavigate={setActiveTab} />;
            case 'messages':
                return <MessagesPage onNavigate={setActiveTab} />;
            default:
                return <StudentDashboard user={layoutUser} onNavigate={setActiveTab} />;
        }
    };

    // Render teacher content based on active tab
    const renderTeacherContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <TeacherDashboard onNavigate={setActiveTab} />;
            case 'teacher-sessions':
            case 'sessions':
                return <TeacherSessionsPage onNavigate={setActiveTab} />;
            case 'teacher-students':
            case 'students':
                return <TeacherStudentsPage onNavigate={setActiveTab} />;
            case 'teacher-homework':
            case 'homework':
                return <TeacherHomeworkPage onNavigate={setActiveTab} />;
            case 'messages':
                return <MessagesPage onNavigate={setActiveTab} />;
            default:
                return <TeacherDashboard onNavigate={setActiveTab} />;
        }
    };


    return renderView();
};


// Main App with Providers
const App: React.FC = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
