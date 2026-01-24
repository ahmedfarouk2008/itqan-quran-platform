// ==============================================
// Supabase Database Types (Auto-generated structure)
// ==============================================

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            // Users Profile Table
            profiles: {
                Row: {
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
                Insert: {
                    id: string;
                    created_at?: string;
                    updated_at?: string;
                    name: string;
                    email?: string | null;
                    phone?: string | null;
                    role: 'student' | 'teacher' | 'admin';
                    avatar_url?: string | null;
                    level?: 'مبتدئ' | 'متوسط' | 'متقدم' | null;
                    goals?: string[] | null;
                    timezone?: string | null;
                    bio?: string | null;
                    specialty?: string[] | null;
                    rating?: number | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    name?: string;
                    email?: string | null;
                    phone?: string | null;
                    role?: 'student' | 'teacher' | 'admin';
                    avatar_url?: string | null;
                    level?: 'مبتدئ' | 'متوسط' | 'متقدم' | null;
                    goals?: string[] | null;
                    timezone?: string | null;
                    bio?: string | null;
                    specialty?: string[] | null;
                    rating?: number | null;
                };
            };

            // Sessions Table
            sessions: {
                Row: {
                    id: string;
                    created_at: string;
                    student_id: string;
                    teacher_id: string;
                    type: 'حفظ' | 'تجويد' | 'تفسير';
                    status: 'قيد المراجعة' | 'مؤكدة' | 'ملغاة' | 'مكتملة' | 'جارية';
                    duration: number;
                    scheduled_at: string;
                    notes: string | null;
                    summary: Json | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    student_id: string;
                    teacher_id: string;
                    type: 'حفظ' | 'تجويد' | 'تفسير';
                    status?: 'قيد المراجعة' | 'مؤكدة' | 'ملغاة' | 'مكتملة' | 'جارية';
                    duration: number;
                    scheduled_at: string;
                    notes?: string | null;
                    summary?: Json | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    student_id?: string;
                    teacher_id?: string;
                    type?: 'حفظ' | 'تجويد' | 'تفسير';
                    status?: 'قيد المراجعة' | 'مؤكدة' | 'ملغاة' | 'مكتملة' | 'جارية';
                    duration?: number;
                    scheduled_at?: string;
                    notes?: string | null;
                    summary?: Json | null;
                };
            };

            // Homework Table
            homework: {
                Row: {
                    id: string;
                    created_at: string;
                    student_id: string;
                    teacher_id: string;
                    title: string;
                    description: string;
                    type: 'حفظ' | 'تجويد' | 'تفسير';
                    due_date: string;
                    status: 'لم يبدأ' | 'تم الإرسال' | 'تم المراجعة';
                    submission: Json | null;
                    feedback: Json | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    student_id: string;
                    teacher_id: string;
                    title: string;
                    description: string;
                    type: 'حفظ' | 'تجويد' | 'تفسير';
                    due_date: string;
                    status?: 'لم يبدأ' | 'تم الإرسال' | 'تم المراجعة';
                    submission?: Json | null;
                    feedback?: Json | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    student_id?: string;
                    teacher_id?: string;
                    title?: string;
                    description?: string;
                    type?: 'حفظ' | 'تجويد' | 'تفسير';
                    due_date?: string;
                    status?: 'لم يبدأ' | 'تم الإرسال' | 'تم المراجعة';
                    submission?: Json | null;
                    feedback?: Json | null;
                };
            };

            // Messages Table
            messages: {
                Row: {
                    id: string;
                    created_at: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    is_read: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    is_read?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    sender_id?: string;
                    receiver_id?: string;
                    content?: string;
                    is_read?: boolean;
                };
            };

            // Memorization Progress Table
            memorization_progress: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                    student_id: string;
                    surah_number: number;
                    surah_name: string;
                    total_ayahs: number;
                    memorized_ayahs: number;
                    last_ayah_memorized: number;
                    checkpoints: Json | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    student_id: string;
                    surah_number: number;
                    surah_name: string;
                    total_ayahs: number;
                    memorized_ayahs?: number;
                    last_ayah_memorized?: number;
                    checkpoints?: Json | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                    student_id?: string;
                    surah_number?: number;
                    surah_name?: string;
                    total_ayahs?: number;
                    memorized_ayahs?: number;
                    last_ayah_memorized?: number;
                    checkpoints?: Json | null;
                };
            };

            // Teacher Time Slots Table
            teacher_slots: {
                Row: {
                    id: string;
                    created_at: string;
                    teacher_id: string;
                    day_of_week: number;
                    start_time: string;
                    end_time: string;
                    is_recurring: boolean;
                    is_available: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    teacher_id: string;
                    day_of_week: number;
                    start_time: string;
                    end_time: string;
                    is_recurring?: boolean;
                    is_available?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    teacher_id?: string;
                    day_of_week?: number;
                    start_time?: string;
                    end_time?: string;
                    is_recurring?: boolean;
                    is_available?: boolean;
                };
            };

            // Student Notes Table (Teacher's notes about students)
            student_notes: {
                Row: {
                    id: string;
                    created_at: string;
                    teacher_id: string;
                    student_id: string;
                    note: string;
                    tags: string[] | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    teacher_id: string;
                    student_id: string;
                    note: string;
                    tags?: string[] | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    teacher_id?: string;
                    student_id?: string;
                    note?: string;
                    tags?: string[] | null;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_role: 'student' | 'teacher' | 'admin';
            session_type: 'حفظ' | 'تجويد' | 'تفسير';
            session_status: 'قيد المراجعة' | 'مؤكدة' | 'ملغاة' | 'مكتملة' | 'جارية';
            homework_status: 'لم يبدأ' | 'تم الإرسال' | 'تم المراجعة';
            user_level: 'مبتدئ' | 'متوسط' | 'متقدم';
        };
    };
}

// Convenience type exports
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type Homework = Database['public']['Tables']['homework']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type MemorizationProgress = Database['public']['Tables']['memorization_progress']['Row'];
export type TeacherSlot = Database['public']['Tables']['teacher_slots']['Row'];
export type StudentNote = Database['public']['Tables']['student_notes']['Row'];
