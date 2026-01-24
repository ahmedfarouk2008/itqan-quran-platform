import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ==============================================
// Toast Context - إدارة الإشعارات
// ==============================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((
        message: string,
        type: ToastType = 'info',
        duration: number = 4000
    ) => {
        const id = 'toast_' + Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, toast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    const value: ToastContextType = {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
    toasts,
    onRemove
}) => {
    if (toasts.length === 0) return null;

    const getToastStyles = (type: ToastType): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            marginBottom: '12px',
            animation: 'slideDown 0.3s ease',
            cursor: 'pointer',
            color: 'white',
            fontWeight: 500,
        };

        const colors: Record<ToastType, string> = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
        };

        return { ...baseStyles, backgroundColor: colors[type] };
    };

    const getIcon = (type: ToastType): string => {
        const icons: Record<ToastType, string> = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
        };
        return icons[type];
    };

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    style={getToastStyles(toast.type)}
                    onClick={() => onRemove(toast.id)}
                >
                    <span style={{ fontSize: '18px' }}>{getIcon(toast.type)}</span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
