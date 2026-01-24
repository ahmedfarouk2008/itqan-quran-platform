import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../lib/database.types';
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

            let query = supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: true });

            // Filter by conversation partner if specified
            if (conversationPartnerId) {
                query = supabase
                    .from('messages')
                    .select('*')
                    .or(
                        `and(sender_id.eq.${user.id},receiver_id.eq.${conversationPartnerId}),and(sender_id.eq.${conversationPartnerId},receiver_id.eq.${user.id})`
                    )
                    .order('created_at', { ascending: true });
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                throw fetchError;
            }

            setMessages(data || []);
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

        const channel = supabase
            .channel('messages-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${user.id}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const unreadCount = messages.filter(m => m.receiver_id === user?.id && !m.is_read).length;

    const sendMessage = async (receiverId: string, content: string): Promise<{ error: Error | null }> => {
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        try {
            const { error: insertError } = await supabase
                .from('messages')
                .insert({
                    sender_id: user.id,
                    receiver_id: receiverId,
                    content,
                });

            if (insertError) {
                return { error: insertError };
            }

            await fetchMessages();
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const markAsRead = async (messageId: string): Promise<{ error: Error | null }> => {
        try {
            const { error: updateError } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', messageId);

            if (updateError) {
                return { error: updateError };
            }

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
            const { error: updateError } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('sender_id', senderId)
                .eq('receiver_id', user.id);

            if (updateError) {
                return { error: updateError };
            }

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
