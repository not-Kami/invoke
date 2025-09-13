import { useState, useMemo, useEffect } from 'react';
import { Game } from '../../lib/api';
import GameFilters from '../../components/games/GameFilters';
import GameCard from '../../components/games/GameCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { publicAPI } from '../../lib/api';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';


export default function GamesPage() {
  // État des filtres simplifiés
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: 'all',
    system: 'all'
  });

  // État pour les jeux mis en avant
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Charger les jeux mis en avant
  useEffect(() => {
    const loadFeaturedGames = async () => {
      try {
        setFeaturedLoading(true);
        const response = await publicAPI.getFeaturedGames();
        if (response.success && response.data) {
          setFeaturedGames(response.data);
        }
      } catch (error) {
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadFeaturedGames();
  }, []);

  // Utiliser le hook de scroll infini pour les autres jeux
  const {
    items: regularGames,
    loading: regularLoading,
    error,
    hasMore,
    lastElementRef,
    reset
  } = useInfiniteScroll<Game>(
    publicAPI.getGamesPaginated as any, // Type assertion pour éviter les conflits de types
    12, // 12 jeux par page
    { threshold: 0.1 }, // Charger quand on est à 10% du bas
    filters.searchTerm,
    filters.genre,
    filters.system
  );

  // Filtrer les jeux réguliers pour éviter les doublons avec les jeux mis en avant
  const featuredGameIds = new Set(featuredGames.map(game => game._id));
  const filteredRegularGames = regularGames.filter(game => !featuredGameIds.has(game._id));
  
  // Combiner les jeux mis en avant et les jeux réguliers (sans doublons)
  const allGames = [...featuredGames, ...filteredRegularGames];
  const loading = featuredLoading || regularLoading;

  // Générer les listes uniques de genres et systèmes
  const availableGenres = useMemo(() => {
    const genres = [...new Set(allGames.map(game => game.genre))];
    return genres.sort();
  }, [allGames]);

  const availableSystems = useMemo(() => {
    const systems = [...new Set(allGames.map(game => game.system))];
    return systems.sort();
  }, [allGames]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Réinitialiser la liste quand les filtres changent
    reset();
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      genre: 'all',
      system: 'all'
    });
    // Réinitialiser la liste quand on efface les filtres
    reset();
  };

  const handleGameClick = (_game: Game) => {
    // TODO: Navigate to game detail page
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Games Library</h1>
          <p className="text-gray-300 text-lg">Discover our collection of tabletop role-playing games</p>
        </div>

        {/* Filtres */}
        <GameFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          availableGenres={availableGenres}
          availableSystems={availableSystems}
          totalResults={allGames.length}
        />

        {/* Grille des jeux */}
        {allGames.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No games found</div>
            <p className="text-gray-500">Try modifying your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allGames.map((game, index) => (
                <GameCard
                  key={`game-${game._id}-${index}`}
                  game={game}
                  onClick={handleGameClick}
                  className={`h-96 ${featuredGames.some(fg => fg._id === game._id) ? 'border-2 border-yellow-400/30' : ''}`}
                  ref={index === allGames.length - 1 ? lastElementRef : undefined}
                />
            ))}
          </div>
        )}

        {/* Indicateur de chargement pour le scroll infini */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Chargement de plus de jeux...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}