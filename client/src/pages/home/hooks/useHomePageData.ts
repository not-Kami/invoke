import { useState, useEffect } from 'react';
import { Game, Session } from '../../../types';

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
        const response = await fetch('/api/v1/games');
        if (response.ok) {
          const data = await response.json();
          const featured = data.data.filter((game: Game) => game.featured);
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
        const response = await fetch('/api/v1/sessions?featured=true&limit=6');
        if (response.ok) {
          const data = await response.json();
          console.log('⭐ Sessions mises en avant:', data.data);
          setFeaturedSessions(data.data);
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
