import { useState, useEffect, useCallback } from 'react';
import { db, Profile } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// ==============================================
// Students Hook - جلب طلاب المعلمة
// ==============================================

interface UseStudentsReturn {
    students: Profile[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
    updateStudent: (studentId: string, updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

export const useStudents = (): UseStudentsReturn => {
    const { user, profile } = useAuth();
    const [students, setStudents] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStudents = useCallback(async () => {
        if (!user || profile?.role !== 'teacher') {
            setStudents([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Fetch sessions where this teacher is assigned
            const sessionsQuery = query(
                collection(db, 'sessions'),
                where('teacher_id', '==', user.uid)
            );

            const sessionsSnapshot = await getDocs(sessionsQuery);
            const studentIds = new Set<string>();
            sessionsSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.student_id) {
                    studentIds.add(data.student_id);
                }
            });

            // Fetch student profiles
            if (studentIds.size === 0) {
                setStudents([]);
                setIsLoading(false);
                return;
            }

            // Firestore 'in' queries are limited to 10 items, so batch the queries
            const studentIdsArray = Array.from(studentIds);
            const studentsData: Profile[] = [];

            // Batch requests in groups of 10
            for (let i = 0; i < studentIdsArray.length; i += 10) {
                const batch = studentIdsArray.slice(i, i + 10);
                const studentsQuery = query(
                    collection(db, 'users'),
                    where('__name__', 'in', batch)
                );

                const studentsSnapshot = await getDocs(studentsQuery);
                studentsSnapshot.forEach((doc) => {
                    studentsData.push({ ...doc.data(), id: doc.id } as Profile);
                });
            }

            setStudents(studentsData);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching students:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const updateStudent = async (studentId: string, updates: Partial<Profile>): Promise<{ error: Error | null }> => {
        // 1. Optimistic Update: Update local state immediately
        const previousStudents = [...students];
        setStudents((prev) =>
            prev.map((student) =>
                student.id === studentId ? { ...student, ...updates } : student
            )
        );

        try {
            // 2. Perform the actual update in Firestore
            const studentRef = doc(db, 'users', studentId);
            await updateDoc(studentRef, updates);

            // We don't await fetchStudents() here to keep the UI snappy.
            // The local state is already correct/consistent with what we sent.
            return { error: null };
        } catch (err) {
            // 3. Rollback on error
            console.error('Error updating student: Reverting optimistic update', err);
            setStudents(previousStudents);
            return { error: err as Error };
        }
    };

    return {
        students,
        isLoading,
        error,
        refresh: fetchStudents,
        updateStudent,
    };
};
