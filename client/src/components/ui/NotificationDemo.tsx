import React, { useState } from 'react';
import Button from './Button';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationDemo: React.FC = () => {
  const { addSuccess, addError, addInfo, clearNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const simulateAPICall = async (type: 'success' | 'error' | 'info') => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (type) {
      case 'success':
        addSuccess('Opération réussie ! Les données ont été chargées avec succès.');
        break;
      case 'error':
        addError('Erreur de connexion à l\'API. Vérifiez votre connexion internet.');
        break;
      case 'info':
        addInfo('Nouvelles données disponibles. Cliquez sur actualiser pour les voir.');
        break;
    }
    
    setIsLoading(false);
  };

  const simulateAdminActions = () => {
    addInfo('Simulation des actions admin...');
    
    setTimeout(() => addSuccess('Utilisateur mis en avant avec succès'), 500);
    setTimeout(() => addSuccess('Session mise à jour'), 1000);
    setTimeout(() => addError('Erreur lors de la suppression'), 1500);
    setTimeout(() => addInfo('Synchronisation terminée'), 2000);
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-xl font-cinzel font-semibold text-white mb-4">
        🧪 Démonstration du système de notifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-slate-300">Tests simples</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => addSuccess('Opération réussie !')} 
              variant="primary"
              disabled={isLoading}
            >
              ✅ Succès
            </Button>
            <Button 
              onClick={() => addError('Une erreur est survenue !')} 
              variant="danger"
              disabled={isLoading}
            >
              ❌ Erreur
            </Button>
            <Button 
              onClick={() => addInfo('Information importante')} 
              variant="outline"
              disabled={isLoading}
            >
              ℹ️ Info
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-medium text-slate-300">Simulations API</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => simulateAPICall('success')} 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳' : '🚀'} API Success
            </Button>
            <Button 
              onClick={() => simulateAPICall('error')} 
              variant="danger"
              disabled={isLoading}
            >
              {isLoading ? '⏳' : '💥'} API Error
            </Button>
            <Button 
              onClick={() => simulateAPICall('info')} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? '⏳' : '📡'} API Info
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-slate-300">Scénarios complexes</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={simulateAdminActions} 
            variant="glass"
            disabled={isLoading}
          >
            🎭 Scénario Admin
          </Button>
          <Button 
            onClick={clearNotifications} 
            variant="ghost"
          >
            🗑️ Effacer tout
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-slate-400 mb-2">📋 Instructions de test</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Cliquez sur les boutons pour tester différents types de notifications</li>
          <li>• Les notifications s'auto-suppriment après 5 secondes</li>
          <li>• Cliquez sur ❌ pour fermer manuellement une notification</li>
          <li>• Testez le scénario admin pour voir plusieurs notifications</li>
          <li>• Utilisez "Effacer tout" pour nettoyer l'écran</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo;
