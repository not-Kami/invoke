import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Game, User } from '../../types';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Plus, X, AlertCircle, Calendar } from 'lucide-react';
import { publicAPI, adminAPI } from '../../lib/api';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier les permissions
  useEffect(() => {
    if (user && !(user.role === 'admin' || user.isDM)) {
      navigate('/campaigns');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameId: '',
    maxPlayers: 6,
    isActive: true
  });

  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);

  useEffect(() => {
    // Charger les jeux disponibles depuis l'API
    const fetchGames = async () => {
      try {
        const response = await publicAPI.getGames();
        if (response.success) {
          const data = response;
          setAvailableGames(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        setAvailableGames([]);
      }
    };

    // Charger les joueurs disponibles depuis l'API
    const fetchPlayers = async () => {
      try {
        const response = await adminAPI.getUsers();
        if (response.success) {
          const data = response;
          setAvailablePlayers(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        setAvailablePlayers([]);
      }
    };

    fetchGames();
    fetchPlayers();
  }, []);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPlayer = (player: User) => {
    if (selectedPlayers.length < formData.maxPlayers && !selectedPlayers.find(p => p._id === player._id)) {
      setSelectedPlayers(prev => [...prev, player]);
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
      // Validation
      if (!formData.name || !formData.description || !formData.gameId) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Simuler la création de campagne
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la page des campagnes
      navigate('/campaigns');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur n'a pas les permissions, ne pas afficher la page
  if (user && !(user.role === 'admin' || user.isDM)) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Créer une Campagne</h1>
          <p className="mt-2 text-gray-300">
            Lancez une nouvelle campagne de jeu de rôle épique
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Informations de Base</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de la Campagne *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: La Quête du Dragon Éternel"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Décrivez l'univers, l'histoire, les objectifs de la campagne, le style de jeu, et tout ce qui peut intéresser les joueurs..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Jeu *
                  </label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => handleInputChange('gameId', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez un jeu</option>
                    {availableGames.map(game => (
                      <option key={game._id} value={game._id}>
                        {game.name} ({game.system})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Max de Joueurs
                  </label>
                  <Input
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                    min={2}
                    max={8}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Campagne active (visible pour les joueurs)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Sélection des joueurs */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Sélection des Joueurs</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Joueurs Sélectionnés ({selectedPlayers.length}/{formData.maxPlayers})
                </label>
                <div className="space-y-2">
                  {selectedPlayers.map(player => (
                    <div key={player._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {player.firstName[0]}{player.lastName[0]}
                        </div>
                        <span className="text-white">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePlayer(player._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Joueurs Disponibles
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availablePlayers
                    .filter(player => !selectedPlayers.find(p => p._id === player._id))
                    .map(player => (
                      <button
                        key={player._id}
                        type="button"
                        onClick={() => addPlayer(player)}
                        disabled={selectedPlayers.length >= formData.maxPlayers}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {player.firstName[0]}{player.lastName[0]}
                          </div>
                          <span className="text-white text-sm">
                            {player.firstName} {player.lastName}
                          </span>
                        </div>
                        <Plus className="h-4 w-4 text-purple-400" />
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur la gestion des sessions */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Gestion des Sessions
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Une fois votre campagne créée, vous pourrez organiser des sessions individuelles 
                    au sein de celle-ci. Chaque session peut avoir ses propres objectifs, dates et 
                    participants, tout en maintenant la continuité de l'histoire de la campagne.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages d'erreur */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/campaigns')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? 'Création...' : 'Créer la Campagne'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
