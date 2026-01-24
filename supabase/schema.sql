-- ==============================================
-- Itqan Platform - Database Schema
-- Run this in Supabase SQL Editor
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 1. Profiles Table (extends auth.users)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    avatar_url TEXT,
    level TEXT CHECK (level IN ('مبتدئ', 'متوسط', 'متقدم')),
    goals TEXT[] DEFAULT '{}',
    timezone TEXT DEFAULT 'Africa/Cairo',
    bio TEXT,
    specialty TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- 2. Sessions Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('حفظ', 'تجويد', 'تفسير')),
    status TEXT NOT NULL CHECK (status IN ('قيد المراجعة', 'مؤكدة', 'ملغاة', 'مكتملة', 'جارية')) DEFAULT 'قيد المراجعة',
    duration INTEGER NOT NULL CHECK (duration IN (30, 45, 60)),
    scheduled_at TIMESTAMPTZ NOT NULL,
    notes TEXT,
    summary JSONB
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Users can view their sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = teacher_id);

CREATE POLICY "Students can create sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can update session status" ON public.sessions
    FOR UPDATE USING (auth.uid() = teacher_id OR auth.uid() = student_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_student ON public.sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON public.sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.sessions(scheduled_at);

-- ==============================================
-- 3. Homework Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('حفظ', 'تجويد', 'تفسير')),
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('لم يبدأ', 'تم الإرسال', 'تم المراجعة')) DEFAULT 'لم يبدأ',
    submission JSONB,
    feedback JSONB
);

-- Enable RLS
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;

-- Policies for homework
CREATE POLICY "Users can view their homework" ON public.homework
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = teacher_id);

CREATE POLICY "Teachers can create homework" ON public.homework
    FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Users can update homework" ON public.homework
    FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = teacher_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_homework_student ON public.homework(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_teacher ON public.homework(teacher_id);

-- ==============================================
-- 4. Messages Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark messages as read" ON public.messages
    FOR UPDATE USING (auth.uid() = receiver_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- ==============================================
-- 5. Memorization Progress Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.memorization_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL CHECK (surah_number >= 1 AND surah_number <= 114),
    surah_name TEXT NOT NULL,
    total_ayahs INTEGER NOT NULL,
    memorized_ayahs INTEGER DEFAULT 0 NOT NULL,
    last_ayah_memorized INTEGER DEFAULT 0 NOT NULL,
    checkpoints JSONB DEFAULT '[]'::JSONB,
    UNIQUE(student_id, surah_number)
);

-- Enable RLS
ALTER TABLE public.memorization_progress ENABLE ROW LEVEL SECURITY;

-- Policies for memorization_progress
CREATE POLICY "Users can view memorization progress" ON public.memorization_progress
    FOR SELECT USING (true);

CREATE POLICY "Students can update own progress" ON public.memorization_progress
    FOR ALL USING (auth.uid() = student_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_memorization_student ON public.memorization_progress(student_id);

-- ==============================================
-- 6. Teacher Time Slots Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.teacher_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Enable RLS
ALTER TABLE public.teacher_slots ENABLE ROW LEVEL SECURITY;

-- Policies for teacher_slots
CREATE POLICY "Anyone can view available slots" ON public.teacher_slots
    FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Teachers can manage own slots" ON public.teacher_slots
    FOR ALL USING (auth.uid() = teacher_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_slots_teacher ON public.teacher_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_slots_day ON public.teacher_slots(day_of_week);

-- ==============================================
-- 7. Student Notes Table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.student_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

-- Policies for student_notes
CREATE POLICY "Teachers can view their notes" ON public.student_notes
    FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view notes about them" ON public.student_notes
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can manage notes" ON public.student_notes
    FOR ALL USING (auth.uid() = teacher_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_notes_teacher ON public.student_notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notes_student ON public.student_notes(student_id);

-- ==============================================
-- Helper Functions
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memorization_updated_at
    BEFORE UPDATE ON public.memorization_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================
-- Grant permissions
-- ==============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
