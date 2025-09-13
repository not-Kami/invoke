import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, Gamepad2, Star, Trash2 } from 'lucide-react';
import { adminAPI, User as UserType } from '../../../lib/api';
import { useNotifications } from '../../../hooks/useNotifications';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await adminAPI.getUsers();
        const userData = response.data?.find(u => u._id === id);
        
        if (response.success && userData) {
          setUser(userData);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to load user');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDeleteUser = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await adminAPI.deleteUser(user._id);
      
      if (response.success) {
        addNotification('success', 'User deleted successfully');
        navigate('/admin');
      } else {
        addNotification('error', 'Failed to delete user');
      }
    } catch (err) {
      addNotification('error', 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleToggleFeatured = async () => {
    if (!user) return;
    
    try {
      const response = await adminAPI.adminUpdateUserFeatured(user._id, !user.featured);
      
      if (response.success) {
        setUser({ ...user, featured: !user.featured });
        addNotification('success', `User ${user.featured ? 'removed from' : 'added to'} featured`);
      } else {
        addNotification('error', 'Failed to update featured status');
      }
    } catch (err) {
      addNotification('error', 'Failed to update featured status');
      console.error('Error updating featured status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <User className="h-12 w-12 mx-auto mb-2" />
          <p className="text-xl font-semibold">User not found</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">User Details</h1>
            <p className="text-gray-400">Manage user information and permissions</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleFeatured}
            className={`px-4 py-2 rounded-lg transition-colors ${
              user.featured 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <Star className="h-4 w-4 mr-2 inline" />
            {user.featured ? 'Remove from Featured' : 'Add to Featured'}
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete User
          </button>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">First Name</label>
                <p className="text-white font-medium">{user.firstName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Last Name</label>
                <p className="text-white font-medium">{user.lastName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Nickname</label>
                <p className="text-white font-medium">{user.nickname || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Role</label>
                <p className="text-white font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  {user.role}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">DM Status</label>
                <p className="text-white font-medium">
                  {user.isDM ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600 text-white">
                      <Gamepad2 className="h-3 w-3 mr-1" />
                      Dungeon Master
                    </span>
                  ) : (
                    <span className="text-gray-400">Regular User</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Bio</h2>
              <p className="text-gray-300">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-400">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Member since</span>
                <span className="text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verified</span>
                <span className={`${user.verified ? 'text-green-400' : 'text-red-400'}`}>
                  {user.verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Featured</span>
                <span className={`${user.featured ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {user.featured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
