import { useState, useEffect, useCallback } from 'react';
import { db, Message } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, onSnapshot, or, and } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// ==============================================
// Messages Hook - إدارة الرسائل
// ==============================================

interface UseMessagesReturn {
    messages: Message[];
    unreadCount: number;
    isLoading: boolean;
    error: Error | null;
    sendMessage: (receiverId: string, content: string) => Promise<{ error: Error | null }>;
    markAsRead: (messageId: string) => Promise<{ error: Error | null }>;
    markAllAsRead: (senderId: string) => Promise<{ error: Error | null }>;
    refresh: () => Promise<void>;
}

export const useMessages = (conversationPartnerId?: string): UseMessagesReturn => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMessages = useCallback(async () => {
        if (!user) {
            setMessages([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            let q;

            if (conversationPartnerId) {
                // Fetch messages between user and partner (both directions)
                q = query(
                    collection(db, 'messages'),
                    or(
                        and(where('sender_id', '==', user.uid), where('receiver_id', '==', conversationPartnerId)),
                        and(where('sender_id', '==', conversationPartnerId), where('receiver_id', '==', user.uid))
                    ),
                    orderBy('created_at', 'asc')
                );
            } else {
                // Fetch all messages involving the user
                q = query(
                    collection(db, 'messages'),
                    or(
                        where('sender_id', '==', user.uid),
                        where('receiver_id', '==', user.uid)
                    ),
                    orderBy('created_at', 'asc')
                );
            }

            // Note: 'or' queries with different fields might require a composite index in Firestore.
            // If that fails, might need to split queries or do client-side merging for simple cases. 
            // However, Firestore 'or' is generally supported now.

            const querySnapshot = await getDocs(q);
            const messagesData: Message[] = [];
            querySnapshot.forEach((doc) => {
                // Include doc ID if not in data, but Message type has 'id'. 
                // Firestore data doesn't include ID by default unless stored in field.
                // We should assume we map it.
                messagesData.push({ ...doc.data(), id: doc.id } as Message);
            });

            setMessages(messagesData);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching messages:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, conversationPartnerId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user) return;

        // Simplified subscription: just listen to incoming messages for the user
        // Ref: filter: receiver_id=eq.user.id
        const q = query(
            collection(db, 'messages'),
            where('receiver_id', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    // Only add if it's not already in list (though snapshot usually gives full state or delta)
                    // If we blindly add, we might duplicate if fetch happened.
                    // But here we are just listening for NEW incomings locally to append? 
                    // Better to just re-fetch or merge safely.
                    const newMessage = { ...change.doc.data(), id: change.doc.id } as Message;
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            });
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    const unreadCount = messages.filter(m => m.receiver_id === user?.uid && !m.is_read).length;

    const sendMessage = async (receiverId: string, content: string): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        try {
            const newMessageData = {
                sender_id: user.uid,
                receiver_id: receiverId,
                content,
                is_read: false,
                created_at: new Date().toISOString()
            };

            await addDoc(collection(db, 'messages'), newMessageData);

            await fetchMessages();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const markAsRead = async (messageId: string): Promise<{ error: Error | null }> => {
        try {
            const msgRef = doc(db, 'messages', messageId);
            await updateDoc(msgRef, { is_read: true });

            setMessages(prev =>
                prev.map(m => (m.id === messageId ? { ...m, is_read: true } : m))
            );

            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const markAllAsRead = async (senderId: string): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        try {
            // Firestore doesn't support updateMany directly. Need to query and update batch.
            const q = query(
                collection(db, 'messages'),
                where('sender_id', '==', senderId),
                where('receiver_id', '==', user.uid),
                where('is_read', '==', false)
            );

            const snapshot = await getDocs(q);
            const updatePromises: Promise<void>[] = [];

            snapshot.forEach((document) => {
                updatePromises.push(updateDoc(document.ref, { is_read: true }));
            });

            await Promise.all(updatePromises);
            await fetchMessages();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    return {
        messages,
        unreadCount,
        isLoading,
        error,
        sendMessage,
        markAsRead,
        markAllAsRead,
        refresh: fetchMessages,
    };
};
