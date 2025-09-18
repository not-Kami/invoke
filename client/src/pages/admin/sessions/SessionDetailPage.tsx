import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Gamepad2, Trash2, User } from 'lucide-react';
import { adminAPI, Session as SessionType } from '../../../lib/api';
import { useSimpleNotifications } from '../../../hooks/useSimpleNotifications';

const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useSimpleNotifications();
  const [session, setSession] = useState<SessionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Validation préalable : récupérer directement la session spécifique
        const response = await adminAPI.getSession(id);
        
        if (response.success && response.data) {
          setSession(response.data);
        } else {
          // Session introuvable - afficher l'erreur immédiatement
          setError('Session not found');
          setSession(null);
        }
      } catch (err) {
        setError('Failed to load session');
        setSession(null);
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleDeleteSession = async () => {
    if (!session || !window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const response = await adminAPI.deleteSession(session._id);
      
      if (response.success) {
        addNotification({ type: 'success', title: 'Succès', message: 'Session deleted successfully' });
        navigate('/admin');
      } else {
        addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete session' });
      }
    } catch (err) {
      addNotification({ type: 'error', title: 'Erreur', message: 'Failed to delete session' });
      console.error('Error deleting session:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-600 text-white';
      case 'full': return 'bg-yellow-600 text-white';
      case 'finished': return 'bg-blue-600 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Users className="h-4 w-4" />;
      case 'full': return <Users className="h-4 w-4" />;
      case 'finished': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto mb-2" />
          <p className="text-xl font-semibold">Session not found</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Session Details</h1>
            <p className="text-gray-400">Manage session information and participants</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDeleteSession}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete Session
          </button>
        </div>
      </div>

      {/* Session Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Session Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Title</label>
                <p className="text-white font-medium text-lg">{session.title}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <p className="text-gray-300">{session.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Date & Time</label>
                  <p className="text-white font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1 capitalize">{session.status}</span>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Session Type</label>
                  <p className="text-white font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {session.sessionType === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">One Shot</label>
                  <p className="text-white font-medium">
                    {session.isOneShot ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Max Players</label>
                  <p className="text-white font-medium">{session.maxPlayers}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Current Players</label>
                  <p className="text-white font-medium">{session.players?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Information */}
          {session.game && typeof session.game === 'object' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Game Information
              </h2>
              <div className="flex items-center space-x-4">
                {session.game.images?.logo && (
                  <img
                    src={session.game.images.logo}
                    alt={session.game.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{session.game.name}</h3>
                  <p className="text-gray-400">{session.game.publisher}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* DM Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dungeon Master</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                {session.dm && typeof session.dm === 'object' && session.dm.avatar ? (
                  <img
                    src={session.dm.avatar}
                    alt={`${session.dm.firstName} ${session.dm.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  {session.dm && typeof session.dm === 'object' 
                    ? `${session.dm.firstName} ${session.dm.lastName}`
                    : 'Unknown DM'
                  }
                </p>
                <p className="text-gray-400 text-sm">
                  {session.dm && typeof session.dm === 'object' 
                    ? session.dm.email 
                    : 'Unknown Email'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Players ({session.players?.length || 0}/{session.maxPlayers})
            </h3>
            {session.players && session.players.length > 0 ? (
              <div className="space-y-3">
                {session.players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      {typeof player === 'object' && player.avatar ? (
                        <img
                          src={player.avatar}
                          alt={`${player.firstName} ${player.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {typeof player === 'object' 
                          ? `${player.firstName} ${player.lastName}`
                          : 'Unknown Player'
                        }
                      </p>
                      <p className="text-gray-400 text-xs">
                        {typeof player === 'object' ? player.email : 'Unknown Email'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No players joined yet</p>
            )}
          </div>

          {/* Session Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timezone</span>
                <span className="text-white">{session.timezone || 'UTC'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPage;
