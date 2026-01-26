import React, { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    Search,
    MoreVertical,
    Check,
    CheckCheck,
    ChevronLeft,
    Phone,
    Video,
    Smile
} from 'lucide-react';
import '../../styles/pages/messages.css';

// ==============================================
// Messages Page - صفحة الرسائل
// ==============================================

interface MessagesPageProps {
    onNavigate: (tab: string) => void;
}

// Mock data
const mockConversations = [
    {
        id: '1',
        name: 'أ. فاطمة أحمد',
        avatar: null,
        lastMessage: 'أحسنت في التسميع الأخير!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        unreadCount: 2,
        role: 'teacher',
    },
    {
        id: '2',
        name: 'أ. مريم خالد',
        avatar: null,
        lastMessage: 'موعد الجلسة غداً الساعة 5',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        unreadCount: 0,
        role: 'teacher',
    },
];

const mockMessages: Record<string, Array<{
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}>> = {
    '1': [
        { id: '1', senderId: 'teacher', content: 'السلام عليكم ورحمة الله', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), isRead: true },
        { id: '2', senderId: 'me', content: 'وعليكم السلام ورحمة الله وبركاته', timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString(), isRead: true },
        { id: '3', senderId: 'teacher', content: 'كيف حالك اليوم؟ هل استطعت مراجعة الآيات؟', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true },
        { id: '4', senderId: 'me', content: 'الحمد لله، نعم راجعت الآيات من ١ إلى ١٠', timestamp: new Date(Date.now() - 3600000 + 120000).toISOString(), isRead: true },
        { id: '5', senderId: 'teacher', content: 'ممتاز! سمعت تسميعك الأخير وكان رائعاً', timestamp: new Date(Date.now() - 1800000).toISOString(), isRead: true },
        { id: '6', senderId: 'teacher', content: 'أحسنت في التسميع الأخير!', timestamp: new Date(Date.now() - 300000).toISOString(), isRead: false },
    ],
    '2': [
        { id: '1', senderId: 'teacher', content: 'موعد الجلسة غداً الساعة 5', timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: true },
    ],
};

const MessagesPage: React.FC<MessagesPageProps> = () => {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedConversation) {
            scrollToBottom();
        }
    }, [selectedConversation]);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'الآن';
        if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} د`;
        if (diff < 86400000) return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        if (diff < 172800000) return 'أمس';
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedConversation) return;
        // In real app, send message via Firebase
        setMessageInput('');
        scrollToBottom();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = mockConversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentConversation = mockConversations.find(c => c.id === selectedConversation);
    const currentMessages = selectedConversation ? mockMessages[selectedConversation] || [] : [];

    return (
        <div className="messages-page">
            {/* Conversations List */}
            <div className={`conversations-panel ${selectedConversation ? 'hidden-mobile' : ''}`}>
                <div className="conversations-header">
                    <h2>الرسائل</h2>
                </div>

                {/* Search */}
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="بحث..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Conversations List */}
                <div className="conversations-list">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map(conversation => (
                            <button
                                key={conversation.id}
                                className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                                onClick={() => setSelectedConversation(conversation.id)}
                            >
                                <div className="conversation-avatar">
                                    {conversation.avatar ? (
                                        <img src={conversation.avatar} alt={conversation.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {conversation.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="online-indicator" />
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <span className="conversation-name">{conversation.name}</span>
                                        <span className="conversation-time">{formatTime(conversation.timestamp)}</span>
                                    </div>
                                    <div className="conversation-preview">
                                        <span className="last-message">{conversation.lastMessage}</span>
                                        {conversation.unreadCount > 0 && (
                                            <span className="unread-badge">{conversation.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="no-conversations">
                            <MessageSquare size={32} className="empty-icon" />
                            <p>لا توجد محادثات</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Panel */}
            <div className={`chat-panel ${selectedConversation ? '' : 'hidden-mobile'}`}>
                {selectedConversation && currentConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <button
                                className="back-btn btn btn-ghost btn-icon"
                                onClick={() => setSelectedConversation(null)}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    {currentConversation.avatar ? (
                                        <img src={currentConversation.avatar} alt={currentConversation.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {currentConversation.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="chat-user-name">{currentConversation.name}</h3>
                                    <span className="chat-user-status">متصل الآن</span>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <button className="btn btn-ghost btn-icon">
                                    <Phone size={20} />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <Video size={20} />
                                </button>
                                <button className="btn btn-ghost btn-icon">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="messages-container">
                            {currentMessages.map((message, index) => {
                                const isMe = message.senderId === 'me';
                                const showAvatar = !isMe && (index === 0 || currentMessages[index - 1]?.senderId !== message.senderId);

                                return (
                                    <div
                                        key={message.id}
                                        className={`message ${isMe ? 'sent' : 'received'}`}
                                    >
                                        {!isMe && showAvatar && (
                                            <div className="message-avatar">
                                                <div className="avatar-placeholder small">
                                                    {currentConversation.name.charAt(0)}
                                                </div>
                                            </div>
                                        )}
                                        <div className="message-content">
                                            <div className="message-bubble">
                                                <p>{message.content}</p>
                                            </div>
                                            <div className="message-meta">
                                                <span className="message-time">
                                                    {new Date(message.timestamp).toLocaleTimeString('ar-EG', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {isMe && (
                                                    <span className="message-status">
                                                        {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="message-input-container">
                            <button className="btn btn-ghost btn-icon">
                                <Smile size={22} />
                            </button>
                            <input
                                type="text"
                                className="message-input"
                                placeholder="اكتب رسالة..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="btn btn-primary btn-icon send-btn"
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <MessageSquare size={64} />
                        <h3>اختر محادثة</h3>
                        <p>اختر محادثة من القائمة للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
