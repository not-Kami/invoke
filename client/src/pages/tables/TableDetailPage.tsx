import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tableAPI } from '../../lib/api';
import { Table } from '../../types';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Users, 
  Crown, 
  UserPlus, 
  Tag,
  Lock,
  Globe,
  Settings,
  Trash2
} from 'lucide-react';

export default function TableDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTable();
    }
  }, [id]);

  const loadTable = async () => {
    try {
      setLoading(true);
      const response = await tableAPI.getTable(id!);
      
      if (response.success && response.data) {
        setTable(response.data);
      } else {
        setError('Table not found');
      }
    } catch (error) {
      console.error('Error loading table:', error);
      setError('Failed to load table');
    } finally {
      setLoading(false);
    }
  };

  const handleDissolveTable = async () => {
    if (!table || !user) return;

    // Confirmation avant de dissoudre la table
    const confirmed = window.confirm(
      'Are you sure you want to dissolve this table? This action cannot be undone and all members will be removed.'
    );

    if (!confirmed) return;

    try {
      const response = await tableAPI.dissolveTable(table._id);
      
      if (response.success) {
        // Rediriger vers le dashboard après dissolution
        navigate('/dashboard');
      } else {
        console.error('Error dissolving table:', response.error);
        alert('Failed to dissolve table. Please try again.');
      }
    } catch (error) {
      console.error('Error dissolving table:', error);
      alert('Failed to dissolve table. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-white/10 rounded-lg"></div>
                <div className="h-32 bg-white/10 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-white/10 rounded-lg"></div>
                <div className="h-48 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !table) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/invoke-logo.svg" 
                alt="Invoke Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Table Not Found</h1>
            <p className="text-gray-300 mb-6">{error || 'The table you are looking for does not exist.'}</p>
            <Button
              onClick={() => navigate('/tables')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tables
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === (typeof table.owner === 'string' ? table.owner : table.owner._id);
  const isMember = table.members?.some(member => 
    typeof member.user === 'string' ? member.user === user?._id : member.user._id === user?._id
  );


  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/tables')}
              className="border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tables
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4">
              {/* Image de la table */}
              {table.avatar && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  <img
                    src={table.avatar}
                    alt={`${table.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{table.name}</h1>
                  {isOwner && <Crown className="h-6 w-6 text-yellow-400" />}
                  {table.isPrivate && <Lock className="h-5 w-5 text-red-400" />}
                </div>
                <p className="text-gray-300 text-lg">{table.description}</p>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/tables/${table._id}/edit`)}
                  variant="outline"
                  className="border-white/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Table
                </Button>
                <Button
                  onClick={handleDissolveTable}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Dissolve
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Table Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Table Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Members</p>
                    <p className="text-lg font-semibold text-white">
                      {table.memberCount || table.members?.length || 0} members
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-lg font-semibold text-white capitalize">{table.status}</p>
                  </div>
                </div>
                
                {table.tags && table.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {table.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members ({table.members?.filter(member => {
                    const memberUser = typeof member.user === 'string' ? null : member.user;
                    return memberUser?._id !== (typeof table.owner === 'string' ? table.owner : table.owner._id);
                  }).length || 0})
                </h2>
              </CardHeader>
              <CardContent>
                {/* Owner */}
                {table.owner && (
                  <div className="mb-4 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                          {typeof table.owner !== 'string' && table.owner.avatar ? (
                            <img
                              src={table.owner.avatar}
                              alt={`${table.owner.firstName} ${table.owner.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                              {typeof table.owner !== 'string' ? `${table.owner.firstName?.[0]}${table.owner.lastName?.[0]}` : 'U'}
                            </div>
                          )}
                        </div>
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          {typeof table.owner === 'string' ? 'Loading...' : `${table.owner.firstName} ${table.owner.lastName}`}
                          <Crown className="h-3 w-3 text-yellow-400" />
                        </p>
                        <p className="text-sm text-gray-400">Table Owner</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Members (excluding owner) */}
                {table.members && table.members.length > 0 ? (
                  <div className="space-y-3">
                    {table.members
                      .filter(member => {
                        const memberUser = member.user;
                        const ownerId = typeof table.owner === 'string' ? table.owner : table.owner._id;
                        return typeof memberUser === 'object' && memberUser?._id !== ownerId;
                      })
                      .map((member, index) => {
                        const memberUser = member.user;
                        const isUserObject = typeof memberUser === 'object' && memberUser !== null;
                        
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                                  {isUserObject && memberUser.avatar ? (
                                    <img
                                      src={memberUser.avatar}
                                      alt={`${memberUser.firstName} ${memberUser.lastName}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                                      {isUserObject ? `${memberUser.firstName?.[0]}${memberUser.lastName?.[0]}` : 'U'}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">
                                    {isUserObject ? `${memberUser.firstName} ${memberUser.lastName}` : 'Unknown User'}
                                  </p>
                                  <p className="text-sm text-gray-400">Member</p>
                                </div>
                              </div>
                            </div>
                          );
                      })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No members yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {isOwner ? (
                  <Button
                    onClick={() => navigate(`/tables/${table._id}/edit`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Table
                  </Button>
                ) : isMember ? (
                  <Button
                    onClick={() => navigate(`/tables/${table._id}/leave`)}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                  >
                    Leave Table
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate(`/tables/${table._id}/join`)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Table
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Table Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Statistics</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sessions Played</span>
                  <span className="text-white font-semibold">{table.stats?.sessionsPlayed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Play Time</span>
                  <span className="text-white font-semibold">{table.stats?.totalPlayTime || 0}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Rating</span>
                  <span className="text-white font-semibold">{table.stats?.averageRating || 0}/5</span>
                </div>
              </CardContent>
            </Card>

            {/* Table Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Table Details</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white text-sm">
                    {new Date(table.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Visibility</span>
                  <span className="text-white text-sm flex items-center gap-1">
                    {table.isPrivate ? (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3" />
                        Public
                      </>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
