
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Types migrated from Supabase
export type Profile = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: 'student' | 'teacher' | 'admin';
    avatar_url: string | null;
    level: 'مبتدئ' | 'متوسط' | 'متقدم' | null;
    goals: string[] | null;
    timezone: string | null;
    bio: string | null;
    specialty: string[] | null;
    rating: number | null;
    status: 'active' | 'inactive' | 'new';
    current_surah: string | null;
    memorized_ayahs: number | null;
    teacher_notes: Array<{ type: 'warning' | 'success'; text: string; date: string }> | null;
    total_surahs: number | null;
};

export type Session = {
    id: string;
    created_at: string;
    student_id: string;
    teacher_id: string;
    type: 'حفظ' | 'تجويد' | 'تفسير';
    status: 'قيد المراجعة' | 'مؤكدة' | 'ملغاة' | 'مكتملة' | 'جارية';
    duration: number;
    scheduled_at: string;
    notes: string | null;
    summary: Record<string, unknown> | null;
    meeting_link?: string | null;
};

export type Homework = {
    id: string;
    created_at: string;
    student_id: string;
    teacher_id: string;
    title: string;
    description: string;
    type: 'حفظ' | 'تجويد' | 'تفسير';
    due_date: string;
    status: 'لم يبدأ' | 'تم الإرسال' | 'تم المراجعة';
    submission: Record<string, unknown> | null;
    feedback: Record<string, unknown> | null;
};

export type Message = {
    id: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    is_read: boolean;
};

export type TeacherSlot = {
    id: string;
    created_at: string;
    teacher_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    is_available: boolean;
};
