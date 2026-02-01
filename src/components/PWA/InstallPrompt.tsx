import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import '../../styles/components/pwa.css';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Hide the app provided install promotion
        setIsVisible(false);
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="pwa-install-prompt">
            <div className="pwa-icon">
                <img src="/pwa-192x192.png" alt="Itqan" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
            </div>
            <div className="pwa-content">
                <div className="pwa-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 className="pwa-title">تطبيق إتقان</h3>
                    <button onClick={handleDismiss} style={{ background: 'none', border: 'none', padding: 0, color: '#9ca3af', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>
                <p className="pwa-description">حمل التطبيق لتجربة استخدام أفضل وسهولة في الوصول</p>
                <div className="pwa-actions">
                    <button className="pwa-install-btn" onClick={handleInstallClick}>
                        <Download size={18} style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                        تثبيت التطبيق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
