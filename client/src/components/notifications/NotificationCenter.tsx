import React, { useState } from 'react';
import { Scroll, X, Check, XCircle, Users, Calendar, Crown, Bell } from 'lucide-react';
import Button from '../ui/Button';

interface Notification {
  _id: string;
  type: 'invitation' | 'session' | 'campaign' | 'table';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onAcceptInvitation: (id: string) => void;
  onDeclineInvitation: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onAcceptInvitation,
  onDeclineInvitation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invitation':
        return <Users className="h-4 w-4 text-blue-400" />;
      case 'session':
        return <Calendar className="h-4 w-4 text-green-400" />;
      case 'campaign':
        return <Crown className="h-4 w-4 text-purple-400" />;
      case 'table':
        return <Users className="h-4 w-4 text-cyan-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'invitation':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'session':
        return 'border-green-500/20 bg-green-500/5';
      case 'campaign':
        return 'border-purple-500/20 bg-purple-500/5';
      case 'table':
        return 'border-cyan-500/20 bg-cyan-500/5';
      default:
        return 'border-gray-500/20 bg-gray-500/5';
    }
  };

  return (
    <div className="relative">
      {/* Notification Scroll - Desktop */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="relative border-white/20 text-white hover:bg-white/10 hidden md:flex"
      >
        <Scroll className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Scroll - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative md:hidden w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
      >
        <Scroll className="h-5 w-5 text-purple-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel - Parchemin */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 z-50">
          <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 border-2 border-purple-300 shadow-2xl rounded-lg relative overflow-hidden">
            {/* Effet parchemin avec coins roulés */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-200 to-purple-300"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-200 to-purple-300"></div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <Scroll className="h-5 w-5" />
                  Notifications
                </h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  size="sm"
                  className="border-purple-400 text-purple-700 hover:bg-purple-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={() => setFilter('unread')}
                  variant={filter === 'unread' ? 'primary' : 'outline'}
                  size="sm"
                  className={filter === 'unread' ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-700'}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  onClick={() => setFilter('all')}
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  className={filter === 'all' ? 'bg-purple-600 text-white' : 'border-purple-300 text-purple-700'}
                >
                  All ({notifications.length})
                </Button>
              </div>

              {/* Notifications Content */}
              <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Scroll className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-purple-700 font-medium">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                  <p className="text-purple-600 text-sm mt-1">
                    {filter === 'unread' ? 'You\'re all caught up!' : 'Check back later for updates'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'ring-2 ring-amber-300/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-amber-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-amber-600 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>

                          {/* Action Buttons for Invitations */}
                          {notification.type === 'invitation' && !notification.read && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                onClick={() => {
                                  onAcceptInvitation(notification._id);
                                  onMarkAsRead(notification._id);
                                }}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                onClick={() => {
                                  onDeclineInvitation(notification._id);
                                  onMarkAsRead(notification._id);
                                }}
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-1"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}

                          {/* Mark as Read Button for other notifications */}
                          {notification.type !== 'invitation' && !notification.read && (
                            <Button
                              onClick={() => onMarkAsRead(notification._id)}
                              size="sm"
                              variant="outline"
                              className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs px-3 py-1 mt-2"
                            >
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
