import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Gamepad2, Trash2 } from 'lucide-react';
import { adminAPI, Campaign as CampaignType } from '../../../lib/api';
import { useSimpleNotifications } from '../../../hooks/useSimpleNotifications';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useSimpleNotifications();
  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await adminAPI.getCampaign(id);
        
        if (response.success && response.data) {
          setCampaign(response.data);
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

    fetchCampaign();
  }, [id]);

  const handleDeleteCampaign = async () => {
    if (!campaign || !window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const response = await adminAPI.deleteCampaign(campaign._id);
      
      if (response.success) {
        addNotification({ type: 'success', title: 'Succès', message: 'Campaign deleted successfully' });
        navigate('/admin');
      } else {
        addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete campaign' });
      }
    } catch (err) {
      addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete campaign' });
      console.error('Error deleting campaign:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading campaign...</p>
        </div>
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
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Campaign Details</h1>
            <p className="text-gray-400">Manage campaign information and participants</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDeleteCampaign}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete Campaign
          </button>
        </div>
      </div>

      {/* Campaign Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Campaign Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Title</label>
                <p className="text-white font-medium text-lg">{campaign.title || campaign.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-gray-300">{campaign.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className="text-white font-medium">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600 text-white">
                      {campaign.status || 'Active'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Max Players</label>
                  <p className="text-white font-medium">{campaign.maxPlayers || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Current Players</label>
                  <p className="text-white font-medium">{campaign.players?.length || 0}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Sessions</label>
                  <p className="text-white font-medium">{campaign.sessions?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Information */}
          {campaign.game && typeof campaign.game === 'object' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Game Information
              </h2>
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
                  <p className="text-gray-400">{campaign.game.publisher}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* DM Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dungeon Master</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                {campaign.dm && typeof campaign.dm === 'object' && campaign.dm.avatar ? (
                  <img
                    src={campaign.dm.avatar}
                    alt={`${campaign.dm.firstName} ${campaign.dm.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  {campaign.dm && typeof campaign.dm === 'object' 
                    ? `${campaign.dm.firstName} ${campaign.dm.lastName}`
                    : 'Unknown DM'
                  }
                </p>
                <p className="text-gray-400 text-sm">
                  {campaign.dm && typeof campaign.dm === 'object' 
                    ? campaign.dm.email 
                    : 'Unknown Email'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Players ({campaign.players?.length || 0}/{campaign.maxPlayers || '∞'})
            </h3>
            {campaign.players && campaign.players.length > 0 ? (
              <div className="space-y-3">
                {campaign.players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      {typeof player === 'object' && player.avatar ? (
                        <img
                          src={player.avatar}
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {typeof player === 'object' 
                          ? `${player.firstName} ${player.lastName}`
                          : 'Unknown Player'
                        }
                      </p>
                      <p className="text-gray-400 text-xs">
                        {typeof player === 'object' ? player.email : 'Unknown Email'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No players joined yet</p>
            )}
          </div>

          {/* Campaign Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {new Date(campaign.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">
                  {campaign.duration || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
