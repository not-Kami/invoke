import { useState, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  autoRemove?: boolean;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [counter, setCounter] = useState(0);

  const addNotification = useCallback((
    type: 'success' | 'error' | 'info', 
    message: string, 
    options: { autoRemove?: boolean; duration?: number } = {}
  ) => {
    const id = `${Date.now()}-${counter}`;
    setCounter(prev => prev + 1);
    const notification: NotificationItem = {
      id,
      type,
      message,
      autoRemove: options.autoRemove ?? true,
      duration: options.duration ?? 5000
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove si activé
    if (notification.autoRemove) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addSuccess = useCallback((message: string, options?: { autoRemove?: boolean; duration?: number }) => {
    addNotification('success', message, options);
  }, [addNotification]);

  const addError = useCallback((message: string, options?: { autoRemove?: boolean; duration?: number }) => {
    addNotification('error', message, options);
  }, [addNotification]);

  const addInfo = useCallback((message: string, options?: { autoRemove?: boolean; duration?: number }) => {
    addNotification('info', message, options);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    addSuccess,
    addError,
    addInfo,
    removeNotification,
    clearNotifications
  };
};
