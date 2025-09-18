import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tableAPI } from '../../lib/api';
import { Table } from '../../types';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Users, 
  Plus, 
  Search,
  Crown,
  UserPlus,
  Calendar
} from 'lucide-react';

export default function TablesPage() {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [myTables, setMyTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const [tablesResponse, myTablesResponse] = await Promise.all([
        tableAPI.getTables({ status: 'active', limit: 20 }),
        tableAPI.getUserTables()
      ]);

      if (tablesResponse.success && tablesResponse.data) {
        setTables(Array.isArray(tablesResponse.data.tables) ? tablesResponse.data.tables : []);
      }
      if (myTablesResponse.success && myTablesResponse.data) {
        setMyTables(Array.isArray(myTablesResponse.data) ? myTablesResponse.data : []);
      }
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };


  const getCurrentTables = () => {
    switch (filter) {
      case 'my':
        return myTables;
      default:
        return tables;
    }
  };

  const filteredTables = getCurrentTables().filter(table => {
    // Vérifier que la table a les propriétés nécessaires
    if (!table || typeof table !== 'object') return false;
    
    const name = table.name || '';
    const description = table.description || '';
    const tags = Array.isArray(table.tags) ? table.tags : [];
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           tags.some(tag => (tag || '').toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to access tables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tables</h1>
              <p className="text-gray-300">Join or create gaming groups to play together</p>
            </div>
            <Button
              onClick={() => window.location.href = '/tables/create'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              className="border-white/20"
            >
              All Tables
            </Button>
            <Button
              variant={filter === 'my' ? 'primary' : 'outline'}
              onClick={() => setFilter('my')}
              className="border-white/20"
            >
              My Tables ({myTables.length})
            </Button>
          </div>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-white/10 rounded mb-4"></div>
                  <div className="h-8 bg-white/20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/invoke-logo.svg" 
                alt="Invoke Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'my' ? 'No tables yet' : 'No tables found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {filter === 'my' ? 'Create your first table to start playing with friends' : 'Try adjusting your search or create a new table'}
            </p>
            <Button
              onClick={() => window.location.href = '/tables/create'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TableCardProps {
  table: Table;
}

function TableCard({ table }: TableCardProps) {
  const { user } = useAuth();
  const isOwner = user?._id === table.owner;
  const isMember = table.members?.some(member => 
    typeof member.user === 'string' ? member.user === user?._id : member.user._id === user?._id
  );

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white">{table.name}</h3>
              {isOwner && <Crown className="h-4 w-4 text-yellow-400" />}
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">{table.description}</p>
          </div>
          {table.isPrivate && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Tags */}
        {table.tags && table.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {table.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {table.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                +{table.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{table.memberCount || table.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{table.stats?.sessionsPlayed || 0} sessions</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {isOwner ? (
            <Button
              onClick={() => window.location.href = `/tables/${table._id}`}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              size="sm"
            >
              <Crown className="h-4 w-4 mr-2" />
              Manage Table
            </Button>
          ) : isMember ? (
            <Button
              onClick={() => window.location.href = `/tables/${table._id}`}
              variant="outline"
              className="w-full border-green-500 text-green-400 hover:text-white hover:bg-green-500"
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              View Table
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = `/tables/${table._id}`}
              variant="outline"
              className="w-full border-purple-500 text-purple-400 hover:text-white hover:bg-purple-500"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Table
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
