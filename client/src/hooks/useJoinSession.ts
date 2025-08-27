import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from './useNotifications';
import { adminAPI } from '../lib/api';

interface UseJoinSessionReturn {
  joinSession: (sessionId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useJoinSession(): UseJoinSessionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const joinSession = async (sessionId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to join a session');
      addNotification(
        'error',
        'You must be logged in to join a session'
      );
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to join session:', sessionId);
      
      const response = await adminAPI.joinSession(sessionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to join session');
      }

      console.log('Successfully joined session:', response.data);
      
      addNotification(
        'success',
        'You have successfully joined the session'
      );

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join session';
      setError(errorMessage);
      
      addNotification(
        'error',
        errorMessage
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinSession,
    loading,
    error
  };
}
