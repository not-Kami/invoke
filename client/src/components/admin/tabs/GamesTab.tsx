
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import FeaturedToggle from '../FeaturedToggle';
import Button from '../../ui/Button';
import { Game } from '../../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface GamesTabProps {
  games: Game[];
  loading: boolean;
  onDeleteGame: (gameId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
  onOpenGameModal: (game?: Game) => void;
}

const GamesTab: React.FC<GamesTabProps> = ({
  games,
  loading,
  onDeleteGame,
  onToggleFeatured,
  onOpenGameModal
}) => {
  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'system', label: 'Système' },
    { 
      key: 'sessionsCount', 
      label: 'Sessions',
      render: (_value: any) => (
        <Badge variant="default">{0}</Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Mis en avant',
      render: (value: boolean, row: any) => (
        <FeaturedToggle
          isFeatured={value}
          onToggle={(featured) => onToggleFeatured('game', row._id, featured)}
        />
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date création',
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

  const handleEditGame = (game: Game) => {
    onOpenGameModal(game);
  };

  const handleDeleteGame = (game: Game) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le jeu "${game.name}" ?`)) {
      onDeleteGame(game._id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Games Management</h3>
        <Button 
          onClick={() => onOpenGameModal()} 
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un jeu</span>
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={games}
        showEditButton={true}
        onEdit={handleEditGame}
        onDelete={handleDeleteGame}
      />
    </div>
  );
};

export default GamesTab;
