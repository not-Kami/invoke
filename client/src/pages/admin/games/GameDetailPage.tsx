import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Star, Trash2 } from 'lucide-react';
import { adminAPI, Game as GameType } from '../../../lib/api';
import { useSimpleNotifications } from '../../../hooks/useSimpleNotifications';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useSimpleNotifications();
  const [game, setGame] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await adminAPI.getGame(id);
        
        if (response.success && response.data) {
          setGame(response.data);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        setError('Failed to load game');
        console.error('Error fetching game:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleDeleteGame = async () => {
    if (!game || !window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      const response = await adminAPI.deleteGame(game._id);
      
      if (response.success) {
        addNotification({ type: 'success', title: 'Succès', message: 'Game deleted successfully' });
        navigate('/admin');
      } else {
        addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete game' });
      }
    } catch (err) {
      addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete game' });
      console.error('Error deleting game:', err);
    }
  };

  const handleToggleFeatured = async () => {
    if (!game) return;
    
    try {
      const response = await adminAPI.updateGameFeatured(game._id, !game.featured);
      
      if (response.success) {
        setGame({ ...game, featured: !game.featured });
        addNotification({ type: 'success', title: 'Succès', message: `Game ${game.featured ? 'removed from' : 'added to'} featured` });
      } else {
        addNotification({ type: 'error', title: 'Erreur', message: 'Failed to update featured status' });
      }
    } catch (err) {
      addNotification({ type: 'error', title: 'Erreur', message: 'Failed to update featured status' });
      console.error('Error updating featured status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <Gamepad2 className="h-12 w-12 mx-auto mb-2" />
          <p className="text-xl font-semibold">Game not found</p>
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
            <h1 className="text-2xl font-bold text-white">Game Details</h1>
            <p className="text-gray-400">Manage game information and settings</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleFeatured}
            className={`px-4 py-2 rounded-lg transition-colors ${
              game.featured 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <Star className="h-4 w-4 mr-2 inline" />
            {game.featured ? 'Remove from Featured' : 'Add to Featured'}
          </button>
          <button
            onClick={handleDeleteGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete Game
          </button>
        </div>
      </div>

      {/* Game Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Gamepad2 className="h-5 w-5 mr-2" />
              Game Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium text-lg">{game.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Publisher</label>
                <p className="text-white font-medium">{game.publisher}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-gray-300">{game.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Players</label>
                  <p className="text-white font-medium">{game.players || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Duration</label>
                  <p className="text-white font-medium">{game.duration || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Genre</label>
                  <p className="text-white font-medium">{game.genre || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Complexity</label>
                  <p className="text-white font-medium">{game.complexity || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          {(game.images?.banner || game.images?.logo) && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Images</h2>
              <div className="space-y-4">
                {game.images.banner && (
                  <div>
                    <label className="text-sm text-gray-400">Banner</label>
                    <div className="mt-2">
                      <img
                        src={game.images.banner}
                        alt={`${game.name} banner`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
                {game.images.logo && (
                  <div>
                    <label className="text-sm text-gray-400">Logo</label>
                    <div className="mt-2">
                      <img
                        src={game.images.logo}
                        alt={`${game.name} logo`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Logo */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
              {game.images?.logo ? (
                <img
                  src={game.images.logo}
                  alt={game.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <Gamepad2 className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{game.name}</h3>
            <p className="text-gray-400">{game.publisher}</p>
          </div>

          {/* Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Featured</span>
                <span className={`${game.featured ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {game.featured ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active</span>
                <span className="text-green-400">Yes</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {new Date(game.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {new Date(game.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sessions</span>
                <span className="text-white">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Campaigns</span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
