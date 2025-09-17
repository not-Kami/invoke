import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSimpleNotifications } from './useSimpleNotifications';
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
  const { addSuccess, addError } = useSimpleNotifications();

  const joinSession = async (sessionId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to join a session');
      addError(
        'Error',
        'You must be logged in to join a session'
      );
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      
      const response = await adminAPI.joinSession(sessionId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to join session');
      }

      
      addSuccess(
        'Success',
        'You have successfully joined the session'
      );

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join session';
      setError(errorMessage);
      
      addError(
        'Error',
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
