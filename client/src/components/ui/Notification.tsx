import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onRemove: (id: string) => void;
  autoRemove?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  onRemove,
  autoRemove = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (autoRemove) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, autoRemove, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg border-l-4 ${getStyles()} animate-in slide-in-from-right-full duration-300`}
    >
      {getIcon()}
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
