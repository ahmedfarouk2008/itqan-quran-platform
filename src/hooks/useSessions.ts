import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

// ==============================================
// Sessions Hook - إدارة الجلسات
// ==============================================

interface UseSessionsReturn {
    sessions: Session[];
    upcomingSessions: Session[];
    pastSessions: Session[];
    isLoading: boolean;
    error: Error | null;
    createSession: (data: CreateSessionData) => Promise<{ error: Error | null }>;
    updateSession: (id: string, updates: Partial<Session>) => Promise<{ error: Error | null }>;
    cancelSession: (id: string) => Promise<{ error: Error | null }>;
    refresh: () => Promise<void>;
}

interface CreateSessionData {
    teacher_id: string;
    type: 'حفظ' | 'تجويد' | 'تفسير';
    duration: number;
    scheduled_at: string;
    notes?: string;
}

export const useSessions = (): UseSessionsReturn => {
    const { user, profile } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSessions = useCallback(async () => {
        if (!user) {
            setSessions([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const isTeacher = profile?.role === 'teacher';
            const column = isTeacher ? 'teacher_id' : 'student_id';

            const { data, error: fetchError } = await supabase
                .from('sessions')
                .select('*')
                .eq(column, user.id)
                .order('scheduled_at', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            setSessions(data || []);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching sessions:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('sessions-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'sessions',
                },
                () => {
                    fetchSessions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchSessions]);

    const upcomingSessions = sessions.filter(
        s => new Date(s.scheduled_at) > new Date() && s.status !== 'ملغاة' && s.status !== 'مكتملة'
    );

    const pastSessions = sessions.filter(
        s => new Date(s.scheduled_at) <= new Date() || s.status === 'مكتملة'
    );

    const createSession = async (data: CreateSessionData): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        try {
            const { error: insertError } = await supabase
                .from('sessions')
                .insert({
                    student_id: user.id,
                    ...data,
                });

            if (insertError) {
                return { error: insertError };
            }

            await fetchSessions();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const updateSession = async (id: string, updates: Partial<Session>): Promise<{ error: Error | null }> => {
        try {
            const { error: updateError } = await supabase
                .from('sessions')
                .update(updates)
                .eq('id', id);

            if (updateError) {
                return { error: updateError };
            }

            await fetchSessions();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const cancelSession = async (id: string): Promise<{ error: Error | null }> => {
        return updateSession(id, { status: 'ملغاة' });
    };

    return {
        sessions,
        upcomingSessions,
        pastSessions,
        isLoading,
        error,
        createSession,
        updateSession,
        cancelSession,
        refresh: fetchSessions,
    };
};
