import { useState, useEffect, useCallback } from 'react';
import { db, Session } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
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
    deleteSession: (id: string) => Promise<{ error: Error | null }>;
    refresh: () => Promise<void>;
}

interface CreateSessionData {
    teacher_id?: string; // Optional if creator is teacher
    student_id?: string; // Optional if creator is student
    type: 'حفظ' | 'تجويد' | 'تفسير';
    duration: number;
    scheduled_at: string;
    notes?: string;
    meeting_link?: string;
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
                where(column, '==', user.uid)
                // orderBy('scheduled_at', 'asc') // Commented to avoid needing composite index
            );

            const querySnapshot = await getDocs(q);
            const sessionsData: Session[] = [];
            querySnapshot.forEach((doc) => {
                sessionsData.push({ ...doc.data(), id: doc.id } as Session);
            });

            // Client-side sort
            sessionsData.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

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
        if (!user || !profile) {
            return { error: new Error('User not authenticated') };
        }

        try {
            const isTeacher = profile.role === 'teacher';

            const sessionData = {
                ...data,
                student_id: isTeacher ? data.student_id : user.uid,
                teacher_id: isTeacher ? user.uid : data.teacher_id,
                created_at: new Date().toISOString(),
                status: isTeacher ? 'مؤكدة' : 'قيد المراجعة', // Auto-confirm if teacher creates it
                summary: null
            };

            // Validate requirements
            if (!sessionData.student_id || !sessionData.teacher_id) {
                return { error: new Error('Missing student or teacher ID') };
            }

            const docRef = await addDoc(collection(db, 'sessions'), sessionData);

            // Create Notification
            const notificationData = {
                userId: isTeacher ? sessionData.student_id : sessionData.teacher_id,
                type: 'session_request', // Using string directly to avoid enum import issues conform to NotificationType
                title: isTeacher ? 'تم جدولة جلسة جديدة' : 'طلب حجز جلسة جديد',
                message: isTeacher
                    ? `قام المعلم بجدولة جلسة جديدة معك موعدها ${new Date(data.scheduled_at).toLocaleDateString('ar-EG')}`
                    : `لديك طلب حجز جلسة جديد، يرجى مراجعته.`,
                isRead: false,
                createdAt: new Date().toISOString(),
                link: isTeacher ? '/student/sessions' : '/teacher/sessions',
                relatedId: docRef.id
            };

            await addDoc(collection(db, 'notifications'), notificationData);

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

    const deleteSession = async (id: string): Promise<{ error: Error | null }> => {
        try {
            await deleteDoc(doc(db, 'sessions', id));
            await fetchSessions();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
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
        deleteSession,
        refresh: fetchSessions,
    };
};
