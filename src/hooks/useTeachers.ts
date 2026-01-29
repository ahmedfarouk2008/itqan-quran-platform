import { useState, useEffect, useCallback } from 'react';
import { db, Profile, TeacherSlot } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';

// ==============================================
// Teachers Hook - إدارة المعلمات
// ==============================================

interface UseTeachersReturn {
    teachers: Profile[];
    isLoading: boolean;
    error: Error | null;
    getTeacherSlots: (teacherId: string) => Promise<TeacherSlot[]>;
    saveTeacherSlots: (teacherId: string, slots: { day: string; time: string }[]) => Promise<{ error: Error | null }>;
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

    const saveTeacherSlots = async (teacherId: string, slots: { day: string; time: string }[]): Promise<{ error: Error | null }> => {
        try {
            // 1. Get existing slots to delete (simple replace strategy for now)
            // Ideally we would diff, but for < 100 docs this is simpler
            const q = query(collection(db, 'teacher_slots'), where('teacher_id', '==', teacherId));
            const snapshot = await getDocs(q);

            const batch = writeBatch(db);

            // Delete all existing
            snapshot.docs.forEach((d) => {
                batch.delete(d.ref);
            });

            // Add new slots
            slots.forEach((slot) => {
                const newDocRef = doc(collection(db, 'teacher_slots'));
                const dayMap: { [key: string]: number } = {
                    'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3,
                    'الخميس': 4, 'الجمعة': 5, 'السبت': 6
                };

                const newSlot: TeacherSlot = {
                    id: newDocRef.id,
                    created_at: new Date().toISOString(),
                    teacher_id: teacherId,
                    day_of_week: dayMap[slot.day] ?? 0,
                    start_time: slot.time,
                    end_time: calculateEndTime(slot.time), // Helper needed
                    is_recurring: true,
                    is_available: true
                };
                batch.set(newDocRef, newSlot);
            });

            await batch.commit();
            return { error: null };
        } catch (err) {
            console.error('Error saving slots:', err);
            return { error: err as Error };
        }
    };

    // Helper to calculate end time (assuming 1 hour slots for availability grid)
    const calculateEndTime = (startTime: string): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours + 1, minutes);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return {
        teachers,
        isLoading,
        error,
        getTeacherSlots,
        saveTeacherSlots,
        refresh: fetchTeachers,
    };
};
