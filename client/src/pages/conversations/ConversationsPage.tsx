import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { MessageSquare, User, Calendar, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Conversation {
  _id: string;
  title: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

  // Mock data pour la démonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        _id: '1',
        title: 'Question sur la session D&D',
        content: 'Salut ! J\'ai une question sur la session de demain...',
        sender: {
          _id: 'user1',
          firstName: 'Alice',
          lastName: 'Martin',
          email: 'alice@example.com'
        },
        receiver: {
          _id: user?._id || 'user2',
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john@example.com'
        },
        createdAt: '2024-08-16T10:00:00Z',
        updatedAt: '2024-08-16T10:00:00Z',
        isRead: false
      },
      {
        _id: '2',
        title: 'Organisation campagne Pathfinder',
        content: 'Bonjour ! Je voudrais organiser une campagne Pathfinder...',
        sender: {
          _id: user?._id || 'user2',
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john@example.com'
        },
        receiver: {
          _id: 'user3',
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com'
        },
        createdAt: '2024-08-15T14:30:00Z',
        updatedAt: '2024-08-15T14:30:00Z',
        isRead: true
      }
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, [user]);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'sent') {
      matchesFilter = conversation.sender._id === user?._id;
    } else if (filterType === 'received') {
      matchesFilter = conversation.receiver._id === user?._id;
    }

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getConversationPartner = (conversation: Conversation) => {
    if (conversation.sender._id === user?._id) {
      return conversation.receiver;
    }
    return conversation.sender;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-cinzel font-bold text-white">Conversations</h1>
          </div>
          <p className="text-slate-400">
            Gérez vos conversations avec d'autres joueurs et maîtres de jeu
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher dans les conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-80"
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Toutes</option>
                <option value="sent">Envoyées</option>
                <option value="received">Reçues</option>
              </select>
            </div>
          </div>

          {/* Bouton nouvelle conversation */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nouvelle conversation</span>
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucune conversation</h3>
                <p className="text-slate-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'Aucune conversation ne correspond à vos critères.'
                    : 'Vous n\'avez pas encore de conversations. Commencez par en créer une !'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conversation) => {
              const partner = getConversationPartner(conversation);
              const isUnread = !conversation.isRead && conversation.receiver._id === user?._id;
              
              return (
                <Card 
                  key={conversation._id} 
                  className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                    isUnread ? 'border-purple-500/50 bg-purple-900/20' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {conversation.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              avec {partner.firstName} {partner.lastName}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-slate-300 mb-3 line-clamp-2">
                          {conversation.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(conversation.createdAt)}</span>
                          </div>
                          <span className="capitalize">
                            {conversation.sender._id === user?._id ? 'Envoyé' : 'Reçu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
