
import DataTable from '../DataTable';
import Badge from '../../ui/Badge';
import FeaturedToggle from '../FeaturedToggle';
import { Campaign } from '../../../lib/api';

interface CampaignsTabProps {
  campaigns: Campaign[];
  loading: boolean;
  onDeleteCampaign: (campaignId: string) => void;
  onToggleFeatured: (type: string, id: string, featured: boolean) => void;
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  onToggleFeatured
}) => {
  const columns = [
    { key: 'title', label: 'Titre' },
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
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value === 'active' ? 'Active' : 'En pause'}
        </Badge>
      )
    },
    { 
      key: 'players', 
      label: 'Joueurs',
      render: (value: number, row: any) => `${value}/${row.maxPlayers}`
    },
    { 
      key: 'featured', 
      label: 'Mis en avant',
      render: (value: boolean, row: any) => (
        <FeaturedToggle
          isFeatured={value}
          onToggle={(featured) => onToggleFeatured('campaign', row._id, featured)}
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
        <h3 className="text-lg font-cinzel font-semibold text-white">Gestion des campagnes</h3>
      </div>
      
      <DataTable
        columns={columns}
        data={campaigns}
      />
    </div>
  );
};

export default CampaignsTab;
