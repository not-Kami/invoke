import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';
import { Game } from '../../../lib/api';
import GameCard from '../../../components/games/GameCard';

interface FeaturedGamesSectionProps {
  featuredGames: Game[];
  loading: boolean;
}

export default function FeaturedGamesSection({ 
  featuredGames, 
  loading
}: FeaturedGamesSectionProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const totalGames = featuredGames.length;
  const [isMobile, setIsMobile] = useState(false);
  
  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const visibleCards = isMobile ? 1 : 4; // 1 carte sur mobile, 4 sur desktop

  // Fonction pour aller à la carte suivante
  const nextCard = () => {
    if (totalGames <= 1) return;
    
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      
      // Si on dépasse la fin, on revient au début
      if (newIndex >= totalGames) {
        return 0;
      }
      return newIndex;
    });
  };

  // Fonction pour aller à la carte précédente
  const prevCard = () => {
    if (totalGames <= 1) return;
    
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      
      // Si on va en négatif, on va à la fin
      if (newIndex < 0) {
        return totalGames - 1;
      }
      return newIndex;
    });
  };

  // Fonction pour naviguer vers la page détaillée du jeu
  const handleGameClick = (game: Game) => {
    navigate(`/game/${game._id}`);
  };

  // Gestion des événements tactiles pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(0); // Reset touchEnd
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }
    
    // Reset pour éviter les conflits
    setTouchStart(0);
    setTouchEnd(0);
  };


  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Featured Games</h2>
            </div>
            <p className="text-gray-300 text-lg">Discover our selection of recommended games</p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading games...</span>
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
              <h2 className="font-display text-3xl font-bold text-white">Featured Games</h2>
            </div>
            <p className="text-gray-300 text-lg">Discover our selection of recommended games</p>
          </div>
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No featured games</h3>
            <p className="text-slate-400">Administrators can feature games from the admin panel.</p>
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
            <h2 className="font-display text-3xl font-bold text-white">Featured Games</h2>
          </div>
          <p className="text-gray-300 text-lg">Discover our selection of recommended games</p>
        </div>
        
        {/* Featured games carousel */}
        <div className="w-full">
          {/* Games carousel - responsive avec transition de translation */}
          <div 
            className="relative mb-6 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: isMobile 
                  ? `translateX(-${currentIndex * 100}%)` 
                  : `translateX(-${currentIndex * (100 / visibleCards)}%)`
              }}
            >
              {featuredGames.map((game, index) => (
                <div 
                  key={`${game._id}-${index}`}
                  className={`flex-shrink-0 ${isMobile ? 'w-full flex justify-center px-4' : 'w-1/4'}`}
                >
                  <div className={`${isMobile ? 'w-full max-w-sm' : 'w-full'}`}>
                    <GameCard
                      game={game}
                      onClick={() => handleGameClick(game)}
                      className="h-80 w-full transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - sous le slider */}
          {totalGames > 1 && (
            <div className="flex justify-center items-center space-x-4 mb-8">
              <button
                onClick={prevCard}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextCard}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {/* View all games button */}
        <div className="text-center mt-8">
          <Link to="/games">
            <button className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
              View all games
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
