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
      console.log('🔐 useFavoriteGames - User state:', user);
      console.log('🔐 useFavoriteGames - User ID:', user?._id);
      
      if (!user) {
        console.log('🔐 useFavoriteGames - No user, skipping fetch');
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching favorite games for user:', user._id);
        console.log('🔐 User object:', user);
        
        // Utiliser la nouvelle route RESTful
        const response = await usersApi.getFavorites(user._id);
        
        if (response.success && response.data) {
          console.log('✅ Favorite games fetched:', response.data);
          setFavoriteGames(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          console.error('❌ Failed to fetch favorite games:', response.error);
          if (response.error === 'Not authorized to access this route') {
            console.log('🔐 User not authenticated, clearing favorites');
            setFavoriteGames([]);
            setError('Please log in to view your favorite games');
          } else {
            setError(response.error || 'Failed to fetch favorite games');
            setFavoriteGames([]);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching favorite games:', err);
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
      console.log('🔄 Adding favorite game:', game.name, 'for user:', user._id);
      
      // Utiliser la nouvelle route RESTful
      const response = await usersApi.addFavorite(user._id, game._id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save favorite game');
      }
      
      // Mettre à jour la liste locale avec la réponse de l'API
      setFavoriteGames(Array.isArray(response.data) ? response.data : [response.data]);
      console.log('✅ Favorite game added and saved to backend:', game.name);
    } catch (error) {
      console.error('❌ Error adding favorite game:', error);
      throw error;
    }
  };

  const removeFavoriteGame = async (gameId: string) => {
    if (!user) return;
    
    try {
      console.log('🔄 Removing favorite game:', gameId, 'for user:', user._id);
      
      // Utiliser la nouvelle route RESTful
      const response = await usersApi.removeFavorite(user._id, gameId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove favorite game');
      }
      
      // Mettre à jour la liste locale avec la réponse de l'API
      setFavoriteGames(Array.isArray(response.data) ? response.data : [response.data]);
      console.log('✅ Favorite game removed and saved to backend:', gameId);
    } catch (error) {
      console.error('❌ Error removing favorite game:', error);
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
