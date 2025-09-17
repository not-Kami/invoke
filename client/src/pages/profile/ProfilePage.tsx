import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import { usersApi, adminAPI, Game } from '../../lib/api';
import { useNotification } from '../../hooks/useNotification';
import { useFavoriteGames } from '../../hooks/useFavoriteGames';
import { useMasteredGames } from '../../hooks/useMasteredGames';
import ImagePreview from '../../components/ui/ImagePreview';
import { 
  User, 
 
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
  const { success, error } = useNotification();
  const { favoriteGames, addFavoriteGame, removeFavoriteGame, isFavorite } = useFavoriteGames();
  const { masteredGames, addMasteredGame, removeMasteredGame } = useMasteredGames();
  const [isEditing, setIsEditing] = useState(defaultEditMode);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'dm-settings' | 'feedback'>('personal');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [gameSearchTerm, setGameSearchTerm] = useState('');
  const [selectorType, setSelectorType] = useState<'favorites' | 'mastered'>('favorites');

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

  const [loading, setLoading] = useState(false);

  // Charger les données du profil
  const loadProfileData = useCallback(async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      // Charger le profil de base
      const profileResponse = await usersApi.getProfile(user._id);
      if (profileResponse.success && profileResponse.data) {
        // setProfileData(prev => ({ ...prev, ...profileResponse.data }));
      }

      // Charger les jeux favoris
      const favoritesResponse = await usersApi.getFavorites(user._id);
      if (favoritesResponse.success && favoritesResponse.data) {
        setProfileData(prev => ({ ...prev, favorite_games: favoritesResponse.data || [] }));
      }

      // Charger les jeux maîtrisés si l'utilisateur est DM
      if (user.isDM) {
        const masteredResponse = await usersApi.getProfile(user._id);
        if (masteredResponse.success && masteredResponse.data?.mastered_games) {
          // setProfileData(prev => ({ ...prev, mastered_games: masteredResponse.data.mastered_games }));
        }
      }

      // Charger tous les jeux disponibles (utiliser l'API admin pour avoir tous les jeux)
      const gamesResponse = await adminAPI.getGames();
      if (gamesResponse.success && gamesResponse.data) {
        setAvailableGames(gamesResponse.data);
      }
    } catch (err) {
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
        // setProfileData(prev => ({ ...prev, ...response.data }));
        
        // Mettre à jour l'utilisateur dans le contexte d'auth (optionnel)
        try {
          await updateUser(response.data);
        } catch (err) {
        }
        
        success('Profile Updated', 'Your profile has been updated successfully!');
        
        // Marquer qu'il faut fermer l'édition
        setShouldCloseEdit(true);
      } else {
        error('Update Error', response.message || 'Error during update');
      }
    } catch (err) {
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
    if (!selectedImage || !user?._id) return;

    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch(`/api/v1/upload/immediate/user/${user._id}/avatar`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // Mettre à jour l'utilisateur local avec le nouvel avatar
          const updatedUser = { ...user, avatar: result.data.secure_url };
          
          // Mettre à jour l'utilisateur dans le contexte d'auth
          await updateUser(updatedUser);
          
          // Mettre à jour le profil local
          setProfileData(prev => ({ ...prev, avatar: result.data.secure_url }));
          
          success('Avatar Updated', 'Your profile picture has been updated successfully!');
          
          // Réinitialiser l'image sélectionnée
          setSelectedImage(null);
        } else {
          error('Upload Error', result.message || 'Unknown error during upload');
        }
      } else {
        const errorData = await response.json();
        error('Upload Error', errorData.message || 'Error uploading avatar');
      }
    } catch (err) {
      error('Upload Error', 'Error uploading avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  // Fonctions pour gérer les jeux favoris
  const handleToggleFavorite = async (game: Game) => {
    try {
      if (isFavorite(game._id)) {
        await removeFavoriteGame(game._id);
        success('Game Removed', `${game.name} removed from favorites`);
      } else {
        await addFavoriteGame(game);
        success('Game Added', `${game.name} added to favorites`);
      }
    } catch (err) {
      error('Error', 'Failed to update favorite games');
    }
  };

  // Fonctions pour gérer les jeux maîtrisés
  const handleToggleMastered = async (game: Game) => {
    try {
      const isMastered = masteredGames.find(g => g._id === game._id);
      if (isMastered) {
        await removeMasteredGame(game._id);
        success('Game Removed', `${game.name} removed from mastered games`);
      } else {
        await addMasteredGame(game);
        success('Game Added', `${game.name} added to mastered games`);
      }
    } catch (err) {
      error('Error', 'Failed to update mastered games');
    }
  };



  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'preferences', label: 'Favorite Games', icon: Heart },
    ...(user.isDM || profileData.isDM ? [{ id: 'dm-settings', label: 'Mastered Games', icon: Crown }] : []),
    { id: 'feedback', label: 'Reviews & Feedback', icon: Star }
  ];

  // Fonction pour devenir DM
  const handleBecomeDM = async () => {
    try {
      setLoading(true);
      
      const response = await usersApi.becomeDM(user._id);
      
      if (response.success && response.data) {
        // Mettre à jour l'utilisateur dans le contexte d'authentification
        updateUser(response.data);
        
        // Mettre à jour les données du profil local
        setProfileData(prev => ({ ...prev, isDM: true }));
        
        success('Congratulations!', 'You are now a Dungeon Master! 🎲 You can now create and manage game sessions.');
      } else {
        error('Error', response.error || 'Failed to update your DM status. Please try again.');
      }
    } catch (err) {
      error('Error', 'Failed to update your DM status. Please try again.');
      console.error('Error updating DM status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour retirer le statut DM
  const handleRemoveDM = async () => {
    if (!window.confirm('Are you sure you want to remove your Dungeon Master status? You will lose access to DM features like creating sessions.')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await usersApi.removeDM(user._id);
      
      if (response.success && response.data) {
        // Mettre à jour l'utilisateur dans le contexte d'authentification
        updateUser(response.data);
        
        // Mettre à jour les données du profil local
        setProfileData(prev => ({ ...prev, isDM: false }));
        
        success('Status Updated', 'Your Dungeon Master status has been removed. You can become a DM again anytime from your profile.');
      } else {
        error('Error', response.error || 'Failed to update your DM status. Please try again.');
      }
    } catch (err) {
      error('Error', 'Failed to update your DM status. Please try again.');
      console.error('Error updating DM status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            {profileData.isDM && (
              <Badge variant="warning" className="mt-1">
                <Crown className="h-3 w-3 mr-1" />
                Dungeon Master
              </Badge>
            )}
          </div>
          
          {/* Remove DM Section - Only show if user is a DM */}
          {profileData.isDM && (
            <div className="mt-4 p-3 bg-white/3 backdrop-blur-sm border border-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">DM Status</div>
                  <div className="text-xs text-gray-300">•</div>
                  <div className="text-xs text-gray-400">Want to step down?</div>
                </div>
                <button
                  onClick={handleRemoveDM}
                  disabled={loading}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Remove DM status'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Become DM Section - Only show if user is not already a DM */}
        {!profileData.isDM && (
          <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Want to create sessions?</p>
                  <p className="text-sm text-gray-400">Become a Dungeon Master to start hosting games</p>
                </div>
              </div>
              <Button
                onClick={handleBecomeDM}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-300"></div>
                    <span>Upgrading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Become DM</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

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
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Favorite Games</h3>
                      <Button
                        onClick={() => {
                          setSelectorType('favorites');
                          setShowGameSelector(true);
                        }}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Add Games
                      </Button>
                    </div>
                    {favoriteGames.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteGames.map((game: Game) => (
                          <div key={game._id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white">{game.name}</h4>
                              <button
                                onClick={() => handleToggleFavorite(game)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
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
                        <p className="text-sm text-gray-500 mb-4">Your favorite games will appear here</p>
                        <Button
                          onClick={() => {
                            setSelectorType('favorites');
                            setShowGameSelector(true);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Add Your First Game
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'dm-settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">Dungeon Master Profile</h3>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-medium text-white">Mastered Games</h4>
                        <Button
                          onClick={() => {
                            setSelectorType('mastered');
                            setShowGameSelector(true);
                          }}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Add Games
                        </Button>
                      </div>
                      {masteredGames.length > 0 ? (
                        <div className="space-y-3">
                          {masteredGames.map((game: Game) => (
                            <div key={game._id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-medium text-white">{game.name}</h5>
                                  <p className="text-sm text-gray-400">{game.system}</p>
                                </div>
                                <button
                                  onClick={() => handleToggleMastered(game)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No mastered games yet</p>
                          <p className="text-sm text-gray-500 mb-4">Your mastered games will appear here</p>
                          <Button
                            onClick={() => {
                              setSelectorType('mastered');
                              setShowGameSelector(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Add Your First Game
                          </Button>
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

        {/* Modal de sélection de jeux simplifié */}
        {showGameSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {selectorType === 'favorites' ? 'Select Favorite Games' : 'Select Mastered Games'}
                  </h3>
                  <button
                    onClick={() => setShowGameSelector(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <Input
                  placeholder="Search games..."
                  value={gameSearchTerm}
                  onChange={(e) => setGameSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="p-6 max-h-[50vh] overflow-y-auto">
                <div className="space-y-2">
                  {availableGames
                    .filter(game => 
                      game.name.toLowerCase().includes(gameSearchTerm.toLowerCase()) ||
                      game.description.toLowerCase().includes(gameSearchTerm.toLowerCase())
                    )
                    .map((game: Game) => (
                      <div key={game._id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{game.name}</h4>
                            <p className="text-sm text-gray-400">{game.genre} • {game.system}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {selectorType === 'favorites' && (
                              <button
                                onClick={() => handleToggleFavorite(game)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  isFavorite(game._id)
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                <Heart className={`h-4 w-4 inline mr-1 ${isFavorite(game._id) ? 'fill-current' : ''}`} />
                                {isFavorite(game._id) ? 'Remove' : 'Add'}
                              </button>
                            )}
                            {selectorType === 'mastered' && user.isDM && (
                              <button
                                onClick={() => handleToggleMastered(game)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  masteredGames.find(g => g._id === game._id)
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                <Crown className={`h-4 w-4 inline mr-1 ${masteredGames.find(g => g._id === game._id) ? 'fill-current' : ''}`} />
                                {masteredGames.find(g => g._id === game._id) ? 'Remove' : 'Add'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="p-6 border-t border-white/10">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowGameSelector(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
