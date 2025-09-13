import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Calendar, Gamepad2, BookOpen, Loader2 } from 'lucide-react';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { results, loading, search, getSuggestions, clearResults } = useGlobalSearch();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        search(query);
        getSuggestions(query);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, getSuggestions, clearResults]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (type: string, id: string) => {
    const routes = {
      user: `/admin/users/${id}`,
      session: `/admin/sessions/${id}`,
      game: `/admin/games/${id}`,
      campaign: `/admin/campaigns/${id}`
    };

    const route = routes[type as keyof typeof routes];
    if (route) {
      navigate(route);
      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'session': return <Calendar className="h-4 w-4" />;
      case 'game': return <Gamepad2 className="h-4 w-4" />;
      case 'campaign': return <BookOpen className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Rechercher dans toutes les ressources..."
          className="w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Recherche en cours...
            </div>
          ) : results && results.total > 0 ? (
            <div className="p-2">
              {/* Results Summary */}
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-700">
                {results.total} résultat{results.total > 1 ? 's' : ''} pour "{query}"
              </div>

              {/* Users */}
              {results.users.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Utilisateurs ({results.users.length})
                  </div>
                  {results.users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleResultClick('user', user._id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center space-x-3"
                    >
                      {getIcon('user')}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {user.email}
                        </div>
                      </div>
                      {user.isDM && (
                        <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded">
                          DM
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Sessions */}
              {results.sessions.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Sessions ({results.sessions.length})
                  </div>
                  {results.sessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => handleResultClick('session', session._id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center space-x-3"
                    >
                      {getIcon('session')}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {session.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {session.dm?.firstName} {session.dm?.lastName} • {formatDate(session.date)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        session.status === 'open' ? 'bg-green-600 text-white' :
                        session.status === 'full' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {session.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Games */}
              {results.games.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Jeux ({results.games.length})
                  </div>
                  {results.games.map((game) => (
                    <button
                      key={game._id}
                      onClick={() => handleResultClick('game', game._id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center space-x-3"
                    >
                      {getIcon('game')}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {game.name}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {game.publisher}
                        </div>
                      </div>
                      {game.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-600 text-white rounded">
                          Featured
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Campaigns */}
              {results.campaigns.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Campagnes ({results.campaigns.length})
                  </div>
                  {results.campaigns.map((campaign) => (
                    <button
                      key={campaign._id}
                      onClick={() => handleResultClick('campaign', campaign._id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center space-x-3"
                    >
                      {getIcon('campaign')}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {campaign.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {campaign.dm?.firstName} {campaign.dm?.lastName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              Aucun résultat trouvé pour "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
