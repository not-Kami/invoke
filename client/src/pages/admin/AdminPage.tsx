import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import DataTable from '../../components/admin/DataTable';
import FeaturedToggle from '../../components/admin/FeaturedToggle';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { adminAPI, User, Session, Campaign, Game } from '../../lib/api';
import { 
  Users, 
  Calendar, 
  Gamepad2, 
  BookOpen, 
  Download,
  Plus,
  Edit,
  Trash2,
  Star
} from 'lucide-react';

type TabType = 'users' | 'sessions' | 'campaigns' | 'games';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, sessionsRes, campaignsRes, gamesRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getSessions(),
        adminAPI.getCampaigns(),
        adminAPI.getGames(),
      ]);

      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (sessionsRes.success && sessionsRes.data) setSessions(sessionsRes.data);
      if (campaignsRes.success && campaignsRes.data) setCampaigns(campaignsRes.data);
      if (gamesRes.success && gamesRes.data) setGames(gamesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'campaigns', label: 'Campagnes', icon: BookOpen },
    { id: 'games', label: 'Jeux', icon: Gamepad2 },
  ];

  const handleToggleFeatured = async (type: string, id: string, featured: boolean) => {
    try {
      let response;
      switch (type) {
        case 'user':
          response = await adminAPI.updateUser(id, { featured });
          if (response.success && response.data) {
            setUsers(prev => prev.map(user => 
              user._id === id ? { ...user, featured } : user
            ));
          }
          break;
        case 'session':
          response = await adminAPI.updateSession(id, { featured });
          if (response.success && response.data) {
            setSessions(prev => prev.map(session => 
              session._id === id ? { ...session, featured } : session
            ));
          }
          break;
        case 'campaign':
          response = await adminAPI.updateCampaign(id, { featured });
          if (response.success && response.data) {
            setCampaigns(prev => prev.map(campaign => 
              campaign._id === id ? { ...campaign, featured } : campaign
            ));
          }
          break;
        case 'game':
          response = await adminAPI.updateGame(id, { featured });
          if (response.success && response.data) {
            setGames(prev => prev.map(game => 
              game._id === id ? { ...game, featured } : game
            ));
          }
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
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
      createdAt: user.createdAt
    }));

    const csvContent = [
      ['ID', 'Prénom', 'Nom', 'Email', 'Rôle', 'MJ', 'Mis en avant', 'Date création'],
      ...exportData.map(user => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.isDM ? 'Oui' : 'Non',
        user.featured ? 'Oui' : 'Non',
        user.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderUsersTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des utilisateurs</h3>
        <div className="flex space-x-2">
          <Button onClick={handleExportUsers} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
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
                onToggle={(featured) => handleToggleFeatured('user', row.id, featured)}
              />
            )
          },
          { key: 'createdAt', label: 'Date création' },
        ]}
        data={users}
        onEdit={(user) => console.log('Edit user:', user)}
        onDelete={(user) => console.log('Delete user:', user._id)}
      />
    </div>
  );

  const renderSessionsTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des sessions</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Titre' },
          { key: 'game', label: 'Jeu' },
          { key: 'dm', label: 'MJ' },
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
            render: (value: number, row: any) => `${value}/${row.maxPlayers}`
          },
          { 
            key: 'featured', 
            label: 'Mis en avant',
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('session', row.id, featured)}
              />
            )
          },
          { key: 'date', label: 'Date' },
        ]}
        data={sessions}
        onEdit={(session) => console.log('Edit session:', session)}
        onDelete={(session) => console.log('Delete session:', session._id)}
      />
    </div>
  );

  const renderCampaignsTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des campagnes</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Titre' },
          { key: 'game', label: 'Jeu' },
          { key: 'dm', label: 'MJ' },
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
                onToggle={(featured) => handleToggleFeatured('campaign', row.id, featured)}
              />
            )
          },
          { key: 'createdAt', label: 'Date création' },
        ]}
        data={campaigns}
        onEdit={(campaign) => console.log('Edit campaign:', campaign)}
        onDelete={(campaign) => console.log('Delete campaign:', campaign._id)}
      />
    </div>
  );

  const renderGamesTable = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des jeux</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Nom' },
          { key: 'system', label: 'Système' },
          { 
            key: 'sessionsCount', 
            label: 'Sessions',
            render: (value: number) => (
              <Badge variant="info">{value}</Badge>
            )
          },
          { 
            key: 'featured', 
            label: 'Mis en avant',
            render: (value: boolean, row: any) => (
              <FeaturedToggle
                isFeatured={value}
                onToggle={(featured) => handleToggleFeatured('game', row.id, featured)}
              />
            )
          },
          { key: 'createdAt', label: 'Date création' },
        ]}
        data={games}
        onEdit={(game) => console.log('Edit game:', game)}
        onDelete={(game) => console.log('Delete game:', game._id)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-white mb-2">
          Administration
        </h1>
        <p className="text-slate-400">
          Gérez les utilisateurs, sessions, campagnes et jeux
        </p>
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
              <div className="text-slate-400">Chargement des données...</div>
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
    </div>
  );
};

export default AdminPage; 