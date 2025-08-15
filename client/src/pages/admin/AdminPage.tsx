import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import GameModal from '../../components/admin/GameModal';
import NotificationContainer from '../../components/ui/NotificationContainer';

// Import des composants d'onglets
import UsersTab from '../../components/admin/tabs/UsersTab';
import SessionsTab from '../../components/admin/tabs/SessionsTab';
import CampaignsTab from '../../components/admin/tabs/CampaignsTab';
import GamesTab from '../../components/admin/tabs/GamesTab';
import ConversationsTab from '../../components/admin/tabs/ConversationsTab';

// Import des modals
import ReplyModal from '../../components/admin/modals/ReplyModal';

// Import des hooks
import { useAdminData } from '../../hooks/admin/useAdminData';
import { useAdminActions } from '../../hooks/admin/useAdminActions';

import { adminAPI, Game, Conversation } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  Users, 
  Calendar, 
  Gamepad2, 
  BookOpen, 
  MessageSquare,
  Plus,
  Shield,
  AlertTriangle
} from 'lucide-react';

type TabType = 'users' | 'sessions' | 'campaigns' | 'games' | 'conversations';

const AdminPage: React.FC = () => {
  const { canViewAdminPanel } = usePermissions();
  const { notifications, removeNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  
  // États pour les modals
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Hook pour les données admin
  const {
    users,
    setUsers,
    sessions,
    setSessions,
    campaigns,
    setCampaigns,
    games,
    setGames,
    conversations,
    loading
  } = useAdminData(activeTab);

  // Hook pour les actions admin
  const {
    deleteUser,
    deleteSession,
    deleteCampaign,
    deleteGame,
    toggleFeatured,
    exportSession,
    replyToConversation
  } = useAdminActions();

  // Vérification de sécurité
  useEffect(() => {
    if (!canViewAdminPanel()) {
      console.log('AdminPage: Access denied - user is not admin');
      return;
    }
    
    console.log('AdminPage: User has admin access');
  }, []);

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

  // Handlers pour les actions
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId, setUsers);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId, setSessions);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteCampaign(campaignId, setCampaigns);
  };

  const handleDeleteGame = (gameId: string) => {
    deleteGame(gameId, setGames);
  };

  const handleToggleFeatured = (type: string, id: string, featured: boolean) => {
    let setter;
      switch (type) {
        case 'user':
        setter = setUsers;
          break;
        case 'session':
        setter = setSessions;
          break;
        case 'campaign':
        setter = setCampaigns;
          break;
        case 'game':
        setter = setGames;
          break;
      default:
        return;
    }
    toggleFeatured(type, id, featured, setter);
  };

  const handleExportSession = (sessionId: string) => {
    exportSession(sessionId);
  };

  const handleOpenGameModal = (game?: Game) => {
    setSelectedGame(game || null);
    setGameModalOpen(true);
  };

  const handleSaveGame = async (gameData: Partial<Game>) => {
    try {
      if (selectedGame) {
        // Mise à jour
        const response = await adminAPI.updateGame(selectedGame._id, gameData);
        if (response.success) {
          setGames(prev => prev.map(game => 
            game._id === selectedGame._id ? { ...game, ...gameData } : game
          ));
        }
      } else {
        // Création
        const response = await adminAPI.createGame(gameData);
        if (response.success) {
          setGames(prev => [...prev, response.data]);
        }
      }
      setGameModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du jeu:', error);
    }
  };

  const handleOpenReplyModal = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setReplyModalOpen(true);
  };

  const handleSendReply = (conversationId: string, content: string) => {
    replyToConversation(conversationId, content);
  };

  const tabs = [
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users },
    { id: 'sessions' as TabType, label: 'Sessions', icon: Calendar },
    { id: 'campaigns' as TabType, label: 'Campagnes', icon: BookOpen },
    { id: 'games' as TabType, label: 'Jeux', icon: Gamepad2 },
    { id: 'conversations' as TabType, label: 'Conversations', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-cinzel font-bold text-white mb-4">
            Panel d'Administration
          </h1>
          <p className="text-slate-400 text-lg">
            Gérez votre plateforme de jeux de rôle
          </p>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'users' && (
          <UsersTab
            users={users}
            loading={loading}
            onDeleteUser={handleDeleteUser}
            onToggleFeatured={handleToggleFeatured}
          />
        )}
        
        {activeTab === 'sessions' && (
          <SessionsTab
            sessions={sessions}
            loading={loading}
            onDeleteSession={handleDeleteSession}
            onToggleFeatured={handleToggleFeatured}
            onExportSession={handleExportSession}
          />
        )}
        
        {activeTab === 'campaigns' && (
          <CampaignsTab
            campaigns={campaigns}
            loading={loading}
            onDeleteCampaign={handleDeleteCampaign}
            onToggleFeatured={handleToggleFeatured}
          />
        )}
        
        {activeTab === 'games' && (
          <GamesTab
            games={games}
            loading={loading}
            onDeleteGame={handleDeleteGame}
            onToggleFeatured={handleToggleFeatured}
            onOpenGameModal={handleOpenGameModal}
          />
        )}
        
        {activeTab === 'conversations' && (
          <ConversationsTab
            conversations={conversations}
            loading={loading}
            onOpenReplyModal={handleOpenReplyModal}
          />
        )}
      </div>

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

      {/* Modal de réponse aux conversations */}
      <ReplyModal
        isOpen={replyModalOpen}
        conversation={selectedConversation}
        onClose={() => {
                  setReplyModalOpen(false);
                  setSelectedConversation(null);
        }}
        onSendReply={handleSendReply}
      />
    </div>
  );
};

export default AdminPage; 