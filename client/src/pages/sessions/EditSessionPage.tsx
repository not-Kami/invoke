import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI, publicAPI } from '../../lib/api';
import { Game, User } from '../../types';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Users, Plus, X, AlertCircle, ArrowLeft } from 'lucide-react';

// Options de durée prédéfinies (tranches de 30 minutes jusqu'à 12h)
const durationOptions = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' },
  { value: 210, label: '3.5 hours' },
  { value: 240, label: '4 hours' },
  { value: 270, label: '4.5 hours' },
  { value: 300, label: '5 hours' },
  { value: 330, label: '5.5 hours' },
  { value: 360, label: '6 hours' },
  { value: 390, label: '6.5 hours' },
  { value: 420, label: '7 hours' },
  { value: 450, label: '7.5 hours' },
  { value: 480, label: '8 hours' },
  { value: 510, label: '8.5 hours' },
  { value: 540, label: '9 hours' },
  { value: 570, label: '9.5 hours' },
  { value: 600, label: '10 hours' },
  { value: 630, label: '10.5 hours' },
  { value: 660, label: '11 hours' },
  { value: 690, label: '11.5 hours' },
  { value: 720, label: '12 hours' }
];

export default function EditSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

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
    maxPlayers: 6
  });

  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  
  // États pour la recherche de joueurs
  const [playerSearchOpen, setPlayerSearchOpen] = useState(false);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<User[]>([]);

  // Vérifier les permissions et charger la session
  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  const fetchSession = async () => {
    try {
      setFetching(true);
      
      const response = await adminAPI.getSession(id!);
      
      if (response.success && response.data) {
        const session = response.data;
        
        // Vérifier que l'utilisateur est le DM de cette session
        // session.dm peut être un objet populé ou juste l'ID
        const dmId = typeof session.dm === 'object' ? session.dm._id : session.dm;
        if (dmId !== user?._id) {
          setError('You can only edit sessions you created');
          return;
        }

        // Remplir le formulaire avec les données existantes
        setFormData({
          title: session.title,
          description: session.description,
          date: new Date(session.date).toISOString().split('T')[0],
          startTime: new Date(session.date).toTimeString().slice(0, 5),
          estimatedDuration: (session as any).estimatedDuration || 120,
          timezone: session.timezone || 'UTC',
          sessionType: session.sessionType,
          isOneShot: session.isOneShot,
          gameId: typeof session.game === 'string' ? session.game : session.game._id,
          maxPlayers: session.maxPlayers
        });

        // Charger les joueurs existants
        if (session.players && session.players.length > 0) {
          const playersResponse = await publicAPI.getUsersForInvite();
          if (playersResponse.success && playersResponse.data) {
            const existingPlayers = playersResponse.data.filter(player => 
              session.players.some(sessionPlayer => 
                typeof sessionPlayer === 'string' ? sessionPlayer === player._id : sessionPlayer._id === player._id
              )
            );
            setSelectedPlayers(existingPlayers);
          }
        } else {
          setSelectedPlayers([]);
        }

        // Charger l'image si elle existe
        if (session.image) {
          setImagePreview(session.image);
        }
      } else {
        setError(response.message || 'Failed to fetch session');
      }
    } catch (error) {
      setError('An error occurred while fetching the session');
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!id) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/v1/upload/immediate/session/${id}/banner`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setImagePreview(result.data.secure_url);
        }
      } else {
      }
    } catch (error) {
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Optionnel: supprimer l'image du serveur
  };

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


  useEffect(() => {
    // Load available games from API
    const fetchGames = async () => {
      try {
        const response = await adminAPI.getGames();
        if (response.success && response.data) {
          setAvailableGames(response.data);
        }
      } catch (error) {
      }
    };

    fetchGames();
  }, []);

  // Gérer la recherche de joueurs
  useEffect(() => {
    if (!availablePlayers || availablePlayers.length === 0) {
      setFilteredPlayers([]);
      return;
    }
    
    if (playerSearchTerm.trim() === '') {
      setFilteredPlayers(availablePlayers);
    } else {
      const filtered = availablePlayers.filter(player =>
        player.firstName.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
        player.lastName.toLowerCase().includes(playerSearchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(playerSearchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [playerSearchTerm, availablePlayers]);

  const openPlayerSearch = async () => {
    try {
      // Charger les joueurs seulement quand on ouvre le modal
      const response = await adminAPI.getPlayersForInvitation();
      if (response.success && response.data) {
        setAvailablePlayers(response.data);
        setFilteredPlayers(response.data);
      } else {
        // Fallback : utiliser seulement les joueurs déjà invités
        setAvailablePlayers(selectedPlayers);
        setFilteredPlayers(selectedPlayers);
      }
    } catch (error) {
      // Fallback : utiliser seulement les joueurs déjà invités
      setAvailablePlayers(selectedPlayers);
      setFilteredPlayers(selectedPlayers);
    }
    
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
    }
    closePlayerSearch();
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
      const sessionData: any = {
        title: formData.title,
        description: formData.description,
        date: `${formData.date}T${formData.startTime}:00.000Z`,
        timezone: formData.timezone,
        sessionType: formData.sessionType,
        isOneShot: formData.isOneShot,
        game: formData.gameId,
        maxPlayers: formData.maxPlayers,
        estimatedDuration: formData.estimatedDuration
      };
      
      // Ne modifier les joueurs que si on a des joueurs sélectionnés
      if (selectedPlayers.length > 0) {
        sessionData.players = selectedPlayers.map(p => p._id);
      }


      // Appel API pour mettre à jour la session
      const response = await adminAPI.updateSession(id!, sessionData);
      
      if (response.success) {
        
        navigate(`/sessions/${id}`);
      } else {
        throw new Error(response.message || 'Failed to update session');
      }
    } catch (error) {
      setError('Failed to update session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-white">Error</h2>
            <p className="mt-2 text-gray-300">{error}</p>
            <Button
              onClick={() => navigate(`/sessions/${id}`)}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(`/sessions/${id}`)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Session
          </Button>
          
          <h1 className="text-3xl font-bold text-white">Edit Session</h1>
          <p className="mt-2 text-gray-300">
            Modify your gaming session settings
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

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your session..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>

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
                      disabled={uploadingImage}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-white text-sm">
                          {uploadingImage ? 'Uploading...' : 'Click to upload banner image'}
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Session banner preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
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

          {/* Gestion des joueurs */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Player Management</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Session Players ({selectedPlayers.length}/{formData.maxPlayers})
                  </h3>
                  <p className="text-sm text-gray-300">
                    Manage who can join your session
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={openPlayerSearch}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:text-white hover:bg-green-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              </div>

              {selectedPlayers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-300">Current Players ({selectedPlayers.length})</h4>
                    <span className="text-xs text-gray-500">Click X to remove player</span>
                  </div>
                  {selectedPlayers.map(player => (
                    <div key={player._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {player.firstName[0]}{player.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{player.email}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removePlayer(player._id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-600 hover:text-white hover:bg-red-600 hover:border-red-500 transition-colors"
                        title="Remove player from session"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedPlayers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No players invited yet</p>
                  <p className="text-sm text-gray-500">Click "Add Player" to invite someone</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={() => navigate(`/sessions/${id}`)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {loading ? 'Updating...' : 'Update Session'}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de recherche de joueurs */}
      {playerSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Player</h3>
              <Button
                onClick={closePlayerSearch}
                variant="outline"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search players..."
                value={playerSearchTerm}
                onChange={(e) => setPlayerSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredPlayers
                .filter(player => !selectedPlayers.find(p => p._id === player._id))
                .map(player => (
                  <div
                    key={player._id}
                    onClick={() => addPlayer(player)}
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {player.firstName[0]}{player.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {player.firstName} {player.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{player.email}</p>
                    </div>
                  </div>
                ))}
            </div>
            
            {availablePlayers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400">Unable to load players</p>
                <p className="text-sm text-gray-500">You can only manage currently invited players</p>
              </div>
            ) : filteredPlayers.filter(player => !selectedPlayers.find(p => p._id === player._id)).length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400">No available players found</p>
                <p className="text-sm text-gray-500">All players are already invited</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
