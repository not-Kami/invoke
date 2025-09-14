import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { MessageSquare, User, Calendar, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { conversationsApi } from '../../lib/api';

// Utiliser l'interface Conversation de l'API
import { Conversation } from '../../lib/api';

const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  // Charger les vraies conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await conversationsApi.getUserConversations();
        
        if (response.success && response.data) {
          setConversations(response.data);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user]);

  const handleNewConversation = () => {
    setShowNewConversationModal(true);
  };

  const handleCloseNewConversationModal = () => {
    setShowNewConversationModal(false);
  };

  const handleConversationCreated = async () => {
    // Recharger les conversations après création
    try {
      const response = await conversationsApi.getUserConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error reloading conversations:', error);
    }
    setShowNewConversationModal(false);
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (conversation.messages && conversation.messages.length > 0 && 
                          conversation.messages[conversation.messages.length - 1].content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Pour les conversations contact_admin, on ne filtre pas par sender/receiver
    // car c'est toujours l'utilisateur qui contacte l'admin
    return matchesSearch;
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


  const getDisplayName = (conversation: Conversation) => {
    if (conversation.conversationType === 'contact_admin') {
      return 'Admin';
    }
    
    // Pour les conversations user_chat, vérifier si c'est l'utilisateur connecté
    if (conversation.participants && conversation.participants.length > 0) {
      const isCurrentUser = conversation.participants.some(p => 
        typeof p === 'object' ? p._id === user?._id : p === user?._id
      );
      return isCurrentUser ? 'Me' : 'User';
    }
    
    return 'Unknown';
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
          <button 
            onClick={handleNewConversation}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No conversations</h3>
                <p className="text-slate-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'No conversations match your criteria.'
                    : 'You don\'t have any conversations yet. Start by creating one!'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conversation) => {
              const isUnread = conversation.isUnread || false;
              
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
                              {conversation.subject}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              with {getDisplayName(conversation)}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-slate-300 mb-3 line-clamp-2">
                          {conversation.messages && conversation.messages.length > 0 
                            ? conversation.messages[conversation.messages.length - 1].content 
                            : 'No message'}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(conversation.lastMessageAt || conversation.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              conversation.status === 'closed' ? 'bg-gray-900/50 text-gray-400' :
                              conversation.status === 'in_progress' ? 'bg-blue-900/50 text-blue-400' :
                              'bg-green-900/50 text-green-400'
                            }`}>
                              {conversation.status === 'closed' ? 'Closed' :
                               conversation.status === 'in_progress' ? 'In Progress' : 'Open'}
                            </span>
                          </div>
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

      {/* Modal pour créer une nouvelle conversation */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">New Conversation</h3>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const subject = formData.get('subject') as string;
                const content = formData.get('content') as string;
                
                if (!user) return;
                
                try {
                  const response = await conversationsApi.createContactAdmin({
                    userEmail: user.email,
                    subject: subject,
                    content: content,
                    conversationType: 'contact_admin',
                    userName: `${user.firstName} ${user.lastName}`
                  });
                  
                  if (response.success) {
                    // Recharger les conversations
                    await handleConversationCreated();
                    // Rediriger vers la page de contact
                    window.location.href = '/contact';
                  }
                } catch (error) {
                  console.error('Error creating conversation:', error);
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Subject of your conversation..."
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="content"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                    placeholder="Describe your question or request..."
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Conversation
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseNewConversationModal}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
