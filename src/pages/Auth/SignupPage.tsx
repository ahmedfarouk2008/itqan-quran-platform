import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ChevronLeft, Check, AtSign, User } from 'lucide-react';
import { UserRole } from '../../types';
import '../../styles/pages/auth.css';

// ==============================================
// Signup Page - صفحة إنشاء حساب
// ==============================================

interface SignupPageProps {
    selectedRole: UserRole;
    onSignup: (data: SignupData) => Promise<void>;
    onNavigateToLogin: () => void;
    onBack: () => void;
}

export interface SignupData {
    name: string;
    username: string;
    password: string;
    role: UserRole;
    phone?: string;
}

const SignupPage: React.FC<SignupPageProps> = ({
    selectedRole,
    onSignup,
    onNavigateToLogin,
    onBack
}) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const passwordRequirements = [
        { label: '٨ أحرف على الأقل', met: password.length >= 8 },
        { label: 'حرف كبير ورقم', met: /[A-Z]/.test(password) && /[0-9]/.test(password) },
    ];

    const isPasswordValid = passwordRequirements.every(req => req.met);
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const isUsernameValid = usernameRegex.test(username);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isUsernameValid) {
            setError('اسم المستخدم يجب أن يكون ٣-٢٠ حرف (إنجليزي وأرقام فقط)');
            return;
        }

        if (!isPasswordValid) {
            setError('كلمة المرور ضعيفة');
            return;
        }

        setIsLoading(true);

        try {
            await onSignup({
                name,
                username,
                phone: phone || undefined,
                password,
                role: selectedRole,
            });
        } catch (err: any) {
            if (err?.message?.includes('already registered')) {
                setError('اسم المستخدم موجود بالفعل');
            } else {
                setError('حدث خطأ، حاول مرة أخرى');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Back Button */}
                <button className="auth-back-btn" onClick={onBack}>
                    <ChevronLeft size={20} />
                    <span>العودة</span>
                </button>

                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <BookOpen size={28} />
                    </div>
                    <span className="auth-logo-text">إتقان</span>
                </div>

                {/* Title */}
                <div className="auth-header">
                    <h1 className="auth-title">إنشاء حساب جديد</h1>
                    <p className="auth-subtitle">
                        {selectedRole === UserRole.STUDENT
                            ? 'ابدأ رحلتك مع القرآن الكريم'
                            : 'انضم كمعلمة وساعد الطلاب في رحلتهم'
                        }
                    </p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Compact Name Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">الاسم الكامل</label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                placeholder="اسمك الكامل"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">اسم المستخدم</label>
                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="ahmed_123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">كلمة المرور</label>
                        <div className="input-with-icon">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                dir="ltr"
                            />
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? "إخفاء" : "إظهار"}
                            </button>
                        </div>
                        {/* Password Strength */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.75rem', color: '#6b7280' }}>
                            <span style={{ color: password.length >= 8 ? '#10b981' : 'inherit' }}>• ٨ أحرف</span>
                            <span style={{ color: /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#10b981' : 'inherit' }}>• حرف ورقم</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading || !isPasswordValid || !isUsernameValid || !name}
                    >
                        {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        لديك حساب بالفعل؟{' '}
                        <button className="auth-link" onClick={onNavigateToLogin}>
                            تسجيل الدخول
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
