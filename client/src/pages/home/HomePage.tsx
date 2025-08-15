import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sword, 
  Crown, 
  Users, 
  Calendar, 
  Gamepad2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Eye, 
  Heart 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import HeroImage from '../../assets/hero_section.webp';
import { Game, Session } from '../../types';
import { useFavoriteGames } from '../../hooks/useFavoriteGames';
import { useAuth } from '../../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteGames, addFavoriteGame, removeFavoriteGame, isFavorite } = useFavoriteGames();
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Recalculer le centrage quand la taille change
  useEffect(() => {
    const handleResize = () => {
      // Force re-render pour recalculer le centrage
      setCurrentGameIndex(prev => prev);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // État pour les jeux mis en avant
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour les sessions mises en avant
  const [featuredSessions, setFeaturedSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Récupérer les jeux mis en avant depuis l'API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/games');
        if (response.ok) {
          const data = await response.json();
          const featured = data.data.filter((game: Game) => game.featured);
          console.log('⭐ Jeux mis en avant:', featured);
          setFeaturedGames(featured);
        }
      } catch (error) {
        console.error('Erreur chargement jeux:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  // Récupérer les sessions mises en avant depuis l'API
  useEffect(() => {
    const fetchFeaturedSessions = async () => {
      try {
        setSessionsLoading(true);
        const response = await fetch('/api/v1/sessions?featured=true&limit=6');
        if (response.ok) {
          const data = await response.json();
          console.log('⭐ Sessions mises en avant:', data.data);
          setFeaturedSessions(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement sessions:', error);
        // Fallback vers des sessions mockées si l'API échoue
        const mockSessions: Session[] = [
          {
            _id: 'session1',
            title: 'Aventure Épique',
            description: 'Une quête légendaire dans les terres mystérieuses',
            date: '2024-08-20T19:00:00Z',
            sessionType: 'online',
            isOneShot: false,
            game: {
              _id: 'game1',
              name: 'Dungeons & Dragons 5e',
              description: 'Le jeu de rôle fantastique par excellence',
              genre: 'Fantasy',
              system: 'D&D 5e',
              images: { portrait: '/images/dnd5e.jpg' },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            dm: {
              _id: 'dm1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              role: 'user',
              isDM: true,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            players: [],
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: 'session2',
            title: 'Horreur Cosmique',
            description: 'Plongez dans l\'univers de Lovecraft',
            date: '2024-08-22T20:00:00Z',
            sessionType: 'offline',
            isOneShot: true,
            game: {
              _id: 'game2',
              name: 'Call of Cthulhu',
              description: 'Horreur cosmique et mystère',
              genre: 'Horreur',
              system: 'CoC 7e',
              images: { portrait: '/images/callofcthulhu.jpg' },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            dm: {
              _id: 'dm2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              role: 'user',
              isDM: true,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            players: [],
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ];
        setFeaturedSessions(mockSessions);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchFeaturedSessions();
  }, []);

  // Fonction pour aller au jeu suivant
  const nextGame = () => {
    setCurrentGameIndex((prev) => 
      prev === featuredGames.length - 1 ? 0 : prev + 1
    );
  };

  // Fonction pour aller au jeu précédent
  const prevGame = () => {
    setCurrentGameIndex((prev) => 
      prev === 0 ? featuredGames.length - 1 : prev - 1
    );
  };

  // Fonction pour aller directement à une carte spécifique
  const goToGame = (index: number) => {
    setCurrentGameIndex(index);
  };

  // Calcul simple du centrage
  const getSliderTransform = () => {
    const cardWidth = isMobile ? 240 : 296;
    const gap = isMobile ? 8 : 16;
    const totalWidth = cardWidth + gap;
    
    // Centrer la carte active
    const centerOffset = (window.innerWidth - cardWidth) / 2;
    return -currentGameIndex * totalWidth + centerOffset;
  };

  // Fonctions pour le drag & drop simple
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(currentGameIndex * (isMobile ? 240 : 296));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const cardWidth = isMobile ? 240 : 296;
    const newIndex = Math.round((-walk + scrollLeft) / cardWidth);
    
    // Limiter aux bornes du slider
    const clampedIndex = Math.max(0, Math.min(featuredGames.length - 1, newIndex));
    setCurrentGameIndex(clampedIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Support tactile pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(currentGameIndex * (isMobile ? 240 : 296));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    const cardWidth = isMobile ? 240 : 296;
    const newIndex = Math.round((-walk + scrollLeft) / cardWidth);
    
    // Limiter aux bornes du slider
    const clampedIndex = Math.max(0, Math.min(featuredGames.length - 1, newIndex));
    setCurrentGameIndex(clampedIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Fonction pour gérer l'ajout/suppression des favoris
  const handleToggleFavorite = async (e: React.MouseEvent, game: Game) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      console.log('Utilisateur non connecté');
      return;
    }

    try {
      if (isFavorite(game._id)) {
        await removeFavoriteGame(game._id);
      } else {
        await addFavoriteGame(game);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  // Fonction pour naviguer vers la page Games avec le jeu sélectionné
  const handleGameClick = (game: Game) => {
    navigate(`/games?game=${game._id}`);
  };

  // Fonction pour naviguer vers la page Sessions avec la session sélectionnée
  const handleSessionClick = (session: Session) => {
    navigate(`/sessions/${session._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${HeroImage})`
          }}
        ></div>
        
        {/* Overlay Filters */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-transparent to-blue-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <div className="flex justify-end">
            {/* Main Content - Aligned Right */}
            <div className="text-right max-w-3xl">
              <div className="inline-flex items-center bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-purple-300 text-sm font-medium">Your Next Adventure Awaits</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Roll the Dice,<br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Write Your Legend
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl ml-auto">
                Connect with legendary dungeon masters, join epic campaigns, and forge unforgettable stories 
                in the ultimate tabletop RPG community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link to="/sessions/create">
                  <Button variant="glass" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Onto your next an Adventure
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 shadow-2xl opacity-50 cursor-not-allowed"
                  disabled
                  title="Fonctionnalité à venir"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Hire a Dungeon Master
                  <span className="ml-2 text-sm text-gray-300">(À venir)</span>
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md ml-auto">
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">156+</div>
                  <div className="text-gray-300 text-sm">Adventurers</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">24</div>
                  <div className="text-gray-300 text-sm">Active Sessions</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">12</div>
                  <div className="text-gray-300 text-sm">Master DMs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Jeux Mis en Avant */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Jeux Mis en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Découvrez notre sélection de jeux recommandés</p>
          </div>
        </div>
        
        {/* Slider des jeux mis en avant */}
        <div className="relative group w-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Chargement des jeux...</span>
              </div>
            </div>
          ) : featuredGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucun jeu mis en avant</h3>
              <p className="text-slate-400">Les administrateurs peuvent mettre en avant des jeux depuis le panneau d'administration.</p>
            </div>
          ) : (
            <>
              {/* Boutons de navigation */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={prevGame}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={nextGame}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Container des cartes avec scroll horizontal */}
              <div 
                ref={containerRef}
                className={`relative overflow-hidden w-full px-4 sm:px-8 py-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  ref={sliderRef}
                  className="flex space-x-2 sm:space-x-4 transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(${getSliderTransform()}px)`,
                    width: `${featuredGames.length * (isMobile ? 256 : 280) + (featuredGames.length - 1) * (isMobile ? 8 : 16)}px`
                  }}
                >
                  {featuredGames.map((game, index) => (
                <div 
                  key={`${game._id}-${index}`}
                  className={`flex-shrink-0 w-60 sm:w-64 transition-all duration-300 transform card-hover ${
                    index === currentGameIndex ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <Card 
                    className="relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group h-72 sm:h-80 cursor-pointer"
                    onClick={() => handleGameClick(game)}
                  >
                    {/* Image de fond - Portrait en priorité pour les cartes */}
                    <div className="absolute inset-0 w-full h-full">
                      {/* Fallback vers le gradient si pas d'images */}
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                          <Gamepad2 className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Image portrait si disponible */}
                      {game.images?.portrait ? (
                        <img 
                          src={game.images.portrait} 
                          alt={`Portrait ${game.name}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onLoad={() => console.log('✅ Image portrait chargée pour', game.name, ':', game.images.portrait)}
                          onError={(e) => console.error('❌ Erreur chargement image pour', game.name, ':', e)}
                        />
                      ) : null}
                      
                      {/* Gradient overlay transparent -> opaque de haut en bas */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Bouton favori en haut à droite */}
                    <div className="absolute top-3 right-3 z-10">
                      <button 
                        className={`w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110 ${
                          isFavorite(game._id) ? 'bg-red-500/80 hover:bg-red-600/80' : ''
                        }`}
                        onClick={(e) => handleToggleFavorite(e, game)}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(game._id) ? 'fill-current text-red-200' : ''}`} />
                      </button>
                    </div>

                    {/* Badge Mis en avant pour les jeux featured */}
                    {game.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="success" size="sm">Mis en avant</Badge>
                      </div>
                    )}

                    {/* Contenu en bas de la carte */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="font-display text-xl font-bold text-white mb-2">{game.name}</h3>
                      
                      {/* Métadonnées compactes */}
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {game.genre}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {game.system}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
            </>
          )}
        </div>
      </section>

      {/* Sessions Mises en Avant */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-400" />
              <h2 className="font-display text-3xl font-bold text-white">Sessions Mises en Avant</h2>
            </div>
            <p className="text-gray-300 text-lg">Rejoignez des aventures extraordinaires</p>
          </div>

          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Chargement des sessions...</span>
              </div>
            </div>
          ) : featuredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune session mise en avant</h3>
              <p className="text-slate-400">Les administrateurs peuvent mettre en avant des sessions depuis le panneau d'administration.</p>
            </div>
          ) : (
            <>
              {/* Navigation flèches */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {/* TODO: Navigation sessions */}}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {/* TODO: Navigation sessions */}}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Grille des sessions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSessions.map((session) => (
                  <div key={session._id} className="group">
                    <Card 
                      className="relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group h-80 cursor-pointer"
                      onClick={() => handleSessionClick(session)}
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
                        {session.game.images?.portrait ? (
                          <img 
                            src={session.game.images.portrait} 
                            alt={`Portrait ${session.game.name}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoad={() => console.log('✅ Image portrait chargée pour', session.game.name, ':', session.game.images.portrait)}
                            onError={(e) => console.error('❌ Erreur chargement image pour', session.game.name, ':', e)}
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
                            {session.game.genre}
                          </span>
                          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            {session.game.system}
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
                ))}
              </div>

              {/* Bouton Voir toutes les sessions */}
              <div className="text-center mt-8">
                <Link to="/sessions">
                  <Button variant="ghost" className="text-purple-400 hover:text-white">
                    Voir toutes les sessions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>


    </div>
  );
}