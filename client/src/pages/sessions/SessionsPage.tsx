import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import { formatDateShort } from '../../lib/utils';
import { Calendar, Users, Plus, Search, UserPlus, RefreshCw, X } from 'lucide-react';
import JoinSessionModal from '../../components/sessions/JoinSessionModal';
import { useJoinSession } from '../../hooks/useJoinSession';

export default function SessionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { joinSession } = useJoinSession();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Join session modal states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les sessions une seule fois
  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getSessions({
        showFinished: true, // Récupérer toutes les sessions
        limit: 1000 // Limite élevée pour avoir toutes les sessions
      });
      
      if (response.success && response.data) {
        const allSessions = response.data.data || response.data;
        setSessions(allSessions);
        setFilteredSessions(allSessions);
      } else {
        const errorMessage = response.message || 'Failed to fetch sessions';
        setError(errorMessage);
        setSessions([]);
        setFilteredSessions([]);
      }
    } catch (error) {
      setError('An error occurred while fetching sessions');
      setSessions([]);
      setFilteredSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage côté front
  useEffect(() => {
    let filtered = sessions;
    
    // Filtre par recherche (titre)
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter]);

  useEffect(() => {
    fetchAllSessions();
  }, []);

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

  const handleJoinSession = (session: any) => {
    setSelectedSession(session);
    setJoinModalOpen(true);
  };

  const handleConfirmJoin = async () => {
    if (!selectedSession) return;
    
    setJoinLoading(true);
    const success = await joinSession(selectedSession._id);
    
    if (success) {
      setJoinModalOpen(false);
      setSelectedSession(null);
      // Rafraîchir la liste des sessions
      await fetchAllSessions();
    }
    
    setJoinLoading(false);
  };

  const handleCloseJoinModal = () => {
    setJoinModalOpen(false);
    setSelectedSession(null);
    setJoinLoading(false);
  };

  const canJoinSession = (session: any) => {
    if (!user) return false;
    
    // Le MJ ne peut pas rejoindre sa propre session
    if (session.dm === user._id) {
      return false;
    }
    
    // Ne peut rejoindre que les sessions ouvertes
    if (session.status !== 'open') return false;
    
    // Vérifier qu'il y a de la place (par défaut 6)
    if (!session.players || session.players.length >= 6) return false;
    
    // Vérifier si l'utilisateur est déjà dans la session
    // Gérer les cas où players est un tableau d'objets ou de strings
    const isAlreadyPlayer = session.players.some((player: any) => 
      typeof player === 'string' ? player === user._id : player._id === user._id
    );
    
    return !isAlreadyPlayer;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gaming Sessions</h1>
            <p className="mt-2 text-gray-300">
              Browse and join gaming sessions
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={fetchAllSessions}
              variant="outline"
              disabled={loading}
              className="text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {user && (user.role === 'admin' || user.isDM) && (
              <Link to="/sessions/create">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-400">
                  <strong>Error:</strong> {error}
                </p>
                <Button
                  onClick={() => setError(null)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="full">Full</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Sessions Grid */}
        {!filteredSessions || filteredSessions.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No sessions found
              </h3>
              <p className="text-gray-300 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more sessions.'
                  : 'Be the first to create a session!'}
              </p>
              {user && (user.role === 'admin' || user.isDM) && (
                <Link to="/sessions/create">
                  <Button className="text-gray-400 hover:text-white transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions?.map((session) => (
              <Card key={session._id} className="hover:shadow-md transition-shadow overflow-hidden">
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
                        firstName={session.dm?.firstName || 'Unknown'}
                        lastName={session.dm?.lastName || 'DM'}
                        src={session.dm?.avatar}
                        size="sm"
                      />
                      <div className="ml-3">
                        <p className="text-white font-semibold text-sm">
                          {session.dm?.firstName || 'Unknown'} {session.dm?.lastName || 'DM'}
                        </p>
                        <p className="text-xs text-gray-300">★ 4.9</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {typeof session.game === 'object' && session.game && session.game.images?.logo ? (
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
                        {typeof session.game === 'object' && session.game ? session.game.name || 'Unknown Game' : 'Unknown Game'}
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
                    ) : canJoinSession(session) ? (
                      <Button
                        onClick={() => handleJoinSession(session)}
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
            ))}
          </div>
        )}
      </div>

      {/* Join Session Modal */}
      {selectedSession && (
        <JoinSessionModal
          session={selectedSession}
          isOpen={joinModalOpen}
          onClose={handleCloseJoinModal}
          onConfirm={handleConfirmJoin}
          loading={joinLoading}
        />
      )}
    </div>
  );
}