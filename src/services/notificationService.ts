import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { NotificationType } from '../types';

const COLLECTION_NAME = 'notifications';

export const notificationService = {
    /**
     * Create a new notification for a user
     */
    createNotification: async (
        userId: string,
        type: NotificationType | string,
        title: string,
        message: string,
        link?: string
    ) => {
        try {
            const notificationData = {
                userId,
                type,
                title,
                message,
                link,
                isRead: false,
                createdAt: new Date().toISOString(),
                // Using serverTimestamp for more accurate ordering if needed, 
                // but keeping string format to match Type definition for now
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), notificationData);
            return { id: docRef.id, ...notificationData };
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    /**
     * Mark a notification as read
     */
    markAsRead: async (notificationId: string) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, notificationId);
            await updateDoc(docRef, { isRead: true });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications for a user as read
     */
    markAllAsRead: async (userId: string) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('userId', '==', userId),
                where('isRead', '==', false)
            );

            const snapshot = await getDocs(q);
            const updatePromises = snapshot.docs.map(doc =>
                updateDoc(doc.ref, { isRead: true })
            );

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Error marking all as read:', error);
            throw error;
        }
    },

    /**
     * Get unread count for a user
     */
    getUnreadCount: async (userId: string) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('userId', '==', userId),
                where('isRead', '==', false)
            );
            const snapshot = await getDocs(q);
            return snapshot.size;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }
};
