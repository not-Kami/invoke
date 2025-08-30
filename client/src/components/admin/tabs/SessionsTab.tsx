
import ExpandableDataTable from '../ExpandableDataTable';
import SessionExpandedContent from '../SessionExpandedContent';
import Badge from '../../ui/Badge';
import FeaturedToggle from '../FeaturedToggle';
import { Session } from '../../../lib/api';

interface SessionsTabProps {
  sessions: Session[];
  loading: boolean;
  onDeleteSession: (sessionId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
  onExportSession: (sessionId: string) => void;
}

const SessionsTab: React.FC<SessionsTabProps> = ({
  sessions,
  onToggleFeatured
}) => {
  const columns = [
    { 
      key: 'title', 
      label: 'Titre' 
    },
    { 
      key: 'game', 
      label: 'Jeu',
      render: (value: any) => value?.name || 'N/A'
    },
    { 
      key: 'dm', 
      label: 'MJ',
      render: (value: any) => value ? `${value.firstName} ${value.lastName}` : 'N/A'
    },
    { 
      key: 'status', 
      label: 'Statut',
      render: (value: string) => {
        let variant: 'success' | 'warning' | 'default' | 'danger' = 'default';
        let label = value;
        
        switch (value) {
          case 'open':
            variant = 'success';
            label = 'Ouvert';
            break;
          case 'full':
            variant = 'warning';
            label = 'Complet';
            break;
          case 'finished':
            variant = 'default';
            label = 'Terminé';
            break;
          case 'cancelled':
            variant = 'danger';
            label = 'Annulé';
            break;
          default:
            variant = 'default';
            label = value;
        }
        
        return (
          <Badge variant={variant}>
            {label}
          </Badge>
        );
      }
    },
    { 
      key: 'players', 
      label: 'Joueurs',
      render: (value: any, row: any) => {
        const playerCount = Array.isArray(value) ? value.length : (typeof value === 'number' ? value : 0);
        const maxPlayers = row.maxPlayers || '?';
        return `${playerCount}/${maxPlayers}`;
      }
    },
    { 
      key: 'date', 
      label: 'Date de session',
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      }
    },
    { 
      key: 'featured', 
      label: 'Mis en avant',
      render: (value: boolean, row: any) => (
        <FeaturedToggle
          isFeatured={value}
          onToggle={(featured) => onToggleFeatured('session', row._id, featured)}
        />
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des sessions</h3>
      </div>
      
      <ExpandableDataTable
        columns={columns}
        data={sessions}
        expandableContent={(session) => <SessionExpandedContent session={session} />}
      />
    </div>
  );
};

export default SessionsTab;
