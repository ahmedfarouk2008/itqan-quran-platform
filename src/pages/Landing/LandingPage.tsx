import React from 'react';
import {
    BookOpen,
    ChevronLeft
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

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {

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
                        </div>
                    </div>

                    {/* Hero Image/Decoration */}
                    <div className="hero-decoration">
                        <div className="hero-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="تطبيق إتقان لتعليم القرآن"
                                className="hero-img"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="hero-bg-pattern" />
                <div className="hero-bg-gradient" />
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
