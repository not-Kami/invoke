import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Gamepad2, Users, BookOpen, Shield, Star, User, Crown, Heart, Camera, SkipForward } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPreferences } from '../../hooks/useUserPreferences';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  isSkippable?: boolean;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { 
    preferences, 
    updateMultiplePreferences, 
    updatePreference 
  } = useUserPreferences();
  
  const [userPreferences, setUserPreferences] = useState({
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

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to Invoke!",
      description: "Your journey into tabletop RPGs starts here",
      icon: Star,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Welcome, {user?.firstName || 'Adventurer'}!
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Invoke is your gateway to epic tabletop RPG adventures. 
              Let's get to know you better to personalize your experience.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Your Gaming Identity",
      description: "Tell us about yourself as a player",
      icon: User,
      isSkippable: true,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your Gaming Identity</h3>
            <p className="text-slate-300">
              Help us personalize your experience (you can skip this for now)
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Nickname (optional)</label>
              <input
                type="text"
                placeholder="Enter your gaming nickname"
                value={userPreferences.nickname}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, nickname: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Experience Level</label>
              <select
                value={userPreferences.experienceLevel}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="beginner">Beginner - New to RPGs</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Experienced player</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasProfilePhoto"
                checked={userPreferences.hasProfilePhoto}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, hasProfilePhoto: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="hasProfilePhoto" className="text-slate-300">
                I have a profile photo to upload
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Dungeon Master Aspirations",
      description: "Would you like to run games?",
      icon: Crown,
      isSkippable: true,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Dungeon Master Aspirations</h3>
            <p className="text-slate-300">
              Being a DM means creating and running the game world for other players
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-3">What is a Dungeon Master?</h4>
            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Creates and describes the game world and story</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Controls non-player characters and monsters</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Makes rulings on game mechanics and rules</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensures everyone has fun and feels included</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="wantsToBeDM"
                checked={userPreferences.wantsToBeDM}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, wantsToBeDM: e.target.checked }))}
                className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="wantsToBeDM" className="text-slate-300 font-medium">
                Yes, I'm interested in becoming a Dungeon Master
              </label>
            </div>
            
            {userPreferences.wantsToBeDM && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  🎉 Great choice! We'll show you DM-specific tools and resources to help you get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Favorite Games",
      description: "What RPGs do you love?",
      icon: Heart,
      isSkippable: true,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your Favorite Games</h3>
            <p className="text-slate-300">
              Select the RPGs you love and want to play more of
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {popularGames.map((game) => (
              <div key={game} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`fav-${game}`}
                  checked={userPreferences.favoriteGames.includes(game)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUserPreferences(prev => ({
                        ...prev,
                        favoriteGames: [...prev.favoriteGames, game]
                      }));
                    } else {
                      setUserPreferences(prev => ({
                        ...prev,
                        favoriteGames: prev.favoriteGames.filter(g => g !== game)
                      }));
                    }
                  }}
                  className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
                />
                <label htmlFor={`fav-${game}`} className="text-slate-300 text-sm cursor-pointer">
                  {game}
                </label>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Selected: {userPreferences.favoriteGames.length} games
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Games You Master",
      description: "Which RPGs do you know well?",
      icon: Gamepad2,
      isSkippable: true,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Games You Master</h3>
            <p className="text-slate-300">
              Select the RPGs you're comfortable teaching to others
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {popularGames.map((game) => (
              <div key={game} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`master-${game}`}
                  checked={userPreferences.masteredGames.includes(game)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUserPreferences(prev => ({
                        ...prev,
                        masteredGames: [...prev.masteredGames, game]
                      }));
                    } else {
                      setUserPreferences(prev => ({
                        ...prev,
                        masteredGames: prev.masteredGames.filter(g => g !== game)
                      }));
                    }
                  }}
                  className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500"
                />
                <label htmlFor={`master-${game}`} className="text-slate-300 text-sm cursor-pointer">
                  {game}
                </label>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Selected: {userPreferences.masteredGames.length} games
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Discover Games",
      description: "Explore our curated collection of RPGs",
      icon: Gamepad2,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <Gamepad2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Browse Our Game Library</h3>
            <p className="text-slate-300">
              From classic D&D to indie gems, find your perfect RPG
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-slate-300 text-sm">Games Available</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">Free</div>
              <div className="text-slate-300 text-sm">Access to All</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-300 text-sm">Available</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Join Sessions",
      description: "Connect with players and game masters",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Join Gaming Sessions</h3>
            <p className="text-slate-300">
              Find active sessions or create your own with fellow adventurers
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">Browse available sessions</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">Join with one click</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">Create your own sessions</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Manage Campaigns",
      description: "Organize long-term adventures",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Campaign Management</h3>
            <p className="text-slate-300">
              Keep track of your ongoing adventures and character development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">For Players</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Track character progress</li>
                <li>• Join multiple campaigns</li>
                <li>• Access session history</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">For Game Masters</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Manage player roster</li>
                <li>• Plan session content</li>
                <li>• Track campaign milestones</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Security & Privacy",
      description: "Your data is safe with us",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your Privacy Matters</h3>
            <p className="text-slate-300">
              We're committed to protecting your personal information and gaming data
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">End-to-end encryption</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">GDPR compliant</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-slate-300">No data sharing</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    // Sauvegarder les préférences utilisateur
    updateMultiplePreferences({
      wantsToBeDM: userPreferences.wantsToBeDM,
      favoriteGames: userPreferences.favoriteGames,
      masteredGames: userPreferences.masteredGames,
      nickname: userPreferences.nickname,
      hasProfilePhoto: userPreferences.hasProfilePhoto,
      experienceLevel: userPreferences.experienceLevel
    });
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleSkipStep = () => {
    // Marquer l'étape comme complétée même si elle est sautée
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    handleNext();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const canSkipStep = currentStepData.isSkippable;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentStep + 1}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentStepData.title}</h2>
              <p className="text-slate-400 text-sm">{currentStepData.description}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentStep 
                    ? 'bg-purple-500' 
                    : completedSteps.has(index)
                    ? 'bg-green-500'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
            
            {canSkipStep && (
              <button
                onClick={handleSkipStep}
                className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
