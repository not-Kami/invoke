
import { X, Users, Calendar, MapPin } from 'lucide-react';
import { Session } from '../../types';
import Button from '../ui/Button';
import { formatDateShort } from '../../lib/utils';

interface JoinSessionModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function JoinSessionModal({
  session,
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: JoinSessionModalProps) {
  if (!isOpen) return null;

  const availableSpots = session.players.length < 6 ? 6 - session.players.length : 0;
  const canJoin = session.status === 'open' && availableSpots > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Join Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Session Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
            <p className="text-sm text-gray-600">{session.description}</p>
          </div>

          {/* Session Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDateShort(session.date)}
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {session.sessionType === 'online' ? 'Online' : 'In-Person'}
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {session.players.length}/6 players
              {availableSpots > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  ({availableSpots} spots available)
                </span>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Game:</span> {typeof session.game === 'string' ? session.game : session.game.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">DM:</span> {typeof session.dm === 'string' ? session.dm : `${session.dm.firstName} ${session.dm.lastName}`}
            </p>
          </div>

          {/* Warning if can't join */}
          {!canJoin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                                  {session.status === 'full' 
                    ? 'This session is full and cannot accept more players.'
                    : 'This session cannot accept more players at the moment.'
                  }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={!canJoin || loading}
            className={!canJoin ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? 'Joining...' : 'Join Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}
