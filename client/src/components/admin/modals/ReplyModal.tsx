import React, { useState } from 'react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { Conversation } from '../../../lib/api';
import { XCircle, MessageSquare } from 'lucide-react';

interface ReplyModalProps {
  isOpen: boolean;
  conversation: Conversation | null;
  onClose: () => void;
  onSendReply: (conversationId: string, content: string) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  conversation,
  onClose,
  onSendReply
}) => {
  const [replyContent, setReplyContent] = useState('');

  if (!isOpen || !conversation) {
    return null;
  }

  const handleSendReply = () => {
    if (replyContent.trim()) {
      onSendReply(conversation._id, replyContent);
      setReplyContent('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-cinzel font-semibold text-white">
            Répondre à la conversation
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Détails de la conversation */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Détails de la conversation</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-400">Sujet:</span> {conversation.subject}</div>
              <div><span className="text-slate-400">Type:</span> 
                <Badge variant={conversation.conversationType === 'contact_admin' ? 'info' : 'default'} className="ml-2">
                  {conversation.conversationType === 'contact_admin' ? 'Contact Admin' : 'Chat Utilisateur'}
                </Badge>
              </div>
              <div><span className="text-slate-400">Statut:</span> 
                <Badge variant={conversation.status === 'open' ? 'success' : 'warning'} className="ml-2">
                  {conversation.status === 'open' ? 'Ouvert' : 'Fermé'}
                </Badge>
              </div>
              <div><span className="text-slate-400">Dernier message:</span> 
                <div className="text-slate-300 mt-1 pl-4 border-l border-slate-600">
                  {conversation.messages && conversation.messages.length > 0 
                    ? conversation.messages[conversation.messages.length - 1].content 
                    : 'Aucun message'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Zone de réponse */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Votre réponse
            </label>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tapez votre réponse ici..."
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSendReply}
              disabled={!replyContent.trim()}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Envoyer la réponse
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
