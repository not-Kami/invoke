import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  UserPlus,
  Bell,
  Settings,
  LayoutDashboard,
  Search
} from 'lucide-react';
import InvokeLogo from '../../assets/invoke-logo.svg';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Games', href: '/games' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Campaigns', href: '/campaigns' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Fixé à gauche */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src={InvokeLogo} alt="Invoke" className="h-12 w-12" />
            <span className="font-display text-xl font-bold text-white">Invoke</span>
          </Link>

          {/* Navigation + Search + Actions - Centrés */}
          <div className="hidden md:flex items-center flex-1 justify-center space-x-8 ml-8">
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors font-medium flex items-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Search Bar - Intégré dans la navigation */}
            <div className="flex items-center max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des sessions, campagnes, joueurs..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Desktop Actions - Fixés à droite */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <>
                <button className="text-gray-300 hover:text-white transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    {user.firstName}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Mobile Search */}
            <div className="px-2 pt-2 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-lg">
              {user && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              )}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 space-y-2">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}