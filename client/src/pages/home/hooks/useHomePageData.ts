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
          setFeaturedSessions(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement sessions:', error);
        // Fallback vers des sessions mockées si l'API échoue
        const mockSessions: Session[] = [
          {
            _id: 'session1',
            title: 'Aventure Épique',
            description: 'Une quête légendaire dans les terres mystérieuses',
            date: '2024-08-20T19:00:00Z',
            sessionType: 'online',
            isOneShot: false,
            game: {
              _id: 'game1',
              name: 'Dungeons & Dragons 5e',
              description: 'Le jeu de rôle fantastique par excellence',
              genre: 'Fantasy',
              system: 'D&D 5e',
              images: { portrait: '/images/dnd5e.jpg' },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            dm: {
              _id: 'dm1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              role: 'user',
              isDM: true,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            players: [],
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: 'session2',
            title: 'Horreur Cosmique',
            description: 'Plongez dans l\'univers de Lovecraft',
            date: '2024-08-22T20:00:00Z',
            sessionType: 'offline',
            isOneShot: true,
            game: {
              _id: 'game2',
              name: 'Call of Cthulhu',
              description: 'Horreur cosmique et mystère',
              genre: 'Horreur',
              system: 'CoC 7e',
              images: { portrait: '/images/callofcthulhu.jpg' },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            dm: {
              _id: 'dm2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              role: 'user',
              isDM: true,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            players: [],
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ];
        setFeaturedSessions(mockSessions);
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
