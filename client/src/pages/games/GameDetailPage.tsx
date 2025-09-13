import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Star, Gamepad2, Sparkles } from 'lucide-react';
import { publicAPI, Game, Session, usersApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useFavoriteGames } from '../../hooks/useFavoriteGames';
import SessionCard from '../../components/sessions/SessionCard';

interface GameDetailPageProps {}

export default function GameDetailPage({}: GameDetailPageProps) {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hook pour gérer les favoris
  const { favoriteGames, addFavoriteGame, removeFavoriteGame, isFavorite } = useFavoriteGames();

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;
      
      try {
        setLoading(true);
        const [gameResponse, sessionsResponse] = await Promise.all([
          publicAPI.getGame(gameId),
          publicAPI.getGameSessions(gameId)
        ]);
        
        setGame(gameResponse.data);
        // L'API retourne { success: true, data: [], ... }
        setSessions(sessionsResponse.data || []);
      } catch (err) {
        setError('Error loading game');
        console.error('Error fetching game:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  // Fonction pour gérer l'ajout/suppression des favoris
  const handleToggleFavorite = async () => {
    if (!game || !user) return;
    
    try {
      if (isFavorite(game._id)) {
        await removeFavoriteGame(game._id);
      } else {
        await addFavoriteGame(game);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading game...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Game not found</h1>
            <p className="text-slate-400 mb-6">The game you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/games')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header avec bannière */}
      <div className="relative">
        {/* Bannière du jeu */}
        <div className="h-64 md:h-80 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          {game.images?.banner && (
            <img
              src={game.images.banner}
              alt={`Banner ${game.name}`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Bouton retour */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Informations du jeu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Détails du jeu */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-6">
                {game.images?.logo && (
                  <img
                    src={game.images.logo}
                    alt={`Logo ${game.name}`}
                    className="h-20 w-20 object-contain rounded-lg shadow-xl mr-4"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {game.name}
                  </h2>
                </div>
              </div>
              
              <div className="space-y-4">
                {game.description && (
                  <p className="text-gray-300 leading-relaxed">
                    {game.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {game.genre && (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Genre:</span>
                      <span className="text-white font-medium">{game.genre}</span>
                    </div>
                  )}
                  
                  {game.players && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Players:</span>
                      <span className="text-white font-medium">{game.players}</span>
                    </div>
                  )}
                  
                  {game.duration && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Duration:</span>
                      <span className="text-white font-medium">{game.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Boutons d'action */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                {user ? (
                  <button 
                    onClick={handleToggleFavorite}
                    className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                      game && isFavorite(game._id)
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Star className={`h-4 w-4 mr-2 ${game && isFavorite(game._id) ? 'fill-current' : ''}`} />
                    {game && isFavorite(game._id) ? 'Remove from favorites' : 'Add to favorites'}
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center opacity-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Login to add favorites
                  </button>
                )}
                
                <button className="w-full bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center opacity-50">
                  <Users className="h-4 w-4 mr-2" />
                  Find Players (Coming Soon)
                </button>
                
                <button className="w-full bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center opacity-50">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Table (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions et campagnes */}
        <div className="space-y-8">
          {/* Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-purple-400" />
              Available sessions
            </h2>
            
            {!sessions || sessions.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No sessions</h3>
                <p className="text-gray-400">There are no sessions scheduled for this game yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions && sessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    onClick={(session) => navigate(`/sessions/${session._id}`)}
                    className="h-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Campagnes */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-purple-400" />
              Campaigns
            </h2>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No campaigns</h3>
              <p className="text-gray-400">Campaigns for this game will be available soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
