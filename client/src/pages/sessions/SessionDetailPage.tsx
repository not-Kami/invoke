import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { publicAPI } from '../../lib/api';
import { Session, User } from '../../types';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  Gamepad2, 
  MapPin, 
  UserPlus, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';
import { formatDateShort } from '../../lib/utils';
import JoinSessionModal from '../../components/sessions/JoinSessionModal';
import { useJoinSession } from '../../hooks/useJoinSession';

interface PopulatedSession extends Omit<Session, 'dm' | 'game' | 'players'> {
  dm: User;
  game: {
    _id: string;
    name: string;
    system: string;
    genre: string;
  };
  players: User[];
}

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinSession, loading: joinLoading } = useJoinSession();
  
  const [session, setSession] = useState<PopulatedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await publicAPI.getSession(id!);
      
      if (response.success && response.data) {
        setSession(response.data);
      } else {
        setError(response.message || 'Failed to fetch session');
      }
    } catch (error) {
      setError('An error occurred while fetching the session');
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const canJoinSession = () => {
    if (!user || !session) return false;
    
    // Le MJ ne peut pas rejoindre sa propre session
    if (session.dm._id === user._id) {
      return false;
    }
    
    // Vérifier si l'utilisateur est déjà dans la session
    const isAlreadyPlayer = session.players.some(player => player._id === user._id);
    if (isAlreadyPlayer) return false;
    
    // Vérifier si la session peut accepter de nouveaux joueurs
    return session.status === 'open' && session.players.length < session.maxPlayers;
  };

  const handleJoinSession = () => {
    setJoinModalOpen(true);
  };

  const handleConfirmJoin = async () => {
    if (!session) return;
    
    const success = await joinSession(session._id);
    if (success) {
      setJoinModalOpen(false);
      // Rafraîchir les données de la session
      fetchSession();
    }
  };

  const handleCloseJoinModal = () => {
    setJoinModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'full': return 'bg-yellow-500';
      case 'finished': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="h-4 w-4" />;
      case 'full': return <AlertCircle className="h-4 w-4" />;
      case 'finished': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-white">Error</h2>
            <p className="mt-2 text-gray-300">{error || 'Session not found'}</p>
            <Button
              onClick={() => navigate('/sessions')}
              className="mt-4"
            >
              Back to Sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/sessions')}
            variant="outline"
            className="mb-4 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{session.title}</h1>
              <p className="mt-2 text-gray-300">{session.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(session.status)} text-white`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(session.status)}
                  <span className="capitalize">{session.status}</span>
                </div>
              </Badge>
              
              {!user ? (
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                >
                  Login to Join
                </Button>
              ) : canJoinSession() ? (
                <Button
                  onClick={handleJoinSession}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
              ) : (
                <div className="text-sm text-gray-400">
                  {session.dm._id === user._id
                    ? 'You are the DM'
                    : session.players.some(player => player._id === user._id)
                    ? 'Already joined'
                    : session.status === 'full'
                    ? 'Session full'
                    : 'Cannot join'
                  }
                </div>
              )}
              
              {/* Bouton Modifier pour le MJ */}
              {user && session.dm._id === user._id && (
                <Button
                  onClick={() => navigate(`/sessions/${session._id}/edit`)}
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:text-white hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Session
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Session Banner */}
        {session.image && (
          <div className="mb-8">
            <img
              src={session.image}
              alt={`${session.title} banner`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Session Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Information */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Game Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-white font-medium">{session.game.name}</p>
                    <p className="text-sm text-gray-300">{session.game.system} • {session.game.genre}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-white font-medium">Players</p>
                    <p className="text-sm text-gray-300">
                      {session.players.length} / {session.maxPlayers} players
                    </p>
                  </div>
                </div>
                
                {session.isOneShot && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    One-Shot Session
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Session Details */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">Session Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-white font-medium">Date</p>
                      <p className="text-sm text-gray-300">{formatDateShort(session.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-white font-medium">Time</p>
                      <p className="text-sm text-gray-300">
                        {new Date(session.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-white font-medium">Type</p>
                    <p className="text-sm text-gray-300 capitalize">{session.sessionType}</p>
                  </div>
                </div>
                
                {session.timezone && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-white font-medium">Timezone</p>
                      <p className="text-sm text-gray-300">{session.timezone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dungeon Master */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Dungeon Master</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={session.dm.avatar}
                    alt={`${session.dm.firstName} ${session.dm.lastName}`}
                    firstName={session.dm.firstName}
                    lastName={session.dm.lastName}
                    size="lg"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {session.dm.firstName} {session.dm.lastName}
                    </p>
                    <p className="text-sm text-gray-300">Game Master</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Players */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  Players ({session.players.length}/{session.maxPlayers})
                </h3>
              </CardHeader>
              <CardContent>
                {session.players.length > 0 ? (
                  <div className="space-y-3">
                    {session.players.map(player => (
                      <div key={player._id} className="flex items-center space-x-3">
                        <Avatar
                          src={player.avatar}
                          alt={`${player.firstName} ${player.lastName}`}
                          firstName={player.firstName}
                          lastName={player.lastName}
                          size="sm"
                          className="w-8 h-8"
                        />
                        <span className="text-white text-sm">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No players yet</p>
                    <p className="text-gray-500 text-xs">Be the first to join!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Session Modal */}
      <JoinSessionModal
        session={session}
        isOpen={joinModalOpen}
        onClose={handleCloseJoinModal}
        onConfirm={handleConfirmJoin}
        loading={joinLoading}
      />
    </div>
  );
}
