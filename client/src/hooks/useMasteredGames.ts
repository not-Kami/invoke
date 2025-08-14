import { useState, useEffect } from 'react';
import { publicAPI, usersApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useMasteredGames() {
  const { user } = useAuth();
  const [masteredGames, setMasteredGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasteredGames = async () => {
      if (!user || !user.isDM) {
        setMasteredGames([]);
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Fetching mastered games for user:', user._id);
        setLoading(true);
        setError(null);
        
        // Utiliser l'API backend
        const response = await usersApi.getMastered(user._id);
        console.log('📡 getMastered API response:', response);
        
        if (response.success && response.data) {
          // response.data devrait être un tableau de jeux avec tous les détails
          // car le backend utilise .populate('mastered_games')
          console.log('✅ Mastered games loaded:', response.data.length);
          setMasteredGames(response.data);
        } else {
          console.error('❌ Failed to fetch mastered games:', response);
          setError(response.error || 'Failed to fetch mastered games');
          setMasteredGames([]);
        }
      } catch (err) {
        console.error('❌ Error fetching mastered games:', err);
        setError('Failed to fetch mastered games');
        setMasteredGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMasteredGames();
  }, [user]);

  const addMasteredGame = async (game: any) => {
    if (!user || !user.isDM) return;
    
    try {
      console.log('🔄 Adding mastered game:', game.name, 'for DM:', user._id);
      
      // Utiliser l'API backend d'abord
      const response = await usersApi.addMastered(user._id, game._id);
      
      if (!response.success) {
        throw new Error('Failed to save mastered game');
      }
      
      console.log('✅ Mastered game added to backend, refreshing list...');
      
      // Rafraîchir la liste complète depuis le backend
      const refreshResponse = await usersApi.getMastered(user._id);
      if (refreshResponse.success && refreshResponse.data) {
        setMasteredGames(refreshResponse.data);
        console.log('✅ List refreshed, total mastered games:', refreshResponse.data.length);
      }
      
    } catch (error) {
      console.error('❌ Error adding mastered game:', error);
      throw error;
    }
  };

  const removeMasteredGame = async (gameId: string) => {
    if (!user || !user.isDM) return;
    
    try {
      console.log('🔄 Removing mastered game:', gameId, 'for DM:', user._id);
      
      // Utiliser l'API backend d'abord
      const response = await usersApi.removeMastered(user._id, gameId);
      
      if (!response.success) {
        throw new Error('Failed to remove mastered game');
      }
      
      console.log('✅ Mastered game removed from backend, refreshing list...');
      
      // Rafraîchir la liste complète depuis le backend
      const refreshResponse = await usersApi.getMastered(user._id);
      if (refreshResponse.success && refreshResponse.data) {
        setMasteredGames(refreshResponse.data);
        console.log('✅ List refreshed, total mastered games:', refreshResponse.data.length);
      }
      
    } catch (error) {
      console.error('❌ Error removing mastered game:', error);
      throw error;
    }
  };

  const toggleMasteredGame = (game: any) => {
    const isMastered = masteredGames.find((g: any) => g._id === game._id);
    if (isMastered) {
      removeMasteredGame(game._id);
    } else {
      addMasteredGame(game);
    }
  };

  return {
    masteredGames,
    loading,
    error,
    addMasteredGame,
    removeMasteredGame,
    toggleMasteredGame,
    isMastered: (gameId: string) => masteredGames.find((g: any) => g._id === gameId) !== undefined
  };
}
