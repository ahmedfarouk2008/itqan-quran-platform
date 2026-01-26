import { useState, useEffect, useCallback } from 'react';
import { db, Session } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
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

            const q = query(
                collection(db, 'sessions'),
                where(column, '==', user.uid), // user.id in Supabase, user.uid in Firebase
                orderBy('scheduled_at', 'asc')
            );

            const querySnapshot = await getDocs(q);
            const sessionsData: Session[] = [];
            querySnapshot.forEach((doc) => {
                sessionsData.push({ ...doc.data(), id: doc.id } as Session);
            });

            setSessions(sessionsData);
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
        if (!user || !profile) return;

        const isTeacher = profile.role === 'teacher';
        const column = isTeacher ? 'teacher_id' : 'student_id';

        const q = query(
            collection(db, 'sessions'),
            where(column, '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Re-fetching full list or merging changes. 
            // To simplify and ensure ordering, we can just re-fetch or map changes.
            // Mapping changes properly:
            const changes = snapshot.docChanges();
            if (changes.length > 0) {
                fetchSessions();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, profile, fetchSessions]);

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
            const newSessionData = {
                student_id: user.uid,
                ...data,
                created_at: new Date().toISOString(),
                status: 'قيد المراجعة', // Default status logic inferred
                summary: null
            };

            await addDoc(collection(db, 'sessions'), newSessionData);

            await fetchSessions();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const updateSession = async (id: string, updates: Partial<Session>): Promise<{ error: Error | null }> => {
        try {
            const docRef = doc(db, 'sessions', id);
            await updateDoc(docRef, updates);

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
