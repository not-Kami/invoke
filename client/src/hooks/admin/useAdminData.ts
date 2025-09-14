import { useState, useEffect } from 'react';
import { adminAPI, User, Session, Campaign, Game, Conversation } from '../../lib/api';
import { useSimpleNotifications } from '../useSimpleNotifications';

type TabType = 'users' | 'sessions' | 'campaigns' | 'games' | 'conversations';

export const useAdminData = (activeTab: TabType) => {
  const { addSuccess, addError } = useSimpleNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [originalSessions, setOriginalSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadData = async () => {
    if (isLoadingData) {
      return;
    }
    
    setIsLoadingData(true);
    setLoading(true);
    
    try {
      
      let usersRes: any = null, sessionsRes: any = null, campaignsRes: any = null, gamesRes: any = null, conversationsRes: any = null;
      
      switch (activeTab) {
        case 'users':
          usersRes = await adminAPI.getUsers();
          if (usersRes.success && usersRes.data) {
            const activeUsers = usersRes.data.filter((user: any) => !user.deletedAt);
            usersRes.data = activeUsers;
          }
          break;
        case 'sessions':
          sessionsRes = await adminAPI.getSessions({ limit: 100 });
          break;
        case 'campaigns':
          campaignsRes = await adminAPI.getCampaigns();
          break;
        case 'games':
          gamesRes = await adminAPI.getGames();
          break;
        case 'conversations':
          conversationsRes = await adminAPI.getConversations();
          break;
      }

      // Traitement des utilisateurs
      if (usersRes && usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      } else if (usersRes && Array.isArray(usersRes)) {
        setUsers(usersRes);
      } else if (usersRes && usersRes.error && !usersRes.error.includes('Données invalides')) {
        addError('Error', `Erreur utilisateurs: ${usersRes.error}`);
      }

      // Traitement des sessions
      if (sessionsRes && sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data);
        setOriginalSessions(sessionsRes.data);
      } else if (sessionsRes && Array.isArray(sessionsRes)) {
        setSessions(sessionsRes);
        setOriginalSessions(sessionsRes);
      } else if (sessionsRes && sessionsRes.error && !sessionsRes.error.includes('Données invalides')) {
        addError('Error', `Erreur sessions: ${sessionsRes.error}`);
      }

      // Traitement des campagnes
      if (campaignsRes && campaignsRes.success && campaignsRes.data) {
        setCampaigns(campaignsRes.data);
      } else if (campaignsRes && Array.isArray(campaignsRes)) {
        setCampaigns(campaignsRes);
      } else if (campaignsRes && campaignsRes.error && !campaignsRes.error.includes('Données invalides')) {
        addError('Error', `Erreur campagnes: ${campaignsRes.error}`);
      }

      // Traitement des jeux
      if (gamesRes && gamesRes.success && gamesRes.data) {
        setGames(gamesRes.data);
      } else if (gamesRes && Array.isArray(gamesRes)) {
        setGames(gamesRes);
      } else if (gamesRes && gamesRes.error && !gamesRes.error.includes('Données invalides')) {
        addError('Error', `Erreur jeux: ${gamesRes.error}`);
      }

      // Traitement des conversations
      if (conversationsRes && conversationsRes.success && conversationsRes.data) {
        setConversations(conversationsRes.data);
      } else if (conversationsRes && Array.isArray(conversationsRes)) {
        setConversations(conversationsRes);
      } else if (conversationsRes && conversationsRes.error && !conversationsRes.error.includes('Données invalides')) {
        addError('Error', `Erreur conversations: ${conversationsRes.error}`);
      }

      addSuccess('Success', 'Données chargées avec succès');
    } catch (error) {
      addError('Error', `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return {
    users,
    setUsers,
    sessions,
    setSessions,
    originalSessions,
    campaigns,
    setCampaigns,
    games,
    setGames,
    conversations,
    setConversations,
    loading,
    loadData
  };
};
