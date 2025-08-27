import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Lock, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { conversationsApi, Conversation } from '../lib/api';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserEmail?: string;
}

interface Message {
  _id: string;
  content: string;
  sender: string;
  timestamp: string;
  isAdmin: boolean;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  currentUserEmail
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && conversationId) {
      loadConversation();
    }
  }, [isOpen, conversationId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load conversation details
      const convResponse = await conversationsApi.getConversation(conversationId);
      if (convResponse.success && convResponse.data) {
        setConversation(convResponse.data);
      } else {
        throw new Error('Failed to load conversation');
      }

      // TODO: Load messages when API is ready
      // For now, we'll simulate some messages
      const mockMessages: Message[] = [
        {
          _id: '1',
          content: conversation?.messages && conversation.messages.length > 0 
            ? conversation.messages[conversation.messages.length - 1].content 
            : 'Initial message',
          sender: 'User',
          timestamp: conversation?.messages && conversation.messages.length > 0 
            ? conversation.messages[conversation.messages.length - 1].timestamp 
            : new Date().toISOString(),
          isAdmin: false
        }
      ];
      setMessages(mockMessages);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;

    try {
      setSending(true);
      
      // Check if conversation is closed
      if (conversation.status === 'closed') {
        setError('This conversation is closed. You cannot send new messages.');
        return;
      }

      // TODO: Send message via API when ready
      // const response = await conversationsApi.addMessage(conversationId, newMessage);
      
      // For now, simulate sending
      const mockMessage: Message = {
        _id: Date.now().toString(),
        content: newMessage,
        sender: currentUserEmail || 'You',
        timestamp: new Date().toISOString(),
        isAdmin: false
      };

      setMessages(prev => [...prev, mockMessage]);
      setNewMessage('');
      
      // Update conversation last message
      if (conversation) {
        setConversation(prev => prev ? {
          ...prev,
          lastMessage: {
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: currentUserEmail || 'You'
          },
          updatedAt: new Date().toISOString()
        } : null);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!conversation) return;

    try {
      // TODO: Close conversation via API when ready
      // const response = await conversationsApi.closeConversation(conversationId);
      
      // For now, simulate closing
      setConversation(prev => prev ? { ...prev, status: 'closed' } : null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close conversation');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                {conversation?.subject || 'Conversation'}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Badge 
                  variant={conversation?.status === 'open' ? 'success' : 'warning'}
                  className="text-xs"
                >
                  {conversation?.status === 'open' ? 'Open' : 'Closed'}
                </Badge>
                <span>•</span>
                <span>ID: {conversationId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {conversation?.status === 'open' && (
              <Button
                onClick={handleCloseConversation}
                variant="outline"
                size="sm"
                className="text-orange-400 border-orange-400 hover:bg-orange-400/20"
              >
                <Lock className="w-4 h-4 mr-1" />
                Close
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-slate-400">Loading conversation...</div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-red-400 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                {error}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isAdmin
                          ? 'bg-slate-700 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.sender}
                        </span>
                        <span className="text-xs opacity-50">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {conversation?.status === 'closed' && (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <p className="text-orange-400 font-medium">This conversation is closed</p>
                    <p className="text-slate-400 text-sm mt-1">
                      You cannot send new messages to this conversation.
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              {conversation?.status === 'open' && (
                <div className="p-4 border-t border-slate-700">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      variant="primary"
                      size="sm"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;
