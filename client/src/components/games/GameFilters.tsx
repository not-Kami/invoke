import React from 'react';
import { Search, Filter, X, Star } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export interface GameFiltersState {
  searchTerm: string;
  genre: string;
  system: string;
  featured: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface GameFiltersProps {
  filters: GameFiltersState;
  onFiltersChange: (filters: GameFiltersState) => void;
  onClearFilters: () => void;
  availableGenres: string[];
  availableSystems: string[];
  totalResults: number;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  availableGenres,
  availableSystems,
  totalResults
}) => {
  const handleFilterChange = (key: keyof GameFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = filters.searchTerm || 
    filters.genre !== 'all' || 
    filters.system !== 'all' || 
    filters.featured || 
    filters.sortBy !== 'createdAt';

  return (
    <div className="space-y-4">
      {/* Header avec nombre de résultats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filtres</span>
        </div>
        <div className="text-sm text-gray-400">
          {totalResults} jeu{totalResults > 1 ? 'x' : ''} trouvé{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, description..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre par genre */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">Tous les genres</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Filtre par système */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Système
          </label>
          <select
            value={filters.system}
            onChange={(e) => handleFilterChange('system', e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">Tous les systèmes</option>
            {availableSystems.map(system => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
        </div>

        {/* Filtre par tri */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trier par
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="createdAt">Date d'ajout</option>
            <option value="name">Nom</option>
            <option value="genre">Genre</option>
            <option value="system">Système</option>
          </select>
        </div>
      </div>

      {/* Filtres additionnels et boutons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Filtre featured */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-800"
            />
            <span className="text-sm text-gray-300 flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>En vedette</span>
            </span>
          </label>

          {/* Ordre de tri */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Ordre:</span>
            <Button
              variant={filters.sortOrder === 'asc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('sortOrder', 'asc')}
              className="px-2 py-1 text-xs"
            >
              ↑
            </Button>
            <Button
              variant={filters.sortOrder === 'desc' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('sortOrder', 'desc')}
              className="px-2 py-1 text-xs"
            >
              ↓
            </Button>
          </div>
        </div>

        {/* Bouton réinitialiser */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filtres actifs affichés */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
          {filters.searchTerm && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>Recherche: "{filters.searchTerm}"</span>
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.genre !== 'all' && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>Genre: {filters.genre}</span>
              <button
                onClick={() => handleFilterChange('genre', 'all')}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.system !== 'all' && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>Système: {filters.system}</span>
              <button
                onClick={() => handleFilterChange('system', 'all')}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="info" className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>En vedette</span>
              <button
                onClick={() => handleFilterChange('featured', false)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GameFilters;
