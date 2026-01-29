import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { FollowUpRecord } from '../components/Homework/FollowUpTable';

// ==============================================
// FollowUpRecords Hook - إدارة سجلات المتابعة
// ==============================================

interface UseFollowUpRecordsReturn {
    records: FollowUpRecord[];
    isLoading: boolean;
    error: Error | null;
    addRecord: (record: Omit<FollowUpRecord, 'id'>) => Promise<{ error: Error | null }>;
    updateRecord: (id: string, updates: Partial<FollowUpRecord>) => Promise<{ error: Error | null }>;
    deleteRecord: (id: string) => Promise<{ error: Error | null }>;
    refresh: () => Promise<void>;
}

export const useFollowUpRecords = (studentId: string | null): UseFollowUpRecordsReturn => {
    const { user } = useAuth();
    const [records, setRecords] = useState<FollowUpRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecords = useCallback(async () => {
        if (!studentId || !user) {
            setRecords([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const q = query(
                collection(db, 'follow_up_records'),
                where('student_id', '==', studentId),
                // We can also add teacher_id check if we want strict privacy, 
                // but usually teachers can see records for their students.
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const recordsData: FollowUpRecord[] = [];
            querySnapshot.forEach((doc) => {
                recordsData.push({ ...doc.data(), id: doc.id } as FollowUpRecord);
            });

            setRecords(recordsData);
        } catch (err) {
            console.error('Error fetching follow-up records:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [studentId, user]);

    // Initial fetch and Real-time subscription
    useEffect(() => {
        if (!studentId || !user) {
            setRecords([]);
            return;
        }

        setIsLoading(true);

        const q = query(
            collection(db, 'follow_up_records'),
            where('student_id', '==', studentId),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recordsData: FollowUpRecord[] = [];
            snapshot.forEach((doc) => {
                recordsData.push({ ...doc.data(), id: doc.id } as FollowUpRecord);
            });
            setRecords(recordsData);
            setIsLoading(false);
        }, (err) => {
            console.error("Error in follow-up records subscription:", err);
            setError(err);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [studentId, user]);

    const addRecord = async (recordData: Omit<FollowUpRecord, 'id'>) => {
        if (!user || !studentId) return { error: new Error('Missing user or student ID') };

        try {
            await addDoc(collection(db, 'follow_up_records'), {
                ...recordData,
                student_id: studentId,
                teacher_id: user.uid,
                created_at: new Date().toISOString()
            });
            return { error: null };
        } catch (err) {
            console.error('Error adding record:', err);
            return { error: err as Error };
        }
    };

    const updateRecord = async (id: string, updates: Partial<FollowUpRecord>) => {
        try {
            const recordRef = doc(db, 'follow_up_records', id);
            await updateDoc(recordRef, updates);
            return { error: null };
        } catch (err) {
            console.error('Error updating record:', err);
            return { error: err as Error };
        }
    };

    const deleteRecord = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'follow_up_records', id));
            return { error: null };
        } catch (err) {
            console.error('Error deleting record:', err);
            return { error: err as Error };
        }
    };

    return {
        records,
        isLoading,
        error,
        addRecord,
        updateRecord,
        deleteRecord,
        refresh: fetchRecords
    };
};
