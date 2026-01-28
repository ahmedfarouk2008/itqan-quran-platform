import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Save,
    Camera,
    BookOpen
} from 'lucide-react';
import { updatePassword as firebaseUpdatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/profile-settings.css';

// Reuse the same CSS as StudentProfileSettings since the layout is identical

const TeacherProfileSettings: React.FC = () => {
    const { user, profile, updateProfile } = useAuth();
    const { success, error: showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        bio: profile?.bio || '', // Teachers might have bio
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await updateProfile({
            name: formData.name,
            phone: formData.phone,
            bio: formData.bio
        });

        if (error) {
            showError('حدث خطأ أثناء تحديث الملف الشخصي');
        } else {
            success('تم تحديث الملف الشخصي بنجاح');
        }
        setIsLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('كلمة المرور غير متطابقة');
            return;
        }

        if (!passwordData.currentPassword) {
            showError('الرجاء إدخال كلمة المرور الحالية');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        if (!user || !user.email) return;

        setIsLoading(true);
        try {
            // Re-authenticate the user before changing password
            const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Now update the password
            await firebaseUpdatePassword(user, passwordData.newPassword);
            success('تم تحديث كلمة المرور بنجاح');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: unknown) {
            const firebaseError = error as { code?: string };
            if (firebaseError.code === 'auth/wrong-password') {
                showError('كلمة المرور الحالية غير صحيحة');
            } else if (firebaseError.code === 'auth/too-many-requests') {
                showError('تم تجاوز عدد المحاولات المسموح بها. حاول لاحقاً');
            } else {
                showError('حدث خطأ أثناء تحديث كلمة المرور');
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="profile-settings-page animate-fadeIn">
            <header className="page-header">
                <h1>الإعدادات</h1>
                <p>إدارة ملفك الشخصي وإعدادات الحساب</p>
            </header>

            <div className="settings-grid">
                {/* Profile Information */}
                <section className="settings-card">
                    <div className="card-header">
                        <User size={20} />
                        <h2>المعلومات الشخصية</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                        <div className="avatar-section">
                            <div className="avatar-preview">
                                <img
                                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || '')}&background=10b981&color=fff`}
                                    alt="Profile"
                                />
                                <button type="button" className="change-avatar-btn">
                                    <Camera size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>الاسم الكامل</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>البريد الإلكتروني</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="disabled"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>رقم الهاتف</label>
                            <div className="input-wrapper">
                                <Phone size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>نبذة تعريفية</label>
                            <div className="input-wrapper">
                                <BookOpen size={18} />
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="اكتبي نبذة قصيرة عن مؤهلاتك وخبرتك..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <button type="submit" className="save-btn" disabled={isLoading}>
                            <Save size={18} />
                            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </form>
                </section>

                {/* Security Settings */}
                <section className="settings-card">
                    <div className="card-header">
                        <Lock size={20} />
                        <h2>الأمان وكلمة المرور</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label>كلمة المرور الحالية</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>كلمة المرور الجديدة</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>تأكيد كلمة المرور</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="save-btn" disabled={isLoading}>
                            <Save size={18} />
                            {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default TeacherProfileSettings;
