import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface GameFiltersState {
  searchTerm: string;
  genre: string;
  system: string;
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
    filters.system !== 'all';

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      {/* Header avec nombre de résultats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filtres</span>
        </div>
        <div className="text-sm text-gray-400">
          {totalResults} jeu{totalResults > 1 ? 'x' : ''} trouvé{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, description..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      </div>

      {/* Bouton de réinitialisation */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Réinitialiser les filtres</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameFilters;
