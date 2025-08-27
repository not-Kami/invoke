import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import OnboardingModal from './OnboardingModal';
import WelcomeBanner from './WelcomeBanner';
import UserPreferencesSection from '../profile/UserPreferencesSection';

const OnboardingDemo: React.FC = () => {
  const { 
    showOnboarding, 
    showWelcomeBanner, 
    completeOnboarding, 
    resetOnboarding, 
    skipOnboarding, 
    dismissWelcomeBanner 
  } = useOnboarding();

  const {
    preferences,
    resetPreferences,
    markOnboardingCompleted,
    isOnboardingCompleted
  } = useUserPreferences();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Onboarding & Preferences Demo</h2>
      
      {/* Onboarding Controls */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Onboarding Controls</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={resetOnboarding}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Show Onboarding
          </button>
          
          <button
            onClick={() => resetPreferences()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reset All Preferences
          </button>
          
          <button
            onClick={() => markOnboardingCompleted()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Mark Onboarding Complete
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div>
            <p><strong>Onboarding Modal:</strong> {showOnboarding ? 'Visible' : 'Hidden'}</p>
            <p><strong>Welcome Banner:</strong> {showWelcomeBanner ? 'Visible' : 'Hidden'}</p>
            <p><strong>Onboarding Completed:</strong> {isOnboardingCompleted() ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p><strong>Local Storage Key:</strong> invoke_onboarding_completed</p>
            <p><strong>Preferences Key:</strong> invoke_user_preferences</p>
            <p><strong>Last Updated:</strong> {preferences.lastUpdated?.toLocaleString() || 'Never'}</p>
          </div>
        </div>
      </div>

      {/* User Preferences Display */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">User Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-sm">
          <div>
            <p><strong>Nickname:</strong> {preferences.nickname || 'Not set'}</p>
            <p><strong>Experience:</strong> {preferences.experienceLevel}</p>
            <p><strong>Wants to DM:</strong> {preferences.wantsToBeDM ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p><strong>Has Photo:</strong> {preferences.hasProfilePhoto ? 'Yes' : 'No'}</p>
            <p><strong>Favorite Games:</strong> {preferences.favoriteGames.length}</p>
            <p><strong>Mastered Games:</strong> {preferences.masteredGames.length}</p>
          </div>
          <div>
            <p><strong>Onboarding:</strong> {preferences.onboardingCompleted ? 'Complete' : 'Incomplete'}</p>
            <p><strong>Last Updated:</strong> {preferences.lastUpdated?.toLocaleString() || 'Never'}</p>
          </div>
        </div>
      </div>

      {/* User Preferences Section */}
      <UserPreferencesSection />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={skipOnboarding}
        onComplete={completeOnboarding}
      />

      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <WelcomeBanner onDismiss={dismissWelcomeBanner} />
      )}
    </div>
  );
};

export default OnboardingDemo;
