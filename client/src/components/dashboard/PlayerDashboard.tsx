
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Plus, 
  Sword, 
  User,
  Gamepad2,
  Heart,
  X,
  CheckCircle2,
  UserPlus
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
  const navigate = useNavigate();
  // Debug: Log des données reçues
  // Aperçu démo — fiches d'exemple, pas le compte connecté.
  const myCharacters = [
    {
      id: 1,
      name: "Thorin Barbe-de-Fer",
      role: "Guerrier nain",
      level: 8,
      campaign: "Les Ombres de Valoria",
      table: "Table du mercredi",
      accent: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      name: "Zara Nova",
      role: "Netrunner",
      level: 4,
      campaign: "Chroniques de Night City",
      table: "One-shot du vendredi",
      accent: "from-cyan-500 to-blue-600"
    }
  ];

  const myTables = [
    {
      id: 1,
      title: "Les Mystères d'Arkham",
      game: "L'Appel de Cthulhu",
      players: 4,
      maxPlayers: 6,
      nextSession: "2026-10-08",
      place: "En ligne",
      status: "Ouverte"
    },
    {
      id: 2,
      title: "Campagne des Cinq Couronnes",
      game: "D&D 5e",
      players: 6,
      maxPlayers: 6,
      nextSession: "2026-10-15",
      place: "Bruxelles",
      status: "Complète"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      label: "A rejoint la table « Campagne des Cinq Couronnes »",
      when: "Il y a 2 heures",
      icon: UserPlus,
      tone: "text-green-300 bg-green-500/20"
    },
    {
      id: 2,
      label: "A ajouté D&D 5e aux jeux favoris",
      when: "Hier",
      icon: Heart,
      tone: "text-blue-300 bg-blue-500/20"
    },
    {
      id: 3,
      label: "Session jouée — Les Mystères d'Arkham",
      when: "Il y a 3 jours",
      icon: CheckCircle2,
      tone: "text-purple-300 bg-purple-500/20"
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
                <div 
                  key={session._id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => navigate(`/sessions/${session._id}`)}
                >
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

        {/* My Characters — aperçu démo */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">My Characters</h2>
                <Badge variant="info" size="sm">Preview</Badge>
              </div>
              <Button size="sm" className="bg-white/10 text-gray-300 border-white/10 cursor-not-allowed" disabled>
                <Plus className="h-4 w-4 mr-2" />
                New Character
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Sample sheets. They are not linked to this account yet.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCharacters.map((character) => {
                const [firstName, ...rest] = character.name.split(' ');
                return (
                  <div key={character.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar
                        firstName={firstName}
                        lastName={rest.join(' ')}
                        size="lg"
                        className={`bg-gradient-to-br ${character.accent}`}
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">{character.name}</h3>
                        <p className="text-sm text-gray-300">{character.role}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Level {character.level}</span>
                        <span>10</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${character.accent}`}
                          style={{ width: `${character.level * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>{character.campaign}</p>
                      <p className="text-xs text-gray-400">{character.table}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* My Tables — aperçu démo */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">My Tables</h2>
                <Badge variant="info" size="sm">Preview</Badge>
              </div>
              <Button size="sm" className="bg-white/10 text-gray-300 border-white/10 cursor-not-allowed" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Join Table
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Sample tables. Seats and dates are examples.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTables.map((table) => (
                <div key={table.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">{table.title}</h3>
                        <p className="text-sm text-gray-300">{table.game}</p>
                      </div>
                    </div>
                    <Badge variant={table.status === 'Complète' ? 'warning' : 'success'} size="sm">
                      {table.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3" aria-hidden="true">
                    {Array.from({ length: table.maxPlayers }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 flex-1 rounded-full ${index < table.players ? 'bg-purple-400' : 'bg-white/15'}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{table.players}/{table.maxPlayers} players · {table.place}</span>
                    <span>{new Date(table.nextSession).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
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

        {/* Recent Activity — aperçu démo */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Badge variant="info" size="sm">Preview</Badge>
            </div>
            <p className="text-sm text-gray-400 mt-2">Sample feed. Nothing here is saved.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg border border-white/10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.when}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}