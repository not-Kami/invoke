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
        setLoading(true);
        setError(null);
        
        // Utiliser l'API backend
        const response = await usersApi.getMasteredGames(user._id);
        
        if (response.success && response.data) {
          const masteredGameIds = response.data;
          
          if (masteredGameIds.length === 0) {
            setMasteredGames([]);
            return;
          }

          // Récupérer les détails des jeux maîtrisés
          const gamesResponse = await publicAPI.getGames();
          
          if (gamesResponse.success && gamesResponse.data) {
            const userMasteredGames = gamesResponse.data.filter((game: any) => 
              masteredGameIds.includes(game._id)
            );
            setMasteredGames(userMasteredGames);
          } else {
            setError('Failed to fetch game details');
            setMasteredGames([]);
          }
        } else {
          setError(response.error || 'Failed to fetch mastered games');
          setMasteredGames([]);
        }
      } catch (err) {
        console.error('Error fetching mastered games:', err);
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
      
      // Ajouter le jeu à la liste locale
      if (!masteredGames.find((g: any) => g._id === game._id)) {
        setMasteredGames([...masteredGames, game]);
      }
      
      // Utiliser l'API backend
      const response = await usersApi.addMasteredGame(user._id, game._id);
      
      if (!response.success) {
        throw new Error('Failed to save mastered game');
      }
      
      console.log('✅ Mastered game added and saved to backend:', game.name);
    } catch (error) {
      console.error('❌ Error adding mastered game:', error);
      // Revenir à l'état précédent en cas d'erreur
      setMasteredGames(masteredGames.filter((g: any) => g._id !== game._id));
      throw error;
    }
  };

  const removeMasteredGame = async (gameId: string) => {
    if (!user || !user.isDM) return;
    
    try {
      console.log('🔄 Removing mastered game:', gameId, 'for DM:', user._id);
      
      // Retirer le jeu de la liste locale
      setMasteredGames(masteredGames.filter((game: any) => game._id !== gameId));
      
      // Utiliser l'API backend
      const response = await usersApi.removeMasteredGame(user._id, gameId);
      
      if (!response.success) {
        throw new Error('Failed to remove mastered game');
      }
      
      console.log('✅ Mastered game removed and saved to backend:', gameId);
    } catch (error) {
      console.error('❌ Error removing mastered game:', error);
      // Revenir à l'état précédent en cas d'erreur
      const removedGame = masteredGames.find((g: any) => g._id === gameId);
      if (removedGame) {
        setMasteredGames([...masteredGames, removedGame]);
      }
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
