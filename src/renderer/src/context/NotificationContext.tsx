import { createContext, useState, useEffect, ReactNode } from "react";

// Notification model based on your Go model.
// Added an "id" field for identification purposes.
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string; // e.g. "info", "warning", "announcement"
    active: boolean;
    startDate: Date;
    endDate: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    currentNotification: Notification | null;
    markAsSeen: (notificationId: string) => void;
    showNextNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    currentNotification: null,
    markAsSeen: () => { },
    showNextNotification: () => { }
});

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
    const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);

    useEffect(() => {
        // Get seen notifications from localStorage
        const seenNotifications = JSON.parse(localStorage.getItem("seenNotifications") || "[]");

        // Fetch notifications from server
        fetch("http://localhost:9000/api/notifications")
            .then((response) => response.json())
            .then((data: Notification[]) => {
                // Filter out already seen notifications
                const unseenNotifications = data.filter(n => !seenNotifications.includes(n.id));
                setNotifications(unseenNotifications);
                setNotificationQueue(unseenNotifications);

                // Set first notification if exists
                if (unseenNotifications.length > 0) {
                    setCurrentNotification(unseenNotifications[0]);
                }
            })
            .catch((error) => console.error("Error fetching notifications:", error));
    }, []);

    const markAsSeen = (notificationId: string) => {
        // Get existing seen notifications
        const seenNotifications = JSON.parse(localStorage.getItem("seenNotifications") || "[]");

        // Add new notification to seen list
        const updatedSeen = [...seenNotifications, notificationId];
        localStorage.setItem("seenNotifications", JSON.stringify(updatedSeen));

        // Remove from current notifications
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setCurrentNotification(null);

        // Update queue and show next notification
        setNotificationQueue(prev => prev.filter(n => n.id !== notificationId));
    };

    const showNextNotification = () => {
        if (notificationQueue.length > 1) {
            const [_, ...rest] = notificationQueue;
            setNotificationQueue(rest);
            setCurrentNotification(rest[0]);
        } else {
            setCurrentNotification(null);
            setNotificationQueue([]);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            currentNotification,
            markAsSeen,
            showNextNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
