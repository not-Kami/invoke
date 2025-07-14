import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Session, Game } from '../types';
import { sessionsApi, gamesApi } from '../lib/api';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { formatDateShort } from '../lib/utils';
import { Calendar, Users, Gamepad2, Plus, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsResponse, gamesResponse] = await Promise.all([
          sessionsApi.getSessions(),
          gamesApi.getGames(),
        ]);
        
        // Get recent sessions (limit to 6)
        setSessions(sessionsResponse.data.slice(0, 6));
        setGames(gamesResponse.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'full': return 'warning';
      case 'finished': return 'default';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Invoke{user ? `, ${user.firstName}` : ''}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Find dungeon masters, join sessions, and embark on epic adventures
        </p>
        {user ? (
          <div className="flex justify-center space-x-4">
            <Link to="/sessions">
              <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                <Calendar className="h-5 w-5 mr-2" />
                Browse Sessions
              </Button>
            </Link>
            <Link to="/sessions/create">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                <Plus className="h-5 w-5 mr-2" />
                Create Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                Get Started
              </Button>
            </Link>
            <Link to="/sessions">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
                Browse Sessions
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{sessions.length}+</h3>
            <p className="text-gray-600">Active Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Gamepad2 className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{games.length}+</h3>
            <p className="text-gray-600">Game Systems</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">100+</h3>
            <p className="text-gray-600">Active Players</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
          <Link to="/sessions">
            <Button variant="ghost">
              View all
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {session.game.name}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {session.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDateShort(session.date)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar
                        firstName={session.dm.firstName}
                        lastName={session.dm.lastName}
                        src={session.dm.avatar}
                        size="sm"
                      />
                      <span className="ml-2 text-gray-600">
                        {session.dm.firstName} {session.dm.lastName}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {session.players.length}/6
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to={`/sessions/${session._id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Games */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Games</h2>
          <Link to="/games">
            <Button variant="ghost">
              View all
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <Card key={game._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Gamepad2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {game.genre}
                  </p>
                  <Badge variant="info" size="sm">
                    {game.system}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}