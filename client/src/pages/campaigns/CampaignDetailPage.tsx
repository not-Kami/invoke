import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { publicAPI } from '../../lib/api';
import { Campaign, User } from '../../types';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import InvitePlayersModal from '../../components/InvitePlayersModal';
import { 
  Users, 
  BookOpen, 
  Gamepad2, 
  UserPlus, 
  ArrowLeft,
  Edit
} from 'lucide-react';
import { formatDateShort } from '../../lib/utils';

interface PopulatedCampaign extends Omit<Campaign, 'dm' | 'game' | 'players'> {
  dm: User;
  game: {
    _id: string;
    name: string;
    images?: {
      logo?: string;
    };
  };
  players: User[];
  title?: string;
  maxPlayers?: number;
  duration?: string;
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [campaign, setCampaign] = useState<PopulatedCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await publicAPI.getCampaign(id!);
      if (response.success && response.data) {
        // Convertir Campaign en PopulatedCampaign
        const campaignData = response.data as any;
        setCampaign(campaignData);
      } else {
        setError('Campaign not found');
      }
    } catch (err) {
      setError('Failed to load campaign');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const isCampaignDM = () => {
    if (!user || !campaign) return false;
    return typeof campaign.dm === 'string' ? campaign.dm === user._id : campaign.dm._id === user._id;
  };

  const handleInvitePlayers = () => {
    setInviteModalOpen(true);
  };

  const handleInvite = async (playerIds: string[]) => {
    if (!campaign) return;
    
    try {
      // TODO: Implémenter l'API pour inviter des joueurs à la campagne
      console.log('Inviting players:', playerIds, 'to campaign:', campaign._id);
      
      // Rafraîchir les données de la campagne
      fetchCampaign();
    } catch (error) {
      console.error('Error inviting players:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <BookOpen className="h-12 w-12 mx-auto mb-2" />
          <p className="text-xl font-semibold">Campaign not found</p>
        </div>
        <Button onClick={() => navigate('/campaigns')}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              onClick={() => navigate('/campaigns')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{campaign.title || campaign.name}</h1>
              <p className="text-gray-400">Campaign Details</p>
            </div>
          </div>
          
          {isCampaignDM() && (
            <Button
              onClick={() => navigate(`/campaigns/${campaign._id}/edit`)}
              className="bg-purple-600 hover:bg-purple-700 text-white self-start lg:self-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Campaign Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <p className="text-gray-200">{campaign.description || 'No description provided'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <Badge 
                      className={campaign.active ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {campaign.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Players</label>
                    <p className="text-white">{campaign.maxPlayers || 'Not specified'}</p>
                  </div>
                </div>
                
                {campaign.duration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                    <p className="text-white">{campaign.duration}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Information */}
            {campaign.game && typeof campaign.game === 'object' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Game Information
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {campaign.game.images?.logo && (
                      <img
                        src={campaign.game.images.logo}
                        alt={campaign.game.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{campaign.game.name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dungeon Master */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Dungeon Master</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={typeof campaign.dm === 'string' ? undefined : (campaign.dm.avatar || undefined)}
                    alt={`${typeof campaign.dm === 'string' ? 'DM' : `${campaign.dm.firstName} ${campaign.dm.lastName}`}`}
                    firstName={typeof campaign.dm === 'string' ? '' : campaign.dm.firstName}
                    lastName={typeof campaign.dm === 'string' ? '' : campaign.dm.lastName}
                    size="lg"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {typeof campaign.dm === 'string' ? campaign.dm : `${campaign.dm.firstName} ${campaign.dm.lastName}`}
                    </p>
                    <p className="text-sm text-gray-300">Game Master</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Players */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Players ({campaign.players.length}/{campaign.maxPlayers || '∞'})
                  </h3>
                  {isCampaignDM() && (
                    <Button
                      onClick={handleInvitePlayers}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {campaign.players.length > 0 ? (
                  <div className="space-y-3">
                    {campaign.players.map(player => (
                      <div key={player._id} className="flex items-center space-x-3">
                        <Avatar
                          src={player.avatar || undefined}
                          alt={`${player.firstName} ${player.lastName}`}
                          firstName={player.firstName}
                          lastName={player.lastName}
                          size="sm"
                          className="w-8 h-8"
                        />
                        <span className="text-white text-sm">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No players yet</p>
                    <p className="text-gray-500 text-xs">Be the first to join!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Campaign Stats</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {formatDateShort(campaign.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions</span>
                  <span className="text-white">{campaign.sessions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{campaign.duration || 'Not specified'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Invite Players Modal */}
      <InvitePlayersModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
        currentPlayers={campaign?.players || []}
        maxPlayers={campaign?.maxPlayers || 6}
        title="Invite Players to Campaign"
      />
    </div>
  );
}
