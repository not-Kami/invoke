# 🚀 Onboarding System - Invoke

## Overview
The onboarding system provides new users with an interactive tour of Invoke's key features while collecting personalized information about their gaming preferences. This helps create a tailored experience and better matchmaking for gaming sessions.

## Components

### 1. OnboardingModal
- **Purpose**: Main onboarding flow with step-by-step guidance and user preference collection
- **Features**: 
  - 9 interactive steps covering platform features and user preferences
  - Progress tracking with visual indicators
  - Responsive design for all screen sizes
  - Skip functionality for preference collection steps
  - User preference collection (nickname, experience, DM interest, games)

### 2. WelcomeBanner
- **Purpose**: Post-onboarding welcome message with quick actions
- **Features**:
  - Quick access to main platform features
  - Dismissible after user interaction
  - Links to key sections (Games, Sessions, Campaigns)

### 3. OnboardingDemo
- **Purpose**: Development/testing component for onboarding and user preferences
- **Features**:
  - Manual control over onboarding states
  - User preferences management and display
  - Local storage management
  - Status display for debugging
  - Accessible via `/demo/onboarding` route

## Hooks

### useOnboarding
- `showOnboarding`: Controls modal visibility
- `showWelcomeBanner`: Controls welcome banner visibility
- `isLoading`: Loading state for initialization

### useUserPreferences
- `preferences`: User preferences object
- `isLoading`: Loading state for preferences
- `updatePreference`: Update single preference
- `updateMultiplePreferences`: Update multiple preferences at once
- `resetPreferences`: Reset all preferences to defaults

### Functions
- `completeOnboarding()`: Marks onboarding as complete
- `resetOnboarding()`: Resets onboarding state
- `skipOnboarding()`: Skips current onboarding session
- `dismissWelcomeBanner()`: Hides welcome banner

### Local Storage
- **Key**: `invoke_onboarding_completed`
- **Value**: `"true"` when completed
- **Purpose**: Persist onboarding completion across sessions

## Onboarding Steps

### Step 1: Welcome
- Personalized greeting with user's name
- Platform overview and mission statement

### Step 2: Gaming Identity (Skippable)
- Nickname input
- Experience level selection
- Profile photo availability

### Step 3: DM Aspirations (Skippable)
- Explanation of Dungeon Master role
- Interest in becoming a DM
- DM-specific features preview

### Step 4: Favorite Games (Skippable)
- Selection of preferred RPGs
- Multiple choice from popular games
- Custom game preferences

### Step 5: Games You Master (Skippable)
- Games comfortable teaching to others
- Expertise level indication
- Mentoring opportunities

### Step 6: Discover Games
- Game library introduction
- Statistics and key benefits
- Visual representation of available content

### Step 7: Join Sessions
- Session management features
- Player and GM capabilities
- Quick action checkboxes

### Step 8: Manage Campaigns
- Campaign organization tools
- Separate player and GM features
- Long-term adventure planning

### Step 9: Security & Privacy
- Data protection commitment
- Security features overview
- Trust-building information

## User Preferences

### Collected Information
- **Gaming Identity**: Nickname, experience level, profile photo availability
- **DM Interest**: Whether the user wants to become a Dungeon Master
- **Game Preferences**: Favorite games and mastered games
- **Onboarding Status**: Completion tracking and last update timestamp

### Storage
- **Local Storage**: All preferences stored locally for privacy
- **Key**: `invoke_user_preferences`
- **Persistence**: Survives browser sessions and app restarts
- **Privacy**: No data sent to server without explicit consent

## Integration
```tsx
import { useOnboarding } from '../../hooks/useOnboarding';

const HomePage = () => {
  const { showOnboarding, showWelcomeBanner, completeOnboarding, skipOnboarding, dismissWelcomeBanner } = useOnboarding();
  
  return (
    <>
      {/* Main content */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={skipOnboarding}
        onComplete={completeOnboarding}
      />
      {showWelcomeBanner && (
        <WelcomeBanner onDismiss={dismissWelcomeBanner} />
      )}
    </>
  );
};
```

### Navbar Integration
```tsx
import { useOnboarding } from '../../hooks/useOnboarding';

const Navbar = () => {
  const { resetOnboarding } = useOnboarding();
  
  return (
    <button onClick={resetOnboarding} title="Show onboarding again">
      <HelpCircle className="h-4 w-4" />
    </button>
  );
};
```

### Profile Integration
```tsx
import { UserPreferencesSection } from '../onboarding';

const ProfilePage = () => {
  return (
    <div>
      {/* Other profile content */}
      <UserPreferencesSection />
    </div>
  );
};
```

## Customization

### Adding New Steps
1. Add step data to `steps` array in `OnboardingModal`
2. Include icon, title, description, and content
3. Update step count and progress calculation

### Modifying Content
- Each step's content is fully customizable
- Supports React components, images, and interactive elements
- Responsive design with Tailwind CSS classes

### Styling
- Uses consistent design system with platform theme
- Purple/blue gradient color scheme
- Smooth animations and transitions
- Mobile-first responsive design

## Best Practices

1. **Performance**: Lazy load onboarding content
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **User Experience**: Allow users to skip or go back
4. **Persistence**: Save completion status locally
5. **Testing**: Use OnboardingDemo component for development

## Future Enhancements

- [ ] A/B testing for different onboarding flows
- [ ] Analytics tracking for completion rates
- [ ] Personalized onboarding based on user preferences
- [ ] Video tutorials integration
- [ ] Interactive walkthroughs for specific features
