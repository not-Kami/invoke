import { adminAPI } from '../../lib/api';
import { useNotifications } from '../useNotifications';

export const useAdminActions = () => {
  const { addSuccess, addError } = useNotifications();

  const deleteUser = async (userId: string, setUsers: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        setUsers((prev: any[]) => prev.filter((user: any) => user._id !== userId));
        addSuccess('Utilisateur supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de la suppression:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
        addSuccess('Session supprimée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de la suppression:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
        addSuccess('Campagne supprimée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de la suppression:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
        addSuccess('Jeu supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de la suppression:', error);
      addError(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const toggleFeatured = async (type: string, id: string, featured: boolean, setter: any) => {
    try {
      console.log(`useAdminActions: Mise à jour featured ${type} ${id} -> ${featured}`);
      
      let response;
      switch (type) {
        case 'user':
          console.log('useAdminActions: Sending updateUserFeatured request:', { id, featured });
          response = await adminAPI.adminUpdateUserFeatured(id, featured);
          console.log('useAdminActions: Response received:', response);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Utilisateur mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'session':
          console.log('useAdminActions: Sending adminUpdateSessionFeatured request:', { id, featured });
          response = await adminAPI.adminUpdateSessionFeatured(id, featured);
          console.log('useAdminActions: Session featured response received:', response);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Session mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'campaign':
          console.log('useAdminActions: Sending updateCampaign request:', { id, featured });
          response = await adminAPI.updateCampaign(id, { featured });
          console.log('useAdminActions: Campaign featured response received:', response);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Campagne mise à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        case 'game':
          console.log('useAdminActions: Sending updateGame request:', { id, featured });
          response = await adminAPI.updateGame(id, { featured });
          console.log('useAdminActions: Game featured response received:', response);
          if (response.success && response.data) {
            setter((prev: any[]) => prev.map((item: any) => 
              item._id === id ? { ...item, featured } : item
            ));
            addSuccess('Jeu mis à jour avec succès');
          } else {
            throw new Error(response.error || 'Erreur lors de la mise à jour');
          }
          break;
        default:
          throw new Error(`Type non supporté: ${type}`);
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de la mise à jour featured:', error);
      addError(`Erreur de mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // TODO: Implémenter exportSession quand l'API sera disponible
  const exportSession = async (_sessionId: string) => {
    console.log('exportSession not implemented yet');
    addSuccess('Export des sessions pas encore implémenté');
  };

  const replyToConversation = async (conversationId: string, content: string) => {
    try {
      const response = await adminAPI.replyToConversation(conversationId, content);
      if (response.success) {
        addSuccess('Réponse envoyée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      console.error('useAdminActions: Erreur lors de l\'envoi de la réponse:', error);
      addError(`Erreur d'envoi: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
