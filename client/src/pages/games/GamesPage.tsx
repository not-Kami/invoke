import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Game, Session, Campaign, adminAPI } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import GameFilters, { GameFiltersState } from '../../components/games/GameFilters';
import GameCard from '../../components/games/GameCard';
import Pagination from '../../components/ui/Pagination';
import { Gamepad2, Loader2, Users, Calendar, MapPin, Clock } from 'lucide-react';

export default function GamesPage() {
  const [searchParams] = useSearchParams();
  const selectedGameId = searchParams.get('game');
  
  const [games, setGames] = useState<Game[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // État des filtres
  const [filters, setFilters] = useState<GameFiltersState>({
    searchTerm: '',
    genre: 'all',
    system: 'all',
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Données mockées pour le développement
  const mockGames: Game[] = [
    {
      _id: '1',
      name: 'Dungeons & Dragons 5e',
      description: 'Le système de jeu de rôle fantastique le plus populaire au monde. Créez des héros épiques et partez à l\'aventure dans des mondes magiques remplis de dragons, de donjons et de trésors légendaires.',
      genre: 'Fantasy',
      system: 'D&D 5e',
      images: {
        logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop&crop=center'
      },
      featured: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Call of Cthulhu',
      description: 'Un jeu d\'horreur cosmique basé sur les œuvres de H.P. Lovecraft. Les joueurs incarnent des investigateurs confrontés à des forces anciennes et maléfiques qui menacent l\'humanité.',
      genre: 'Horreur',
      system: 'BRP',
      images: {
        logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop&crop=center'
      },
      featured: false,
      createdAt: '2024-02-20T14:30:00Z',
      updatedAt: '2024-02-20T14:30:00Z'
    },
    {
      _id: '3',
      name: 'Cyberpunk Red',
      description: 'Plongez dans un futur dystopique où la technologie et la cybernétique règnent en maître. Incarnez des mercenaires, des hackers et des street samouraïs dans Night City.',
      genre: 'Science-Fiction',
      system: 'Cyberpunk Red',
      images: {
        logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1518709268806-4e9042af2176?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1518709268807-4e9042af2176?w=1200&h=400&fit=crop&crop=center'
      },
      featured: true,
      createdAt: '2024-03-10T09:15:00Z',
      updatedAt: '2024-03-10T09:15:00Z'
    },
    {
      _id: '4',
      name: 'Vampire: The Masquerade',
      description: 'Un jeu de rôle gothique où les joueurs incarnent des vampires dans un monde moderne. Gagnez en puissance tout en maintenant le secret de votre nature vampirique.',
      genre: 'Horreur',
      system: 'Storyteller',
      images: {
        logo: 'https://images.unsplash.com/photo-1518709268808-4e9042af2176?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1518709268809-4e9042af2176?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1518709268810-4e9042af2176?w=1200&h=400&fit=crop&crop=center'
      },
      featured: false,
      createdAt: '2024-04-05T20:45:00Z',
      updatedAt: '2024-04-05T16:45:00Z'
    },
    {
      _id: '5',
      name: 'Pathfinder 2e',
      description: 'Un système de jeu de rôle fantastique offrant une grande liberté de création de personnages et des règles tactiques sophistiquées pour des combats épiques.',
      genre: 'Fantasy',
      system: 'Pathfinder 2e',
      images: {
        logo: 'https://images.unsplash.com/photo-1518709268811-4e9042af2176?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1518709268812-4e9042af2176?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1518709268813-4e9042af2176?w=1200&h=400&fit=crop&crop=center'
      },
      featured: false,
      createdAt: '2024-05-12T11:20:00Z',
      updatedAt: '2024-05-12T11:20:00Z'
    },
    {
      _id: '6',
      name: 'Star Wars: Edge of the Empire',
      description: 'Explorez la galaxie Star Wars en incarnant des contrebandiers, des chasseurs de primes et des explorateurs dans les territoires de la Bordure Extérieure.',
      genre: 'Science-Fiction',
      system: 'Genesys',
      images: {
        logo: 'https://images.unsplash.com/photo-1518709268814-4e9042af2176?w=400&h=400&fit=crop&crop=center',
        portrait: 'https://images.unsplash.com/photo-1518709268815-4e9042af2176?w=600&h=800&fit=crop&crop=center',
        banner: 'https://images.unsplash.com/photo-1518709268816-4e9042af2176?w=1200&h=400&fit=crop&crop=center'
      },
      featured: true,
      createdAt: '2024-06-18T13:10:00Z',
      updatedAt: '2024-06-18T13:10:00Z'
    }
  ];

  useEffect(() => {
    // Simuler un chargement API avec des données mockées
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser les données mockées pour le développement
        setGames(mockGames);
        setTotalResults(mockGames.length);
        setTotalPages(Math.ceil(mockGames.length / 6)); // 6 jeux par page
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]);
        setTotalResults(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Récupérer les sessions et campagnes du jeu sélectionné
  useEffect(() => {
    if (selectedGameId) {
      // Simuler la récupération des sessions et campagnes
      const mockSessions: Session[] = [
        {
          _id: '1',
          title: 'Session D&D - Les Mines de Phandelver',
          description: 'Une aventure épique dans les mines perdues',
          date: '2024-08-20T19:00:00Z',
          sessionType: 'online',
          isOneShot: false,
          game: mockGames.find(g => g._id === selectedGameId) || mockGames[0],
          dm: { _id: 'dm1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', isDM: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          players: [],
          status: 'open',
          createdAt: '2024-08-01T00:00:00Z',
          updatedAt: '2024-08-01T00:00:00Z'
        },
        {
          _id: '2',
          title: 'Session D&D - Combat contre le Dragon',
          description: 'Un combat épique contre un dragon ancien',
          date: '2024-08-25T19:00:00Z',
          sessionType: 'offline',
          isOneShot: true,
          game: mockGames.find(g => g._id === selectedGameId) || mockGames[0],
          dm: { _id: 'dm2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'user', isDM: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          players: [],
          status: 'open',
          createdAt: '2024-08-01T00:00:00Z',
          updatedAt: '2024-08-01T00:00:00Z'
        }
      ];

      const mockCampaigns: Campaign[] = [
        {
          _id: '1',
          name: 'Campagne D&D - Les Royaumes Oubliés',
          description: 'Une campagne épique dans les Royaumes Oubliés',
          game: mockGames.find(g => g._id === selectedGameId) || mockGames[0],
          dm: { _id: 'dm1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', isDM: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          players: [],
          sessions: [],
          active: true,
          createdAt: '2024-08-01T00:00:00Z',
          updatedAt: '2024-08-01T00:00:00Z'
        }
      ];

      setSessions(mockSessions);
      setCampaigns(mockCampaigns);
    } else {
      setSessions([]);
      setCampaigns([]);
    }
  }, [selectedGameId]);

  // Filtrer et trier les jeux
  const filteredAndSortedGames = useMemo(() => {
    let filtered = [...games];

    // Filtre par recherche
    if (filters.searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        game.system.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtre par genre
    if (filters.genre !== 'all') {
      filtered = filtered.filter(game => game.genre === filters.genre);
    }

    // Filtre par système
    if (filters.system !== 'all') {
      filtered = filtered.filter(game => game.system === filters.system);
    }

    // Filtre par featured
    if (filters.featured) {
      filtered = filtered.filter(game => game.featured);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'genre':
          aValue = a.genre.toLowerCase();
          bValue = b.genre.toLowerCase();
          break;
        case 'system':
          aValue = a.system.toLowerCase();
          bValue = b.system.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [games, filters]);

  // Pagination
  const paginatedGames = useMemo(() => {
    const gamesPerPage = 6;
    const startIndex = (currentPage - 1) * gamesPerPage;
    return filteredAndSortedGames.slice(startIndex, startIndex + gamesPerPage);
  }, [filteredAndSortedGames, currentPage]);

  // Mettre à jour la pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredAndSortedGames.length / 6));
  }, [filteredAndSortedGames]);

  // Obtenir les genres et systèmes uniques pour les filtres
  const availableGenres = useMemo(() => 
    Array.from(new Set(games.map(game => game.genre))).sort(),
    [games]
  );

  const availableSystems = useMemo(() => 
    Array.from(new Set(games.map(game => game.system))).sort(),
    [games]
  );

  const handleFiltersChange = (newFilters: GameFiltersState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      genre: 'all',
      system: 'all',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleGameClick = (game: Game) => {
    // TODO: Navigation vers la page de détail du jeu
    console.log('Game clicked:', game);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement des jeux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Systèmes de Jeu</h1>
          <p className="mt-2 text-gray-300">
            Explorez différents systèmes de jeux de rôle sur table et trouvez votre prochaine aventure
          </p>
        </div>

        {/* Filtres */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <GameFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              availableGenres={availableGenres}
              availableSystems={availableSystems}
              totalResults={filteredAndSortedGames.length}
            />
          </CardContent>
        </Card>

        {/* Affichage conditionnel : Sessions/Campagnes du jeu ou Grille des jeux */}
        {selectedGameId ? (
          // Affichage des sessions et campagnes du jeu sélectionné
          <div className="space-y-8">
            {/* Sessions du jeu */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Sessions de {games.find(g => g._id === selectedGameId)?.name}</h3>
              {sessions.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">Aucune session trouvée</h4>
                    <p className="text-gray-300">Aucune session n'est programmée pour ce jeu pour le moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session) => (
                    <Card key={session._id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-white">{session.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.status === 'open' ? 'bg-green-500/20 text-green-300' :
                            session.status === 'full' ? 'bg-yellow-500/20 text-yellow-300' :
                            session.status === 'finished' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {session.status === 'open' ? 'Ouverte' :
                             session.status === 'full' ? 'Complète' :
                             session.status === 'finished' ? 'Terminée' : 'Annulée'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{session.description}</p>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(session.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {session.sessionType === 'online' ? 'En ligne' : 'En présentiel'}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            DM: {session.dm.firstName} {session.dm.lastName}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Campagnes du jeu */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Campagnes de {games.find(g => g._id === selectedGameId)?.name}</h3>
              {campaigns.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8 text-center">
                    <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">Aucune campagne trouvée</h4>
                    <p className="text-gray-300">Aucune campagne n'est active pour ce jeu pour le moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <Card key={campaign._id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-white">{campaign.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            campaign.active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {campaign.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{campaign.description}</p>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            DM: {campaign.dm.firstName} {campaign.dm.lastName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {campaign.sessions.length} session(s)
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton retour */}
            <div className="text-center pt-8">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                ← Retour à tous les jeux
              </button>
            </div>
          </div>
        ) : (
          // Affichage normal de la grille des jeux
          <>
            {paginatedGames.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Aucun jeu trouvé
                  </h3>
                  <p className="text-gray-300">
                    {filters.searchTerm || filters.genre !== 'all' || filters.system !== 'all' || filters.featured
                      ? 'Essayez d\'ajuster vos critères de recherche.'
                      : 'Les systèmes de jeu apparaîtront ici quand ils seront disponibles.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedGames.map((game) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      onClick={() => handleGameClick(game)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}