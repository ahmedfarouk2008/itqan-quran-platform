import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import '../../styles/pages/auth.css';

// ==============================================
// Login Page - الإصدار التفاعلي 🐻
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
    const [error, setError] = useState<string | null>(null);

    // Mascot States: 'idle', 'focused', 'blind'
    const [mascotState, setMascotState] = useState<'idle' | 'focused' | 'blind'>('idle');
    const [eyePosition, setEyePosition] = useState(0);

    // Calculate eye movement based on username length
    useEffect(() => {
        if (mascotState === 'focused') {
            const limit = 15;
            const position = Math.min(username.length, limit) * 2; // Move 2px per char
            setEyePosition(position);
        } else {
            setEyePosition(0);
        }
    }, [username, mascotState]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await onLogin(username, password);
        } catch (err) {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة');
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
                        {/* Body/Head - Green Circle */}
                        <path
                            d="M60 110 C90 110 110 90 110 60 C110 30 90 10 60 10 C30 10 10 30 10 60 C10 90 30 110 60 110"
                            fill="#10b981"
                        />

                        {/* Ears */}
                        <circle cx="20" cy="40" r="10" fill="#059669" />
                        <circle cx="100" cy="40" r="10" fill="#059669" />

                        {/* Eyes */}
                        <g className="eyes-group" transform={`translate(${eyePosition}, 0)`}>
                            <ellipse cx="45" cy="55" rx="10" ry="12" fill="white" />
                            <ellipse cx="75" cy="55" rx="10" ry="12" fill="white" />
                            <circle cx="45" cy="55" r="4" fill="#1f2937" />
                            <circle cx="75" cy="55" r="4" fill="#1f2937" />
                        </g>

                        {/* Mouth - Simple Smile */}
                        <path
                            d="M50 75 Q60 82 70 75"
                            stroke="#064e3b"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />

                        {/* Hands - Initially hidden below */}
                        <g className="hands-group">
                            <path
                                className="hand-left"
                                d="M30 110 Q45 60 60 60 Q45 60 30 110"
                                fill="#047857"
                            />
                            <path
                                className="hand-right"
                                d="M90 110 Q75 60 60 60 Q75 60 90 110"
                                fill="#047857"
                            />
                        </g>
                    </svg>
                </div>

                {/* Title */}
                <div className="auth-header" style={{ marginTop: '0' }}>
                    <h1 className="auth-title">مرحباً بعودتك</h1>
                    <p className="auth-subtitle">سجّل دخولك لمتابعة رحلتك مع القرآن</p>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">
                            اسم المستخدم
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            placeholder="أدخل اسم المستخدم"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setMascotState('focused')}
                            onBlur={() => setMascotState('idle')}
                            required
                            dir="ltr"
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            كلمة المرور
                        </label>
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
                                autoComplete="current-password"
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
