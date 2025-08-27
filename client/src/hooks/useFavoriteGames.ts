import { useState, useEffect } from 'react';
import { usersApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useFavoriteGames() {
  const { user } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      if (!user) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Utiliser la nouvelle route RESTful
        const response = await usersApi.getFavorites(user._id);
        
        if (response.success && response.data) {
          setFavoriteGames(response.data);
        } else {
          console.error('Failed to fetch favorite games:', response.error);
          setError(response.error || 'Failed to fetch favorite games');
          setFavoriteGames([]);
        }
      } catch (err) {
        console.error('Error fetching favorite games:', err);
        setError('Failed to fetch favorite games');
        setFavoriteGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteGames();
  }, [user]);

  const addFavoriteGame = async (game: any) => {
    if (!user) return;
    
    try {
      // Utiliser la nouvelle route RESTful
      const response = await usersApi.addFavorite(user._id, game._id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save favorite game');
      }
      
      // Mettre à jour la liste locale
      if (response.data && Array.isArray(response.data)) {
        setFavoriteGames(response.data);
      }
    } catch (error) {
      console.error('Error adding favorite game:', error);
      throw error;
    }
  };

  const removeFavoriteGame = async (gameId: string) => {
    if (!user) return;
    
    try {
      // Utiliser la nouvelle route RESTful
      const response = await usersApi.removeFavorite(user._id, gameId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove favorite game');
      }
      
      // Mettre à jour la liste locale
      if (response.data && Array.isArray(response.data)) {
        setFavoriteGames(response.data);
      }
    } catch (error) {
      console.error('Error removing favorite game:', error);
      throw error;
    }
  };

  const toggleFavoriteGame = (game: any) => {
    const isFavorite = favoriteGames.find((g: any) => g._id === game._id);
    if (isFavorite) {
      removeFavoriteGame(game._id);
    } else {
      addFavoriteGame(game);
    }
  };

  return {
    favoriteGames,
    loading,
    error,
    addFavoriteGame,
    removeFavoriteGame,
    toggleFavoriteGame,
    isFavorite: (gameId: string) => favoriteGames.find((g: any) => g._id === gameId) !== undefined
  };
}
