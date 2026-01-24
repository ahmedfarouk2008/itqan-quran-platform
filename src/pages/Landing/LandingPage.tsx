import React from 'react';
import {
    BookOpen,
    GraduationCap,
    ChevronLeft,
    Star,
    Users,
    CheckCircle,
    Play
} from 'lucide-react';
import { UserRole } from '../../types';
import '../../styles/pages/landing.css';

// ==============================================
// Landing Page - الصفحة الرئيسية
// ==============================================

interface LandingPageProps {
    onGetStarted: () => void;
    onSelectRole: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSelectRole }) => {
    const steps = [
        {
            number: '١',
            title: 'سجّل حسابك',
            description: 'أنشئ حسابك في ثوانٍ واختر هدفك التعليمي',
            icon: Users,
        },
        {
            number: '٢',
            title: 'اختر معلمتك',
            description: 'تواصل مع معلمة متخصصة تناسب مستواك',
            icon: GraduationCap,
        },
        {
            number: '٣',
            title: 'ابدأ رحلتك',
            description: 'احجز جلساتك وتابع تقدمك يومياً',
            icon: BookOpen,
        },
    ];

    const features = [
        'جلسات فردية مع معلمات متخصصات',
        'خطة تعليمية مخصصة لكل طالب',
        'متابعة مستمرة وتقييم دوري',
        'مرونة في اختيار المواعيد',
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        {/* Logo */}
                        <div className="hero-logo">
                            <div className="logo-icon">
                                <BookOpen size={32} />
                            </div>
                            <span className="logo-text">إتقان</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="hero-title">
                            أتقن القرآن الكريم
                            <br />
                            <span className="hero-title-accent">مع معلمة واحدة بخطة واضحة</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle">
                            منصة متكاملة لتعليم القرآن الكريم، تربط بين الطلاب والمعلمات
                            لتسهيل الحفظ والتجويد والتفسير بأسلوب ميسّر وفعّال.
                        </p>

                        {/* CTA Buttons */}
                        <div className="hero-actions">
                            <button
                                className="btn btn-primary btn-lg hero-cta"
                                onClick={onGetStarted}
                            >
                                <span>ابدأ الآن</span>
                                <ChevronLeft size={20} />
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <Play size={18} />
                                <span>شاهد كيف تعمل</span>
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="hero-features">
                            {features.map((feature, index) => (
                                <div key={index} className="hero-feature">
                                    <CheckCircle size={18} className="hero-feature-icon" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Image/Decoration */}
                    <div className="hero-decoration">
                        <div className="hero-card">
                            <div className="hero-card-header">
                                <Star size={24} className="hero-card-star" />
                                <span>تقييم الطلاب</span>
                            </div>
                            <div className="hero-card-rating">
                                <span className="rating-number">4.9</span>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                                    ))}
                                </div>
                                <span className="rating-count">+500 طالب</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="hero-bg-pattern" />
                <div className="hero-bg-gradient" />
            </section>

            {/* How It Works Section */}
            <section className="steps-section">
                <div className="section-container">
                    <h2 className="section-title">كيف تعمل المنصة؟</h2>
                    <p className="section-subtitle">ثلاث خطوات بسيطة لبدء رحلتك مع القرآن</p>

                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-icon">
                                    <step.icon size={28} />
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Selection Section */}
            <section className="roles-section">
                <div className="section-container">
                    <h2 className="section-title">اختر طريقك</h2>

                    <div className="roles-grid">
                        {/* Student Option */}
                        <button
                            className="role-card"
                            onClick={() => onSelectRole(UserRole.STUDENT)}
                        >
                            <div className="role-icon role-icon-student">
                                <Users size={32} />
                            </div>
                            <h3 className="role-title">أنا طالب</h3>
                            <p className="role-description">
                                أريد تعلم القرآن الكريم مع معلمة متخصصة ومتابعة تقدمي
                            </p>
                            <div className="role-cta">
                                <span>ابدأ رحلة التعلم</span>
                                <ChevronLeft size={18} />
                            </div>
                        </button>

                        {/* Teacher Option */}
                        <button
                            className="role-card"
                            onClick={() => onSelectRole(UserRole.TEACHER)}
                        >
                            <div className="role-icon role-icon-teacher">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="role-title">أنا معلمة</h3>
                            <p className="role-description">
                                أريد تعليم القرآن الكريم وإدارة طلابي بسهولة
                            </p>
                            <div className="role-cta">
                                <span>انضم كمعلمة</span>
                                <ChevronLeft size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="section-container">
                    <h2 className="section-title">الأسئلة الشائعة</h2>

                    <div className="faq-list">
                        <details className="faq-item">
                            <summary className="faq-question">كيف تتم الجلسات التعليمية؟</summary>
                            <p className="faq-answer">
                                تتم الجلسات عبر مكالمات فيديو مباشرة بينك وبين معلمتك. يمكنك حجز المواعيد
                                المناسبة لك من خلال المنصة.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary className="faq-question">هل خصوصياتي محمية؟</summary>
                            <p className="faq-answer">
                                نعم، نحن نحرص على خصوصية جميع المستخدمين. لا يتم تسجيل أي جلسة بدون
                                إذنك، وجميع بياناتك مشفرة ومحمية.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary className="faq-question">ما هي مدة الجلسة الواحدة؟</summary>
                            <p className="faq-answer">
                                يمكنك اختيار مدة الجلسة بما يناسبك: 30 دقيقة، 45 دقيقة، أو ساعة كاملة.
                            </p>
                        </details>

                        <details className="faq-item">
                            <summary className="faq-question">هل يمكنني تغيير موعد الجلسة؟</summary>
                            <p className="faq-answer">
                                نعم، يمكنك طلب تغيير الموعد قبل الجلسة بوقت كافٍ من خلال التواصل مع معلمتك.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-logo">
                        <BookOpen size={24} />
                        <span>إتقان</span>
                    </div>
                    <p className="footer-text">
                        منصة إتقان لتعليم القرآن الكريم © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
