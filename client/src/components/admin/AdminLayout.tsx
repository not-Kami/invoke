
import AdminSecurityWrapper from '../auth/AdminSecurityWrapper';
import { usePermissions } from '../../hooks/usePermissions';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InvokeLogo from '../../assets/invoke-logo.svg';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { canViewAdminPanel } = usePermissions();

  // Double vérification : composant + hook
  if (!canViewAdminPanel) {
    return null; // Le AdminSecurityWrapper gérera l'affichage
  }

  return (
    <AdminSecurityWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header avec menu */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo et titre */}
              <div className="flex items-center space-x-4">
                <img src={InvokeLogo} alt="Invoke" className="w-10 h-10" />
                <h1 className="text-2xl font-cinzel font-bold text-white">Invoke - Admin Panel</h1>
              </div>
              
              {/* Bouton retour */}
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to the app</span>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Contenu principal */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminSecurityWrapper>
  );
};

export default AdminLayout; 