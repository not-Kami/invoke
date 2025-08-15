import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ChevronUp, ChevronDown, Send, User, Shield } from 'lucide-react';
import { conversationsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Conversation } from '../lib/api';
import { Textarea } from '../components/ui/Textarea';
import Button from '../components/ui/Button';

interface ConversationsBubbleProps {
  className?: string;
}

const ConversationsBubble: React.FC<ConversationsBubbleProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadUserConversations();
    }
  }, [user, isOpen]);

  const loadUserConversations = async () => {
    try {
      setLoading(true);
      // Utiliser la route simple /user pour l'utilisateur connecté
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

  const handleReply = async () => {
    if (!selectedConversation || !replyContent.trim()) return;

    try {
      setSending(true);
      const response = await conversationsApi.addMessage(selectedConversation._id, replyContent.trim());

      if (response.success) {
        // Recharger les conversations pour mettre à jour le dernier message
        await loadUserConversations();
        setReplyContent('');
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  // Si pas d'utilisateur connecté, ne pas afficher
  if (!user) {
    return null;
  }

  const unreadCount = conversations ? conversations.filter(conv => conv.isUnread).length : 0;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Bouton de la bulle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
      >
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px]">
            {unreadCount}
          </span>
        )}
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Panneau des conversations */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Mes conversations</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedConversation(null);
                setReplyContent('');
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contenu */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
                <p className="text-slate-400 mt-2">Chargement...</p>
              </div>
            ) : conversations && conversations.length > 0 ? (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`p-3 rounded-lg transition-colors cursor-pointer mb-2 ${
                      selectedConversation?._id === conversation._id 
                        ? 'bg-slate-700 border border-purple-500' 
                        : 'hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {conversation.subject}
                        </h4>
                        <p className="text-slate-400 text-sm truncate mt-1">
                          {conversation.messages && conversation.messages.length > 0
                            ? conversation.messages[conversation.messages.length - 1].content
                            : 'Aucun message'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            conversation.status === 'open' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
                          </span>
                          {conversation.isUnread && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">Aucune conversation</p>
                <p className="text-slate-500 text-sm">Vos conversations apparaîtront ici</p>
              </div>
            )}
          </div>

          {/* Zone de réponse */}
          {selectedConversation && selectedConversation.status === 'open' && (
            <div className="p-3 border-t border-slate-700">
              <div className="mb-3">
                <h4 className="text-white font-medium text-sm mb-2">
                  Répondre à : {selectedConversation.subject}
                </h4>
                {/* Aperçu du dernier message */}
                {selectedConversation.messages && selectedConversation.messages.length > 0 && (
                  <div className="bg-slate-700/50 rounded p-2 mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      {selectedConversation.messages[selectedConversation.messages.length - 1].senderType === 'admin' ? (
                        <Shield className="w-3 h-3 text-purple-400" />
                      ) : (
                        <User className="w-3 h-3 text-blue-400" />
                      )}
                      <span className="text-xs text-slate-300">
                        {selectedConversation.messages[selectedConversation.messages.length - 1].senderType === 'admin' ? 'Admin' : 'Vous'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {selectedConversation.messages[selectedConversation.messages.length - 1].content}
                    </p>
                  </div>
                )}
              </div>
              
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tapez votre réponse... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
                className="min-h-[80px] bg-slate-700 text-white border-slate-600 placeholder-slate-400 mb-3 resize-none"
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || sending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  size="sm"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedConversation(null);
                    setReplyContent('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* Footer - Lien vers la page complète */}
          <div className="p-3 border-t border-slate-700">
            <button
              onClick={() => window.open('/conversations', '_blank')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Voir toutes mes conversations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsBubble;
