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
import HeroImage from '../assets/hero_section.webp';

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
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${HeroImage})`
          }}
        ></div>
        
        {/* Overlay Filters */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-transparent to-blue-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <div className="flex justify-end">
            {/* Main Content - Aligned Right */}
            <div className="text-right max-w-3xl">
              <div className="inline-flex items-center bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-purple-300 text-sm font-medium">Your Next Adventure Awaits</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Roll the Dice,<br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Write Your Legend
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl ml-auto">
                Connect with legendary dungeon masters, join epic campaigns, and forge unforgettable stories 
                in the ultimate tabletop RPG community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Link to="/sessions">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-2xl transform hover:scale-105 transition-all duration-200">
                    <Sword className="h-5 w-5 mr-2" />
                    Browse Adventures
                  </Button>
                </Link>
                <Link to="/sessions/create">
                  <Button variant="glass" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Session
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md ml-auto">
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">156+</div>
                  <div className="text-gray-300 text-sm">Adventurers</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">24</div>
                  <div className="text-gray-300 text-sm">Active Sessions</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-white">12</div>
                  <div className="text-gray-300 text-sm">Master DMs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Systems Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Explore Game Systems</h2>
            <p className="text-gray-300 text-lg">Click on a game to see available sessions and campaigns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
              <Link key={index} to={`/games/${game.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer transform hover:scale-105">
                  <CardContent className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                      <game.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{game.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{game.genre}</p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="info" size="sm">{game.system}</Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>12 Sessions</span>
                        <span>3 Campaigns</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/games">
              <Button variant="glass">
                View All Game Systems
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
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


    </div>
  );
}