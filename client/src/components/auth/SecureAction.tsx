
import { usePermissions } from '../../hooks/usePermissions';
import { Shield, Lock } from 'lucide-react';

interface SecureActionProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  requiredDM?: boolean;
  action?: string;
  resource?: string;
  fallback?: React.ReactNode;
  showLockIcon?: boolean;
}

const SecureAction: React.FC<SecureActionProps> = ({
  children,
  requiredRole = 'user',
  requiredDM = false,
  action,
  resource,
  fallback,
  showLockIcon = false
}) => {
  const { canAccess } = usePermissions();

  const permission: any = {
    action: action || 'access',
    resource: resource || 'component',
    requiredRole,
    requiredDM
  };

  const hasAccess = canAccess(permission);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="inline-flex items-center space-x-2 text-gray-400">
        {showLockIcon && <Lock className="h-4 w-4" />}
        <span className="text-sm">Action non autorisée</span>
      </div>
    );
  }

  return (
    <div className="secure-action">
      {showLockIcon && (
        <div className="inline-flex items-center space-x-2 text-green-400 mb-2">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Action sécurisée</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureAction;
