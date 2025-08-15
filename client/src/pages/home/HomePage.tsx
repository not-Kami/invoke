import React from 'react';
import { useFavoriteGames } from '../../hooks/useFavoriteGames';
import { useAuth } from '../../contexts/AuthContext';
import { useHomePageData } from './hooks/useHomePageData';

// Sections
import { HeroSection, FeaturedGamesSection, FeaturedSessionsSection } from './sections';

export default function HomePage() {
  const { user } = useAuth();
  const { favoriteGames, addFavoriteGame, removeFavoriteGame, isFavorite } = useFavoriteGames();
  const { featuredGames, gamesLoading, featuredSessions, sessionsLoading } = useHomePageData();

  // Fonction pour gérer l'ajout/suppression des favoris
  const handleToggleFavorite = async (game: any) => {
    if (!user) {
      console.log('Utilisateur non connecté');
      return;
    }

    try {
      if (isFavorite(game._id)) {
        await removeFavoriteGame(game._id);
      } else {
        await addFavoriteGame(game);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Section Jeux Mis en Avant */}
      <FeaturedGamesSection
        featuredGames={featuredGames}
        loading={gamesLoading}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      {/* Sessions Mises en Avant */}
      <FeaturedSessionsSection
        featuredSessions={featuredSessions}
        loading={sessionsLoading}
      />
    </div>
  );
}