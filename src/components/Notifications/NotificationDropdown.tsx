import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import '../../styles/components/notifications.css';

interface NotificationDropdownProps {
    onNavigate?: (tab: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigate }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (id: string, link?: string) => {
        await markAsRead(id);

        if (link && onNavigate) {
            // Check for keywords in the link to determine where to navigate
            const linkLower = link.toLowerCase();
            if (linkLower.includes('session') || linkLower.includes('meeting')) {
                onNavigate('sessions');
            } else if (linkLower.includes('homework') || linkLower.includes('assignment')) {
                onNavigate('homework');
            } else if (linkLower.includes('profile')) {
                onNavigate('settings');
            } else {
                // Default fallback if just a specialized link, or maybe do nothing
                // For now, let's try to match exact link if it matches a tab id
                onNavigate(linkLower);
            }
        }

        setIsOpen(false);
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <button
                className={`notification-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '+9' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>الإشعارات</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-read" onClick={() => markAllAsRead()}>
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <Bell size={40} className="empty-icon" />
                                <p>لا توجد إشعارات جديدة</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notif.id, notif.link)}
                                >
                                    <div className="notification-icon">
                                        <Bell size={16} />
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notif.title}</div>
                                        <div className="notification-message">{notif.message}</div>
                                        <div className="notification-time">
                                            {new Date(notif.createdAt).toLocaleString('ar-EG')}
                                        </div>
                                    </div>
                                    {!notif.isRead && <div className="unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
