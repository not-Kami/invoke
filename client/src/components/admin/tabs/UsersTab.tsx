
import { Card, CardContent, CardHeader } from '../../ui/Card';
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import FeaturedToggle from '../FeaturedToggle';
import { User } from '../../../lib/api';
import { Users, Shield, Download } from 'lucide-react';

interface UsersTabProps {
  users: User[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  loading,
  onDeleteUser,
  onToggleFeatured
}) => {
  // Fonction d'export CSV récupérée du backup
  const handleExportUsers = () => {
    const exportData = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isDM: user.isDM,
      featured: user.featured,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    const csvContent = [
      ['ID', 'Prénom', 'Nom', 'Email', 'Rôle', 'MJ', 'Mis en avant', 'Date création', 'Dernière connexion'],
      ...exportData.map(user => {
        const createdDate = new Date(user.createdAt);
        const updatedDate = new Date(user.updatedAt);
        const formattedCreatedDate = createdDate.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        const formattedUpdatedDate = updatedDate.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        
        return [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.isDM ? 'Oui' : 'Non',
          user.featured ? 'Oui' : 'Non',
          formattedCreatedDate,
          formattedUpdatedDate
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fonction pour déterminer le rôle affiché selon la logique demandée
  const getDisplayRole = (user: User) => {
    if (user.role === 'admin') return 'Admin';
    if (user.isDM) return 'DM';
    return 'Basic User';
  };

  // Fonction pour déterminer la couleur du badge
  const getRoleBadgeVariant = (user: User) => {
    if (user.role === 'admin') return 'danger';
    if (user.isDM) return 'warning';
    return 'default';
  };

  // Colonnes de la table récupérées du backup
  const columns = [
    { 
      key: 'email', 
      label: 'Email',
      render: (value: string) => (
        <div className="text-sm text-slate-300">{value || 'N/A'}</div>
      )
    },
    { 
      key: 'role', 
      label: 'Rôle',
      render: (_value: string, row: User) => {
        const displayRole = getDisplayRole(row);
        const badgeVariant = getRoleBadgeVariant(row);
        
        return (
          <Badge variant={badgeVariant}>
            <Shield className="w-3 h-3 mr-1" />
            {displayRole}
          </Badge>
        );
      }
    },
    { 
      key: 'isDM', 
      label: 'MJ',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Mis en avant',
      render: (value: boolean, row: User) => (
        <FeaturedToggle
          isFeatured={value}
          onToggle={(featured) => onToggleFeatured('user', row._id, featured)}
        />
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date création',
      render: (value: string) => {
        if (!value) return <span className="text-slate-400">Date inconnue</span>;
        try {
          const date = new Date(value);
          return (
            <div className="text-sm text-slate-300">
              {date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
          );
        } catch (error) {
          return <span className="text-slate-400">Date invalide</span>;
        }
      }
    },
    { 
      key: 'updatedAt', 
      label: 'Dernière connexion',
      render: (value: string) => {
        if (!value) return <span className="text-slate-400">Date inconnue</span>;
        try {
          const date = new Date(value);
          return (
            <div className="text-sm text-slate-300">
              {date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
          );
        } catch (error) {
          return <span className="text-slate-400">Date invalide</span>;
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-cinzel font-semibold text-white">
                Gestion des Utilisateurs
              </h3>
              <p className="text-sm text-slate-400">
                {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleExportUsers}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={users}
          columns={columns}
          onDelete={(user) => onDeleteUser(user._id)}
        />
      </CardContent>
    </Card>
  );
};

export default UsersTab;
