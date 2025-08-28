import { useState, useEffect } from 'react';
import { Game, Session } from '../../../types';
import { publicAPI } from '../../../lib/api';

export function useHomePageData() {
  // État pour les jeux mis en avant
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  
  // État pour les sessions mises en avant
  const [featuredSessions, setFeaturedSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Récupérer les jeux mis en avant depuis l'API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setGamesLoading(true);
        const response = await publicAPI.getGames();
        if (response.success && response.data) {
          const featured = response.data.filter((game: Game) => game.featured);
          console.log('⭐ Jeux mis en avant:', featured);
          setFeaturedGames(featured);
        }
      } catch (error) {
        console.error('Erreur chargement jeux:', error);
      } finally {
        setGamesLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  // Récupérer les sessions mises en avant depuis l'API
  useEffect(() => {
    const fetchFeaturedSessions = async () => {
      try {
        setSessionsLoading(true);
        const response = await publicAPI.getFeaturedSessions();
        if (response.success && response.data) {
          console.log('⭐ Sessions mises en avant:', response.data);
          setFeaturedSessions(response.data);
        }
      } catch (error) {
        console.error('Erreur chargement sessions:', error);
        setFeaturedSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchFeaturedSessions();
  }, []);

  return {
    featuredGames,
    gamesLoading,
    featuredSessions,
    sessionsLoading
  };
}
