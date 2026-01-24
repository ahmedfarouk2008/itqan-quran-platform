import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ChevronLeft, Check } from 'lucide-react';
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
    email?: string;
    phone?: string;
    password: string;
    role: UserRole;
}

const SignupPage: React.FC<SignupPageProps> = ({
    selectedRole,
    onSignup,
    onNavigateToLogin,
    onBack
}) => {
    const [name, setName] = useState('');
    const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isPasswordValid) {
            setError('كلمة المرور لا تستوفي المتطلبات');
            return;
        }

        setIsLoading(true);

        try {
            await onSignup({
                name,
                email: contactMethod === 'email' ? email : undefined,
                phone: contactMethod === 'phone' ? phone : undefined,
                password,
                role: selectedRole,
            });
        } catch (err) {
            setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
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

                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
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

                    {/* Contact Method Toggle */}
                    <div className="form-group">
                        <label className="form-label">وسيلة التواصل</label>
                        <div className="tabs">
                            <button
                                type="button"
                                className={`tab ${contactMethod === 'email' ? 'active' : ''}`}
                                onClick={() => setContactMethod('email')}
                            >
                                البريد الإلكتروني
                            </button>
                            <button
                                type="button"
                                className={`tab ${contactMethod === 'phone' ? 'active' : ''}`}
                                onClick={() => setContactMethod('phone')}
                            >
                                رقم الموبايل
                            </button>
                        </div>
                    </div>

                    {/* Email or Phone */}
                    {contactMethod === 'email' ? (
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                dir="ltr"
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                                رقم الموبايل
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className="form-input"
                                placeholder="+20 1XX XXX XXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                dir="ltr"
                            />
                        </div>
                    )}

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
                        disabled={isLoading || !isPasswordValid}
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
