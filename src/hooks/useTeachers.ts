import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, TeacherSlot } from '../lib/database.types';

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

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'teacher')
                .order('rating', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setTeachers(data || []);
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
            const { data, error: fetchError } = await supabase
                .from('teacher_slots')
                .select('*')
                .eq('teacher_id', teacherId)
                .eq('is_available', true)
                .order('day_of_week', { ascending: true })
                .order('start_time', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            return data || [];
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
