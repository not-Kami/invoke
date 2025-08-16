import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Gamepad2, Users, BookOpen, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Attendre l'animation de sortie
  };

  if (!isVisible) return null;

  const quickActions = [
    {
      icon: Gamepad2,
      title: 'Browse Games',
      description: 'Discover new RPGs',
      href: '/games',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Find Sessions',
      description: 'Join active games',
      href: '/sessions',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Start Campaign',
      description: 'Create your adventure',
      href: '/campaigns/create',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Welcome to Invoke! 🎉</h3>
            <p className="text-slate-400 text-sm">Ready to start your adventure?</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="group block p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{action.title}</div>
                    <div className="text-slate-400 text-xs">{action.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <p className="text-slate-300 text-sm">
            Need help? Check out our <Link to="/about" className="text-purple-400 hover:text-purple-300 underline">About page</Link>
          </p>
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
