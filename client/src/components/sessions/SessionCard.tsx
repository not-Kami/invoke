import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { Calendar, Users, UserPlus } from 'lucide-react';
import { Session } from '../../types';
import { formatDateShort } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface SessionCardProps {
  session: Session;
  onClick?: (session: Session) => void;
  className?: string;
  canJoinSession?: (session: Session) => boolean;
  handleJoinSession?: (session: Session) => void;
}

export default function SessionCard({ 
  session, 
  onClick,
  className = "",
  canJoinSession,
  handleJoinSession
}: SessionCardProps) {
  const { user, loading: authLoading } = useAuth();
  const handleCardClick = () => {
    if (onClick) {
      onClick(session);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'full': return 'warning';
      case 'finished': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'full': return 'Full';
      case 'finished': return 'Finished';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow overflow-hidden ${className}`}
      onClick={handleCardClick}
    >
      {/* Image de bannière en haut */}
      <div className="relative h-48 w-full">
        {session.image ? (
          <img 
            src={session.image} 
            alt={`Bannière ${session.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
        
        {/* Overlay fondu pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Titre et badges superposés sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-bold text-white text-xl mb-2">
            {session.title}
          </h3>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusBadgeVariant(session.status)} size="sm">
              {getStatusDisplayName(session.status)}
            </Badge>
            <Badge variant="info" size="sm">
              {session.sessionType || 'Unknown'}
            </Badge>
            {session.isOneShot && (
              <Badge variant="default" size="sm">
                One-shot
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-4 bg-black">
        {/* DM et jeu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar
              firstName={typeof session.dm === 'object' ? session.dm?.firstName || 'Unknown' : 'Unknown'}
              lastName={typeof session.dm === 'object' ? session.dm?.lastName || 'DM' : 'DM'}
              src={typeof session.dm === 'object' ? session.dm?.avatar || undefined : undefined}
              size="sm"
            />
            <div className="ml-3">
              <p className="text-white font-semibold text-sm">
                {typeof session.dm === 'object' ? session.dm?.firstName || 'Unknown' : 'Unknown'} {typeof session.dm === 'object' ? session.dm?.lastName || 'DM' : 'DM'}
              </p>
              <p className="text-xs text-gray-300">★ 4.9</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {typeof session.game === 'object' && session.game.images?.logo ? (
              <img 
                src={session.game.images.logo} 
                alt={`Logo ${session.game.name}`}
                className="w-8 h-8 rounded mr-2 object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">?</span>
              </div>
            )}
            <span className="text-white font-medium text-sm">
              {typeof session.game === 'object' ? session.game?.name || 'Unknown Game' : 'Unknown Game'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">
          {session.description || 'No description available'}
        </p>

        {/* Bouton d'action principal */}
        <div className="mb-4">
          {session.status === 'finished' || session.status === 'cancelled' ? (
            <div className="text-center py-3">
              <p className="text-sm text-gray-500">
                {session.status === 'finished' ? 'Session finished' : 'Session cancelled'}
              </p>
            </div>
          ) : authLoading ? (
            <div className="text-center py-3">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : !user ? (
            <Button
              onClick={() => window.location.href = '/login'}
              size="lg"
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            >
              Login to Join
            </Button>
          ) : canJoinSession && canJoinSession(session) ? (
            <Button
              onClick={() => handleJoinSession && handleJoinSession(session)}
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Session
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = `/sessions/${session._id}`}
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0"
            >
              View Details
            </Button>
          )}
        </div>

        {/* Informations de session */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{session.date ? formatDateShort(session.date) : 'Date not set'}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{session.players?.length || 0}/6</span>
            {session.players && session.players.length < 6 && (
              <span className="ml-1 text-xs">
                (only {6 - session.players.length} spots available)
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}