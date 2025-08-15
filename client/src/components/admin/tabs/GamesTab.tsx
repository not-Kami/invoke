import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/Card';
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import FeaturedToggle from '../FeaturedToggle';
import { Game } from '../../../lib/api';
import { Gamepad2, Edit, Trash2, Star, Plus } from 'lucide-react';

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
      render: (value: number) => (
        <Badge variant="info">{value || 0}</Badge>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des jeux</h3>
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
      />
    </div>
  );
};

export default GamesTab;
