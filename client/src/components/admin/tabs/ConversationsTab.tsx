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
      key: 'unreadCount', 
      label: 'Non lus',
      render: (value: number) => (
        <Badge variant={value > 0 ? 'danger' : 'default'}>
          {value > 0 ? 'Non lu' : 'Lu'}
        </Badge>
      )
    },
    { 
      key: 'updatedAt', 
      label: 'Dernière mise à jour',
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des conversations</h3>
      </div>

      <DataTable
        columns={columns}
        data={conversations}
        onRowClick={(conversation) => {
          // Navigation vers la page de conversation
          window.open(`/admin/conversations/${conversation._id}`, '_blank');
        }}
        onDelete={(conversation) => {
          if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
            // TODO: Implémenter handleDeleteConversation
          }
        }}
        onArchive={(conversation) => {
          if (confirm('Êtes-vous sûr de vouloir archiver cette conversation ?')) {
            // TODO: Implémenter handleArchiveConversation
          }
        }}
        showArchiveButton={true}
        showEditButton={false}
      />
    </div>
  );
};

export default ConversationsTab;
