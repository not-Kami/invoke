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
    {
      key: 'title',
      label: 'Titre du jeu',
      render: (value: string, row: Game) => (
        <div className="max-w-xs">
          <div className="font-medium text-white">{value}</div>
          <div className="text-sm text-slate-400">
            {row.description ? row.description.substring(0, 60) + '...' : 'Aucune description'}
          </div>
        </div>
      )
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (value: string) => (
        <Badge variant="default">{value}</Badge>
      )
    },
    {
      key: 'featured',
      label: 'Mis en avant',
      render: (value: boolean, row: Game) => (
        <FeaturedToggle
          featured={value}
          onToggle={(featured) => onToggleFeatured('game', row._id, featured)}
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
      render: (_: any, row: Game) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenGameModal(row)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteGame(row._id)}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-cinzel font-semibold text-white">
                Gestion des Jeux
              </h3>
              <p className="text-sm text-slate-400">
                {games.length} jeu{games.length > 1 ? 'x' : ''} au total
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => onOpenGameModal()}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un jeu</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={games}
          columns={columns}
          emptyMessage="Aucun jeu trouvé"
        />
      </CardContent>
    </Card>
  );
};

export default GamesTab;
