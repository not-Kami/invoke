import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import DataTable from '../../components/admin/DataTable';
import ExpandableDataTable from '../../components/admin/ExpandableDataTable';
import SessionExpandedContent from '../../components/admin/SessionExpandedContent';
import GameExpandedContent from '../../components/admin/GameExpandedContent';
import GameModal from '../../components/admin/GameModal';
import FeaturedToggle from '../../components/admin/FeaturedToggle';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import NotificationContainer from '../../components/ui/NotificationContainer';

import { adminAPI, User, Session, Campaign, Game } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  Users, 
  Calendar, 
  Gamepad2, 
  BookOpen, 
  Download,
  Plus,
  Edit,
  Trash2,
  Star,
  Shield,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

type TabType = 'users' | 'sessions' | 'campaigns' | 'games';

const AdminPage: React.FC = () => {
  const { canViewAdminPanel, canManageUsers, canManageSessions, canManageCampaigns } = usePermissions();
  const { notifications, addSuccess, addError, addInfo, removeNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false); // Protection contre les appels multiples
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Vérification de sécurité - double protection
  useEffect(() => {
    if (!canViewAdminPanel()) {
      console.log('AdminPage: Access denied - user is not admin');
      return;
    }
    
    console.log('AdminPage: User has admin access, loading data...');
    loadData();
  }, []); // Charger une seule fois au montage du composant

  // Recharger les données quand l'onglet change
  useEffect(() => {
    if (canViewAdminPanel()) {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    // Protection contre les appels multiples
    if (isLoadingData) {
      console.log('AdminPage: Chargement déjà en cours, ignoré');
      return;
    }
    
    setIsLoadingData(true);
    setLoading(true);
    
    try {
      console.log('AdminPage: Chargement des données...');
      
      // Charger seulement l'onglet actif pour plus de rapidité
      let usersRes: any = null, sessionsRes: any = null, campaignsRes: any = null, gamesRes: any = null;
      
      switch (activeTab) {
        case 'users':
          usersRes = await adminAPI.getUsers();
          // Filtrer les utilisateurs supprimés côté frontend
          if (usersRes.success && usersRes.data) {
            const activeUsers = usersRes.data.filter((user: any) => !user.deletedAt);
            usersRes.data = activeUsers;
          }
          break;
        case 'sessions':
          sessionsRes = await adminAPI.getSessions();
          break;
        case 'campaigns':
          campaignsRes = await adminAPI.getCampaigns();
          break;
        case 'games':
          gamesRes = await adminAPI.getGames();
          break;
      }

      console.log('AdminPage: Réponses API reçues:', {
        users: usersRes,
        sessions: sessionsRes,
        campaigns: campaignsRes,
        games: gamesRes
      });

      // Traitement des utilisateurs
      if (usersRes && usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
        console.log('AdminPage: Utilisateurs chargés:', usersRes.data.length);
      } else if (usersRes && Array.isArray(usersRes)) {
        // Fallback : si l'API retourne directement un tableau
        setUsers(usersRes);
        console.log('AdminPage: Utilisateurs chargés (format direct):', usersRes.length);
      } else if (usersRes && usersRes.error) {
        console.error('AdminPage: Erreur lors du chargement des utilisateurs:', usersRes.error);
        // Ne pas afficher d'erreur si c'est juste une absence de données
        if (!usersRes.error.includes('Données invalides')) {
          addError(`Erreur utilisateurs: ${usersRes.error}`);
        }
      }

      // Traitement des sessions
      if (sessionsRes && sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data);
        console.log('AdminPage: Sessions chargées:', sessionsRes.data.length);
      } else if (sessionsRes && Array.isArray(sessionsRes)) {
        // Fallback : si l'API retourne directement un tableau
        setSessions(sessionsRes);
        console.log('AdminPage: Sessions chargées (format direct):', sessionsRes.length);
      } else if (sessionsRes && sessionsRes.error) {
        console.error('AdminPage: Erreur lors du chargement des sessions:', sessionsRes.error);
        if (!sessionsRes.error.includes('Données invalides')) {
          addError(`Erreur sessions: ${sessionsRes.error}`);
        }
      }

      // Traitement des campagnes
      if (campaignsRes && campaignsRes.success && campaignsRes.data) {
        setCampaigns(campaignsRes.data);
        console.log('AdminPage: Campagnes chargées:', campaignsRes.data.length);
      } else if (campaignsRes && Array.isArray(campaignsRes)) {
        // Fallback : si l'API retourne directement un tableau
        setCampaigns(campaignsRes);
        console.log('AdminPage: Campagnes chargées (format direct):', campaignsRes.length);
      } else if (campaignsRes && campaignsRes.error) {
        console.error('AdminPage: Erreur lors du chargement des campagnes:', campaignsRes.error);
        if (!campaignsRes.error.includes('Données invalides')) {
          addError(`Erreur campagnes: ${campaignsRes.error}`);
        }
      }

      // Traitement des jeux
      if (gamesRes && gamesRes.success && gamesRes.data) {
        setGames(gamesRes.data);
        console.log('AdminPage: Jeux chargés:', gamesRes.data.length);
      } else if (gamesRes && Array.isArray(gamesRes)) {
        // Fallback : si l'API retourne directement un tableau
        setGames(gamesRes);
        console.log('AdminPage: Jeux chargés (format direct):', gamesRes.length);
      } else if (gamesRes && gamesRes.error) {
        console.error('AdminPage: Erreur lors du chargement des jeux:', gamesRes.error);
        if (!gamesRes.error.includes('Données invalides')) {
          addError(`Erreur jeux: ${gamesRes.error}`);
        }
      }

      // Une seule notification de succès au lieu de multiples
      addSuccess('Données chargées avec succès');
    } catch (error) {
      console.error('AdminPage: Erreur lors du chargement des données:', error);
      addError(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      setIsLoadingData(false);
    }
  };

  // Vérification de sécurité au rendu
  if (!canViewAdminPanel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès refusé</h1>
          <p className="text-gray-300 mb-4">
            Cette page est réservée aux administrateurs uniquement.
          </p>
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        setUsers(prev => prev.filter(user => user._id !== userId));
        addSuccess('Utilisateur supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('AdminPage: Erreur lors de la suppression:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleToggleFeatured = async (type: string, id: string, featured: boolean) => {
    try {
      console.log(`AdminPage: Mise à jour featured ${type} ${id} -> ${featured}`);
      
      let response;
      switch (type) {
        case 'user':
          response = await adminAPI.updateUser(id, { featured });
          if (response.success && response.data) {
            setUsers(prev => prev.map(user => 
              user._id === id ? { ...user, featured } : user
            ));
            addSuccess('Utilisateur mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'session':
          response = await adminAPI.adminUpdateSessionFeatured(id, featured);
          if (response.success && response.data) {
            setSessions(prev => prev.map(session => 
              session._id === id ? { ...session, featured } : session
            ));
            addSuccess('Session mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'campaign':
          response = await adminAPI.updateCampaign(id, { featured });
          if (response.success && response.data) {
            setCampaigns(prev => prev.map(campaign => 
              campaign._id === id ? { ...campaign, featured } : campaign
            ));
            addSuccess('Campagne mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'game':
          response = await adminAPI.updateGame(id, { featured });
          if (response.success && response.data) {
            setGames(prev => prev.map(game => 
              game._id === id ? { ...game, featured } : game
            ));
            addSuccess('Jeu mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
      }
    } catch (error) {
      console.error('AdminPage: Erreur lors de la mise à jour:', error);
      addError(`Erreur de mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleSaveGame = async (gameData: Partial<Game>) => {
    try {
      let response: any;
      if (gameData._id) {
        // Modification
        response = await adminAPI.updateGame(gameData._id, gameData);
        if (response.success && response.data) {
          setGames(prev => prev.map(game => 
            game._id === gameData._id ? response.data : game
          ));
          addSuccess('Jeu modifié avec succès');
        } else {
          throw new Error(response.error || 'Erreur lors de la modification');
        }
      } else {
        // Création
        response = await adminAPI.createGame(gameData);
        if (response.success && response.data) {
          setGames(prev => [...prev, response.data]);
          addSuccess('Jeu créé avec succès');
        } else {
          throw new Error(response.error || 'Erreur lors de la création');
        }
      }
      
      setGameModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('AdminPage: Erreur lors de la sauvegarde du jeu:', error);
      addError(`Erreur de sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteGame(gameId);
      if (response.success) {
        setGames(prev => prev.filter(game => game._id !== gameId));
        addSuccess('Jeu supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('AdminPage: Erreur lors de la suppression du jeu:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

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
    
    addSuccess('Export des utilisateurs réussi');
  };

  const renderUsersTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des utilisateurs</h3>
        <div className="flex space-x-2">
          <Button onClick={handleExportUsers} variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'firstName', label: 'Prénom' },
          { key: 'lastName', label: 'Nom' },
          { key: 'email', label: 'Email' },
          { 
            key: 'role', 
            label: 'Rôle',
            render: (value: string) => (
              <Badge variant={value === 'admin' ? 'danger' : 'default'}>
                {value === 'admin' ? 'Admin' : 'Utilisateur'}
              </Badge>
            )
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
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('user', row._id, featured)}
              />
            )
          },
          { 
            key: 'createdAt', 
            label: 'Date création',
            render: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              });
            }
          },
          { 
            key: 'updatedAt', 
            label: 'Dernière connexion',
            render: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              });
            }
          },
        ]}
        data={users}
        onDelete={(user) => handleDeleteUser(user._id)}
      />
    </div>
  );

  const renderSessionsTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des sessions</h3>
      </div>
      <ExpandableDataTable
        columns={[
          { key: 'title', label: 'Titre' },
          { 
            key: 'game', 
            label: 'Jeu',
            render: (value: any) => value?.name || 'N/A'
          },
          { 
            key: 'dm', 
            label: 'MJ',
            render: (value: any) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
          },
          { 
            key: 'status', 
            label: 'Statut',
            render: (value: string) => (
              <Badge variant={value === 'open' ? 'success' : 'warning'}>
                {value === 'open' ? 'Ouvert' : 'Complet'}
              </Badge>
            )
          },
          { 
            key: 'players', 
            label: 'Joueurs',
            render: (value: any, row: any) => {
              const playerCount = Array.isArray(value) ? value.length : (typeof value === 'number' ? value : 0);
              const maxPlayers = row.maxPlayers || '?';
              return `${playerCount}/${maxPlayers}`;
            }
          },
          { 
            key: 'date', 
            label: 'Date de session',
            render: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              });
            }
          },
          { 
            key: 'featured', 
            label: 'Mis en avant',
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('session', row._id, featured)}
              />
            )
          },
        ]}
        data={sessions}
        expandableContent={(session) => <SessionExpandedContent session={session} />}
      />
    </div>
  );

  const renderCampaignsTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des campagnes</h3>
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Titre' },
          { 
            key: 'game', 
            label: 'Jeu',
            render: (value: any) => value?.name || 'N/A'
          },
          { 
            key: 'dm', 
            label: 'MJ',
            render: (value: any) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
          },
          { 
            key: 'status', 
            label: 'Statut',
            render: (value: string) => (
              <Badge variant={value === 'active' ? 'success' : 'warning'}>
                {value === 'active' ? 'Active' : 'En pause'}
              </Badge>
            )
          },
          { 
            key: 'players', 
            label: 'Joueurs',
            render: (value: number, row: any) => `${value}/${row.maxPlayers}`
          },
          { 
            key: 'featured', 
            label: 'Mis en avant',
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('campaign', row._id, featured)}
              />
            )
          },
          { 
            key: 'createdAt', 
            label: 'Date création',
            render: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              });
            }
          },
        ]}
        data={campaigns}
      />
    </div>
  );

  const renderGamesTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des jeux</h3>
        <Button 
          onClick={() => setGameModalOpen(true)} 
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un jeu</span>
        </Button>
      </div>
      <ExpandableDataTable
        columns={[
          { key: 'name', label: 'Nom' },
          { key: 'system', label: 'Système' },
          { 
            key: 'sessionsCount', 
            label: 'Sessions',
            render: (value: number) => (
              <Badge variant="info">{value || 0}</Badge>
            )
          },
          { 
            key: 'featured', 
            label: 'Mis en avant',
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('game', row._id, featured)}
              />
            )
          },
          { 
            key: 'createdAt', 
            label: 'Date création',
            render: (value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              });
            }
          },
        ]}
        data={games}
        onEdit={(game) => {
          setSelectedGame(game);
          setGameModalOpen(true);
        }}
        onDelete={(game) => handleDeleteGame(game._id)}
        expandableContent={(game) => <GameExpandedContent game={game} />}
      />
    </div>
  );

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'campaigns', label: 'Campagnes', icon: BookOpen },
    { id: 'games', label: 'Jeux', icon: Gamepad2 },
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        maxNotifications={5}
        position="top-right"
      />



      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white mb-2">
            Administration
          </h1>
          <p className="text-slate-400">
            Gérez les utilisateurs, sessions, campagnes et jeux
          </p>
        </div>
        <Button onClick={loadData} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Onglets */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 px-6 py-4 transition-all duration-200 ${
                    isActive
                      ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-500/10'
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contenu des onglets */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Chargement des données...</span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'users' && renderUsersTable()}
              {activeTab === 'sessions' && renderSessionsTable()}
              {activeTab === 'campaigns' && renderCampaignsTable()}
              {activeTab === 'games' && renderGamesTable()}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal des jeux */}
      {gameModalOpen && (
        <GameModal
          isOpen={gameModalOpen}
          onClose={() => {
            setGameModalOpen(false);
            setSelectedGame(null);
          }}
          onSave={handleSaveGame}
          game={selectedGame}
        />
      )}
    </div>
  );
};

export default AdminPage; 