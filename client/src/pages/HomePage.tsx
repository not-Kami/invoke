import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { 
  Sword, 
  Users, 
  Calendar, 
  Gamepad2, 
  Plus, 
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  // Données mockées pour le moment
  const stats = [
    { label: 'Active Sessions', value: '24', icon: Calendar, color: 'text-blue-500' },
    { label: 'Dungeon Masters', value: '12', icon: Crown, color: 'text-purple-500' },
    { label: 'Adventurers', value: '156', icon: Users, color: 'text-green-500' },
  ];

  const recentSessions = [
    {
      id: 1,
      title: "Les Ombres de Valoria",
      subtitle: "Une Quête Épique dans un Monde Fracturé",
      dm: "Alex 'DragonMaster' Lenop",
      game: "Dungeons & Dragons 5e",
      date: "2024-01-15",
      players: 4,
      maxPlayers: 6,
      status: "open",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Cyberpunk Chronicles",
      subtitle: "Neon Nights & Digital Dreams",
      dm: "Sarah 'Netrunner' Chen",
      game: "Cyberpunk Red",
      date: "2024-01-18",
      players: 5,
      maxPlayers: 5,
      status: "full",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Mystic Realms",
      subtitle: "Ancient Magic Awakens",
      dm: "Marcus 'Mage' Thompson",
      game: "Pathfinder 2e",
      date: "2024-01-20",
      players: 3,
      maxPlayers: 6,
      status: "open",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
    }
  ];

  const popularGames = [
    { name: "Dungeons & Dragons 5e", genre: "Fantasy", system: "D&D", icon: Sword },
    { name: "Cyberpunk Red", genre: "Sci-Fi", system: "Cyberpunk", icon: Gamepad2 },
    { name: "Pathfinder 2e", genre: "Fantasy", system: "Pathfinder", icon: Crown },
    { name: "Call of Cthulhu", genre: "Horror", system: "BRP", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to the Realm of Adventure!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Embark on epic quests, forge legendary characters, and discover master dungeon masters 
              in a world where every roll of the dice tells a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sessions">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  <Sword className="h-5 w-5 mr-2" />
                  Browse Sessions
                </Button>
              </Link>
              <Link to="/sessions/create">
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="text-center p-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="font-display text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Sessions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-white">Recent Adventures</h2>
            <Link to="/sessions">
              <Button variant="ghost" className="text-purple-400 hover:text-white">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSessions.map((session) => (
              <Card key={session.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={session.image} 
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={session.status === 'open' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{session.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{session.subtitle}</p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>DM: {session.dm}</div>
                    <div>{session.game}</div>
                    <div className="flex items-center justify-between">
                      <span>{session.date}</span>
                      <span>{session.players}/{session.maxPlayers} players</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                      Join Adventure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Games */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-white">Popular Realms</h2>
            <Link to="/games">
              <Button variant="ghost" className="text-purple-400 hover:text-white">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <game.icon className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{game.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{game.genre}</p>
                  <Badge variant="info" size="sm">{game.system}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}