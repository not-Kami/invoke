import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';
import GameCard from '../components/GameCard';
import { Game } from '../../../types';

interface FeaturedGamesSectionProps {
  featuredGames: Game[];
  loading: boolean;
  onToggleFavorite: (game: Game) => void;
  isFavorite: (gameId: string) => boolean;
}

export default function FeaturedGamesSection({ 
  featuredGames, 
  loading, 
  onToggleFavorite, 
  isFavorite 
}: FeaturedGamesSectionProps) {
  const navigate = useNavigate();
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Recalculer le centrage quand la taille change
  useEffect(() => {
    const handleResize = () => {
      setCurrentGameIndex(prev => prev);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour aller au jeu suivant
  const nextGame = () => {
    setCurrentGameIndex((prev) => 
      prev === featuredGames.length - 1 ? 0 : prev + 1
    );
  };

  // Fonction pour aller au jeu précédent
  const prevGame = () => {
    setCurrentGameIndex((prev) => 
      prev === 0 ? featuredGames.length - 1 : prev - 1
    );
  };

  // Fonction pour aller directement à une carte spécifique
  const goToGame = (index: number) => {
    setCurrentGameIndex(index);
  };

  // Calcul simple du centrage
  const getSliderTransform = () => {
    const cardWidth = isMobile ? 240 : 320; // w-60 = 240px, w-80 = 320px
    const gap = isMobile ? 8 : 16;
    const totalWidth = cardWidth + gap;
    
    // Centrer la carte active
    const centerOffset = (window.innerWidth - cardWidth) / 2;
    return -currentGameIndex * totalWidth + centerOffset;
  };

  // Fonctions pour le drag & drop simple
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(currentGameIndex * (isMobile ? 240 : 320));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const cardWidth = isMobile ? 240 : 320;
    const newIndex = Math.round((-walk + scrollLeft) / cardWidth);
    
    // Limiter aux bornes du slider
    const clampedIndex = Math.max(0, Math.min(featuredGames.length - 1, newIndex));
    setCurrentGameIndex(clampedIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Support tactile pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(currentGameIndex * (isMobile ? 240 : 320));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const cardWidth = isMobile ? 240 : 320;
    const newIndex = Math.round((-walk + scrollLeft) / cardWidth);
    
    // Limiter aux bornes du slider
    const clampedIndex = Math.max(0, Math.min(featuredGames.length - 1, newIndex));
    setCurrentGameIndex(clampedIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Fonction pour naviguer vers la page Games avec le jeu sélectionné
  const handleGameClick = (game: Game) => {
    navigate(`/games?game=${game._id}`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Jeux Mis en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Découvrez notre sélection de jeux recommandés</p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement des jeux...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredGames.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Jeux Mis en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Découvrez notre sélection de jeux recommandés</p>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun jeu mis en avant</h3>
            <p className="text-slate-400">Les administrateurs peuvent mettre en avant des jeux depuis le panneau d'administration.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h2 className="font-display text-3xl font-bold text-white">Jeux Mis en Avant</h2>
          </div>
          <p className="text-gray-300 text-lg">Découvrez notre sélection de jeux recommandés</p>
        </div>
        
        {/* Slider des jeux mis en avant */}
        <div className="relative group w-full">
          {/* Boutons de navigation */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevGame}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={nextGame}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Container du slider */}
          <div 
            ref={containerRef}
            className="overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${getSliderTransform()}px)` }}
            >
              {featuredGames.map((game, index) => (
                <div 
                  key={game._id} 
                  className={`flex-shrink-0 ${isMobile ? 'w-60 mx-1' : 'w-80 mx-2'}`}
                >
                  <GameCard
                    game={game}
                    isFavorite={isFavorite(game._id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={handleGameClick}
                    className="h-96"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs de navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredGames.map((_, index) => (
              <button
                key={index}
                onClick={() => goToGame(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentGameIndex 
                    ? 'bg-purple-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bouton Voir tous les jeux */}
        <div className="text-center mt-8">
          <Link to="/games">
            <button className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
              Voir tous les jeux
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
