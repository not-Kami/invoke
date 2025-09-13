
import { useHomePageData } from './hooks/useHomePageData';
import { useOnboarding } from '../../hooks/useOnboarding';

// Sections
import { HeroSection, FeaturedGamesSection, FeaturedSessionsSection } from './sections';
import OnboardingModal from '../../components/onboarding/OnboardingModal';
import WelcomeBanner from '../../components/onboarding/WelcomeBanner';

export default function HomePage() {
  const { featuredGames, gamesLoading, featuredSessions, sessionsLoading } = useHomePageData();
  const { showOnboarding, showWelcomeBanner, completeOnboarding, skipOnboarding, dismissWelcomeBanner } = useOnboarding();


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <HeroSection />

              {/* Featured Games Section */}
      <FeaturedGamesSection
        featuredGames={featuredGames}
        loading={gamesLoading}
      />

              {/* Featured Sessions Section */}
      <FeaturedSessionsSection
        featuredSessions={featuredSessions}
        loading={sessionsLoading}
      />

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
}