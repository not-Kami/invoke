
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Users, 
  BookOpen, 
  Shield, 
  Heart,

  ArrowRight,
  Play
} from 'lucide-react';
import InvokeLogo from '../assets/invoke-logo.svg';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Role-Playing Games',
      description: 'Create and manage your role-playing game sessions with an intuitive and modern interface.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a passionate community of players and game masters.'
    },
    {
      icon: BookOpen,
      title: 'Campaigns',
      description: 'Organize your long-term campaigns with advanced management tools.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your data is protected with the best security practices.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Players' },
    { number: '500+', label: 'Sessions Created' },
    { number: '100+', label: 'Campaigns' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src={InvokeLogo} alt="Invoke" className="w-24 h-24" />
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-white mb-6">
              About <span className="text-purple-400">Invoke</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Invoke is a modern platform dedicated to role-playing game enthusiasts. 
              We believe that every gaming session should be a memorable adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Start the Adventure</span>
                </button>
              </Link>
              <Link to="/games">
                <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                  Discover Games
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cinzel font-bold text-white mb-4">
              Why Choose Invoke?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A platform designed by enthusiasts, for enthusiasts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-cinzel font-bold text-white mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              At Invoke, we are committed to creating the best possible experience for 
              the role-playing game community. Our platform combines modern technology and 
              gaming passion to provide an environment where every player can thrive.
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <Heart className="w-6 h-6" />
              <span className="text-lg font-medium">Built with passion</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-cinzel font-bold text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of players who have already chosen Invoke for their adventures
          </p>
          <Link to="/signup">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 mx-auto">
              <span>Join Invoke</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
