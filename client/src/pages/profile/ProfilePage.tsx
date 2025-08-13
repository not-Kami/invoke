import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import { usersApi } from '../../lib/api';
import { useNotification } from '../../hooks/useNotification';
import ImagePreview from '../../components/ui/ImagePreview';
import { 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Star,
  Heart,
  Settings,
  Crown,
  DollarSign,
  Monitor,
  Globe,
  Shield,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfilePageProps {
  defaultEditMode?: boolean;
}

export default function ProfilePage({ defaultEditMode = false }: ProfilePageProps) {
  const { user } = useAuth();
  const { success, error, warning } = useNotification();
  const [isEditing, setIsEditing] = useState(defaultEditMode);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'dm-settings' | 'privacy'>('personal');
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

  // Données mockées pour le profil
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    bio: "Passionate tabletop RPG player with 5+ years of experience. Love exploring new worlds and creating memorable stories with friends.",
    location: "Paris, France",
    joinedDate: "2023-06-15",
    avatar: null,
    preferences: {
      favoriteGames: [
        { name: "Dungeons & Dragons 5e", level: "Expert", favorite: true },
        { name: "Pathfinder 2e", level: "Intermediate", favorite: true },
        { name: "Call of Cthulhu", level: "Beginner", favorite: false },
        { name: "Cyberpunk Red", level: "Intermediate", favorite: false }
      ],
      playStyle: ["Roleplay", "Combat", "Exploration"],
      availability: ["Weekends", "Weekday Evenings"],
      preferredSessionLength: "3-4 hours"
    },
    dmSettings: {
      isDM: false,
      experience: "2 years",
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
        { name: "D&D 5e", experience: "Advanced", years: 2 },
        { name: "Call of Cthulhu", experience: "Intermediate", years: 1 }
      ]
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showLocation: true,
      allowMessages: true,
      notifications: {
        email: true,
        push: true,
        gameInvites: true,
        announcements: false
      }
    }
  });

  const handleSave = () => {
    // Ici on sauvegarderait via l'API
    setIsEditing(false);
    // API call would go here
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
      error('Fichier invalide', 'Veuillez sélectionner un fichier image valide.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      error('Fichier trop volumineux', 'Taille maximale : 5MB.');
      return;
    }

    setSelectedImage(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    setAvatarLoading(true);

    try {
      const response = await usersApi.uploadAvatar(user._id, selectedImage);
      
      if (response.success) {

        
        // Mettre à jour l'utilisateur local avec le nouvel avatar
        const updatedUser = { ...user, avatar: response.data.file.url };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Mettre à jour l'objet user principal (important pour l'affichage)
        // Note: Dans un vrai projet, on utiliserait un contexte React ou Redux
        // Pour l'instant, on force la mise à jour en rechargeant la page
        success('Avatar mis à jour', 'Votre photo de profil a été modifiée avec succès !');
        
        // Réinitialiser l'image sélectionnée
        setSelectedImage(null);
        
        // Forcer la mise à jour de l'interface en rechargeant la page
        // C'est une solution temporaire - idéalement on utiliserait un contexte
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        error('Erreur d\'upload', response.message || 'Erreur inconnue lors de l\'upload');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      error('Erreur d\'upload', 'Erreur lors de l\'upload de l\'avatar. Veuillez réessayer.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'preferences', label: 'Game Preferences', icon: Heart },
    ...(user.isDM || profileData.dmSettings.isDM ? [{ id: 'dm-settings', label: 'DM Settings', icon: Crown }] : []),
    { id: 'privacy', label: 'Privacy & Notifications', icon: Shield }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <div className="flex items-center space-x-2">
              <Badge variant={user.role === 'admin' ? 'success' : 'default'}>
                {user.role}
              </Badge>
              {profileData.dmSettings.isDM && (
                <Badge variant="warning">
                  <Crown className="h-3 w-3 mr-1" />
                  Dungeon Master
                </Badge>
              )}
            </div>
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
                        {avatarLoading ? 'Upload en cours...' : 'Confirmer l\'upload'}
                      </Button>
                    </div>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-white mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                
                {/* Message d'aide pour l'upload */}
                <p className="text-xs text-gray-400 mb-2">
                  Cliquez sur l'icône de caméra pour changer votre photo de profil
                </p>
                <p className="text-gray-300 text-sm mb-2">{profileData.email}</p>
                <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(profileData.joinedDate).toLocaleDateString()}</span>
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
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
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
                        Location
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          className="bg-gray-800/50 border-gray-600 text-white"
                          placeholder="City, Country"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-white">{profileData.location}</p>
                        </div>
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
                      <h3 className="text-lg font-medium text-white mb-4">Game Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.preferences.favoriteGames.map((game, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{game.name}</h4>
                              <div className="flex items-center space-x-2">
                                <button className={`p-1 rounded ${game.favorite ? 'text-red-400' : 'text-gray-400'}`}>
                                  <Heart className={`h-4 w-4 ${game.favorite ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="info" size="sm">{game.level}</Badge>
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
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Play Style</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.playStyle.map((style) => (
                          <Badge key={style} variant="default">{style}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Availability</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.availability.map((time) => (
                          <Badge key={time} variant="info">{time}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Preferred Session Length</h3>
                      <p className="text-gray-300">{profileData.preferences.preferredSessionLength}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'dm-settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Dungeon Master Profile</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">DM Mode</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Where I Run Games</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">In Person:</span>
                          <span className="text-white">{profileData.dmSettings.location.irlLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Online:</span>
                          <div className="flex space-x-1">
                            {profileData.dmSettings.location.vtt.map((vtt) => (
                              <Badge key={vtt} variant="default" size="sm">{vtt}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Pricing</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-white">
                            {profileData.dmSettings.pricing.hourlyRate}{profileData.dmSettings.pricing.currency}/hour
                          </span>
                        </div>
                        {profileData.dmSettings.pricing.freeGames && (
                          <Badge variant="success" size="sm">Free games available</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-white mb-3">Games I Master</h4>
                      <div className="space-y-3">
                        {profileData.dmSettings.masteredGames.map((game, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <h5 className="font-medium text-white">{game.name}</h5>
                              <p className="text-sm text-gray-400">{game.years} years experience</p>
                            </div>
                            <Badge 
                              variant={
                                game.experience === 'Expert' ? 'success' :
                                game.experience === 'Advanced' ? 'warning' : 'default'
                              }
                            >
                              {game.experience}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Profile Visibility</p>
                            <p className="text-sm text-gray-400">Who can see your profile</p>
                          </div>
                          <select className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-1">
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Show Email</p>
                            <p className="text-sm text-gray-400">Display email on profile</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Show Location</p>
                            <p className="text-sm text-gray-400">Display location on profile</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email Notifications</p>
                            <p className="text-sm text-gray-400">Receive updates via email</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Game Invitations</p>
                            <p className="text-sm text-gray-400">Get notified about game invites</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Announcements</p>
                            <p className="text-sm text-gray-400">Platform updates and news</p>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                          </button>
                        </div>
                      </div>
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
