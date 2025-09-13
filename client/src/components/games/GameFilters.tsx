
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
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 mb-8">
      {/* Header with results count */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Filter className="h-6 w-6 text-purple-400" />
          <span className="text-lg font-semibold text-white">Search & Filters</span>
        </div>
        <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
          {totalResults} game{totalResults > 1 ? 's' : ''} found
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by name, description..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="pl-12 py-3 text-lg"
        />
      </div>

      {/* Main filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Genre filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-200 mb-3">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          >
            <option value="all">All genres</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* System filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-200 mb-3">
            System
          </label>
          <select
            value={filters.system}
            onChange={(e) => handleFilterChange('system', e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          >
            <option value="all">All systems</option>
            {availableSystems.map(system => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center space-x-2 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200"
          >
            <X className="h-4 w-4" />
            <span>Reset filters</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameFilters;
