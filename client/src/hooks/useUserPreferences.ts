import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface UserPreferences {
  wantsToBeDM: boolean;
  favoriteGames: string[];
  masteredGames: string[];
  nickname: string;
  hasProfilePhoto: boolean;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
  lastUpdated: Date;
}

const USER_PREFERENCES_KEY = 'invoke_user_preferences';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    wantsToBeDM: false,
    favoriteGames: [],
    masteredGames: [],
    nickname: '',
    hasProfilePhoto: false,
    experienceLevel: 'beginner',
    onboardingCompleted: false,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Charger les préférences depuis le localStorage
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(USER_PREFERENCES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convertir la date string en objet Date
          if (parsed.lastUpdated) {
            parsed.lastUpdated = new Date(parsed.lastUpdated);
          }
          setPreferences(parsed);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Sauvegarder les préférences dans le localStorage
  const savePreferences = (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
        lastUpdated: new Date()
      };
      
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
      setPreferences(updatedPreferences);
      
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  };

  // Mettre à jour une préférence spécifique
  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    return savePreferences({ [key]: value });
  };

  // Mettre à jour plusieurs préférences à la fois
  const updateMultiplePreferences = (updates: Partial<UserPreferences>) => {
    return savePreferences(updates);
  };

  // Réinitialiser toutes les préférences
  const resetPreferences = () => {
    const defaultPreferences: UserPreferences = {
      wantsToBeDM: false,
      favoriteGames: [],
      masteredGames: [],
      nickname: '',
      hasProfilePhoto: false,
      experienceLevel: 'beginner',
      onboardingCompleted: false,
      lastUpdated: new Date()
    };
    
    try {
      localStorage.removeItem(USER_PREFERENCES_KEY);
      setPreferences(defaultPreferences);
      return true;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      return false;
    }
  };

  // Marquer l'onboarding comme terminé
  const markOnboardingCompleted = () => {
    return updatePreference('onboardingCompleted', true);
  };

  // Vérifier si l'onboarding est terminé
  const isOnboardingCompleted = () => {
    return preferences.onboardingCompleted;
  };

  // Obtenir les jeux favoris
  const getFavoriteGames = () => {
    return preferences.favoriteGames;
  };

  // Ajouter un jeu aux favoris
  const addFavoriteGame = (game: string) => {
    if (!preferences.favoriteGames.includes(game)) {
      const updatedFavorites = [...preferences.favoriteGames, game];
      return updatePreference('favoriteGames', updatedFavorites);
    }
    return true;
  };

  // Supprimer un jeu des favoris
  const removeFavoriteGame = (game: string) => {
    const updatedFavorites = preferences.favoriteGames.filter(g => g !== game);
    return updatePreference('favoriteGames', updatedFavorites);
  };

  // Vérifier si un jeu est dans les favoris
  const isFavoriteGame = (game: string) => {
    return preferences.favoriteGames.includes(game);
  };

  // Obtenir les jeux maîtrisés
  const getMasteredGames = () => {
    return preferences.masteredGames;
  };

  // Ajouter un jeu aux maîtrisés
  const addMasteredGame = (game: string) => {
    if (!preferences.masteredGames.includes(game)) {
      const updatedMastered = [...preferences.masteredGames, game];
      return updatePreference('masteredGames', updatedMastered);
    }
    return true;
  };

  // Supprimer un jeu des maîtrisés
  const removeMasteredGame = (game: string) => {
    const updatedMastered = preferences.masteredGames.filter(g => g !== game);
    return updatePreference('masteredGames', updatedMastered);
  };

  // Vérifier si un jeu est maîtrisé
  const isMasteredGame = (game: string) => {
    return preferences.masteredGames.includes(game);
  };

  // Obtenir le niveau d'expérience
  const getExperienceLevel = () => {
    return preferences.experienceLevel;
  };

  // Mettre à jour le niveau d'expérience
  const updateExperienceLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    return updatePreference('experienceLevel', level);
  };

  // Vérifier si l'utilisateur veut être DM
  const wantsToBeDM = () => {
    return preferences.wantsToBeDM;
  };

  // Mettre à jour l'intérêt pour être DM
  const updateDMInterest = (interested: boolean) => {
    return updatePreference('wantsToBeDM', interested);
  };

  // Obtenir le nickname
  const getNickname = () => {
    return preferences.nickname;
  };

  // Mettre à jour le nickname
  const updateNickname = (nickname: string) => {
    return updatePreference('nickname', nickname);
  };

  // Vérifier si l'utilisateur a une photo de profil
  const hasProfilePhoto = () => {
    return preferences.hasProfilePhoto;
  };

  // Mettre à jour le statut de la photo de profil
  const updateProfilePhotoStatus = (hasPhoto: boolean) => {
    return updatePreference('hasProfilePhoto', hasPhoto);
  };

  return {
    // État
    preferences,
    isLoading,
    
    // Actions principales
    savePreferences,
    updatePreference,
    updateMultiplePreferences,
    resetPreferences,
    
    // Onboarding
    markOnboardingCompleted,
    isOnboardingCompleted,
    
    // Jeux favoris
    getFavoriteGames,
    addFavoriteGame,
    removeFavoriteGame,
    isFavoriteGame,
    
    // Jeux maîtrisés
    getMasteredGames,
    addMasteredGame,
    removeMasteredGame,
    isMasteredGame,
    
    // Profil utilisateur
    getExperienceLevel,
    updateExperienceLevel,
    wantsToBeDM,
    updateDMInterest,
    getNickname,
    updateNickname,
    hasProfilePhoto,
    updateProfilePhotoStatus
  };
};
