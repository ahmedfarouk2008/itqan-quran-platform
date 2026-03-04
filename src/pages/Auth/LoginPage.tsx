import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import '../../styles/pages/auth.css';

// ==============================================
// Login Page - صفحة تسجيل الدخول
// ==============================================

interface LoginPageProps {
    onLogin: (username: string, password: string) => Promise<void>;
    onNavigateToSignup: () => void;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { username?: string; password?: string } = {};
        if (!username.trim()) newErrors.username = 'اسم المستخدم مطلوب';
        if (!password) newErrors.password = 'كلمة المرور مطلوبة';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            await onLogin(username, password);
        } catch (err: any) {
            setErrors({ general: err.message || 'اسم المستخدم أو كلمة المرور غير صحيحة' });
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
                    <h1 className="auth-title">مرحباً بعودتك</h1>
                    <p className="auth-subtitle">سجّل دخولك لمتابعة رحلتك مع القرآن</p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="auth-error">
                            {errors.general}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">
                            اسم المستخدم
                        </label>
                        <input
                            id="username"
                            type="text"
                            className={`form-input ${errors.username ? 'input-error' : ''}`}
                            placeholder="أدخل اسم المستخدم"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors({ ...errors, username: undefined });
                            }}
                            dir="ltr"
                            autoComplete="username"
                        />
                        {errors.username && <span className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            كلمة المرور
                        </label>
                        <div className="input-with-icon">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="******"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                dir="ltr"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'جاري الدخول...' : 'دخول'}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        ليس لديك حساب؟{' '}
                        <button className="auth-link" onClick={onNavigateToSignup}>
                            إنشاء حساب جديد
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
