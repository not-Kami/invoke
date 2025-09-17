import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardData } from './useDashboardData';

interface Notification {
  _id: string;
  type: 'invitation' | 'session' | 'campaign' | 'table';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const { refreshData } = useDashboardData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Pour l'instant, pas de notifications car on a supprimé le système d'invitations
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Mock implementation - mark as read locally
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      // TODO: Implémenter l'API réelle
      /*
      const response = await fetch(`/api/v1/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
      }
      */
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const acceptInvitation = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (!notification || notification.type !== 'invitation') return;

      const response = await fetch(`/api/v1/tables/${notification.data.tableId}/accept-invitation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Supprimer la notification
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        console.log('Invitation accepted successfully');
        // Recharger les données du dashboard
        await refreshData();
      } else {
        const errorData = await response.json();
        console.error('Error accepting invitation:', errorData.message);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const declineInvitation = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (!notification || notification.type !== 'invitation') return;

      const response = await fetch(`/api/v1/tables/${notification.data.tableId}/decline-invitation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Supprimer la notification
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        console.log('Invitation declined successfully');
      } else {
        const errorData = await response.json();
        console.error('Error declining invitation:', errorData.message);
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    loading,
    markAsRead,
    acceptInvitation,
    declineInvitation,
    refreshNotifications: fetchNotifications
  };
}