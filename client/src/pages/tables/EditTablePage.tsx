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
  X,
  Save,
  Trash2
} from 'lucide-react';

export default function EditTablePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour l'édition
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: [] as string[],
    avatar: null as File | null
  });
  const [newTag, setNewTag] = useState('');
  
  // États pour l'ajout de membres
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

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
        const tableData = response.data;
        console.log('Table loaded:', tableData);
        console.log('Members:', tableData.members);
        setTable(tableData);
        setFormData({
          name: tableData.name,
          description: tableData.description,
          isPrivate: tableData.isPrivate,
          tags: tableData.tags || [],
          avatar: null
        });
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const searchPlayers = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Utiliser la vraie API de recherche d'utilisateurs
      const response = await fetch(`/api/v1/users/list/players`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Filtrer les résultats côté client
          const filtered = data.data.filter((user: any) => 
            (user.firstName?.toLowerCase().includes(term.toLowerCase()) ||
             user.lastName?.toLowerCase().includes(term.toLowerCase()) ||
             user.email?.toLowerCase().includes(term.toLowerCase()) ||
             (user.nickname && user.nickname.toLowerCase().includes(term.toLowerCase())))
          );
          setSearchResults(filtered);
        } else {
          setSearchResults([]);
        }
      } else {
        console.error('Error searching players:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
    }
  };

  const addMember = async (playerId: string) => {
    if (!table || !user) return;

    try {
      setAdding(true);
      const response = await tableAPI.addMembers(table._id, [playerId]);
      
      if (response.success) {
        // Recharger la table pour voir les nouveaux membres
        await loadTable();
        // Ne pas fermer le modal, juste vider la recherche
        setPlayerSearchTerm('');
        setSearchResults([]);
        console.log('Player added successfully');
      } else {
        console.error('Error adding player:', response.error);
        alert('Error adding player: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setAdding(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!table || !user) return;

    try {
      // Pour l'instant, on simule la suppression
      // Plus tard, on pourra utiliser une vraie API
      console.log('Remove member:', memberId);
      await loadTable();
    } catch (error) {
      console.error('Error removing member:', error);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table || !user) return;

    try {
      setSaving(true);
      
      // Convertir l'image en base64 si elle existe
      let avatarBase64 = null;
      if (formData.avatar) {
        avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.avatar!);
        });
      }
      
      const tableData = {
        ...formData,
        avatar: avatarBase64 || table.avatar // Garder l'ancienne image si pas de nouvelle
      };
      
      const response = await tableAPI.updateTable(table._id, tableData);
      
      if (response.success) {
        navigate(`/tables/${table._id}`);
      } else {
        console.error('Error updating table:', response.error);
      }
    } catch (error) {
      console.error('Error updating table:', error);
    } finally {
      setSaving(false);
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


  if (!isOwner) {
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
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-6">Only the table owner can edit this table.</p>
            <Button
              onClick={() => navigate(`/tables/${table._id}`)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Table
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/tables/${table._id}`)}
              className="border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Table
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Edit Table</h1>
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-lg">Manage your table settings and members</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Basic Information
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Table Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter table name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe your table and what kind of games you play..."
                    />
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Table Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.avatar ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                          <img
                            src={URL.createObjectURL(formData.avatar)}
                            alt="Table preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : table?.avatar ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                          <img
                            src={table.avatar}
                            alt="Current table photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <div className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                          {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={formData.isPrivate}
                      onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Private Table
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Add a tag..."
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="border-white/20"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-purple-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Members Management */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Members ({table.members?.filter(member => {
                        const memberUser = typeof member.user === 'string' ? null : member.user;
                        return memberUser?._id !== (typeof table.owner === 'string' ? table.owner : table.owner._id);
                      }).length || 0})
                    </h2>
                    <Button
                      type="button"
                      onClick={() => setShowAddMemberModal(true)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Members
                    </Button>
                  </div>
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
                          return memberUser?._id !== ownerId;
                        })
                      .map((member, index) => {
                        const memberUser = member.user;
                          
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                                  {memberUser && memberUser.avatar ? (
                                    <img
                                      src={memberUser.avatar}
                                      alt={`${memberUser.firstName} ${memberUser.lastName}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                                      {memberUser ? `${memberUser.firstName?.[0]}${memberUser.lastName?.[0]}` : 'U'}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">
                                    {memberUser ? `${memberUser.firstName} ${memberUser.lastName}` : 'Unknown User'}
                                  </p>
                                  <p className="text-sm text-gray-400">Member</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  onClick={() => removeMember(memberUser?._id || '')}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
              {/* Save Actions */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Actions</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={saving || !formData.name.trim() || !formData.description.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => navigate(`/tables/${table._id}`)}
                    variant="outline"
                    className="w-full border-white/20"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleDissolveTable}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Dissolve Table
                  </Button>
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
        </form>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-white/20 w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Add Members</h3>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAddMemberModal(false);
                      setPlayerSearchTerm('');
                      setSearchResults([]);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search Players
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={playerSearchTerm}
                      onChange={(e) => {
                        setPlayerSearchTerm(e.target.value);
                        searchPlayers(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Search by name or email..."
                    />
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.map((player) => (
                          <div
                            key={player._id}
                            onClick={() => addMember(player._id)}
                            className="px-3 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <p className="text-white text-sm">
                                {player.firstName} {player.lastName}
                              </p>
                              <p className="text-gray-400 text-xs">{player.email}</p>
                            </div>
                            {adding && (
                              <span className="text-blue-400 text-xs">Adding...</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
