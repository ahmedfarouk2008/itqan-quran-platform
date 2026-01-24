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

interface SignupData {
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
        { label: 'حرف كبير واحد على الأقل', met: /[A-Z]/.test(password) },
        { label: 'رقم واحد على الأقل', met: /[0-9]/.test(password) },
    ];

    const isPasswordValid = passwordRequirements.every(req => req.met);

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const isUsernameValid = usernameRegex.test(username);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow alphanumeric and underscore, no spaces
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setUsername(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isUsernameValid) {
            setError('اسم المستخدم يجب أن يكون ٣-٢٠ حرف (حروف إنجليزية وأرقام و _ فقط)');
            return;
        }

        if (!isPasswordValid) {
            setError('كلمة المرور لا تستوفي المتطلبات');
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
                setError('اسم المستخدم مستخدم بالفعل، اختر اسماً آخر');
            } else {
                setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
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

                    {/* Full Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            <User size={16} className="form-label-icon" />
                            الاسم الكامل
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            placeholder="أدخل اسمك الكامل"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Username */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">
                            <AtSign size={16} className="form-label-icon" />
                            اسم المستخدم
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            placeholder="مثال: ahmed_123"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            dir="ltr"
                            autoComplete="username"
                            maxLength={20}
                        />
                        <p className="form-hint">
                            حروف إنجليزية صغيرة وأرقام و _ فقط (٣-٢٠ حرف)
                        </p>
                        {username && !isUsernameValid && (
                            <p className="form-error-hint">
                                اسم المستخدم غير صالح
                            </p>
                        )}
                    </div>

                    {/* Phone (Optional) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">
                            رقم الموبايل <span className="optional-label">(اختياري)</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            placeholder="+20 1XX XXX XXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            dir="ltr"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            كلمة المرور
                        </label>
                        <div className="input-with-icon">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="أدخل كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                dir="ltr"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Requirements */}
                        <div className="password-requirements">
                            {passwordRequirements.map((req, index) => (
                                <div
                                    key={index}
                                    className={`password-requirement ${req.met ? 'met' : ''}`}
                                >
                                    <Check size={14} />
                                    <span>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full"
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

            {/* Background */}
            <div className="auth-bg" />
        </div>
    );
};

export default SignupPage;
