import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Sword, 
  Crown,
  User,
  Gamepad2,
  Clock,
  MapPin,
  Edit,
  Eye,
  ChevronRight,
  UserPlus,
  Mail,
  CheckCircle,
  XCircle,
  Globe,
  Monitor,
  DollarSign,
  Star,
  Megaphone,
  Heart
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'player' | 'dm'>('player');

  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  // Données mockées pour le dashboard
  const upcomingGames = [
    {
      id: 1,
      title: "Les Ombres de Valoria",
      game: "D&D 5e",
      date: "2024-01-28",
      time: "19:00",
      dm: "Alex Lenop",
      type: "campaign",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Cyberpunk One-Shot",
      game: "Cyberpunk Red",
      date: "2024-02-02",
      time: "14:00",
      dm: "Sarah Chen",
      type: "session",
      status: "pending"
    }
  ];

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

  const myTables = [
    {
      id: 1,
      name: "Équipe Dragon Rouge",
      members: [
        { id: 1, name: "Alice Martin", status: "confirmed", avatar: null },
        { id: 2, name: "Bob Dupont", status: "confirmed", avatar: null },
        { id: 3, name: "Charlie Durand", status: "pending", avatar: null }
      ],
      invitations: 1,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Les Aventuriers du Dimanche",
      members: [
        { id: 4, name: "Diana Lopez", status: "confirmed", avatar: null },
        { id: 5, name: "Eve Chen", status: "confirmed", avatar: null }
      ],
      invitations: 0,
      createdAt: "2024-01-20"
    }
  ];

  const favoriteGames = [
    { name: "Dungeons & Dragons 5e", level: "Expert" },
    { name: "Pathfinder 2e", level: "Intermediate" },
    { name: "Call of Cthulhu", level: "Beginner" }
  ];

  const mySessions = [
    {
      id: 1,
      title: "Les Mystères d'Arkham",
      game: "Call of Cthulhu",
      players: 4,
      maxPlayers: 6,
      nextSession: "2024-01-30",
      status: "active"
    },
    {
      id: 2,
      title: "Campagne Épique Fantasy",
      game: "D&D 5e",
      players: 6,
      maxPlayers: 6,
      nextSession: "2024-02-01",
      status: "full"
    }
  ];

  const myAnnouncements = [
    {
      id: 1,
      title: "Nouvelle campagne D&D 5e - Les Terres Oubliées",
      game: "D&D 5e",
      type: "campaign",
      location: "IRL - Paris 11ème",
      price: "15€/session",
      players: 3,
      maxPlayers: 6,
      status: "active",
      createdAt: "2024-01-20"
    },
    {
      id: 2,
      title: "One-shot Cyberpunk Red",
      game: "Cyberpunk Red",
      type: "session",
      location: "En ligne - Roll20",
      price: "Gratuit",
      players: 2,
      maxPlayers: 4,
      status: "active",
      createdAt: "2024-01-25"
    }
  ];

  const dmSettings = {
    location: {
      irl: true,
      online: true,
      irlLocation: "Paris 11ème",
      vtt: ["Roll20", "Foundry VTT"]
    },
    pricing: {
      hourlyRate: 15,
      currency: "€",
      freeGames: true
    },
    masteredGames: [
      { name: "D&D 5e", experience: "Expert", years: 5 },
      { name: "Call of Cthulhu", experience: "Advanced", years: 3 },
      { name: "Cyberpunk Red", experience: "Intermediate", years: 1 }
    ]
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-300 mt-2">
                {viewMode === 'player' ? 'Ready for your next adventure?' : 'Time to craft some epic stories!'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user.role === 'admin' ? 'success' : 'default'}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('player')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'player'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sword className="h-4 w-4" />
              <span>Player Mode</span>
            </button>
            <button
              onClick={() => setViewMode('dm')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === 'dm'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>DM Mode</span>
            </button>
          </div>
        </div>

        {viewMode === 'player' ? (
          /* Player Dashboard */
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
                  {upcomingGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{game.title}</h3>
                          <p className="text-sm text-gray-300">{game.game} • DM: {game.dm}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{game.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{game.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={game.status === 'confirmed' ? 'success' : 'warning'}>
                          {game.status}
                        </Badge>
                        <Badge variant="info" size="sm">
                          {game.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* My Characters */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">My Characters</h2>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
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
                            <h3 className="font-semibold text-white">{character.name}</h3>
                            <p className="text-sm text-gray-300">{character.class} • Level {character.level}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Campaign: {character.campaign}</p>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Tables */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">My Tables</h2>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Table
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myTables.map((table) => (
                      <div key={table.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{table.name}</h3>
                          <div className="flex items-center space-x-2">
                            {table.invitations > 0 && (
                              <Badge variant="warning" size="sm">
                                {table.invitations} pending
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          {table.members.slice(0, 4).map((member) => (
                            <div key={member.id} className="relative">
                              <Avatar
                                firstName={member.name.split(' ')[0]}
                                lastName={member.name.split(' ')[1]}
                                size="sm"
                              />
                              {member.status === 'pending' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                              )}
                              {member.status === 'confirmed' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                              )}
                            </div>
                          ))}
                          {table.members.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                              +{table.members.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            {table.members.length} members
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                              <UserPlus className="h-3 w-3 mr-1" />
                              Invite
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-white">
                              <Calendar className="h-3 w-3 mr-1" />
                              Book Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="glass" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Find Groups
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    My Schedule
                  </Button>
                </CardContent>
              </Card>

              {/* Favorite Games */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-purple-400" />
                      <h2 className="text-lg font-semibold text-white">Favorite Games</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {favoriteGames.map((game, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{game.name}</p>
                          <p className="text-xs text-gray-400">{game.level}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 3 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                (game.level === 'Expert' && i < 3) ||
                                (game.level === 'Intermediate' && i < 2) ||
                                (game.level === 'Beginner' && i < 1)
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Joined "Les Ombres de Valoria"</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Updated character sheet</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Completed one-shot session</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* DM Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Announcements */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Megaphone className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">My Announcements</h2>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{announcement.title}</h3>
                            <Badge variant="info" size="sm">{announcement.type}</Badge>
                            <Badge variant={announcement.status === 'active' ? 'success' : 'default'} size="sm">
                              {announcement.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{announcement.game}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{announcement.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{announcement.price}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{announcement.players}/{announcement.maxPlayers} players</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Posted {announcement.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-xs text-gray-400">
                          {announcement.players} interested players
                        </span>
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                          <Users className="h-3 w-3 mr-1" />
                          Manage Players
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* My Sessions & Campaigns */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">Running Sessions</h2>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white hover:text-gray-900">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mySessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{session.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-400">{session.game}</span>
                            <span className="text-xs text-gray-400">
                              {session.players}/{session.maxPlayers} players
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={session.status === 'active' ? 'success' : 'warning'} size="sm">
                        {session.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-6">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingGames.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <h3 className="font-medium text-white">{event.title}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="info" size="sm">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* DM Sidebar */}
            <div className="space-y-6">
              {/* DM Tools */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">DM Tools</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="glass" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Session
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Players
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                                         <Calendar className="h-4 w-4 mr-2" />
                    Schedule Events
                  </Button>
                  <Button variant="glass" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Campaign Settings
                  </Button>
                </CardContent>
              </Card>

              {/* DM Profile Settings */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-purple-400" />
                      <h2 className="text-lg font-semibold text-white">DM Profile</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Where I Play</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-300">IRL: {dmSettings.location.irlLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-300">Online: {dmSettings.location.vtt.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Pricing</h3>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-300">
                        {dmSettings.pricing.hourlyRate}{dmSettings.pricing.currency}/hour
                      </span>
                      {dmSettings.pricing.freeGames && (
                        <Badge variant="success" size="sm">Free games available</Badge>
                      )}
                    </div>
                  </div>

                  {/* Mastered Games */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Games I Master</h3>
                    <div className="space-y-2">
                      {dmSettings.masteredGames.map((game, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-white">{game.name}</p>
                            <p className="text-xs text-gray-400">{game.years} years experience</p>
                          </div>
                          <Badge 
                            variant={
                              game.experience === 'Expert' ? 'success' :
                              game.experience === 'Advanced' ? 'warning' : 'default'
                            } 
                            size="sm"
                          >
                            {game.experience}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-white">Your Stats</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-sm text-gray-300">Active Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">3</div>
                      <div className="text-sm text-gray-300">Running Campaigns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">24</div>
                      <div className="text-sm text-gray-300">Sessions Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
