import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tableAPI } from '../../lib/api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Users, Lock, Tag, Gamepad2, Clock } from 'lucide-react';

export default function CreateTablePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    tags: [] as string[],
    avatar: null as File | null
  });
  const [newTag, setNewTag] = useState('');
  const [invitedPlayers, setInvitedPlayers] = useState<string[]>([]);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  const addPlayer = (player: any) => {
    if (!invitedPlayers.includes(player._id)) {
      setInvitedPlayers(prev => [...prev, player._id]);
    }
    setPlayerSearchTerm('');
    setSearchResults([]);
  };

  const removePlayer = (playerId: string) => {
    setInvitedPlayers(prev => prev.filter(id => id !== playerId));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
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
        avatar: avatarBase64
      };
      
      const response = await tableAPI.createTable(tableData);
      
      if (response.success && response.data) {
        console.log('Table created successfully:', response.data);
        navigate(`/tables/${response.data._id}`);
      } else {
        console.error('Error creating table:', response.error || response.message);
      }
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to create a table.</p>
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
              onClick={() => navigate('/tables')}
              className="border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tables
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Table</h1>
          <p className="text-gray-300">Set up a gaming group to play together</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                  {formData.avatar && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                      <img
                        src={URL.createObjectURL(formData.avatar)}
                        alt="Table preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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

          {/* Invite Players */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Invite Players
              </h2>
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
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((player) => (
                        <div
                          key={player._id}
                          onClick={() => addPlayer(player)}
                          className="px-3 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white text-sm">
                              {player.firstName} {player.lastName}
                            </p>
                            <p className="text-gray-400 text-xs">{player.email}</p>
                          </div>
                          {invitedPlayers.includes(player._id) && (
                            <span className="text-green-400 text-xs">Added</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Invited Players */}
              {invitedPlayers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Invited Players ({invitedPlayers.length})
                  </label>
                  <div className="space-y-2">
                    {invitedPlayers.map((playerId) => {
                      const player = searchResults.find(p => p._id === playerId) || 
                        { _id: playerId, firstName: 'Player', lastName: 'Unknown' };
                      return (
                        <div
                          key={playerId}
                          className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg"
                        >
                          <span className="text-white text-sm">
                            {player.firstName} {player.lastName}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePlayer(playerId)}
                            className="text-red-400 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Players will receive an invitation to join your table once it's created.
              </p>
            </CardContent>
          </Card>

          {/* Session Preferences - Coming Soon */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-400">Session Preferences</h2>
                  <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Soon you'll be able to set session types, timezone, and availability preferences for your table.
              </p>
            </CardContent>
          </Card>

          {/* Availability - Coming Soon */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-400">Availability</h2>
                  <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Soon you'll be able to set your table's availability schedule and time slots.
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tables')}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.description.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? 'Creating...' : 'Create Table'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
