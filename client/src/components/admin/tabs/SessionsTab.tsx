import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/Card';
import ExpandableDataTable from '../ExpandableDataTable';
import SessionExpandedContent from '../SessionExpandedContent';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import FeaturedToggle from '../FeaturedToggle';
import { Session } from '../../../lib/api';
import { Calendar, Edit, Trash2, Star, Download } from 'lucide-react';

interface SessionsTabProps {
  sessions: Session[];
  loading: boolean;
  onDeleteSession: (sessionId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
  onExportSession: (sessionId: string) => void;
}

const SessionsTab: React.FC<SessionsTabProps> = ({
  sessions,
  loading,
  onDeleteSession,
  onToggleFeatured,
  onExportSession
}) => {
  const columns = [
    {
      key: 'title',
      label: 'Titre de la session',
      render: (value: string, row: Session) => (
        <div className="max-w-xs">
          <div className="font-medium text-white">{value}</div>
          <div className="text-sm text-slate-400">
            {row.campaignName ? `Campagne: ${row.campaignName}` : 'Session standalone'}
          </div>
        </div>
      )
    },
    {
      key: 'gameMaster',
      label: 'Maître de jeu',
      render: (value: string) => (
        <div className="text-sm text-slate-300">{value}</div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value === 'active' ? 'Active' : 'Terminée'}
        </Badge>
      )
    },
    {
      key: 'featured',
      label: 'Mis en avant',
      render: (value: boolean, row: Session) => (
        <FeaturedToggle
          featured={value}
          onToggle={(featured) => onToggleFeatured('session', row._id, featured)}
        />
      )
    },
    {
      key: 'createdAt',
      label: 'Date de création',
      render: (value: string) => (
        <div className="text-sm text-slate-300">
          {new Date(value).toLocaleDateString('fr-FR')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Session) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportSession(row._id)}
            className="text-blue-400 hover:text-blue-300 hover:border-blue-400"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* TODO: Implémenter l'édition */}}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteSession(row._id)}
            className="text-red-400 hover:text-red-300 hover:border-red-400"
          >
            <Trash2 className="w-4 h-4" />
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
          <Calendar className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-cinzel font-semibold text-white">
              Gestion des Sessions
            </h3>
            <p className="text-sm text-slate-400">
              {sessions.length} session{sessions.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ExpandableDataTable
          data={sessions}
          columns={columns}
          expandedContent={(session) => <SessionExpandedContent session={session} />}
          emptyMessage="Aucune session trouvée"
        />
      </CardContent>
    </Card>
  );
};

export default SessionsTab;
