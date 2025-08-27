import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';
import InvokeLogo from '../../assets/invoke-logo.svg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={InvokeLogo} alt="Invoke" className="w-10 h-10" />
              <span className="text-xl font-cinzel font-bold text-white">Invoke</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Your community platform for tabletop RPGs. 
              Connect with passionate players and create memorable adventures.
            </p>
            <div className="flex items-center space-x-2 text-slate-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">Built with passion</span>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-slate-400 hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="text-slate-400 hover:text-white transition-colors">
                  Sessions
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-slate-400 hover:text-white transition-colors">
                  Campaigns
                </Link>
              </li>
            </ul>
          </div>

          {/* Support et aide */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2">
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    localStorage.removeItem('invoke_onboarding_completed');
                    window.location.reload();
                  }}
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Onboarding</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © {currentYear} Invoke. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Privacy protected</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message de fin */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm italic">
            May your dice roll true.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
