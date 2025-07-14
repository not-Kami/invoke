import React, { useEffect, useState } from 'react';
import { Game } from '@/types';
import { gamesApi } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Search, Gamepad2 } from 'lucide-react';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gamesApi.getGames();
        setGames(response.data);
        setFilteredGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.system.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(game => game.genre === genreFilter);
    }

    setFilteredGames(filtered);
  }, [games, searchTerm, genreFilter]);

  // Get unique genres for filter
  const genres = Array.from(new Set(games.map(game => game.genre)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Game Systems</h1>
        <p className="mt-2 text-gray-600">
          Explore different tabletop RPG systems and find your next adventure
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No games found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg mb-4 flex items-center justify-center">
                      <Gamepad2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {game.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="info">
                        {game.genre}
                      </Badge>
                      <Badge variant="default">
                        {game.system}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {game.description}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Added {new Date(game.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}