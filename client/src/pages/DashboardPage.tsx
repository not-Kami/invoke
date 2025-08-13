import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { useFavoriteGames } from '../hooks/useFavoriteGames';
import { useMasteredGames } from '../hooks/useMasteredGames';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import DMConfirmationModal from '../components/ui/DMConfirmationModal';
import StopDMConfirmationModal from '../components/ui/StopDMConfirmationModal';

import { Game } from '../types';
import { publicAPI } from '../lib/api';
import { 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Sword, 
  Crown,
  User,
  Gamepad2,
  Clock,
  MapPin,
  Edit,
  Eye,
  ChevronRight,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Globe,
  Monitor,
  DollarSign,
  Star,
  Megaphone,
  Heart,
  Lock,
  Info,
  AlertTriangle,
  X,
  Search
} from 'lucide-react';
import { usersApi } from '../lib/api';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const { loading, sessions, campaigns, isAdmin, isDM } = useDashboardData();
  const { favoriteGames, loading: gamesLoading, error: gamesError, removeFavoriteGame, addFavoriteGame } = useFavoriteGames();
  const { masteredGames } = useMasteredGames();
  const [viewMode, setViewMode] = useState<'player' | 'dm'>('player');
  
  // États pour les modals DM
  const [showDMConfirmation, setShowDMConfirmation] = useState(false);
  const [showStopDMConfirmation, setShowStopDMConfirmation] = useState(false);
  const [dmActionLoading, setDmActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // États pour le popup des jeux favoris
  const [showAddGamePopup, setShowAddGamePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);



  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  // Données réelles du dashboard - filtrer les 5 premières sessions à venir (pas terminées)
  const upcomingSessions = sessions
    .filter(session => 
      new Date(session.date) > new Date() && 
      session.status !== 'finished' && 
      session.status !== 'cancelled'
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const upcomingCampaigns = campaigns.filter(campaign => 
    campaign.active
  ).slice(0, 3);

  const myCharacters = [
    {
      id: 1,
      name: "Thorin Barbe-de-Fer",
      class: "Guerrier Nain",
      level: 8,
      campaign: "Les Ombres de Valoria",
      avatar: null
    },
    {
      id: 2,
      name: "Zara Nova",
      class: "Netrunner",
      level: 4,
      campaign: "Cyberpunk Chronicles",
      avatar: null
    }
  ];

  const myTables = [
    {
      id: 1,
      name: "Équipe Dragon Rouge",
      members: [
        { id: 1, name: "Alice Martin", status: "confirmed", avatar: null },
        { id: 2, name: "Bob Dupont", status: "confirmed", avatar: null },
        { id: 3, name: "Charlie Durand", status: "pending", avatar: null }
      ],
      invitations: 1,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Les Aventuriers du Dimanche",
      members: [
        { id: 4, name: "Diana Lopez", status: "confirmed", avatar: null },
        { id: 5, name: "Eve Chen", status: "confirmed", avatar: null }
      ],
      invitations: 0,
      createdAt: "2024-01-20"
    }
  ];

  const mySessions = [
    {
      id: 1,
      title: "Les Mystères d'Arkham",
      game: "Call of Cthulhu",
      players: 4,
      maxPlayers: 6,
      nextSession: "2024-01-30",
      status: "active"
    },
    {
      id: 2,
      title: "Campagne Épique Fantasy",
      game: "D&D 5e",
      players: 6,
      maxPlayers: 6,
      nextSession: "2024-02-01",
      status: "full"
    }
  ];

  const myAnnouncements = [
    {
      id: 1,
      title: "Nouvelle campagne D&D 5e - Les Terres Oubliées",
      game: "D&D 5e",
      type: "campaign",
      location: "IRL - Paris 11ème",
      price: "15€/session",
      players: 3,
      maxPlayers: 6,
      status: "active",
      createdAt: "2024-01-20"
    },
    {
      id: 2,
      title: "One-shot Cyberpunk Red",
      game: "Cyberpunk Red",
      type: "session",
      location: "En ligne - Roll20",
      price: "Gratuit",
      players: 2,
      maxPlayers: 4,
      status: "active",
      createdAt: "2024-01-25"
    }
  ];

  const dmSettings = {
    location: {
      irl: true,
      online: true,
      irlLocation: "Paris 11ème",
      vtt: ["Roll20", "Foundry VTT"]
    },
    pricing: {
      hourlyRate: 15,
      currency: "€",
      freeGames: true
    },
    masteredGames: [
      { name: "D&D 5e", experience: "Expert", years: 5 },
      { name: "Call of Cthulhu", experience: "Advanced", years: 3 },
      { name: "Cyberpunk Red", experience: "Intermediate", years: 1 }
    ]
  };

  // Fonction pour devenir DM
  const handleBecomeDM = async () => {
    try {
      setDmActionLoading(true);
      await updateUser({ isDM: true });
      setShowDMConfirmation(false);
      setNotification({
        type: 'success',
        message: 'Félicitations ! Vous êtes maintenant Maître de Donjon ! 🎲'
      });
      // Basculer automatiquement vers le mode DM
      setViewMode('dm');
    } catch (error) {
      console.error('Error becoming DM:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du changement de statut. Veuillez réessayer.'
      });
    } finally {
      setDmActionLoading(false);
    }
  };

  // Fonction pour arrêter d'être DM
  const handleStopBeingDM = async () => {
    try {
      setDmActionLoading(true);
      await updateUser({ isDM: false });
      setShowStopDMConfirmation(false);
      setNotification({
        type: 'success',
        message: 'Vous n\'êtes plus Maître de Donjon. Retour au mode joueur.'
      });
      // Basculer automatiquement vers le mode joueur
      setViewMode('player');
    } catch (error) {
      console.error('Error stopping DM status:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du changement de statut. Veuillez réessayer.'
      });
    } finally {
      setDmActionLoading(false);
    }
  };

  // Fonction pour ouvrir le popup d'ajout
  const handleOpenAddGamePopup = async () => {
    setShowAddGamePopup(true);
    setSearchTerm('');
    setAvailableGames([]);
    
    // Charger les jeux populaires par défaut
    try {
      setSearchLoading(true);
      const response = await publicAPI.getGames();
      
      if (response.success && response.data) {
        const games = response.data;
        // Filtrer les jeux qui ne sont pas déjà favoris et prendre les premiers (populaires)
        const popularGames = games
          .filter(game => !favoriteGames.find(fav => fav._id === game._id))
          .slice(0, 8); // Limiter à 8 jeux populaires
        setAvailableGames(popularGames);
      }
    } catch (error) {
      console.error('Error loading popular games:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fonction pour rechercher des jeux disponibles
  const handleSearchGames = async () => {
    if (!searchTerm.trim()) {
      // Si la recherche est vide, recharger les jeux populaires
      handleOpenAddGamePopup();
      return;
    }
    
    try {
      setSearchLoading(true);
      const response = await publicAPI.getGames();
      
      if (response.success && response.data) {
        const games = response.data;
        // Filtrer les jeux qui correspondent à la recherche et qui ne sont pas déjà favoris
        const filteredGames = games.filter(game => 
          game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !favoriteGames.find(fav => fav._id === game._id)
        );
        setAvailableGames(filteredGames);
      }
    } catch (error) {
      console.error('Error searching games:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la recherche de jeux.'
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Fonction pour ajouter un jeu aux favoris
  const handleAddToFavorites = (game: any) => {
    addFavoriteGame(game);
    setNotification({
      type: 'success',
      message: `${game.name} ajouté aux favoris !`
    });
    setSearchTerm('');
    setAvailableGames([]);
  };

  // Vérifier si l'utilisateur peut accéder au mode DM
  const canAccessDMView = isAdmin || isDM;

  // Fermer la notification après 5 secondes
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen py-12">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-300 mt-2">
                {viewMode === 'player' ? 'Ready for your next adventure?' : 'Time to craft some epic stories!'}
              </p>
            </div>
            {/* Suppression de la pastille de rôle - pas utile */}
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('player')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'player'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Sword className="h-4 w-4" />
                <span>Player Mode</span>
              </button>
              <button
                onClick={() => setViewMode('dm')}
                disabled={!canAccessDMView}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'dm'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : canAccessDMView 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span>DM Mode</span>
                {!canAccessDMView && <Lock className="h-3 w-3 ml-1" />}
              </button>
            </div>

            {/* Bouton pour arrêter d'être DM (seulement visible en mode DM) */}
            {viewMode === 'dm' && isDM && !isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                onClick={() => setShowStopDMConfirmation(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Arrêter d'être DM
              </Button>
            )}
          </div>
        </div>

        {viewMode === 'player' ? (
          /* Player Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Games - Amélioré pour afficher 5 sessions à venir */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">Upcoming Games</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading sessions...</p>
                    </div>
                  ) : upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <div key={session._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Gamepad2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{session.title}</h3>
                            <p className="text-sm text-gray-300">{session.game.name} • MJ: {session.dm.firstName} {session.dm.lastName}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Users className="h-3 w-3" />
                                <span>{session.players.length} joueurs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={session.status === 'open' ? 'success' : 'warning'}>
                            {session.status === 'open' ? 'Ouverte' : session.status}
                          </Badge>
                          <Badge variant="info" size="sm">
                            Session
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Aucune session à venir</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {sessions.length > 0 ? `${sessions.length} sessions trouvées, mais aucune à venir` : 'Aucune session trouvée'}
                      </p>
                      {(isAdmin || isDM) && (
                        <Button 
                          size="sm" 
                          className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                          onClick={() => window.location.href = '/sessions/create'}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une Session
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Characters - Grisé (upcoming feature) */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6 opacity-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <h2 className="text-xl font-semibold text-gray-400">My Characters</h2>
                      <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                        Coming Soon
                      </Badge>
                    </div>
                    <Button size="sm" className="bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed" disabled>
                      <Plus className="h-4 w-4 mr-2" />
                      New Character
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCharacters.map((character) => (
                      <div key={character.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar
                            firstName={character.name.split(' ')[0]}
                            lastName={character.name.split(' ')[1] || ''}
                            size="sm"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-400">{character.name}</h3>
                            <p className="text-sm text-gray-500">{character.class} • Level {character.level}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Campaign: {character.campaign}</p>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-400" disabled>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-400" disabled>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Tables - Grisé (upcoming feature) */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6 opacity-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <h2 className="text-xl font-semibold text-gray-400">My Tables</h2>
                      <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                        Coming Soon
                      </Badge>
                    </div>
                    <Button size="sm" className="bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed" disabled>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Table
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myTables.map((table) => (
                      <div key={table.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-400">{table.name}</h3>
                          <div className="flex items-center space-x-2">
                            {table.invitations > 0 && (
                              <Badge variant="warning" size="sm">
                                {table.invitations} pending
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-400" disabled>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {table.members.slice(0, 4).map((member) => (
                            <div key={member.id} className="relative">
                              <Avatar
                                firstName={member.name.split(' ')[0]}
                                lastName={member.name.split(' ')[1]}
                                size="sm"
                              />
                              {member.status === 'pending' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                              )}
                              {member.status === 'confirmed' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                              )}
                            </div>
                          ))}
                          {table.members.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                              +{table.members.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {table.members.length} members
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-400" disabled>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Invite
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-400" disabled>
                              <Calendar className="h-3 w-3 mr-1" />
                              Book Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions - Amélioré */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="glass" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/profile/edit'}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>

                  <Button 
                    variant="glass" 
                    className="w-full justify-start opacity-50 bg-white/5 border-white/10 cursor-not-allowed" 
                    disabled
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Find Groups
                    <Badge variant="default" size="sm" className="ml-auto bg-gray-600 text-gray-300">
                      Coming Soon
                    </Badge>
                  </Button>
                  <Button 
                    variant="glass" 
                    className="w-full justify-start opacity-50 bg-white/5 border-white/10 cursor-not-allowed" 
                    disabled
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    My Schedule
                    <Badge variant="default" size="sm" className="ml-auto bg-gray-600 text-gray-300">
                      Coming Soon
                    </Badge>
                  </Button>
                  {!isDM && (
                    <Button 
                      variant="glass" 
                      className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                      onClick={() => setShowDMConfirmation(true)}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Become a DM
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Favorite Games - Amélioré avec ajout de jeux */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-purple-400" />
                      <h2 className="text-lg font-semibold text-white">Favorite Games</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-400 hover:text-white"
                        onClick={handleOpenAddGamePopup}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {gamesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading favorite games...</p>
                    </div>
                  ) : gamesError ? (
                    <div className="text-center py-8 text-red-400">
                      Error loading favorite games: {gamesError}
                    </div>
                  ) : favoriteGames.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">No favorite games yet. Add some!</p>
                      <Button 
                        size="sm" 
                        className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                        onClick={handleOpenAddGamePopup}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Favorite Games
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favoriteGames.map((game) => (
                        <div key={game._id} className="flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium text-white">{game.name}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                              onClick={() => removeFavoriteGame(game._id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity - Gardé tel quel */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Joined "Les Ombres de Valoria"</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Updated character sheet</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Completed one-shot session</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* DM Dashboard - Accès restreint */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {canAccessDMView ? (
              <>
                {/* My Announcements */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Megaphone className="h-5 w-5 text-purple-400" />
                          <h2 className="text-xl font-semibold text-white">Mes Annonces</h2>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvelle Annonce
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {myAnnouncements.length > 0 ? (
                        myAnnouncements.map((announcement) => (
                          <div key={announcement.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-white">{announcement.title}</h3>
                                  <Badge variant="info" size="sm">{announcement.type}</Badge>
                                  <Badge variant={announcement.status === 'active' ? 'success' : 'default'} size="sm">
                                    {announcement.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{announcement.game}</p>
                                
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{announcement.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{announcement.price}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{announcement.players}/{announcement.maxPlayers} joueurs</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Posté le {announcement.createdAt}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Modifier
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                              <span className="text-xs text-gray-400">
                                {announcement.players} joueurs intéressés
                              </span>
                              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                                <Users className="h-3 w-3 mr-1" />
                                Gérer les Joueurs
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">Aucune annonce active</p>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Créer une Annonce
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* My Sessions & Campaigns */}
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-purple-400" />
                          <h2 className="text-xl font-semibold text-white">Sessions en Cours</h2>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-gray-900">
                          Voir Tout
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mySessions.length > 0 ? (
                        mySessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <Crown className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{session.title}</h3>
                                <div className="flex items-center space-x-3 mt-1">
                                  <span className="text-xs text-gray-400">{session.game}</span>
                                  <span className="text-xs text-gray-400">
                                    {session.players}/{session.maxPlayers} joueurs
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={session.status === 'active' ? 'success' : 'warning'} size="sm">
                              {session.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">Aucune session en cours</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              /* Message pour les utilisateurs non-MJ avec encouragement à devenir DM */
              <div className="lg:col-span-3">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Mode Maître de Donjon
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                      Ce mode est réservé aux maîtres de donjon et administrateurs. 
                      Ici, vous pourrez gérer vos campagnes, créer des sessions et 
                      organiser vos parties de jeu de rôle.
                    </p>
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        🎲 Devenez Maître de Donjon sur Invoke !
                      </h3>
                      <p className="text-gray-300 mb-4 max-w-lg mx-auto">
                        Invoke permet à tout le monde de proposer ses services en tant que DM. 
                        Partagez votre passion, créez des aventures uniques et rejoignez une 
                        communauté de joueurs passionnés !
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                        onClick={() => setShowDMConfirmation(true)}
                      >
                        <Crown className="h-5 w-5 mr-2" />
                        Devenir DM
                      </Button>
                    </div>
                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        <span>Gérer les campagnes</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Créer des sessions</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Gérer les joueurs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* DM Sidebar - Seulement si accès autorisé */}
            {canAccessDMView && (
              <div className="space-y-6">
                {/* DM Tools */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">DM Tools</h2>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="glass" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Session
                    </Button>
                    <Button variant="glass" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Players
                    </Button>
                    <Button variant="glass" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Events
                    </Button>
                    <Button variant="glass" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Campaign Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* DM Profile Settings */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-purple-400" />
                        <h2 className="text-lg font-semibold text-white">DM Profile</h2>
                      </div>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Where I Play</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-300">IRL: {dmSettings.location.irlLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-300">Online: {dmSettings.location.vtt.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Pricing</h3>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-300">
                          {dmSettings.pricing.hourlyRate}{dmSettings.pricing.currency}/hour
                        </span>
                        {dmSettings.pricing.freeGames && (
                          <Badge variant="success" size="sm">Free games available</Badge>
                        )}
                      </div>
                    </div>

                    {/* Mastered Games */}
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Games I Master</h3>
                      <div className="space-y-2">
                        {dmSettings.masteredGames.map((game, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-white">{game.name}</p>
                              <p className="text-xs text-gray-400">{game.years} years experience</p>
                            </div>
                            <Badge 
                              variant={
                                game.experience === 'Expert' ? 'success' :
                                game.experience === 'Advanced' ? 'warning' : 'default'
                              } 
                              size="sm"
                            >
                              {game.experience}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-white">Your Stats</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-sm text-gray-300">Active Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">3</div>
                        <div className="text-sm text-gray-300">Running Campaigns</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">24</div>
                        <div className="text-sm text-gray-300">Sessions Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DMConfirmationModal
        isOpen={showDMConfirmation}
        onClose={() => setShowDMConfirmation(false)}
        onConfirm={handleBecomeDM}
        loading={dmActionLoading}
      />

      <StopDMConfirmationModal
        isOpen={showStopDMConfirmation}
        onClose={() => setShowStopDMConfirmation(false)}
        onConfirm={handleStopBeingDM}
        loading={dmActionLoading}
      />

      {/* Add Favorite Games Modal */}
      {showAddGamePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddGamePopup(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowAddGamePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Add Favorite Games
              </h2>
              <p className="text-gray-300">
                Search and add games to your favorites
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchGames()}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <Button
                  onClick={handleSearchGames}
                  disabled={searchLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                >
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            {searchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-400">Loading games...</p>
              </div>
            ) : availableGames.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2">
                <h3 className="text-sm font-medium text-white mb-3">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Games'}
                </h3>
                {availableGames.map((game) => (
                  <div key={game._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{game.name}</p>
                      {game.genre && (
                        <p className="text-xs text-gray-400">{game.genre}</p>
                      )}
                      {game.system && (
                        <p className="text-xs text-gray-500">{game.system}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToFavorites(game)}
                      className="bg-green-600 hover:bg-green-700 text-white border-0 ml-3"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-4">
                <p className="text-gray-400">No games found matching "{searchTerm}"</p>
                <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                  onClick={() => {
                    setSearchTerm('');
                    handleSearchGames();
                  }}
                >
                  Show Popular Games
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">No popular games available</p>
                <p className="text-xs text-gray-500 mt-1">Try searching for specific games</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                onClick={() => setShowAddGamePopup(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
