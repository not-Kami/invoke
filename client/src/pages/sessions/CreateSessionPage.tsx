import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Game, User } from '../../types';
import { adminAPI } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Users, Plus, X, AlertCircle, Image as ImageIcon, Search } from 'lucide-react';

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier les permissions
  useEffect(() => {
    if (user && !(user.role === 'admin' || user.isDM)) {
      navigate('/sessions');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    estimatedDuration: 120, // Durée en minutes (2h par défaut)
    timezone: 'UTC',
    sessionType: 'online' as 'online' | 'offline',
    isOneShot: false,
    gameId: '',
    maxPlayers: 6,
    image: null as File | null
  });

  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // États pour la recherche de joueurs
  const [playerSearchOpen, setPlayerSearchOpen] = useState(false);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<User[]>([]);

  // Générer les fuseaux horaires
  const generateTimezones = () => {
    const timezones = [
      { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
      { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
      { value: 'EST', label: 'EST (Eastern Standard Time) - New York, Toronto' },
      { value: 'CST', label: 'CST (Central Standard Time) - Chicago, Mexico City' },
      { value: 'MST', label: 'MST (Mountain Standard Time) - Denver, Phoenix' },
      { value: 'PST', label: 'PST (Pacific Standard Time) - Los Angeles, Vancouver' },
      { value: 'UTC+1', label: 'UTC+1 - Paris, Berlin, Rome, Bruxelles' },
      { value: 'UTC+2', label: 'UTC+2 - Athens, Helsinki, Kiev, Johannesburg' },
      { value: 'UTC+3', label: 'UTC+3 - Moscow, Istanbul, Riyadh, Nairobi' },
      { value: 'UTC+4', label: 'UTC+4 - Dubai, Baku, Tbilisi, Yerevan' },
      { value: 'UTC+5', label: 'UTC+5 - Tashkent, Karachi, Mumbai, New Delhi' },
      { value: 'UTC+6', label: 'UTC+6 - Almaty, Dhaka, Omsk, Novosibirsk' },
      { value: 'UTC+7', label: 'UTC+7 - Bangkok, Hanoi, Jakarta, Ho Chi Minh City' },
      { value: 'UTC+8', label: 'UTC+8 - Beijing, Hong Kong, Singapore, Manila' },
      { value: 'UTC+9', label: 'UTC+9 - Tokyo, Seoul, Pyongyang, Osaka' },
      { value: 'UTC+10', label: 'UTC+10 - Sydney, Melbourne, Brisbane, Vladivostok' },
      { value: 'UTC+11', label: 'UTC+11 - Vladivostok, Magadan, Solomon Islands' },
      { value: 'UTC+12', label: 'UTC+12 - Auckland, Wellington, Kamchatka' },
      { value: 'UTC-1', label: 'UTC-1 - Azores, Cape Verde' },
      { value: 'UTC-2', label: 'UTC-2 - Fernando de Noronha, South Georgia' },
      { value: 'UTC-3', label: 'UTC-3 - Brasília, Buenos Aires, São Paulo' },
      { value: 'UTC-4', label: 'UTC-4 - Santiago, La Paz, Caracas, Halifax' },
      { value: 'UTC-5', label: 'UTC-5 - Bogotá, Lima, Quito, Panama City' },
      { value: 'UTC-6', label: 'UTC-6 - Guatemala City, Tegucigalpa, San Salvador' },
      { value: 'UTC-7', label: 'UTC-7 - Hermosillo, Chihuahua, Mazatlán' },
      { value: 'UTC-8', label: 'UTC-8 - Anchorage, Fairbanks, Juneau' },
      { value: 'UTC-9', label: 'UTC-9 - Anchorage, Fairbanks, Juneau' },
      { value: 'UTC-10', label: 'UTC-10 - Honolulu, Papeete, Anchorage' },
      { value: 'UTC-11', label: 'UTC-11 - Pago Pago, Midway Island' },
      { value: 'UTC-12', label: 'UTC-12 - Baker Island, Howland Island' }
    ];
    return timezones;
  };

  // Options de durée prédéfinies
  const durationOptions = [
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 150, label: '2.5 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
    { value: 360, label: '6 hours' }
  ];

  useEffect(() => {
    // Load available games from API
    const fetchGames = async () => {
      try {
        const response = await adminAPI.getGames();
        if (response.success && response.data) {
          setAvailableGames(response.data);
        } else {
        }
      } catch (error) {
      }
    };

    // Charger les joueurs disponibles depuis l'API
    const fetchPlayers = async () => {
      try {
        const response = await adminAPI.getPlayersForInvitation();
        
        if (response.success && response.data) {
          setAvailablePlayers(response.data);
          setFilteredPlayers(response.data);
        } else {
          setAvailablePlayers([]);
          setFilteredPlayers([]);
        }
      } catch (error) {
        setAvailablePlayers([]);
        setFilteredPlayers([]);
      }
    };

    fetchGames();
    fetchPlayers();
  }, []);

  // Filtrer les joueurs selon la recherche
  useEffect(() => {
    if (playerSearchTerm.trim() === '') {
      setFilteredPlayers(availablePlayers.filter(player => 
        !selectedPlayers.find(p => p._id === player._id)
      ));
    } else {
      const filtered = availablePlayers.filter(player => 
        !selectedPlayers.find(p => p._id === player._id) &&
        (player.firstName.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
         player.lastName.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
         player.email.toLowerCase().includes(playerSearchTerm.toLowerCase()))
      );
      setFilteredPlayers(filtered);
    }
  }, [playerSearchTerm, availablePlayers, selectedPlayers]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const openPlayerSearch = () => {
    setPlayerSearchOpen(true);
    setPlayerSearchTerm('');
  };

  const closePlayerSearch = () => {
    setPlayerSearchOpen(false);
    setPlayerSearchTerm('');
  };

  const addPlayer = (player: User) => {
    if (!selectedPlayers.find(p => p._id === player._id)) {
      setSelectedPlayers(prev => [...prev, player]);
      closePlayerSearch();
    }
  };

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p._id !== playerId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Préparer les données pour l'API
      const sessionData = {
        title: formData.title,
        description: formData.description,
        date: `${formData.date}T${formData.startTime}:00.000Z`,
        timezone: formData.timezone,
        sessionType: formData.sessionType,
        isOneShot: formData.isOneShot,
        game: formData.gameId,
        dm: user?._id,
        players: selectedPlayers.map(p => p._id),
        maxPlayers: formData.maxPlayers
      };


      // Appel API pour créer la session
      const response = await adminAPI.createSession(sessionData);
      
      if (response.success) {
        
        // Si une image a été sélectionnée, l'uploader
        if (formData.image && response.data?._id) {
          try {
            const imageFormData = new FormData();
            imageFormData.append('image', formData.image);
            
            const imageResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/v1' : 'https://invoke-api.onrender.com/api/v1')}/upload/immediate/session/${response.data._id}/banner`, {
              method: 'POST',
              body: imageFormData,
            });
            
            if (imageResponse.ok) {
            } else {
            }
          } catch (imageError) {
          }
        }
        
        navigate('/sessions');
      } else {
        throw new Error(response.message || 'Failed to create session');
      }
    } catch (error) {
      setError('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !(user.role === 'admin' || user.isDM)) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Session</h1>
          <p className="mt-2 text-gray-300">
            Set up a new gaming session for your players
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Session Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter session title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Session Type
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value as 'online' | 'offline' }))}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">In-Person</option>
                  </select>
                </div>
              </div>

              <Input
                label="Description"
                placeholder="Describe the session, adventure, or campaign"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Max Players
                  </label>
                  <input
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Estimated Duration
                  </label>
                  <select
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {generateTimezones().map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOneShot"
                  checked={formData.isOneShot}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOneShot: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isOneShot" className="text-sm text-white">
                  This is a one-shot session
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Configuration du jeu */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Game Configuration</h2>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Game
                </label>
                <select
                  value={formData.gameId}
                  onChange={(e) => setFormData(prev => ({ ...prev, gameId: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                >
                  <option value="">Choose a game</option>
                  {availableGames.map(game => (
                    <option key={game._id} value={game._id}>
                      {game.name} ({game.system})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Image de la session */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Session Banner</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-300">
                        Click to upload a banner image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Session banner preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={removeImage}
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section joueurs */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Player Management</h2>
              <p className="text-sm text-gray-300">
                Invite players to join your session
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Invited Players ({selectedPlayers.length}/{formData.maxPlayers})
                  </label>
                </div>
                <Button
                  type="button"
                  onClick={openPlayerSearch}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search & Invite Players
                </Button>
              </div>

              {selectedPlayers.length > 0 && (
                <div className="space-y-2">
                  {selectedPlayers.map(player => (
                    <div key={player._id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-3">
                        {player.avatar && (
                          <img
                            src={player.avatar}
                            alt={`${player.firstName} ${player.lastName}`}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="text-white">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removePlayer(player._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Users className="mx-auto h-12 w-12 mb-2" />
                  <p>No players invited yet</p>
                  <p className="text-sm">Click "Search & Invite Players" to start inviting</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => navigate('/sessions')}
              variant="outline"
              className="text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? 'Creating...' : 'Create Session'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Modal de recherche de joueurs */}
      {playerSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Search & Invite Players</h3>
                <Button
                  type="button"
                  onClick={closePlayerSearch}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Search players
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={playerSearchTerm}
                    onChange={(e) => setPlayerSearchTerm(e.target.value)}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 px-3 py-2 pl-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map(player => (
                    <div
                      key={player._id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {player.avatar && (
                          <img
                            src={player.avatar}
                            alt={`${player.firstName} ${player.lastName}`}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{player.email}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => addPlayer(player)}
                        variant="primary"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="mx-auto h-8 w-8 mb-2" />
                    <p>No players found</p>
                    {playerSearchTerm && (
                      <p className="text-sm">Try a different search term</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
