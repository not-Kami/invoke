import React, { useState, useCallback } from 'react';
import Notification, { NotificationProps } from './Notification';

export interface NotificationItem {
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
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  maxNotifications = 5,
  position = 'top-right'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  // Limiter le nombre de notifications affichées
  const visibleNotifications = notifications.slice(0, maxNotifications);

  return (
    <div className={`fixed z-50 space-y-2 ${getPositionClasses()}`}>
      {visibleNotifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
