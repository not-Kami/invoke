
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

interface SecureRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  requiredDM?: boolean;
  redirectTo?: string;
  showSecurityInfo?: boolean;
}

const SecureRoute: React.FC<SecureRouteProps> = ({
  children,
  requiredRole = 'user',
  requiredDM = false,
  redirectTo,
  showSecurityInfo = false
}) => {
  const { user, loading, canAccess } = usePermissions();
  const location = useLocation();

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

  // Vérifier les permissions
  const permission = {
    action: 'access',
    resource: 'route',
    requiredRole,
    requiredDM
  };

  const hasAccess = canAccess(permission);

  if (!hasAccess) {
    // Redirection avec message d'erreur
    if (redirectTo) {
      return <Navigate to={redirectTo} state={{ 
        error: 'insufficient_permissions',
        requiredRole,
        requiredDM,
        from: location.pathname
      }} replace />;
    }

    // Affichage d'erreur sur place
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès refusé</h1>
          <p className="text-gray-300 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          
          {showSecurityInfo && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
              <h3 className="text-white font-medium mb-2">Permissions requises :</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Rôle : <span className="text-white">{requiredRole}</span></li>
                {requiredDM && <li>• MJ requis : <span className="text-white">Oui</span></li>}
                <li>• Rôle actuel : <span className="text-white">{user?.role || 'Aucun'}</span></li>
                <li>• MJ : <span className="text-white">{user?.isDM ? 'Oui' : 'Non'}</span></li>
              </ul>
            </div>
          )}

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Redirection en cours...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Accès autorisé
  return (
    <div className="secure-route">
      {showSecurityInfo && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4 mx-4 mt-4">
          <div className="flex items-center space-x-2 text-green-300">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Accès sécurisé autorisé</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureRoute;
