import { createClient } from '@supabase/supabase-js';

// ==============================================
// Supabase Client Configuration
// ==============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

// Create client without strict typing to avoid build errors
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Type exports for convenience
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
