import React, { useState } from 'react';
import { X, UserPlus, Search } from 'lucide-react';
import { User } from '../types';
import { publicAPI } from '../lib/api';
import Button from './ui/Button';

interface InvitePlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (playerIds: string[]) => Promise<void>;
  currentPlayers: User[];
  maxPlayers?: number;
  title?: string;
}

export default function InvitePlayersModal({
  isOpen,
  onClose,
  onInvite,
  currentPlayers,
  maxPlayers = 6,
  title = "Invite Players"
}: InvitePlayersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setSelectedPlayers([]);
    }
  }, [isOpen]);

  // Search players
  const handleSearch = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await publicAPI.getUsersForInvite();
      if (response.success && response.data) {
        const filtered = response.data.filter((user: User) => 
          (user.firstName.toLowerCase().includes(term.toLowerCase()) ||
           user.lastName.toLowerCase().includes(term.toLowerCase()) ||
           user.email.toLowerCase().includes(term.toLowerCase()) ||
           (user.nickname && user.nickname.toLowerCase().includes(term.toLowerCase()))) &&
          !currentPlayers.some(p => p._id === user._id) &&
          !selectedPlayers.some(p => p._id === user._id)
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePlayerSelect = (player: User) => {
    if (currentPlayers.length + selectedPlayers.length >= maxPlayers) {
      return; // Max players reached
    }
    setSelectedPlayers([...selectedPlayers, player]);
    setSearchResults(searchResults.filter(p => p._id !== player._id));
  };

  const handlePlayerRemove = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p._id !== playerId));
  };

  const handleInvite = async () => {
    if (selectedPlayers.length === 0) return;

    setIsInviting(true);
    try {
      await onInvite(selectedPlayers.map(p => p._id));
      onClose();
    } catch (error) {
      console.error('Error inviting players:', error);
    } finally {
      setIsInviting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Players Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Current Players</span>
              <span className="text-sm text-gray-400">
                {currentPlayers.length}/{maxPlayers}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPlayers.map(player => (
                <div
                  key={player._id}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {player.firstName} {player.lastName}
                </div>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for players to invite..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(player => (
                  <button
                    key={player._id}
                    type="button"
                    onClick={() => handlePlayerSelect(player)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-600 flex items-center space-x-3"
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
            {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="absolute z-10 w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-4 text-center text-gray-400">
                No players found matching "{searchTerm}"
              </div>
            )}
          </div>

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
                    className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    <span>{player.firstName} {player.lastName}</span>
                    <button
                      type="button"
                      onClick={() => handlePlayerRemove(player._id)}
                      className="ml-2 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Max Players Warning */}
          {currentPlayers.length + selectedPlayers.length >= maxPlayers && (
            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                Maximum number of players reached ({maxPlayers})
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedPlayers.length === 0 || isInviting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isInviting ? 'Inviting...' : `Invite ${selectedPlayers.length} Player${selectedPlayers.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
