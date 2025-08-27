import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useFavoriteGames } from '../../hooks/useFavoriteGames';
import { useMasteredGames } from '../../hooks/useMasteredGames';
import PlayerDashboard from '../../components/dashboard/PlayerDashboard';
import DMDashboard from '../../components/dashboard/DMDashboard';

import Button from '../../components/ui/Button';
import DMConfirmationModal from '../../components/ui/DMConfirmationModal';
import StopDMConfirmationModal from '../../components/ui/StopDMConfirmationModal';

import { 
  Crown,
  User,
  Lock,
  X,
  CheckCircle,

  AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const { loading, sessions, isAdmin, isDM } = useDashboardData();
  const { favoriteGames, removeFavoriteGame } = useFavoriteGames();
  const { masteredGames, removeMasteredGame } = useMasteredGames();
  const [viewMode, setViewMode] = useState<'player' | 'dm'>('player');
  
  // États pour les modals DM
  const [showDMConfirmation, setShowDMConfirmation] = useState(false);
  const [showStopDMConfirmation, setShowStopDMConfirmation] = useState(false);
  const [dmActionLoading, setDmActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  // Données réelles du dashboard - filtrer les 5 premières sessions à venir (pas terminées)
  const upcomingSessions = sessions
    .filter(session => 
      new Date(session.date) > new Date() && 
      session.status !== 'finished' && 
      session.status !== 'cancelled'
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Fonction pour devenir DM
  const handleBecomeDM = async () => {
    try {
      setDmActionLoading(true);
      await updateUser({ isDM: true });
      setShowDMConfirmation(false);
      setNotification({
        type: 'success',
        message: 'Félicitations ! Vous êtes maintenant Maître de Donjon ! 🎲'
      });
      // Basculer automatiquement vers le mode DM
      setViewMode('dm');
    } catch (error) {
      console.error('Error becoming DM:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du changement de statut. Veuillez réessayer.'
      });
    } finally {
      setDmActionLoading(false);
    }
  };

  // Fonction pour arrêter d'être DM
  const handleStopBeingDM = async () => {
    try {
      console.log('🔄 Starting handleStopBeingDM...');
      console.log('👤 Current user:', user);
      console.log('🎯 Updating isDM to false...');
      
      setDmActionLoading(true);
      await updateUser({ isDM: false });
      
      console.log('✅ updateUser completed successfully');
      setShowStopDMConfirmation(false);
      setNotification({
        type: 'success',
        message: 'Vous n\'êtes plus Maître de Donjon. Retour au mode joueur.'
      });
      // Basculer automatiquement vers le mode joueur
      setViewMode('player');
    } catch (error) {
      console.error('❌ Error stopping DM status:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors du changement de statut. Veuillez réessayer.'
      });
    } finally {
      setDmActionLoading(false);
    }
  };

  // Vérifier si l'utilisateur peut accéder à la vue DM
  const canAccessDMView = isDM || isAdmin;

  // Déterminer le mode d'affichage initial seulement au premier chargement
  React.useEffect(() => {
    // Si c'est le premier chargement et que l'utilisateur peut être DM, proposer le mode DM par défaut
    if (canAccessDMView && viewMode === 'player') {
      // Mais ne pas forcer automatiquement, laisser l'utilisateur choisir
      console.log('User can access DM view, but keeping current viewMode:', viewMode);
    }
  }, [canAccessDMView]); // Retirer viewMode des dépendances pour éviter les changements automatiques

  // Fermer la notification après 5 secondes
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen py-12">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="absolute top-2 right-2 text-white/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-300 mt-2">
                {viewMode === 'player' ? 'Ready for your next adventure?' : 'Time to craft some epic stories!'}
              </p>
            </div>
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('player')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'player'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Player Mode</span>
              </button>
              <button
                onClick={() => setViewMode('dm')}
                disabled={!canAccessDMView}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'dm'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : canAccessDMView 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span>DM Mode</span>
                {!canAccessDMView && <Lock className="h-3 w-3 ml-1" />}
              </button>
            </div>

            {/* Bouton pour arrêter d'être DM (seulement visible en mode DM) */}
            {viewMode === 'dm' && isDM && !isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                onClick={() => setShowStopDMConfirmation(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Stop being DM
              </Button>
            )}
          </div>
        </div>

        {/* Contenu du Dashboard selon le mode */}
        {viewMode === 'player' ? (
          <PlayerDashboard
            upcomingSessions={upcomingSessions}
            loading={loading}
            isAdmin={isAdmin || false}
            isDM={isDM || false}
            favoriteGames={favoriteGames}
            onAddFavoriteGame={() => window.location.href = '/games'}
            onRemoveFavoriteGame={removeFavoriteGame}
          />
        ) : (
          <DMDashboard
            masteredGames={masteredGames}
            sessions={sessions}
            loading={loading}
            userId={user._id}
            onAddMasteredGame={() => window.location.href = '/games'}
            onRemoveMasteredGame={removeMasteredGame}
          />
        )}

        {/* Modals */}
        <DMConfirmationModal
          isOpen={showDMConfirmation}
          onClose={() => setShowDMConfirmation(false)}
          onConfirm={handleBecomeDM}
          loading={dmActionLoading}
        />

        <StopDMConfirmationModal
          isOpen={showStopDMConfirmation}
          onClose={() => setShowStopDMConfirmation(false)}
          onConfirm={handleStopBeingDM}
          loading={dmActionLoading}
        />
      </div>
    </div>
  );
}
