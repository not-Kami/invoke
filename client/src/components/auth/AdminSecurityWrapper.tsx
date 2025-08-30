
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminSecurityWrapper: React.FC<AdminSecurityWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading, isAdmin, isAuthenticated } = useAdminAuth();

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès refusé</h1>
          <p className="text-gray-300 mb-4">
            Vous devez être connecté pour accéder à cette section.
          </p>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Redirection vers la page de connexion...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Utilisateur connecté mais pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Permissions insuffisantes</h1>
          <p className="text-gray-300 mb-4">
            Cette section est réservée aux administrateurs uniquement.
          </p>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-orange-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Redirection vers l'accueil...</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">
              Rôle actuel : <span className="text-white font-medium">{user?.role}</span>
            </p>
            <p className="text-sm text-gray-400">
              Email : <span className="text-white font-medium">{user?.email}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Utilisateur admin - afficher le contenu
  return (
    <div className="admin-secured-content">
      {fallback || children}
    </div>
  );
};

export default AdminSecurityWrapper;
