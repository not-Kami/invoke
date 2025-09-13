import { useState, useEffect } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { User } from '../types';
import { adminAPI } from '../lib/api';

interface PlayerSearchProps {
  selectedPlayers: User[];
  onPlayerSelect: (player: User) => void;
  onPlayerRemove: (playerId: string) => void;
  placeholder?: string;
}

export default function PlayerSearch({ 
  selectedPlayers, 
  onPlayerSelect, 
  onPlayerRemove,
  placeholder = "Search for players to invite..."
}: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await adminAPI.getUsers();
        if (response.success && response.data) {
          const filtered = response.data.filter((user: User) => 
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.nickname && user.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          setSearchResults(filtered);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error searching players:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePlayerSelect = (player: User) => {
    onPlayerSelect(player);
    setSearchTerm('');
    setShowResults(false);
  };

  const isPlayerSelected = (player: User) => {
    return selectedPlayers.some(p => p._id === player._id);
  };

  return (
    <div className="space-y-4">
      {/* Selected Players */}
      {selectedPlayers.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Selected Players ({selectedPlayers.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map(player => (
              <div
                key={player._id}
                className="flex items-center bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
              >
                <span>{player.firstName} {player.lastName}</span>
                <button
                  type="button"
                  onClick={() => onPlayerRemove(player._id)}
                  className="ml-2 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults
              .filter(player => !isPlayerSelected(player))
              .map(player => (
                <button
                  key={player._id}
                  type="button"
                  onClick={() => handlePlayerSelect(player)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={`${player.firstName} ${player.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-300">
                        {player.firstName[0]}{player.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.email}
                    </div>
                    {player.nickname && (
                      <div className="text-xs text-purple-400">
                        @{player.nickname}
                      </div>
                    )}
                  </div>
                  <UserPlus className="h-4 w-4 text-purple-400" />
                </button>
              ))}
          </div>
        )}

        {/* No Results */}
        {showResults && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 text-center text-gray-400">
            No players found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
