import React from 'react';
import { Users, Gamepad2, Calendar, User, MapPin, Clock, Star } from 'lucide-react';
import Badge from '../ui/Badge';

interface SessionExpandedContentProps {
  session: any;
}

const SessionExpandedContent: React.FC<SessionExpandedContentProps> = ({ session }) => {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec image et titre */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {session.image ? (
            <img 
              src={session.image} 
              alt={session.title}
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
            <h3 className="text-xl font-cinzel font-semibold text-white">{session.title}</h3>
            {session.featured && (
              <Badge variant="success" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Mis en avant</span>
              </Badge>
            )}
          </div>
          
          {session.description && (
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {session.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(session.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long',
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Durée: {session.duration || 'Non spécifiée'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{session.location || 'Lieu non spécifié'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du jeu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-lg font-cinzel font-semibold text-white mb-3 flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span>Détails du jeu</span>
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Système:</span>
              <span className="text-white">{session.game?.name || 'Non spécifié'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Niveau requis:</span>
              <span className="text-white">{session.level || 'Tous niveaux'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Type de session:</span>
              <span className="text-white">{session.type || 'One-shot'}</span>
            </div>
            
            {session.tags && session.tags.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {session.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Maître de jeu */}
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-lg font-cinzel font-semibold text-white mb-3 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Maître de jeu</span>
          </h4>
          
          <div className="flex items-center space-x-3">
            {session.dmAvatar ? (
              <img 
                src={session.dmAvatar} 
                alt={session.dmName || 'MJ'}
                className="w-12 h-12 rounded-full object-cover border border-slate-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div>
              <p className="text-white font-medium">
                {session.dm ? `${session.dm.firstName} ${session.dm.lastName}` : 'Nom non spécifié'}
              </p>
              <p className="text-slate-400 text-sm">
                {session.dmExperience ? `${session.dmExperience} ans d'expérience` : 'Expérience non spécifiée'}
              </p>
              {session.dmRating && (
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-slate-300 text-sm">{session.dmRating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des joueurs */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <h4 className="text-lg font-cinzel font-semibold text-white mb-3 flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-400" />
          <span>Joueurs ({session.players?.length || 0}/{session.maxPlayers})</span>
        </h4>
        
        {session.players && session.players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {session.players.map((player: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                {player.avatar ? (
                  <img 
                    src={player.avatar} 
                    alt={player.firstName && player.lastName ? `${player.firstName} ${player.lastName}` : `Joueur ${index + 1}`}
                    className="w-10 h-10 rounded-full object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {player.firstName && player.lastName ? `${player.firstName} ${player.lastName}` : `Joueur ${index + 1}`}
                  </p>
                  {player.character && (
                    <p className="text-slate-400 text-sm truncate">
                      {player.character}
                    </p>
                  )}
                </div>
                
                {player.confirmed && (
                  <Badge variant="success" className="text-xs">
                    Confirmé
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-4">
            Aucun joueur inscrit pour le moment
          </p>
        )}
      </div>

      {/* Informations supplémentaires */}
      {(session.notes || session.requirements || session.rewards) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {session.notes && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Notes</h5>
              <p className="text-slate-300 text-sm">{session.notes}</p>
            </div>
          )}
          
          {session.requirements && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Prérequis</h5>
              <p className="text-slate-300 text-sm">{session.requirements}</p>
            </div>
          )}
          
          {session.rewards && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h5 className="text-md font-semibold text-white mb-2">Récompenses</h5>
              <p className="text-slate-300 text-sm">{session.rewards}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionExpandedContent;
