import { useState } from 'react';

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export function useSimpleNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const addSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  };

  const addError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message });
  };

  const addInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  };

  const addWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    addSuccess,
    addError,
    addInfo,
    addWarning,
    removeNotification,
    clearNotifications
  };
}
