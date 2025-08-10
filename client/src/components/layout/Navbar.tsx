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
  LayoutDashboard
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={InvokeLogo} alt="Invoke" className="h-12 w-12" />
            <span className="font-display text-xl font-bold text-white">Invoke</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2">
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