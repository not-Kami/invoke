import { useAuth } from '../contexts/AuthContext';

export interface Permission {
  action: string;
  resource: string;
  requiredRole?: 'user' | 'admin';
  requiredDM?: boolean;
}

export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (requiredRole: 'user' | 'admin'): boolean => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isUser = (): boolean => {
    return hasRole('user') || isAdmin();
  };

  const isDM = (): boolean => {
    return user?.isDM || false;
  };

  const canAccess = (permission: Permission): boolean => {
    if (!user) return false;

    // Vérifier le rôle requis
    if (permission.requiredRole && !hasRole(permission.requiredRole)) {
      return false;
    }

    // Vérifier si l'utilisateur doit être MJ
    if (permission.requiredDM && !isDM()) {
      return false;
    }

    return true;
  };

  const canManageUsers = (): boolean => {
    return isAdmin();
  };

  const canManageSessions = (): boolean => {
    return isAdmin() || isDM();
  };

  const canManageCampaigns = (): boolean => {
    return isAdmin() || isDM();
  };

  const canViewAdminPanel = (): boolean => {
    return isAdmin();
  };

  const canEditProfile = (targetUserId?: string): boolean => {
    if (!user) return false;
    
    // Les admins peuvent éditer tous les profils
    if (isAdmin()) return true;
    
    // Les utilisateurs peuvent éditer leur propre profil
    if (targetUserId) {
      return user._id === targetUserId;
    }
    
    return true; // Édition de son propre profil
  };

  return {
    user,
    hasRole,
    isAdmin,
    isUser,
    isDM,
    canAccess,
    canManageUsers,
    canManageSessions,
    canManageCampaigns,
    canViewAdminPanel,
    canEditProfile,
    permissions: {
      admin: isAdmin(),
      user: isUser(),
      dm: isDM(),
    }
  };
};
