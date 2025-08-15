import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { conversationsApi } from '../../lib/api';
import { Conversation } from '../../lib/api';
import { MessageSquare, User, Shield, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const ConversationsPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationsApi.getUserConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Accès refusé</h1>
          <p className="text-gray-300 mb-4">
            Vous devez être connecté pour voir vos conversations.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement de vos conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-cinzel font-bold text-white mb-2">
            Mes Conversations
          </h1>
          <p className="text-slate-400">
            Gérez vos conversations avec l'équipe de support
          </p>
        </div>

        {/* Conversations */}
        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation._id} className="hover:bg-slate-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          {conversation.subject}
                        </h3>
                        <Badge variant={conversation.status === 'open' ? 'success' : 'warning'}>
                          {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
                        </Badge>
                        {conversation.isUnread && (
                          <Badge variant="danger">Nouveau</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-4">
                        <div>
                          <span className="text-slate-500">Créée le:</span>
                          <p className="text-white">
                            {new Date(conversation.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Dernier message:</span>
                          <p className="text-white">
                            {conversation.lastMessageAt ? 
                              new Date(conversation.lastMessageAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 
                              'Aucun message'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Dernier message */}
                      {conversation.messages && conversation.messages.length > 0 && (
                        <div className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {conversation.messages[conversation.messages.length - 1].senderType === 'admin' ? (
                              <Shield className="w-4 h-4 text-purple-400" />
                            ) : (
                              <User className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-sm text-slate-300">
                              {conversation.messages[conversation.messages.length - 1].senderType === 'admin' ? 'Admin' : 'Vous'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-white">
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        onClick={() => window.open(`/conversations/${conversation._id}`, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        Voir la conversation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucune conversation</h3>
              <p className="text-slate-400 mb-6">
                Vous n'avez pas encore de conversations. Contactez-nous pour commencer !
              </p>
              <Button
                onClick={() => window.open('/contact', '_blank')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Nouveau message
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
