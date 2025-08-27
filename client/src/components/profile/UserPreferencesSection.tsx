import React, { useState } from 'react';
import { Edit3, Save, X, Crown, Heart, Gamepad2, Camera } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences';

const UserPreferencesSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
    const {
    preferences,
    updateMultiplePreferences,
    isLoading
  } = useUserPreferences();

  const [editPreferences, setEditPreferences] = useState({
    wantsToBeDM: preferences.wantsToBeDM,
    favoriteGames: preferences.favoriteGames,
    masteredGames: preferences.masteredGames,
    nickname: preferences.nickname,
    hasProfilePhoto: preferences.hasProfilePhoto,
    experienceLevel: preferences.experienceLevel
  });

  const popularGames = [
    'Dungeons & Dragons 5e',
    'Pathfinder 2e',
    'Call of Cthulhu',
    'Vampire: The Masquerade',
    'Cyberpunk 2020',
    'Star Wars RPG',
    'Blades in the Dark',
    'Monster of the Week',
    'Fate Core',
    'Savage Worlds'
  ];

  const handleSave = () => {
    updateMultiplePreferences(editPreferences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditPreferences({
      wantsToBeDM: preferences.wantsToBeDM,
      favoriteGames: preferences.favoriteGames,
      masteredGames: preferences.masteredGames,
      nickname: preferences.nickname,
      hasProfilePhoto: preferences.hasProfilePhoto,
      experienceLevel: preferences.experienceLevel
    });
    setIsEditing(false);
  };

  const handleGameToggle = (game: string, type: 'favorite' | 'mastered') => {
    if (type === 'favorite') {
      const newFavorites = editPreferences.favoriteGames.includes(game)
        ? editPreferences.favoriteGames.filter(g => g !== game)
        : [...editPreferences.favoriteGames, game];
      setEditPreferences(prev => ({ ...prev, favoriteGames: newFavorites }));
    } else {
      const newMastered = editPreferences.masteredGames.includes(game)
        ? editPreferences.masteredGames.filter(g => g !== game)
        : [...editPreferences.masteredGames, game];
      setEditPreferences(prev => ({ ...prev, masteredGames: newMastered }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Gaming Preferences</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Gaming Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Nickname</label>
            {isEditing ? (
              <input
                type="text"
                value={editPreferences.nickname}
                onChange={(e) => setEditPreferences(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="Enter your gaming nickname"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <div className="text-slate-300">
                {preferences.nickname || 'Not set'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Experience Level</label>
            {isEditing ? (
              <select
                value={editPreferences.experienceLevel}
                onChange={(e) => setEditPreferences(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            ) : (
              <div className="text-slate-300 capitalize">
                {preferences.experienceLevel}
              </div>
            )}
          </div>
        </div>

        {/* DM Interest */}
        <div>
          <label className="block text-white font-medium mb-2">Dungeon Master Interest</label>
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="edit-dm-interest"
                checked={editPreferences.wantsToBeDM}
                onChange={(e) => setEditPreferences(prev => ({ ...prev, wantsToBeDM: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="edit-dm-interest" className="text-slate-300">
                Interested in becoming a Dungeon Master
              </label>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Crown className={`w-5 h-5 ${preferences.wantsToBeDM ? 'text-yellow-400' : 'text-slate-600'}`} />
              <span className="text-slate-300">
                {preferences.wantsToBeDM ? 'Interested in DMing' : 'Not interested in DMing'}
              </span>
            </div>
          )}
        </div>

        {/* Profile Photo Status */}
        <div>
          <label className="block text-white font-medium mb-2">Profile Photo</label>
          {isEditing ? (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="edit-profile-photo"
                checked={editPreferences.hasProfilePhoto}
                onChange={(e) => setEditPreferences(prev => ({ ...prev, hasProfilePhoto: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="edit-profile-photo" className="text-slate-300">
                I have a profile photo to upload
              </label>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Camera className={`w-5 h-5 ${preferences.hasProfilePhoto ? 'text-green-400' : 'text-slate-600'}`} />
              <span className="text-slate-300">
                {preferences.hasProfilePhoto ? 'Photo available' : 'No photo uploaded'}
              </span>
            </div>
          )}
        </div>

        {/* Favorite Games */}
        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span>Favorite Games ({preferences.favoriteGames.length})</span>
          </label>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {popularGames.map((game) => (
                <div key={game} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`edit-fav-${game}`}
                    checked={editPreferences.favoriteGames.includes(game)}
                    onChange={() => handleGameToggle(game, 'favorite')}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor={`edit-fav-${game}`} className="text-slate-300 text-sm cursor-pointer">
                    {game}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.favoriteGames.length > 0 ? (
                preferences.favoriteGames.map((game) => (
                  <span key={game} className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">
                    {game}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">No favorite games selected</span>
              )}
            </div>
          )}
        </div>

        {/* Mastered Games */}
        <div>
          <label className="block text-white font-medium mb-2 flex items-center space-x-2">
            <Gamepad2 className="w-5 h-5 text-green-400" />
            <span>Games You Master ({preferences.masteredGames.length})</span>
          </label>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {popularGames.map((game) => (
                <div key={game} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`edit-master-${game}`}
                    checked={editPreferences.masteredGames.includes(game)}
                    onChange={() => handleGameToggle(game, 'mastered')}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor={`edit-master-${game}`} className="text-slate-300 text-sm cursor-pointer">
                    {game}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.masteredGames.length > 0 ? (
                preferences.masteredGames.map((game) => (
                  <span key={game} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                    {game}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">No mastered games selected</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesSection;
