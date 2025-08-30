
import { Heart } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Game } from '../../../types';

interface GameCardProps {
  game: Game;
  isFavorite?: boolean;
  onToggleFavorite?: (game: Game) => void;
  onClick?: (game: Game) => void;
  showFavoriteButton?: boolean;
  className?: string;
}

export default function GameCard({ 
  game, 
  isFavorite = false, 
  onToggleFavorite, 
  onClick,
  showFavoriteButton = true,
  className = ""
}: GameCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  return (
    <Card 
      className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* Image de fond - Portrait du jeu */}
      <div className="absolute inset-0 w-full h-full">
        {/* Fallback vers le gradient si pas d'images */}
        <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
            <div className="text-white text-2xl font-bold">🎲</div>
          </div>
        </div>
        
        {/* Image portrait du jeu si disponible */}
        {game.images?.portrait ? (
          <img 
            src={game.images.portrait} 
            alt={`Portrait ${game.name}`}
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={() => console.log('✅ Image portrait chargée pour', game.name, ':', game.images.portrait)}
            onError={(e) => console.error('❌ Erreur chargement image pour', game.name, ':', e)}
          />
        ) : null}
        
        {/* Gradient overlay transparent -> opaque de haut en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Bouton favori en haut à droite */}
      {showFavoriteButton && onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </button>
      )}

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
    </Card>
  );
}
