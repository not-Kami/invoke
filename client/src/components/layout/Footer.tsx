import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Instagram, MessageCircle } from 'lucide-react';
import InvokeLogo from '../../assets/invoke-logo.svg';

export default function Footer() {
  const navigation = {
    main: [
      { name: 'Sessions', href: '/sessions' },
      { name: 'Games', href: '/games' },
      { name: 'Campaigns', href: '/campaigns' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      {
        name: 'Discord',
        href: '#',
        icon: MessageCircle,
      },
      {
        name: 'Instagram',
        href: 'https://instagram.com/nacho_fuerte',
        icon: Instagram,
      },
      {
        name: 'GitHub',
        href: 'https://github.com/not-kami',
        icon: Github,
      },
    ],
  };

  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-white/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img src={InvokeLogo} alt="Invoke" className="h-12 w-12" />
              <span className="font-display text-xl font-bold text-white">Invoke</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Embark on epic quests, forge legendary characters, and discover master dungeon masters 
              in a world where every roll of the dice tells a story.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
                  Explore
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.main.slice(0, 3).map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.main.slice(3).map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Invoke. All rights reserved. May your dice roll true.
          </p>
        </div>
      </div>
    </footer>
  );
}
