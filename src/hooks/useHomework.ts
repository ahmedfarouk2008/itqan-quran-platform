import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Homework } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

// ==============================================
// Homework Hook - إدارة الواجبات
// ==============================================

interface UseHomeworkReturn {
    homework: Homework[];
    pendingHomework: Homework[];
    submittedHomework: Homework[];
    reviewedHomework: Homework[];
    isLoading: boolean;
    error: Error | null;
    submitHomework: (id: string, submission: SubmissionData) => Promise<{ error: Error | null }>;
    createHomework: (data: CreateHomeworkData) => Promise<{ error: Error | null }>;
    reviewHomework: (id: string, feedback: FeedbackData) => Promise<{ error: Error | null }>;
    refresh: () => Promise<void>;
}

interface SubmissionData {
    text?: string;
    audio_url?: string;
    submitted_at: string;
}

interface CreateHomeworkData {
    student_id: string;
    title: string;
    description: string;
    type: 'حفظ' | 'تجويد' | 'تفسير';
    due_date: string;
}

interface FeedbackData {
    text: string;
    audio_url?: string;
    error_tags?: string[];
    rating?: number;
    reviewed_at: string;
}

export const useHomework = (): UseHomeworkReturn => {
    const { user, profile } = useAuth();
    const [homework, setHomework] = useState<Homework[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHomework = useCallback(async () => {
        if (!user) {
            setHomework([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const isTeacher = profile?.role === 'teacher';
            const column = isTeacher ? 'teacher_id' : 'student_id';

            const { data, error: fetchError } = await supabase
                .from('homework')
                .select('*')
                .eq(column, user.id)
                .order('due_date', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            setHomework(data || []);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching homework:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchHomework();
    }, [fetchHomework]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('homework-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'homework',
                },
                () => {
                    fetchHomework();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchHomework]);

    const pendingHomework = homework.filter(h => h.status === 'لم يبدأ');
    const submittedHomework = homework.filter(h => h.status === 'تم الإرسال');
    const reviewedHomework = homework.filter(h => h.status === 'تم المراجعة');

    const submitHomework = async (id: string, submission: SubmissionData): Promise<{ error: Error | null }> => {
        try {
            const { error: updateError } = await supabase
                .from('homework')
                .update({
                    submission,
                    status: 'تم الإرسال',
                })
                .eq('id', id);

            if (updateError) {
                return { error: updateError };
            }

            await fetchHomework();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const createHomework = async (data: CreateHomeworkData): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        try {
            const { error: insertError } = await supabase
                .from('homework')
                .insert({
                    teacher_id: user.id,
                    ...data,
                });

            if (insertError) {
                return { error: insertError };
            }

            await fetchHomework();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const reviewHomework = async (id: string, feedback: FeedbackData): Promise<{ error: Error | null }> => {
        try {
            const { error: updateError } = await supabase
                .from('homework')
                .update({
                    feedback,
                    status: 'تم المراجعة',
                })
                .eq('id', id);

            if (updateError) {
                return { error: updateError };
            }

            await fetchHomework();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    return {
        homework,
        pendingHomework,
        submittedHomework,
        reviewedHomework,
        isLoading,
        error,
        submitHomework,
        createHomework,
        reviewHomework,
        refresh: fetchHomework,
    };
};
