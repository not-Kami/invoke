import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('useAdminAuth: No user, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      if (user.role !== 'admin') {
        console.log('useAdminAuth: User is not admin, redirecting to home');
        navigate('/', { replace: true });
        return;
      }

      console.log('useAdminAuth: User is admin, access granted');
    }
  }, [user, loading, navigate]);

  return {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };
};
