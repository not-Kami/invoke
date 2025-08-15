import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/Card';
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { Conversation } from '../../../lib/api';
import { MessageSquare, Eye, EyeOff, Reply } from 'lucide-react';

interface ConversationsTabProps {
  conversations: Conversation[];
  loading: boolean;
  onOpenReplyModal: (conversation: Conversation) => void;
}

const ConversationsTab: React.FC<ConversationsTabProps> = ({
  conversations,
  loading,
  onOpenReplyModal
}) => {
  const columns = [
    {
      key: 'subject',
      label: 'Sujet',
      render: (value: string) => (
        <div className="max-w-xs">
          <div className="font-medium text-white">{value}</div>
        </div>
      )
    },
    { 
      key: 'conversationType', 
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'contact_admin' ? 'info' : 'default'}>
          {value === 'contact_admin' ? 'Contact Admin' : 'Chat Utilisateur'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Statut',
      render: (value: string) => (
        <Badge variant={value === 'open' ? 'success' : 'warning'}>
          {value === 'open' ? 'Ouvert' : 'Fermé'}
        </Badge>
      )
    },
    { 
      key: 'messages', 
      label: 'Dernier message',
      render: (value: any[], row: any) => (
        <div className="max-w-xs truncate">
          {value && value.length > 0 ? (
            <>
              <div className="flex items-center text-sm text-slate-300">
                <MessageSquare className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {value[value.length - 1]?.content || 'Aucun message'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Par: {value[value.length - 1]?.senderType === 'admin' ? 'Admin' : (row.userName || 'Utilisateur')}
              </div>
            </>
          ) : (
            <span className="text-slate-400">Aucun message</span>
          )}
        </div>
      )
    },
    { 
      key: 'unreadCount', 
      label: 'Non lus',
      render: (value: number) => (
        <Badge variant={value > 0 ? 'danger' : 'default'}>
          {value > 0 ? 'Non lu' : 'Lu'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date création',
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-sm text-slate-300">
            <div>{date.toLocaleDateString('fr-FR')}</div>
            <div className="text-xs text-slate-500">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Conversation) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenReplyModal(row)}
            className="text-blue-400 hover:text-blue-300 hover:border-blue-400"
          >
            <Reply className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-cinzel font-semibold text-white">
              Gestion des Conversations
            </h3>
            <p className="text-sm text-slate-400">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-400">Type:</label>
            <select 
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white"
              onChange={(e) => {
                const type = e.target.value;
                if (type === 'all') {
                  // Restaurer toutes les conversations
                } else {
                  // Filtrer par type
                  console.log(`Filtrage par type: ${type}`);
                }
              }}
            >
              <option value="all">Tous les types</option>
              <option value="contact_admin">Contact Admin</option>
              <option value="user_chat">Chat Utilisateur</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-400">Statut:</label>
            <select 
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white"
              onChange={(e) => {
                const status = e.target.value;
                if (status === 'all') {
                  // Restaurer toutes les conversations
                } else {
                  // Filtrer par statut
                  console.log(`Filtrage par statut: ${status}`);
                }
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvertes</option>
              <option value="closed">Fermées</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={conversations}
          columns={columns}
          emptyMessage="Aucune conversation trouvée"
        />
      </CardContent>
    </Card>
  );
};

export default ConversationsTab;
