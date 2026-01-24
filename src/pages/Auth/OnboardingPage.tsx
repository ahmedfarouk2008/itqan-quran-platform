import React, { useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { LearningGoal, UserLevel } from '../../types';
import '../../styles/pages/auth.css';

// ==============================================
// Onboarding Page - صفحة اختيار الأهداف
// ==============================================

interface OnboardingPageProps {
    onComplete: (goals: LearningGoal[], level: UserLevel) => void;
    onBack: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(1);
    const [selectedGoals, setSelectedGoals] = useState<LearningGoal[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null);

    const goals = [
        {
            id: LearningGoal.HIFZ,
            label: 'الحفظ',
            description: 'حفظ القرآن الكريم كاملاً أو أجزاء منه',
            icon: '📖',
            color: 'var(--color-hifz)',
        },
        {
            id: LearningGoal.TAJWEED,
            label: 'التجويد',
            description: 'تعلم أحكام التجويد ومخارج الحروف',
            icon: '🎤',
            color: 'var(--color-tajweed)',
        },
        {
            id: LearningGoal.TAFSEER,
            label: 'التفسير',
            description: 'فهم معاني الآيات وتدبرها',
            icon: '📚',
            color: 'var(--color-tafseer)',
        },
    ];

    const levels = [
        {
            id: UserLevel.BEGINNER,
            label: 'مبتدئ',
            description: 'لم أبدأ بعد أو في البداية',
            icon: '🌱',
        },
        {
            id: UserLevel.INTERMEDIATE,
            label: 'متوسط',
            description: 'حفظت بعض الأجزاء وأتقن بعض الأحكام',
            icon: '🌿',
        },
        {
            id: UserLevel.ADVANCED,
            label: 'متقدم',
            description: 'حفظت الكثير وأريد الإتقان والمراجعة',
            icon: '🌳',
        },
    ];

    const toggleGoal = (goal: LearningGoal) => {
        setSelectedGoals(prev =>
            prev.includes(goal)
                ? prev.filter(g => g !== goal)
                : [...prev, goal]
        );
    };

    const handleNext = () => {
        if (step === 1 && selectedGoals.length > 0) {
            setStep(2);
        } else if (step === 2 && selectedLevel) {
            onComplete(selectedGoals, selectedLevel);
        }
    };

    const handleBack = () => {
        if (step === 1) {
            onBack();
        } else {
            setStep(1);
        }
    };

    const canProceed = step === 1 ? selectedGoals.length > 0 : !!selectedLevel;

    return (
        <div className="auth-page">
            <div className="auth-container onboarding-container">
                {/* Back Button */}
                <button className="auth-back-btn" onClick={handleBack}>
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

                {/* Progress */}
                <div className="onboarding-progress">
                    <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>١</div>
                    <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />
                    <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>٢</div>
                </div>

                {/* Step 1: Select Goals */}
                {step === 1 && (
                    <div className="onboarding-step animate-fadeIn">
                        <div className="auth-header">
                            <h1 className="auth-title">ما هدفك من تعلم القرآن؟</h1>
                            <p className="auth-subtitle">اختر هدفاً واحداً أو أكثر</p>
                        </div>

                        <div className="onboarding-options">
                            {goals.map(goal => (
                                <button
                                    key={goal.id}
                                    className={`onboarding-option ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                                    onClick={() => toggleGoal(goal.id)}
                                    style={{ '--option-color': goal.color } as React.CSSProperties}
                                >
                                    <div className="option-icon">{goal.icon}</div>
                                    <div className="option-content">
                                        <h3 className="option-title">{goal.label}</h3>
                                        <p className="option-description">{goal.description}</p>
                                    </div>
                                    <div className="option-check">
                                        <Check size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Level */}
                {step === 2 && (
                    <div className="onboarding-step animate-fadeIn">
                        <div className="auth-header">
                            <h1 className="auth-title">ما مستواك الحالي؟</h1>
                            <p className="auth-subtitle">اختر المستوى الأنسب لك</p>
                        </div>

                        <div className="onboarding-options">
                            {levels.map(level => (
                                <button
                                    key={level.id}
                                    className={`onboarding-option ${selectedLevel === level.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedLevel(level.id)}
                                >
                                    <div className="option-icon">{level.icon}</div>
                                    <div className="option-content">
                                        <h3 className="option-title">{level.label}</h3>
                                        <p className="option-description">{level.description}</p>
                                    </div>
                                    <div className="option-check">
                                        <Check size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Button */}
                <button
                    className="btn btn-primary btn-lg w-full onboarding-next"
                    onClick={handleNext}
                    disabled={!canProceed}
                >
                    <span>{step === 2 ? 'ابدأ رحلتك' : 'التالي'}</span>
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Background */}
            <div className="auth-bg" />
        </div>
    );
};

export default OnboardingPage;
