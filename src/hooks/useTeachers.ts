import { useState, useEffect, useCallback } from 'react';
import { db, Profile, TeacherSlot } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// ==============================================
// Teachers Hook - إدارة المعلمات
// ==============================================

interface UseTeachersReturn {
    teachers: Profile[];
    isLoading: boolean;
    error: Error | null;
    getTeacherSlots: (teacherId: string) => Promise<TeacherSlot[]>;
    refresh: () => Promise<void>;
}

export const useTeachers = (): UseTeachersReturn => {
    const [teachers, setTeachers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTeachers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const q = query(
                collection(db, 'users'), // Changed from 'profiles' to 'users' based on AuthContext
                where('role', '==', 'teacher'),
                where('role', '==', 'teacher')
                // orderBy('rating', 'desc') // Removed to include teachers with null rating
            );

            const querySnapshot = await getDocs(q);
            const teachersData: Profile[] = [];
            querySnapshot.forEach((doc) => {
                teachersData.push(doc.data() as Profile);
            });

            setTeachers(teachersData);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching teachers:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const getTeacherSlots = async (teacherId: string): Promise<TeacherSlot[]> => {
        try {
            const q = query(
                collection(db, 'teacher_slots'),
                where('teacher_id', '==', teacherId),
                where('is_available', '==', true),
                orderBy('day_of_week', 'asc'),
                orderBy('start_time', 'asc')
            );

            const querySnapshot = await getDocs(q);
            const slotsData: TeacherSlot[] = [];
            querySnapshot.forEach((doc) => {
                slotsData.push(doc.data() as TeacherSlot);
            });

            return slotsData;
        } catch (err) {
            console.error('Error fetching teacher slots:', err);
            return [];
        }
    };

    return {
        teachers,
        isLoading,
        error,
        getTeacherSlots,
        refresh: fetchTeachers,
    };
};
