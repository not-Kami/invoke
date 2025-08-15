import React from 'react';
import Notification from './Notification';

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  autoRemove?: boolean;
  duration?: number;
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
  maxNotifications?: number;
  position?: string;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onRemove, 
  maxNotifications = 5,
  position = 'top-right'
}) => {
  const displayNotifications = notifications.slice(0, maxNotifications);

  return (
    <div className={`fixed z-50 ${position === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'}`}>
      {displayNotifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.type === 'success' ? 'Succès' : notification.type === 'error' ? 'Erreur' : 'Information'}
          message={notification.message}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
