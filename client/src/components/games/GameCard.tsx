import React, { forwardRef } from 'react';
import { Game, getGameImageUrl } from '../../lib/api';
import { Heart, Crown } from 'lucide-react';

interface GameCardProps {
  game: Game;
  isFavorite?: boolean;
  isMastered?: boolean;
  onToggleFavorite?: (game: Game) => void;
  onToggleMastered?: (game: Game) => void;
  onClick?: (game: Game) => void;
  showFavoriteButton?: boolean;
  showMasteredButton?: boolean;
  className?: string;
}

const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  ({ 
    game, 
    isFavorite = false, 
    isMastered = false,
    onToggleFavorite, 
    onToggleMastered,
    onClick,
    showFavoriteButton = true,
    showMasteredButton = false,
    className = "" 
  }, ref) => {
    // Calculer les URLs des images dynamiquement
    const portraitUrl = getGameImageUrl(game._id, 'portrait', game.images?.portrait);
    const logoUrl = getGameImageUrl(game._id, 'logo', game.images?.logo);

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onToggleFavorite) {
        onToggleFavorite(game);
      }
    };

    const handleMasteredClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onToggleMastered) {
        onToggleMastered(game);
      }
    };

    const handleCardClick = () => {
      console.log('GameCard clicked:', game._id, game.name);
      if (onClick) {
        onClick(game);
      }
    };

    return (
      <div 
        ref={ref}
        className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group cursor-pointer rounded-lg shadow-lg ${className}`}
        onClick={handleCardClick}
      >
        {/* Image de fond - Portrait du jeu */}
        <div className="absolute inset-0 w-full h-full">
          {/* Image portrait du jeu (avec fallback automatique) */}
          <img
            src={portraitUrl}
            alt={`Portrait ${game.name}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Gradient overlay transparent -> opaque de haut en bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Logo du jeu en premier plan (haut de la carte) */}
        <div className="absolute top-4 left-4 z-20">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={logoUrl}
              alt={`Logo ${game.name}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Boutons d'action en haut à droite */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
              />
            </button>
          )}
          {showMasteredButton && onToggleMastered && (
            <button
              onClick={handleMasteredClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
            >
              <Crown 
                className={`h-4 w-4 ${isMastered ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} 
              />
            </button>
          )}
        </div>

        {/* Contenu en bas de la carte */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-display text-xl font-bold text-white mb-2">{game.name}</h3>
          <p className="text-gray-200 text-sm mb-3 line-clamp-2">{game.description}</p>
          
          {/* Métadonnées compactes */}
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {game.genre}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {game.system}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

GameCard.displayName = 'GameCard';

export default GameCard;