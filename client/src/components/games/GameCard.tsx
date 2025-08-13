import React from 'react';
import { Gamepad2, Star, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 hover:border-primary-500/50"
      onClick={onClick}
    >
              <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            {/* Logo du jeu ou icône par défaut */}
            <div className="w-16 h-16 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
              {game.images?.logo ? (
                <img 
                  src={game.images.logo} 
                  alt={`Logo ${game.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Badge featured */}
            {game.feature && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-xs text-yellow-400 font-medium">Vedette</span>
              </div>
            )}
          </div>

        {/* Titre et badges */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white leading-tight">
            {game.name}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="info" className="flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>{game.genre}</span>
            </Badge>
            <Badge variant="default" className="flex items-center space-x-1">
              <Gamepad2 className="h-3 w-3" />
              <span>{game.system}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {game.description}
        </p>
        
        {/* Footer avec date */}
        <div className="pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Ajouté {formatDate(game.createdAt)}</span>
            </div>
            
            {/* Actions rapides */}
            <div className="flex items-center space-x-2">
              <button 
                className="text-primary-400 hover:text-primary-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Ajouter aux favoris
                }}
              >
                <Star className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
