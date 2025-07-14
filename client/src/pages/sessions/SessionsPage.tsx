import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@/types';
import { sessionsApi } from '@/lib/api';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import { formatDateShort } from '@/lib/utils';
import { Calendar, Users, Plus, Search, Filter } from 'lucide-react';

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await sessionsApi.getSessions();
        setSessions(response.data);
        setFilteredSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    let filtered = sessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.sessionType === typeFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter, typeFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'success';
      case 'full': return 'warning';
      case 'finished': return 'default';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gaming Sessions</h1>
          <p className="mt-2 text-gray-600">
            Find and join gaming sessions in your area or online
          </p>
        </div>
        {user && (
          <div className="mt-4 sm:mt-0">
            <Link to="/sessions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="full">Full</option>
                <option value="finished">Finished</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="offline">In-Person</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more sessions.'
                : 'Be the first to create a session!'}
            </p>
            {user && (
              <Link to="/sessions/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {session.game.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {session.sessionType}
                      </Badge>
                      {session.isOneShot && (
                        <Badge variant="default" size="sm">
                          One-shot
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {session.description}
                </p>
                
                <div className="space-y-3 text-sm">
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
                      <div className="ml-2">
                        <p className="text-gray-900 font-medium">
                          {session.dm.firstName} {session.dm.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Dungeon Master</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {session.players.length}/6
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
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
      )}
    </div>
  );
}