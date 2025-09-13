import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPreferences } from './useUserPreferences';

const ONBOARDING_KEY = 'invoke_onboarding_completed';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { isOnboardingCompleted, markOnboardingCompleted } = useUserPreferences();

  useEffect(() => {
    // Vérifier si l'onboarding a déjà été complété
    const checkOnboardingStatus = () => {
      try {
        // Vérifier d'abord les préférences utilisateur
        if (user && !isOnboardingCompleted()) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (error) {
        // En cas d'erreur, on affiche l'onboarding par défaut
        if (user) {
          setShowOnboarding(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isOnboardingCompleted]);

  const completeOnboarding = () => {
    try {
      // Marquer l'onboarding comme terminé dans les préférences utilisateur
      markOnboardingCompleted();
      setShowOnboarding(false);
      // Afficher la bannière de bienvenue après l'onboarding
      setShowWelcomeBanner(true);
    } catch (error) {
    }
  };

  const resetOnboarding = () => {
    try {
      // Réinitialiser l'onboarding dans les préférences utilisateur
      localStorage.removeItem(ONBOARDING_KEY);
      setShowOnboarding(true);
    } catch (error) {
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const dismissWelcomeBanner = () => {
    setShowWelcomeBanner(false);
  };

  return {
    showOnboarding,
    showWelcomeBanner,
    isLoading,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding,
    dismissWelcomeBanner
  };
};
