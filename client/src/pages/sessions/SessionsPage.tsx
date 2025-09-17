import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../lib/api';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Plus, Search, RefreshCw, X } from 'lucide-react';
import JoinSessionModal from '../../components/sessions/JoinSessionModal';
import SessionCard from '../../components/sessions/SessionCard';
import { useJoinSession } from '../../hooks/useJoinSession';

export default function SessionsPage() {
  const { user } = useAuth();
  const { joinSession } = useJoinSession();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  
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


  const handleJoinSession = (session: any) => {
    setSelectedSession(session);
    setJoinModalOpen(true);
  };

  const handleSessionClick = (session: any) => {
    window.location.href = `/sessions/${session._id}`;
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
              <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="/invoke-logo.svg" 
                  alt="Invoke Logo" 
                  className="h-16 w-16 object-contain"
                />
              </div>
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
              <SessionCard
                key={session._id}
                session={session}
                onClick={handleSessionClick}
                canJoinSession={canJoinSession}
                handleJoinSession={handleJoinSession}
              />
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