import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Gamepad2, 
  BookOpen, 
  Settings,
  Shield
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { path: '/admin/sessions', icon: Calendar, label: 'Sessions' },
    { path: '/admin/games', icon: Gamepad2, label: 'Jeux' },
    { path: '/admin/campaigns', icon: BookOpen, label: 'Campagnes' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-xl font-cinzel font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar; 