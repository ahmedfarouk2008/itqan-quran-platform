import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Subscription query
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid),
            // orderBy('createdAt', 'desc'), // Requires index, might fail initially without it
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs: Notification[] = [];
            let unread = 0;

            snapshot.forEach((doc) => {
                const data = doc.data() as Omit<Notification, 'id'>;
                notifs.push({ id: doc.id, ...data });
                if (!data.isRead) unread++;
            });

            // Sort client-side to avoid index requirement for now
            notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setNotifications(notifs);
            setUnreadCount(unread);
            setIsLoading(false);
        }, (error) => {
            console.error('Error in notifications subscription:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
    };

    const markAllAsRead = async () => {
        if (user) {
            await notificationService.markAllAsRead(user.uid);
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead
    };
};
