import React from 'react';
import { Gamepad2, Calendar, Star, Users, BookOpen, Tag, Info } from 'lucide-react';
import Badge from '../ui/Badge';

interface GameExpandedContentProps {
  game: any;
}

const GameExpandedContent: React.FC<GameExpandedContentProps> = ({ game }) => {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec image et titre */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {game.image ? (
            <img 
              src={game.image} 
              alt={game.name}
              className="w-24 h-24 rounded-lg object-cover border border-slate-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-cinzel font-semibold text-white">{game.name}</h3>
            {game.featured && (
              <Badge variant="success" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Mis en avant</span>
              </Badge>
            )}
          </div>
          
          {game.description && (
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {game.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Système: {game.system}</span>
            </div>
            
            {game.genre && (
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Genre: {game.genre}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Créé le {new Date(game.createdAt).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées du jeu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-lg font-cinzel font-semibold text-white mb-3 flex items-center space-x-2">
            <Info className="w-5 h-5 text-purple-400" />
            <span>Détails du jeu</span>
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Système:</span>
              <span className="text-white">{game.system}</span>
            </div>
            
            {game.genre && (
              <div className="flex justify-between">
                <span className="text-slate-400">Genre:</span>
                <span className="text-white">{game.genre}</span>
              </div>
            )}
            
            {game.complexity && (
              <div className="flex justify-between">
                <span className="text-slate-400">Complexité:</span>
                <span className="text-white">{game.complexity}</span>
              </div>
            )}
            
            {game.minPlayers && game.maxPlayers && (
              <div className="flex justify-between">
                <span className="text-slate-400">Joueurs:</span>
                <span className="text-white">{game.minPlayers}-{game.maxPlayers}</span>
              </div>
            )}
            
            {game.duration && (
              <div className="flex justify-between">
                <span className="text-slate-400">Durée typique:</span>
                <span className="text-white">{game.duration}</span>
              </div>
            )}
            
            {game.tags && game.tags.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {game.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-lg font-cinzel font-semibold text-white mb-3 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Statistiques</span>
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Sessions jouées</span>
              </div>
              <Badge variant="info">{game.sessionsCount || 0}</Badge>
            </div>
            
            
            
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Dernière session</span>
              </div>
              <span className="text-slate-300 text-sm">
                {game.lastPlayed ? 
                  new Date(game.lastPlayed).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short' 
                  }) : 
                  'Jamais'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description complète */}
      {game.description && (
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-lg font-cinzel font-semibold text-white mb-3">Description</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{game.description}</p>
        </div>
      )}

      {/* Informations supplémentaires */}
      {(game.rules || game.setting || game.requirements) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {game.rules && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Règles</h5>
              <p className="text-slate-300 text-sm">{game.rules}</p>
            </div>
          )}
          
          {game.setting && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Univers</h5>
              <p className="text-slate-300 text-sm">{game.setting}</p>
            </div>
          )}
          
          {game.requirements && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Prérequis</h5>
              <p className="text-slate-300 text-sm">{game.requirements}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameExpandedContent;
