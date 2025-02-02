import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import "./NotificationPopup.css";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
    type?: NotificationType;
    duration?: number;
}

const NotificationPopup: React.FC<NotificationProps> = ({
    type = 'info',
    duration = 10000
}) => {
    const location = useLocation();
    const { currentNotification, markAsSeen, showNextNotification } = useContext(NotificationContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show notifications on home page
        if (location.pathname !== '/') {
            setIsVisible(false);
            return;
        }

        if (currentNotification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    markAsSeen(currentNotification.id);
                    showNextNotification();
                }, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [currentNotification, duration, location.pathname]);

    if (!currentNotification || location.pathname !== '/') return null;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '!';
            default: return 'i';
        }
    };

    return (
        <div className={`notification-popup ${type} ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="notification-icon">
                <span>{getIcon(type)}</span>
            </div>
            <div className="notification-content">
                <h3>{currentNotification.title}</h3>
                <p>{currentNotification.message}</p>
            </div>
            <button
                className="notification-close"
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        markAsSeen(currentNotification.id);
                        showNextNotification();
                    }, 300);
                }}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

export default NotificationPopup;
