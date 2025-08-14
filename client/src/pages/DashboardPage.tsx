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
  MapPin,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Monitor,
  DollarSign,
  Megaphone,
  Heart,
  Lock,
  AlertTriangle,
  X,
  Search,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const { loading, sessions, isAdmin, isDM } = useDashboardData();
  const { favoriteGames, loading: gamesLoading, error: gamesError, removeFavoriteGame, addFavoriteGame } = useFavoriteGames();
  const { masteredGames, removeMasteredGame, addMasteredGame } = useMasteredGames();
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

  // États pour le popup des jeux maîtrisés
  const [showAddMasteredGamePopup, setShowAddMasteredGamePopup] = useState(false);
  const [masteredSearchTerm, setMasteredSearchTerm] = useState('');
  const [availableMasteredGames, setAvailableMasteredGames] = useState<any[]>([]);
  const [masteredSearchLoading, setMasteredSearchLoading] = useState(false);



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



  const mySessions = [
    {
      id: 1,
      title: "The Mysteries of Arkham",
      game: "Call of Cthulhu",
      players: 4,
      maxPlayers: 6,
      nextSession: "2024-01-30",
      status: "active"
    },
    {
      id: 2,
      title: "Epic Fantasy Campaign",
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
      title: "New D&D 5e Campaign - The Forgotten Realms",
      game: "D&D 5e",
      type: "campaign",
      location: "IRL - Paris 11th",
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
      location: "Online - Roll20",
      price: "Free",
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

  // Fonction pour ouvrir le popup des jeux maîtrisés
  const handleOpenAddMasteredGamePopup = async () => {
    console.log('🚀 Opening mastered games popup');
    setShowAddMasteredGamePopup(true);
    setMasteredSearchTerm('');
    setAvailableMasteredGames([]);
    
    // Charger les jeux populaires par défaut
    try {
      setMasteredSearchLoading(true);
      console.log('📡 Loading popular games...');
      
      const response = await publicAPI.getGames();
      console.log('📡 Popular games API response:', response);
      
      if (response.success && response.data) {
        const games = response.data;
        console.log('🎮 Total games available:', games.length);
        
        // Filtrer les jeux qui ne sont pas déjà maîtrisés et prendre les premiers (populaires)
        const currentMasteredIds = masteredGames.map((g: any) => g._id);
        console.log('🎯 Current mastered IDs:', currentMasteredIds);
        
        const popularGames = games
          .filter(game => !currentMasteredIds.includes(game._id))
          .slice(0, 8); // Limiter à 8 jeux populaires
        
        console.log('✅ Popular games to display:', popularGames.length);
        setAvailableMasteredGames(popularGames);
      } else {
        console.error('❌ Failed to load popular games:', response);
      }
    } catch (error) {
      console.error('❌ Error loading popular mastered games:', error);
    } finally {
      setMasteredSearchLoading(false);
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

  // Fonction pour rechercher des jeux pour les jeux maîtrisés
  const handleSearchMasteredGames = async () => {
    try {
      console.log('🔍 Searching mastered games with term:', masteredSearchTerm);
      setMasteredSearchLoading(true);
      
      const response = await publicAPI.getGames();
      console.log('📡 API response:', response);
      
      if (response.success && response.data) {
        let filteredGames = response.data;
        console.log('🎮 Total games from API:', filteredGames.length);
        
        // Si un terme de recherche est fourni, filtrer les jeux
        if (masteredSearchTerm.trim()) {
          filteredGames = response.data.filter((game: any) => 
            game.name.toLowerCase().includes(masteredSearchTerm.toLowerCase()) ||
            (game.system && game.system.toLowerCase().includes(masteredSearchTerm.toLowerCase()))
          );
          console.log('🔍 Filtered games after search:', filteredGames.length);
        }
        
        // Filtrer les jeux déjà maîtrisés
        const currentMasteredIds = masteredGames.map((g: any) => g._id);
        console.log('🎯 Current mastered game IDs:', currentMasteredIds);
        
        filteredGames = filteredGames.filter((game: any) => 
          !currentMasteredIds.includes(game._id)
        );
        console.log('🎯 Games after filtering mastered:', filteredGames.length);
        
        // Limiter à 8 jeux et mettre à jour l'état
        const finalGames = filteredGames.slice(0, 8);
        console.log('✅ Final games to display:', finalGames.length);
        setAvailableMasteredGames(finalGames);
      } else {
        console.error('❌ API response not successful:', response);
        setAvailableMasteredGames([]);
      }
    } catch (error) {
      console.error('❌ Error searching mastered games:', error);
      setAvailableMasteredGames([]);
    } finally {
      setMasteredSearchLoading(false);
    }
  };

  // Fonction pour ajouter un jeu aux jeux maîtrisés
  const handleAddToMastered = async (game: any) => {
    try {
      await addMasteredGame(game);
      setNotification({
        type: 'success',
        message: `${game.name} ajouté aux jeux maîtrisés !`
      });
      
      // Retirer le jeu de la liste des jeux disponibles
      setAvailableMasteredGames(prev => prev.filter(g => g._id !== game._id));
      
      // Vider le terme de recherche
      setMasteredSearchTerm('');
      
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Erreur lors de l'ajout de ${game.name}`
      });
    }
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
                  Stop being DM
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

              {/* Recent Activity - Coming Soon */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-400">Recent Activity</h2>
                    <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                      Coming Soon
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Activity tracking coming soon</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Track your game sessions, achievements, and progress
                    </p>
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
                {/* Colonne principale - Annonces et Sessions */}
                <div className="lg:col-span-2 space-y-6">
                  {/* My Announcements */}
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Megaphone className="h-5 w-5 text-purple-400" />
                          <h2 className="text-xl font-semibold text-white">My Announcements</h2>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                          <Plus className="h-4 w-4 mr-2" />
                          New Announcement
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
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                                                <span className="text-xs text-gray-400">
                                    {announcement.players} interested players
                                  </span>
                                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                                    <Users className="h-3 w-3 mr-1" />
                                    Manage Players
                                  </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">No active announcements</p>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Announcement
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* My Sessions */}
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-purple-400" />
                          <h2 className="text-xl font-semibold text-white">My Sessions</h2>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-gray-900">
                          View All
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
                                    {session.players}/{session.maxPlayers} players
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
                          <p className="text-gray-400">No active sessions</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* DM Tools, Profile & Stats - Coming Soon - Côte à côte */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* DM Tools - Coming Soon */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-60">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Settings className="h-5 w-5 text-gray-400" />
                          <h2 className="text-lg font-semibold text-gray-400">DM Tools</h2>
                          <Badge variant="default" className="text-gray-400 border-gray-400">Coming Soon</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start text-gray-400" disabled>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Session
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-gray-400" disabled>
                            <Users className="h-4 w-4 mr-2" />
                            Manage Players
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-gray-400" disabled>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Events
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-gray-400" disabled>
                            <Settings className="h-4 w-4 mr-2" />
                            Campaign Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* DM Profile - Coming Soon */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-60">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <h2 className="text-lg font-semibold text-gray-400">DM Profile</h2>
                          <Badge variant="default" className="text-gray-400 border-gray-400">Coming Soon</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Profile management coming soon</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Your Stats - Coming Soon */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-60">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-gray-400" />
                          <h2 className="text-lg font-semibold text-gray-400">Your Stats</h2>
                          <Badge variant="default" className="text-gray-400 border-gray-400">Coming Soon</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-400">--</div>
                            <div className="text-xs text-gray-400">Active Players</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-400">--</div>
                            <div className="text-xs text-gray-400">Running Campaigns</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-400">--</div>
                            <div className="text-xs text-gray-400">Sessions Completed</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                {/* Mastered Games */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="h-5 w-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Mastered Games</h2>
                      </div>
                      <Button 
                        size="sm" 
                        variant="glass"
                        onClick={handleOpenAddMasteredGamePopup}
                        disabled={!isDM}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {masteredGames.length === 0 ? (
                        <p className="text-gray-400 text-sm">No mastered games yet</p>
                      ) : (
                        masteredGames.map((game) => (
                          <div key={game._id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                            <div className="flex items-center space-x-2">
                              <Gamepad2 className="h-3 w-3 text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-white">{game.name}</p>
                                <p className="text-xs text-gray-400">{game.system}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMasteredGame(game._id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
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

      {/* Add Mastered Games Modal */}
      {showAddMasteredGamePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddMasteredGamePopup(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowAddMasteredGamePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Add Mastered Games
              </h2>
              <p className="text-gray-300">
                Search and add games you've mastered as a DM
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
                    value={masteredSearchTerm}
                    onChange={(e) => setMasteredSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchMasteredGames()}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <Button
                  onClick={handleSearchMasteredGames}
                  disabled={masteredSearchLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  {masteredSearchLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            {masteredSearchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                <p className="text-gray-400">Loading games...</p>
              </div>
            ) : availableMasteredGames.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2">
                <h3 className="text-sm font-medium text-white mb-3">
                  {masteredSearchTerm ? `Search Results for "${masteredSearchTerm}"` : 'Popular Games'}
                </h3>
                {availableMasteredGames.map((game) => (
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
                      onClick={() => handleAddToMastered(game)}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 ml-3"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : masteredSearchTerm ? (
              <div className="text-center py-4">
                <p className="text-gray-400">No games found matching "{masteredSearchTerm}"</p>
                <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                  onClick={() => {
                    setMasteredSearchTerm('');
                    handleSearchMasteredGames();
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
                onClick={() => setShowAddMasteredGamePopup(false)}
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
