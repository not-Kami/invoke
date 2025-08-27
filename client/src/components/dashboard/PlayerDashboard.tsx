import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { 
  Calendar, 
  Users, 
  Plus, 
  Sword, 
  User,
  Gamepad2,
  Heart,
  X,
  Settings,
  Crown,
  BarChart3
} from 'lucide-react';

interface PlayerDashboardProps {
  upcomingSessions: any[];
  loading: boolean;
  isAdmin: boolean;
  isDM: boolean;
  favoriteGames: any[];
  onAddFavoriteGame: () => void;
  onRemoveFavoriteGame: (gameId: string) => void;
}

export default function PlayerDashboard({
  upcomingSessions,
  loading,
  isAdmin,
  isDM,
  favoriteGames,
  onAddFavoriteGame,
  onRemoveFavoriteGame
}: PlayerDashboardProps) {
  // Debug: Log des données reçues
  console.log('🔍 PlayerDashboard Debug Info:');
  console.log('📊 upcomingSessions reçues:', upcomingSessions);
  console.log('⏳ loading:', loading);
  console.log('👑 isAdmin:', isAdmin);
  console.log('🎲 isDM:', isDM);
  console.log('❤️ favoriteGames:', favoriteGames);
  // Données mockées pour les fonctionnalités à venir
  const myCharacters = [
    {
      id: 1,
      name: "Thorin Barbe-de-Fer",
      class: "Guerrier Nain",
      level: 8,
      campaign: "Les Ombres de Valoria",
      avatar: null
    },
    {
      id: 2,
      name: "Zara Nova",
      class: "Netrunner",
      level: 4,
      campaign: "Cyberpunk Chronicles",
      avatar: null
    }
  ];

  const mySessions = [
    {
      id: 1,
      title: "The Mysteries of Arkham",
      game: "Call of Cthulhu",
      players: 4,
      maxPlayers: 6,
      nextSession: "2024-01-30",
      status: "active"
    },
    {
      id: 2,
      title: "Epic Fantasy Campaign",
      game: "D&D 5e",
      players: 6,
      maxPlayers: 6,
      nextSession: "2024-02-01",
      status: "full"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upcoming Games */}
      <div className="lg:col-span-2">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Upcoming Games</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-400">Loading sessions...</p>
              </div>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Gamepad2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{session.title}</h3>
                      <p className="text-sm text-gray-300">{session.game?.name || 'Unknown Game'}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Users className="h-3 w-3" />
                          <span>{session.players?.length || 0} joueurs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="info" size="sm">
                      {session.status || 'Unknown'}
                    </Badge>
                    <Badge variant="default" size="sm">
                      Session
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Aucune session à venir</p>
                <p className="text-xs text-gray-500 mt-1">
                  {upcomingSessions.length > 0 ? `${upcomingSessions.length} sessions trouvées, mais aucune à venir` : 'Aucune session trouvée'}
                </p>
                {(isAdmin || isDM) && (
                  <Button 
                    size="sm" 
                    variant="primary"
                    className="mt-2"
                    onClick={() => window.location.href = '/sessions/create'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une Session
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Characters - Grisé (upcoming feature) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6 opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-400">My Characters</h2>
                <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                  Coming Soon
                </Badge>
              </div>
              <Button size="sm" className="bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed" disabled>
                <Plus className="h-4 w-4 mr-2" />
                New Character
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCharacters.map((character) => (
                <div key={character.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar
                      firstName={character.name.split(' ')[0]}
                      lastName={character.name.split(' ')[1] || ''}
                      size="sm"
                    />
                    <div>
                      <h3 className="font-medium text-gray-300">{character.name}</h3>
                      <p className="text-sm text-gray-500">{character.class} • Level {character.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Level {character.level}</span>
                    <span>{character.campaign}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Tables - Grisé (upcoming feature) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6 opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-400">My Tables</h2>
                <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                  Coming Soon
                </Badge>
              </div>
              <Button size="sm" className="bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Join Table
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySessions.map((session) => (
                <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-300">{session.title}</h3>
                      <p className="text-sm text-gray-500">{session.game}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{session.players}/{session.maxPlayers} players</span>
                    <span>{session.nextSession}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar droite - Quick Actions et Favorites */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sword className="h-5 w-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0"
              onClick={() => window.location.href = '/sessions'}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Browse Sessions
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-purple-500 text-purple-400 hover:text-white hover:bg-purple-500"
              onClick={() => window.location.href = '/campaigns'}
            >
              <Users className="h-4 w-4 mr-2" />
              Find Campaigns
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-orange-500 text-orange-400 hover:text-white hover:bg-orange-500"
              onClick={() => window.location.href = '/games'}
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Discover Games
            </Button>
          </CardContent>
        </Card>

        {/* Favorite Games */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Favorite Games</h2>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-red-400 hover:text-white hover:bg-red-500/20"
                onClick={onAddFavoriteGame}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {favoriteGames.length > 0 ? (
              <div className="space-y-2">
                {favoriteGames.map((game) => (
                  <div key={game._id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                    <span className="text-sm text-white">{game.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-white hover:bg-red-500/20 p-1 h-6 w-6"
                      onClick={() => onRemoveFavoriteGame(game._id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No favorite games yet</p>
                <Button 
                  size="sm" 
                  variant="primary"
                  className="mt-2"
                  onClick={onAddFavoriteGame}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Games
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - Grisé (upcoming feature) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-400">Recent Activity</h2>
              <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                Coming Soon
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Joined "Epic Fantasy Campaign"</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Added D&D 5e to favorites</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Completed session "The Mysteries of Arkham"</p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}