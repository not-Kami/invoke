import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Game, User } from '../../types';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Calendar, Users, Gamepad2, Plus, X, AlertCircle } from 'lucide-react';

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
    time: '',
    sessionType: 'online' as 'online' | 'offline',
    isOneShot: false,
    gameId: '',
    maxPlayers: 6
  });

  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<User[]>([]);

  useEffect(() => {
    // Charger les jeux disponibles
    const fetchGames = async () => {
      try {
        // Simuler l'API - à remplacer par un vrai appel
        const mockGames: Game[] = [
          {
            _id: '1',
            name: 'Dungeons & Dragons 5e',
            description: 'Le jeu de rôle fantastique par excellence',
            genre: 'Fantasy',
            system: 'D&D 5e',
            image: '/images/dnd5e.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Pathfinder 2e',
            description: 'Un système de jeu de rôle tactique et flexible',
            genre: 'Fantasy',
            system: 'Pathfinder 2e',
            image: '/images/pathfinder2e.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setAvailableGames(mockGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    // Charger les joueurs disponibles
    const fetchPlayers = async () => {
      try {
        // Simuler l'API - à remplacer par un vrai appel
        const mockPlayers: User[] = [
          {
            _id: '1',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            role: 'user',
            isDM: false,
            avatar: '/avatars/alice.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob@example.com',
            role: 'user',
            isDM: false,
            avatar: '/avatars/bob.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setAvailablePlayers(mockPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
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
      if (!formData.title || !formData.description || !formData.date || !formData.gameId) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (new Date(formData.date + 'T' + formData.time) < new Date()) {
        throw new Error('La date et l\'heure de la session ne peuvent pas être dans le passé');
      }

      // Simuler la création de session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la page des sessions
      navigate('/sessions');
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
          <h1 className="text-3xl font-bold text-white">Créer une Session</h1>
          <p className="mt-2 text-gray-300">
            Organisez une nouvelle session de jeu de rôle
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
                  Titre de la Session *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Première aventure dans la Forêt des Ombres"
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
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Décrivez le scénario, les objectifs et le style de jeu..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heure *
                  </label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration du jeu */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Configuration du Jeu</h2>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type de Session
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={(e) => handleInputChange('sessionType', e.target.value as 'online' | 'offline')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="online">En ligne</option>
                    <option value="offline">En personne</option>
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
                    max={10}
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isOneShot}
                      onChange={(e) => handleInputChange('isOneShot', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Session One-shot</span>
                  </label>
                </div>
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
              onClick={() => navigate('/sessions')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? 'Création...' : 'Créer la Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
