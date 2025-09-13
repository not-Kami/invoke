import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import { MessageSquare, Send, ArrowLeft, Archive, Trash2, User, Shield } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { useNotifications } from '../../../hooks/useNotifications';
import { Conversation } from '../../../lib/api';

const ConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      loadConversation();
    }
  }, [id]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getConversation(id!);
      if (response.success && response.data) {
        
        // Forcer le statut "lu" immédiatement
        const conversationData = {
          ...response.data,
          unreadCount: 0,
          isUnread: false
        };
        
        setConversation(conversationData);
        
        // Marquer la conversation comme lue côté serveur
        await markConversationAsRead(response.data._id);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement de la conversation');
      }
    } catch (error) {
      addError(`Erreur de chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async (_conversationId: string) => {
    try {
      // Ici on appellerait l'API pour marquer comme lu
      // Pour l'instant, on met à jour localement
      setConversation(prev => prev ? { ...prev, unreadCount: 0, isUnread: false } : null);
    } catch (error) {
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !conversation) return;

    try {
      setSending(true);
      
      // Appeler l'API pour ajouter la réponse admin
      const response = await adminAPI.replyToConversation(conversation._id, replyContent);
      
      if (response.success) {
        addSuccess('Réponse envoyée avec succès');
        setReplyContent('');
        
        // Recharger la conversation pour afficher le nouveau message
        await loadConversation();
      } else {
        throw new Error(response.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      addError(`Erreur d'envoi: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setSending(false);
    }
  };

  const handleArchive = async () => {
    if (!conversation) return;

    if (confirm('Êtes-vous sûr de vouloir archiver cette conversation ?')) {
      try {
        const response = await adminAPI.archiveConversation(conversation._id);
        if (response.success) {
          setConversation(prev => prev ? { ...prev, status: 'closed' } : null);
          addSuccess('Conversation archivée avec succès');
        } else {
          throw new Error(response.error || 'Erreur lors de l\'archivage');
        }
      } catch (error) {
        addError(`Erreur d'archivage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  const handleDelete = async () => {
    if (!conversation) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.')) {
      try {
        const response = await adminAPI.deleteConversation(conversation._id);
        if (response.success) {
          addSuccess('Conversation supprimée avec succès');
          navigate('/admin');
        } else {
          throw new Error(response.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement de la conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Conversation non trouvée</h1>
          <p className="text-gray-300 mb-4">
            La conversation que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/admin')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-cinzel font-bold text-white">
                {conversation.subject}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={conversation.conversationType === 'contact_admin' ? 'info' : 'default'}>
                  {conversation.conversationType === 'contact_admin' ? 'Contact Admin' : 'Chat Utilisateur'}
                </Badge>
                <Badge variant={conversation.status === 'open' ? 'success' : 'warning'}>
                  {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
                </Badge>
                <Badge variant={conversation.priority === 'urgent' ? 'danger' : 'default'}>
                  {conversation.priority}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {conversation.status === 'open' && (
              <Button onClick={handleArchive} variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
            )}
            <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Informations de la conversation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Email utilisateur:</span>
                <p className="text-white">{conversation.userEmail}</p>
              </div>
              <div>
                <span className="text-slate-400">Créée le:</span>
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
                <span className="text-slate-400">Dernier message:</span>
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
              <div>
                <span className="text-slate-400">Statut:</span>
                <p className="text-white">
                  <Badge variant={conversation.status === 'open' ? 'success' : 'warning'}>
                    {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        

         {/* Messages */}
         <Card>
           <CardHeader>
             <CardTitle className="text-white flex items-center">
               <MessageSquare className="w-5 h-5 mr-2" />
               Messages ({conversation.messages?.length || 0})
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4 max-h-96 overflow-y-auto">
               {conversation.messages && conversation.messages.length > 0 ? (
                 conversation.messages.map((message, index) => (
                   <div
                     key={index}
                     className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                   >
                     <div
                       className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                         message.senderType === 'admin'
                           ? 'bg-purple-600 text-white'
                           : 'bg-slate-700 text-slate-200'
                       }`}
                     >
                       <div className="flex items-center space-x-2 mb-1">
                         {message.senderType === 'admin' ? (
                           <Shield className="w-4 h-4" />
                         ) : (
                           <User className="w-4 h-4" />
                         )}
                         <span className="text-xs opacity-75">
                           {message.senderType === 'admin' ? 'Admin' : 'Utilisateur'}
                         </span>
                         <span className="text-xs opacity-50">
                           {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                             hour: '2-digit',
                             minute: '2-digit'
                           })}
                         </span>
                       </div>
                       <p className="text-sm">{message.content}</p>
                     </div>
                   </div>
                 ))
               ) : (
                 <p className="text-slate-400 text-center py-8">Aucun message dans cette conversation</p>
               )}
             </div>
           </CardContent>
         </Card>

        {/* Réponse */}
        {conversation.status === 'open' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Répondre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Tapez votre réponse..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                  className="min-h-[100px] bg-slate-700 text-white border-slate-600 placeholder-slate-400"
                  disabled={sending}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleReply} 
                    disabled={!replyContent.trim() || sending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? 'Envoi...' : 'Envoyer la réponse'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {conversation.status === 'closed' && (
          <Card>
            <CardContent className="text-center py-8">
              <Archive className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Conversation archivée</h3>
              <p className="text-slate-400">
                Cette conversation est fermée. Vous ne pouvez plus y répondre.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConversationPage;
