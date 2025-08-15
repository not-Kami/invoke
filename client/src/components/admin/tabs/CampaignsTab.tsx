import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/Card';
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import FeaturedToggle from '../FeaturedToggle';
import { Campaign } from '../../../lib/api';
import { BookOpen, Edit, Trash2, Star, Users } from 'lucide-react';

interface CampaignsTabProps {
  campaigns: Campaign[];
  loading: boolean;
  onDeleteCampaign: (campaignId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  loading,
  onDeleteCampaign,
  onToggleFeatured
}) => {
  const columns = [
    {
      key: 'title',
      label: 'Titre de la campagne',
      render: (value: string, row: Campaign) => (
        <div className="max-w-xs">
          <div className="font-medium text-white">{value}</div>
          <div className="text-sm text-slate-400">
            {row.description ? row.description.substring(0, 60) + '...' : 'Aucune description'}
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
      render: (value: boolean, row: Campaign) => (
        <FeaturedToggle
          featured={value}
          onToggle={(featured) => onToggleFeatured('campaign', row._id, featured)}
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
      render: (_: any, row: Campaign) => (
        <div className="flex items-center space-x-2">
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
            onClick={() => onDeleteCampaign(row._id)}
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
          <BookOpen className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-cinzel font-semibold text-white">
              Gestion des Campagnes
            </h3>
            <p className="text-sm text-slate-400">
              {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={campaigns}
          columns={columns}
          emptyMessage="Aucune campagne trouvée"
        />
      </CardContent>
    </Card>
  );
};

export default CampaignsTab;
