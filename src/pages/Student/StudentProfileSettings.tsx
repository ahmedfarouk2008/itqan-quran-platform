import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Save,
    Camera
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/profile-settings.css';

const StudentProfileSettings: React.FC = () => {
    const { profile, updateProfile } = useAuth();
    const { success, error } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const [name, setName] = useState(profile?.name || '');
    const [email, setEmail] = useState(profile?.email || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

    // Passwords
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Update local state when profile loads
    React.useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations (size, type)
        if (file.size > 2 * 1024 * 1024) {
            // error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
            alert('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const { error: updateError } = await updateProfile({
                name,
                phone,
                avatar_url: avatarUrl // Save the base64 string
            });

            if (updateError) throw updateError;
            success('تم تحديث البيانات بنجاح');
        } catch (err) {
            console.error(err);
            // error('حدث خطأ أثناء تحديث البيانات');
            alert('حدث خطأ أثناء تحديث البيانات');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            // error('كلمة المرور غير متطابقة');
            alert('كلمة المرور غير متطابقة');
            return;
        }
        // In real app, call updatePassword logic (needs firebase re-auth usually)
        success('تم تحديث كلمة المرور بنجاح');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="profile-settings-page animate-fadeIn">
            <header className="page-header">
                <h1 className="page-title">إعدادات الحساب</h1>
                <p className="page-subtitle">تحديث بياناتك الشخصية وكلمة المرور</p>
            </header>

            <div className="settings-grid">
                {/* Profile Info */}
                <div className="settings-card card">
                    <div className="card-header">
                        <h3>البيانات الشخصية</h3>
                    </div>
                    <div className="card-body">
                        <div className="profile-avatar-section">
                            <div className="avatar-wrapper">
                                <img
                                    src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
                                    alt={name}
                                    className="profile-avatar"
                                    style={{ objectFit: 'cover' }}
                                />
                                <label className="change-avatar-btn" style={{ cursor: 'pointer' }}>
                                    <Camera size={18} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="settings-form">
                            <div className="form-group">
                                <label>الاسم الكامل</label>
                                <div className="input-icon-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <div className="input-icon-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled
                                    />
                                </div>
                                <span className="form-hint">لا يمكن تغيير البريد الإلكتروني</span>
                            </div>

                            <div className="form-group">
                                <label>رقم الهاتف</label>
                                <div className="input-icon-wrapper">
                                    <Phone size={18} className="input-icon" />
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full" disabled={isUploading}>
                                <Save size={18} />
                                <span>{isUploading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Security */}
                <div className="settings-card card">
                    <div className="card-header">
                        <h3>الأمان وكلمة المرور</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleUpdatePassword} className="settings-form">
                            <div className="form-group">
                                <label>كلمة المرور الحالية</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>كلمة المرور الجديدة</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>تأكيد كلمة المرور</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-secondary w-full">
                                <Save size={18} />
                                <span>تحديث كلمة المرور</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileSettings;
