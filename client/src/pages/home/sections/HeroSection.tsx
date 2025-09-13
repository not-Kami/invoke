
import { Link } from 'react-router-dom';
import { Plus, Users, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';
import HeroImage from '../../../assets/hero_section.webp';
import { useStats } from '../../../hooks/useStats';

export default function HeroSection() {
  const { stats, loading } = useStats();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HeroImage})`
        }}
      ></div>
      
      {/* Overlay Filters */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-transparent to-blue-900/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
        <div className="flex justify-end">
          {/* Main Content - Aligned Right */}
          <div className="text-right max-w-3xl">
            <div className="inline-flex items-center bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">Your Next Adventure Awaits</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Roll the Dice,<br />
              <span className="shimmer-text">
                <span className="shimmer-text-base">Write Your Legend</span>
                <span className="shimmer-text-effect">Write Your Legend</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl ml-auto">
              Connect with legendary dungeon masters, join epic campaigns, and forge unforgettable stories 
              in the ultimate tabletop RPG community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link to="/sessions">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  <Plus className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Start your next Adventure</span>
                  <span className="sm:hidden">Start Adventure</span>
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 shadow-2xl opacity-50 cursor-not-allowed"
                disabled
                title="Fonctionnalité à venir"
              >
                <Users className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Hire a Dungeon Master</span>
                <span className="sm:hidden">Hire DM</span>
                <span className="ml-2 text-sm text-gray-300 hidden sm:inline">(coming soon)</span>
                <span className="ml-2 text-xs text-gray-300 sm:hidden">(soon)</span>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md ml-auto">
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-white">
                  {loading ? '...' : `${stats?.totalUsers || 0}+`}
                </div>
                <div className="text-gray-300 text-sm">Adventurers</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-white">
                  {loading ? '...' : stats?.activeSessions || 0}
                </div>
                <div className="text-gray-300 text-sm">Active Sessions</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-white">
                  {loading ? '...' : stats?.totalDMs || 0}
                </div>
                <div className="text-gray-300 text-sm">Master DMs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
