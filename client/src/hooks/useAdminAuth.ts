import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (user.role !== 'admin') {
        navigate('/', { replace: true });
        return;
      }

    }
  }, [user, loading, navigate]);

  return {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };
};
