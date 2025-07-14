import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Campaign } from '@/types';
import { campaignsApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { Calendar, Users, Plus, Search, Gamepad2 } from 'lucide-react';

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignsApi.getCampaigns();
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(campaign => campaign.active === isActive);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Join ongoing campaigns and embark on epic adventures
          </p>
        </div>
        {user && (
          <div className="mt-4 sm:mt-0">
            <Link to="/campaigns/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more campaigns.'
                : 'Be the first to create a campaign!'}
            </p>
            {user && (
              <Link to="/campaigns/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {campaign.game.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={campaign.active ? 'success' : 'default'}>
                        {campaign.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {campaign.sessions.length} sessions
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {campaign.description}
                </p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Started {formatDate(campaign.createdAt)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar
                        firstName={campaign.dm.firstName}
                        lastName={campaign.dm.lastName}
                        src={campaign.dm.avatar}
                        size="sm"
                      />
                      <div className="ml-2">
                        <p className="text-gray-900 font-medium">
                          {campaign.dm.firstName} {campaign.dm.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Dungeon Master</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign.players.length} players
                    </div>
                  </div>

                  {campaign.players.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Players:</p>
                      <div className="flex -space-x-2">
                        {campaign.players.slice(0, 4).map((player) => (
                          <Avatar
                            key={player._id}
                            firstName={player.firstName}
                            lastName={player.lastName}
                            src={player.avatar}
                            size="sm"
                            className="border-2 border-white"
                          />
                        ))}
                        {campaign.players.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            +{campaign.players.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link to={`/campaigns/${campaign._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Campaign
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}