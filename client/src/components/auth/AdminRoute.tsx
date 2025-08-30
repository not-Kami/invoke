
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AdminRoute Debug - Loading:', loading);
  console.log('AdminRoute Debug - User:', user);
  console.log('AdminRoute Debug - User role:', user?.role);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Chargement...</div>
    </div>;
  }

  if (!user) {
    console.log('AdminRoute Debug - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute Debug - User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute Debug - User is admin, allowing access');
  return <>{children}</>;
};

export default AdminRoute; 