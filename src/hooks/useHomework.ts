import { useState, useEffect, useCallback } from 'react';
import { db, Homework } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
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

            const q = query(
                collection(db, 'homework'),
                where(column, '==', user.uid)
            );

            const querySnapshot = await getDocs(q);
            const homeworkData: Homework[] = [];
            querySnapshot.forEach((doc) => {
                homeworkData.push({ ...doc.data(), id: doc.id } as Homework);
            });

            // Sort client-side to avoid needing a composite index
            homeworkData.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

            setHomework(homeworkData);
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
        if (!user || !profile) return;

        const isTeacher = profile.role === 'teacher';
        const column = isTeacher ? 'teacher_id' : 'student_id';

        const q = query(
            collection(db, 'homework'),
            where(column, '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const changes = snapshot.docChanges();
            if (changes.length > 0) {
                fetchHomework();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, profile, fetchHomework]);

    const pendingHomework = homework.filter(h => h.status === 'لم يبدأ');
    const submittedHomework = homework.filter(h => h.status === 'تم الإرسال');
    const reviewedHomework = homework.filter(h => h.status === 'تم المراجعة');

    const submitHomework = async (id: string, submission: SubmissionData): Promise<{ error: Error | null }> => {
        try {
            const docRef = doc(db, 'homework', id);
            await updateDoc(docRef, {
                submission,
                status: 'تم الإرسال',
            });

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
            const newHomeworkData = {
                teacher_id: user.uid,
                ...data,
                created_at: new Date().toISOString(),
                status: 'لم يبدأ',
                submission: null,
                feedback: null
            };

            await addDoc(collection(db, 'homework'), newHomeworkData);

            await fetchHomework();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const reviewHomework = async (id: string, feedback: FeedbackData): Promise<{ error: Error | null }> => {
        try {
            const docRef = doc(db, 'homework', id);
            await updateDoc(docRef, {
                feedback,
                status: 'تم المراجعة',
            });

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
