import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { UserRole } from '../../types';
import '../../styles/pages/auth.css';

// ==============================================
// Signup Page - صفحة إنشاء حساب
// ==============================================

interface SignupPageProps {
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
    onSignup,
    onNavigateToLogin,
    onBack
}) => {
    // Role is always STUDENT now
    const currentRole = UserRole.STUDENT;
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; username?: string; password?: string; general?: string }>({});

    const passwordRequirements = [
        { label: '٨ أحرف على الأقل', met: password.length >= 8 },
        { label: 'حرف كبير ورقم', met: /[A-Z]/.test(password) && /[0-9]/.test(password) },
    ];

    const isPasswordValid = passwordRequirements.every(req => req.met);
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    // We defer strict username validation to submit or blur to avoid annoying errors during typing
    // but we can still check valid chars as they type (already handled by replace)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { name?: string; username?: string; password?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'الاسم مطلوب';
        }

        if (!usernameRegex.test(username)) {
            newErrors.username = 'اسم المستخدم يجب أن يكون ٣-٢٠ حرف (إنجليزي وأرقام فقط)';
        }

        if (!isPasswordValid) {
            newErrors.password = 'كلمة المرور لا تستوفي الشروط';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            await onSignup({
                name,
                username,
                phone: phone || undefined,
                password,
                role: currentRole,
            });
        } catch (err: any) {
            if (err?.message?.includes('already registered')) {
                setErrors({ username: 'اسم المستخدم موجود بالفعل' });
            } else {
                setErrors({ general: 'حدث خطأ، حاول مرة أخرى' });
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

                {/* Role Switcher Removed - Forcing Student Role */}

                {/* Title */}
                <div className="auth-header">
                    <h1 className="auth-title">إنشاء حساب جديد</h1>
                    <p className="auth-subtitle">
                        ابدأ رحلتك مع القرآن الكريم
                    </p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="auth-error">
                            {errors.general}
                        </div>
                    )}

                    {/* Compact Name Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">الاسم الكامل</label>
                            <input
                                id="name"
                                type="text"
                                className={`form-input ${errors.name ? 'input-error' : ''}`}
                                placeholder="اسمك الكامل"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({ ...errors, name: undefined });
                                }}
                                required
                            />
                            {errors.name && <span className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">اسم المستخدم</label>
                            <input
                                id="username"
                                type="text"
                                className={`form-input ${errors.username ? 'input-error' : ''}`}
                                placeholder="ahmed_123"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                                    if (errors.username) setErrors({ ...errors, username: undefined });
                                }}
                                required
                                dir="ltr"
                            />
                            {errors.username && <span className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{errors.username}</span>}
                        </div>
                    </div>

                    {/* Phone - Restored */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">رقم الهاتف (اختياري)</label>
                        <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            placeholder="01xxxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            dir="ltr"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">كلمة المرور</label>
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
                                required
                                dir="ltr"
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

                        {/* Password Strength */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.75rem', color: '#6b7280' }}>
                            <span style={{ color: password.length >= 8 ? '#10b981' : 'inherit' }}>• ٨ أحرف على الأقل وارقام</span>
                            <span style={{ color: /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#10b981' : 'inherit' }}>• حرف عالاقل كبير</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
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
