import { useState, useEffect } from 'react';
import { usersApi } from '../lib/api';
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
        
        // Utiliser l'API dédiée pour les jeux maîtrisés
        const response = await usersApi.getMastered(user._id);
        
        if (response.success && response.data) {
          setMasteredGames(response.data);
        } else {
          setError(response.error || 'Failed to fetch mastered games');
          setMasteredGames([]);
        }
      } catch (err) {
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
      // Utiliser l'API dédiée pour ajouter un jeu maîtrisé
      const response = await usersApi.addMastered(user._id, game._id);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save mastered game');
      }
      
      // Mettre à jour la liste locale avec la réponse de l'API
      setMasteredGames(response.data || []);
      
    } catch (error) {
      throw error;
    }
  };

  const removeMasteredGame = async (gameId: string) => {
    if (!user || !user.isDM) return;
    
    try {
      // Utiliser l'API dédiée pour supprimer un jeu maîtrisé
      const response = await usersApi.removeMastered(user._id, gameId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove mastered game');
      }
      
      // Mettre à jour la liste locale avec la réponse de l'API
      setMasteredGames(response.data || []);
      
    } catch (error) {
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
