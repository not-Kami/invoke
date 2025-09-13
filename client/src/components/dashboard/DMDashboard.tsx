
import { Card, CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Plus, 
  Crown,
  Star,
  X,
  Sword,
  Gamepad2,
  BarChart3,
  Settings
} from 'lucide-react';

interface DMDashboardProps {
  masteredGames: any[];
  sessions: any[];
  loading: boolean;
  userId: string;
  onAddMasteredGame: () => void;
  onRemoveMasteredGame: (gameId: string) => void;
}

export default function DMDashboard({
  masteredGames,
  sessions,
  loading,
  userId,
  onAddMasteredGame,
  onRemoveMasteredGame
}: DMDashboardProps) {
  const navigate = useNavigate();
  // Debug: Log des données reçues
  
  // Filtrer les sessions de l'utilisateur (en tant que DM)
  const mySessions = sessions.filter(session => session.dm?._id === userId).slice(0, 5);
  

  // Données mockées pour les fonctionnalités à venir
  const dmSettings = [
    {
      id: 1,
      name: "Campaign Management",
      description: "Manage your ongoing campaigns",
      status: "active"
    },
    {
      id: 2,
      name: "Player Management",
      description: "Handle player invitations and permissions",
      status: "active"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-6">
        {/* Mes Sessions */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">My Sessions</h2>
              </div>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => window.location.href = '/sessions/create'}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                <p className="text-gray-400">Loading sessions...</p>
              </div>
            ) : mySessions.length > 0 ? (
              <div className="space-y-4">
                {mySessions.map((session) => (
                  <div 
                    key={session._id} 
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => navigate(`/sessions/${session._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Image de session ou icône par défaut */}
                      {session.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={session.image} 
                            alt={`Bannière ${session.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="h-6 w-6 text-white" />
                        </div>
                      )}
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
                        DM Session
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No active sessions yet</p>
                <Button 
                  size="sm" 
                  variant="primary"
                  className="mt-2"
                  onClick={() => window.location.href = '/sessions/create'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DM Settings - Grisé (upcoming feature) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-400">DM Settings</h2>
                <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                  Coming Soon
                </Badge>
              </div>
              <Button size="sm" className="bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dmSettings.map((setting) => (
                <div key={setting.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-300">{setting.name}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{setting.status}</span>
                    <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Mastered Games */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Mastered Games</h2>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-yellow-400 hover:text-white hover:bg-yellow-500/20"
                onClick={onAddMasteredGame}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {masteredGames.length > 0 ? (
              <div className="space-y-2">
                {masteredGames.map((game) => (
                  <div key={game._id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-sm text-white">{game.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-white hover:bg-red-500/20 p-1 h-6 w-6"
                      onClick={() => onRemoveMasteredGame(game._id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Crown className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No mastered games yet</p>
                <Button 
                  size="sm" 
                  variant="primary"
                  className="mt-2"
                  onClick={onAddMasteredGame}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Games
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Grisé (upcoming feature) */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 opacity-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sword className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-400">Quick Actions</h2>
              <Badge variant="default" size="sm" className="bg-gray-600 text-gray-300">
                Coming Soon
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed"
              disabled
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Campaigns
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed"
              disabled
            >
              <Users className="h-4 w-4 mr-2" />
              Player Management
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed"
              disabled
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Session Analytics
            </Button>
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
                  <p className="text-sm text-gray-300">Created "Epic Fantasy Campaign"</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Added D&D 5e to mastered games</p>
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