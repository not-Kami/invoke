import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { usersApi } from '../../lib/api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import { Search, Users, Shield } from 'lucide-react';

export default function PlayersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      if (roleFilter === 'dm') {
        filtered = filtered.filter(user => user.isDM);
      } else if (roleFilter === 'player') {
        filtered = filtered.filter(user => !user.isDM);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

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
        <h1 className="text-3xl font-bold text-gray-900">Players & Dungeon Masters</h1>
        <p className="mt-2 text-gray-600">
          Connect with fellow players and experienced dungeon masters
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
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Users</option>
                <option value="dm">Dungeon Masters</option>
                <option value="player">Players</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    src={user.avatar}
                    size="xl"
                    className="mx-auto mb-4"
                  />
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    {user.isDM && (
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        Dungeon Master
                      </Badge>
                    )}
                    {user.role === 'admin' && (
                      <Badge variant="warning">
                        Admin
                      </Badge>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {user.bio}
                    </p>
                  )}

                  <div className="text-xs text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
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