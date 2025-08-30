import { useEffect, useState, useMemo } from 'react';
import { Game } from '../../lib/api';
import GameFilters from '../../components/games/GameFilters';
import { Loader2, AlertCircle } from 'lucide-react';
import { publicAPI } from '../../lib/api';
import { Card } from '../../components/ui/Card';

// Composant GameCard simple pour la page games
function SimpleGameCard({ game, onClick, className = "" }: { 
  game: Game; 
  onClick: (game: Game) => void; 
  className?: string;
}) {
  return (
    <Card 
      className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group cursor-pointer ${className}`}
      onClick={() => onClick(game)}
    >
      {/* Image de fond */}
      <div className="absolute inset-0 w-full h-full">
        {/* Fallback vers le gradient si pas d'image */}
        <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
            <div className="text-white text-2xl font-bold">🎲</div>
          </div>
        </div>
        
        {/* Image du jeu si disponible */}
        {game.images?.logo ? (
          <img 
            src={game.images.logo} 
            alt={`Image ${game.name}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        
        {/* Gradient overlay transparent -> opaque de haut en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Contenu en bas de la carte */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-display text-xl font-bold text-white mb-2">{game.name}</h3>
        <p className="text-gray-200 text-sm mb-3 line-clamp-2">{game.description}</p>
        
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
  );
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État des filtres simplifiés
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: 'all',
    system: 'all'
  });

      // Load games from API
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await publicAPI.getGames();
        
        if (response.success && response.data) {
          setGames(response.data);
        } else {
          setError(response.error || 'Error loading games');
        }
      } catch (err) {
        console.error('Error loading games:', err);
        setError('Server connection error');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // Générer les listes uniques de genres et systèmes
  const availableGenres = useMemo(() => {
    const genres = [...new Set(games.map(game => game.genre))];
    return genres.sort();
  }, [games]);

  const availableSystems = useMemo(() => {
    const systems = [...new Set(games.map(game => game.system))];
    return systems.sort();
  }, [games]);

      // Filter games based on criteria
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          game.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesGenre = filters.genre === 'all' || game.genre === filters.genre;
      const matchesSystem = filters.system === 'all' || game.system === filters.system;
      
      return matchesSearch && matchesGenre && matchesSystem;
    });
  }, [games, filters]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      genre: 'all',
      system: 'all'
    });
  };

  const handleGameClick = (game: Game) => {
    // TODO: Navigate to game detail page
    console.log('Selected game:', game.name);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Games Library</h1>
          <p className="text-gray-300">Discover our collection of tabletop role-playing games</p>
        </div>

        {/* Filtres */}
        <GameFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          availableGenres={availableGenres}
          availableSystems={availableSystems}
          totalResults={filteredGames.length}
        />

        {/* Games grid */}
        <div className="mt-8">
          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No games found</div>
              <p className="text-gray-500">Try modifying your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <SimpleGameCard
                  key={game._id}
                  game={game}
                  onClick={handleGameClick}
                  className="h-80"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}