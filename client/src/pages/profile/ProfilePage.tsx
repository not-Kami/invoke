import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import { usersApi, publicAPI, Game } from '../../lib/api';
import { useNotification } from '../../hooks/useNotification';
import ImagePreview from '../../components/ui/ImagePreview';
import { 
  User, 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Heart,
  Crown,
  Star
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  nickname: string;
  avatar?: string | null;
  isDM: boolean;
  favorite_games: Game[];
  mastered_games: Game[];
  evaluations: any[];
  createdAt: string;
  updatedAt: string;
}

interface ProfilePageProps {
  defaultEditMode?: boolean;
}

export default function ProfilePage({ defaultEditMode = false }: ProfilePageProps) {
  const { user, updateUser } = useAuth();
  const { success, error, warning } = useNotification();
  const [isEditing, setIsEditing] = useState(defaultEditMode);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'dm-settings' | 'feedback'>('personal');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to access your profile.</p>
        </div>
      </div>
    );
  }

  // État pour les données du profil
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    bio: user.bio || "Aucune bio pour le moment...",
    nickname: user.nickname || "",
    avatar: user.avatar,
    isDM: user.isDM,
    favorite_games: [],
    mastered_games: [],
    evaluations: [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });

  // État pour les jeux disponibles
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les données du profil
  const loadProfileData = useCallback(async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      // Charger le profil de base
      const profileResponse = await usersApi.getProfile(user._id);
      if (profileResponse.success && profileResponse.data) {
        setProfileData(prev => ({ ...prev, ...profileResponse.data }));
      }

      // Charger les jeux favoris
      const favoritesResponse = await usersApi.getFavorites(user._id);
      if (favoritesResponse.success && favoritesResponse.data) {
        setProfileData(prev => ({ ...prev, favorite_games: favoritesResponse.data || [] }));
      }

      // Charger les jeux maîtrisés si l'utilisateur est DM
      if (user.isDM) {
        const masteredResponse = await usersApi.getMastered(user._id);
        if (masteredResponse.success && masteredResponse.data) {
          setProfileData(prev => ({ ...prev, mastered_games: masteredResponse.data || [] }));
        }
      }

      // Charger tous les jeux disponibles
      const gamesResponse = await publicAPI.getGames();
      if (gamesResponse.success && gamesResponse.data) {
        setAvailableGames(gamesResponse.data);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
              error('Loading Error', 'Unable to load profile data');
    } finally {
      setLoading(false);
    }
  }, [user?._id, user?.isDM, error]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Debug: surveiller les changements de l'état d'édition
  useEffect(() => {
    console.log('Editing state changed:', isEditing);
  }, [isEditing]);

  // Protection contre la remise en édition automatique
  const [shouldCloseEdit, setShouldCloseEdit] = useState(false);

  useEffect(() => {
    if (shouldCloseEdit) {
      setIsEditing(false);
      setShouldCloseEdit(false);
    }
  }, [shouldCloseEdit]);

  const handleSave = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const response = await usersApi.updateProfile(user._id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        nickname: profileData.nickname
      });
      
      if (response.success && response.data) {
        // Mettre à jour le profil local directement
        setProfileData(prev => ({ ...prev, ...response.data }));
        
        // Mettre à jour l'utilisateur dans le contexte d'auth (optionnel)
        try {
          await updateUser(response.data);
        } catch (err) {
          console.warn('Could not update user in auth context:', err);
        }
        
        success('Profile Updated', 'Your profile has been updated successfully!');
        
        // Marquer qu'il faut fermer l'édition
        setShouldCloseEdit(true);
      } else {
        error('Update Error', response.message || 'Error during update');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      error('Update Error', 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      error('Invalid File', 'Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      error('File Too Large', 'Maximum size: 5MB.');
      return;
    }

    setSelectedImage(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    setAvatarLoading(true);

    try {
      const response = await usersApi.uploadAvatar(user._id, selectedImage);
      
      if (response.success && response.data) {
        // Mettre à jour l'utilisateur local avec le nouvel avatar
        const updatedUser = { ...user, avatar: response.data!.avatar };
        
        // Mettre à jour l'utilisateur dans le contexte d'auth
        await updateUser(updatedUser);
        
        // Mettre à jour le profil local
        setProfileData(prev => ({ ...prev, avatar: response.data!.avatar }));
        
        success('Avatar Updated', 'Your profile picture has been updated successfully!');
        
        // Réinitialiser l'image sélectionnée
        setSelectedImage(null);
      } else {
        error('Upload Error', response.message || 'Unknown error during upload');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      error('Upload Error', 'Error uploading avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };



  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'preferences', label: 'Favorite Games', icon: Heart },
    ...(user.isDM || profileData.isDM ? [{ id: 'dm-settings', label: 'Mastered Games', icon: Crown }] : []),
    { id: 'feedback', label: 'Reviews & Feedback', icon: Star }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            {profileData.isDM && (
              <Badge variant="warning">
                <Crown className="h-3 w-3 mr-1" />
                Dungeon Master
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Avatar and Navigation */}
          <div className="lg:col-span-1">
            {/* Avatar Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar
                    firstName={profileData.firstName}
                    lastName={profileData.lastName}
                    src={user.avatar || undefined}
                    size="lg"
                  />
                  <label className={`absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer ${avatarLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {avatarLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={avatarLoading}
                    />
                  </label>
                </div>
                
                {/* Prévisualisation de l'image sélectionnée */}
                {selectedImage && (
                  <div className="mb-4">
                    <ImagePreview
                      file={selectedImage}
                      onRemove={handleRemoveImage}
                      className="mx-auto"
                    />
                    <div className="mt-3 text-center">
                      <Button
                        onClick={handleAvatarUpload}
                        loading={avatarLoading}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {avatarLoading ? 'Uploading...' : 'Confirm Upload'}
                      </Button>
                    </div>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-white mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                
                {/* Message d'aide pour l'upload */}
                <p className="text-xs text-gray-400 mb-2">
                  Click on the camera icon to change your profile picture
                </p>
                <p className="text-gray-300 text-sm mb-2">{profileData.email}</p>
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          className="text-gray-300 hover:text-white"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        ) : (
                          <p className="text-white">{profileData.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        ) : (
                          <p className="text-white">{profileData.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                      ) : (
                        <p className="text-white">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nickname
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.nickname}
                          onChange={(e) => setProfileData({...profileData, nickname: e.target.value})}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="Your nickname (optional)"
                        />
                      ) : (
                        <p className="text-white">{profileData.nickname || "No nickname"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-300">{profileData.bio}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Favorite Games</h3>
                      {profileData.favorite_games.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {profileData.favorite_games.map((game: Game) => (
                            <div key={game._id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="mb-2">
                                <h4 className="font-medium text-white">{game.name}</h4>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{game.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="info" size="sm">{game.genre}</Badge>
                                <Badge variant="default" size="sm">{game.system}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No favorite games yet</p>
                          <p className="text-sm text-gray-500">Your favorite games will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'dm-settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">Dungeon Master Profile</h3>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Mastered Games</h4>
                      {profileData.mastered_games.length > 0 ? (
                        <div className="space-y-3">
                          {profileData.mastered_games.map((game: Game) => (
                            <div key={game._id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div>
                                <h5 className="font-medium text-white">{game.name}</h5>
                                <p className="text-sm text-gray-400">{game.system}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No mastered games yet</p>
                          <p className="text-sm text-gray-500">Your mastered games will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'feedback' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Reviews & Feedback Received</h3>
                      {profileData.evaluations && profileData.evaluations.length > 0 ? (
                        <div className="space-y-4">
                          {profileData.evaluations.map((evaluation: any, index: number) => (
                            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${
                                          i < evaluation.rating 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-500'
                                        }`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">by {evaluation.author?.firstName || 'Anonymous'}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(evaluation.createdAt).toLocaleDateString('en-US')}
                                </span>
                              </div>
                              {evaluation.comment && (
                                <p className="text-gray-300 text-sm">{evaluation.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No reviews or feedback yet</p>
                          <p className="text-sm text-gray-500">Reviews you receive will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
