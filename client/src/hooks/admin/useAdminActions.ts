import { adminAPI } from '../../lib/api';
import { useSimpleNotifications } from '../useSimpleNotifications';

export const useAdminActions = () => {
  const { addSuccess, addError } = useSimpleNotifications();

  const deleteUser = async (userId: string, setUsers: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        setUsers((prev: any[]) => prev.filter((user: any) => user._id !== userId));
        addSuccess('Success', 'Utilisateur supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      addError('Error', `Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const deleteSession = async (sessionId: string, setSessions: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteSession(sessionId);
      if (response.success) {
        setSessions((prev: any[]) => prev.filter((session: any) => session._id !== sessionId));
        addSuccess('Success', 'Session supprimée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      addError('Error', `Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const deleteCampaign = async (campaignId: string, setCampaigns: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteCampaign(campaignId);
      if (response.success) {
        setCampaigns((prev: any[]) => prev.filter((campaign: any) => campaign._id !== campaignId));
        addSuccess('Success', 'Campagne supprimée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      addError('Error', `Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const deleteGame = async (gameId: string, setGames: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteGame(gameId);
      if (response.success) {
        setGames((prev: any[]) => prev.filter((game: any) => game._id !== gameId));
        addSuccess('Success', 'Jeu supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      addError('Error', `Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const toggleFeatured = async (type: string, id: string, featured: boolean, setter: any) => {
    try {
      
      let response;
      switch (type) {
        case 'user':
          response = await adminAPI.adminUpdateUserFeatured(id, featured);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Success', 'Utilisateur mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'session':
          response = await adminAPI.adminUpdateSessionFeatured(id, featured);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Success', 'Session mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'campaign':
          response = await adminAPI.updateCampaign(id, { featured });
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Success', 'Campagne mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'game':
          response = await adminAPI.updateGame(id, { featured });
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Success', 'Jeu mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        default:
          throw new Error(`Type non supporté: ${type}`);
      }
    } catch (error) {
      addError('Error', `Erreur de mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // TODO: Implémenter exportSession quand l'API sera disponible
  const exportSession = async (_sessionId: string) => {
    addSuccess('Info', 'Export des sessions pas encore implémenté');
  };

  const replyToConversation = async (conversationId: string, content: string) => {
    try {
      const response = await adminAPI.replyToConversation(conversationId, content);
      if (response.success) {
        addSuccess('Success', 'Réponse envoyée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      addError('Error', `Erreur d'envoi: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return {
    deleteUser,
    deleteSession,
    deleteCampaign,
    deleteGame,
    toggleFeatured,
    exportSession,
    replyToConversation
  };
};
