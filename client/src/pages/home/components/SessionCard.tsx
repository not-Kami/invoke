
import { Users, Calendar } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Session } from '../../../types';

interface SessionCardProps {
  session: Session;
  onClick?: (session: Session) => void;
  className?: string;
}

export default function SessionCard({ 
  session, 
  onClick,
  className = ""
}: SessionCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(session);
    }
  };

  return (
    <div className="group">
      <Card 
        className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group h-80 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        {/* Image de fond - Portrait du jeu */}
        <div className="absolute inset-0 w-full h-full">
          {/* Fallback vers le gradient si pas d'images */}
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Image portrait du jeu si disponible */}
          {typeof session.game === 'object' && session.game.images?.portrait ? (
            <img 
              src={session.game.images.portrait} 
              alt={`Portrait ${session.game.name}`}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => console.log('✅ Image portrait chargée pour', typeof session.game === 'object' ? session.game.name : 'N/A', ':', typeof session.game === 'object' ? session.game.images?.portrait : 'N/A')}
              onError={(e) => console.error('❌ Erreur chargement image pour', typeof session.game === 'object' ? session.game.name : 'N/A', ':', e)}
            />
          ) : null}
          
          {/* Gradient overlay transparent -> opaque de haut en bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Badge de statut en haut à droite */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant={session.status === 'open' ? 'success' : session.status === 'full' ? 'warning' : 'default'} 
            size="sm"
          >
            {session.status === 'open' ? 'Ouverte' : session.status === 'full' ? 'Complète' : session.status}
          </Badge>
        </div>

        {/* Badge type de session en haut à gauche */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="info" size="sm">
            {session.sessionType === 'online' ? 'En ligne' : 'En présentiel'}
          </Badge>
        </div>

        {/* Contenu en bas de la carte */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-display text-xl font-bold text-white mb-2">{session.title}</h3>
          <p className="text-gray-200 text-sm mb-3 line-clamp-2">{session.description}</p>
          
          {/* Métadonnées compactes */}
          <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {typeof session.game === 'object' ? session.game.genre : 'N/A'}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {typeof session.game === 'object' ? session.game.system : 'N/A'}
            </span>
          </div>

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3" />
              <span>{session.players.length} joueurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
