import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { UserRole } from '../../types';
import '../../styles/pages/auth.css';

// ==============================================
// Signup Page - صفحة إنشاء حساب (تفاعلية) 🐻
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

    // Mascot States
    const [mascotState, setMascotState] = useState<'idle' | 'blind'>('idle');

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

                {/* Interactive Mascot */}
                <div className={`mascot-container ${mascotState} ${showPassword ? 'peeking' : ''}`}>
                    <svg viewBox="0 0 120 120" className="mascot-svg">
                        <path d="M60 110 C90 110 110 90 110 60 C110 30 90 10 60 10 C30 10 10 30 10 60 C10 90 30 110 60 110" fill="#10b981" />
                        <circle cx="20" cy="40" r="10" fill="#059669" />
                        <circle cx="100" cy="40" r="10" fill="#059669" />
                        <g className="eyes-group">
                            <ellipse cx="45" cy="55" rx="10" ry="12" fill="white" />
                            <ellipse cx="75" cy="55" rx="10" ry="12" fill="white" />
                            <circle cx="45" cy="55" r="4" fill="#1f2937" />
                            <circle cx="75" cy="55" r="4" fill="#1f2937" />
                        </g>
                        <path d="M50 75 Q60 82 70 75" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <g className="hands-group">
                            <path className="hand-left" d="M30 110 Q45 60 60 60 Q45 60 30 110" fill="#047857" />
                            <path className="hand-right" d="M90 110 Q75 60 60 60 Q75 60 90 110" fill="#047857" />
                        </g>
                    </svg>
                </div>

                {/* Title */}
                <div className="auth-header" style={{ marginTop: '0' }}>
                    <h1 className="auth-title">حساب جديد</h1>
                    <p className="auth-subtitle">
                        {selectedRole === UserRole.STUDENT ? 'ابدأ رحلتك مع القرآن' : 'انضم كمعلمة'}
                    </p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    {/* Compact layout for Name & Username */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">الاسم</label>
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
                            <label className="form-label" htmlFor="username">المستخدم</label>
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
                                onFocus={() => setMascotState('blind')}
                                onBlur={() => setMascotState('idle')}
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
                        {/* Simple Password Strength Indicator */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.75rem', color: '#6b7280' }}>
                            <span style={{ color: password.length >= 8 ? '#10b981' : 'inherit' }}>• ٨ أحرف</span>
                            <span style={{ color: /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#10b981' : 'inherit' }}>• حرف ورقم</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading || !isPasswordValid || !isUsernameValid || !name}>
                        {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        لديك حساب؟{' '}
                        <button className="auth-link" onClick={onNavigateToLogin}>تسجيل الدخول</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
