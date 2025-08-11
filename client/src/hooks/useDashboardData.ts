import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Session, Campaign } from '../types';

export function useDashboardData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Simuler l'API - à remplacer par de vrais appels
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Pour l'instant, on utilise des tableaux vides
        // Ces données seront remplacées par de vraies données de l'API
        setSessions([]);
        setCampaigns([]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setSessions([]);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Filtrer les sessions et campagnes selon le rôle de l'utilisateur
  const userSessions = user?.role === 'admin' || user?.isDM 
    ? sessions 
    : sessions.filter(session => 
        session.players.some(player => player._id === user?._id) ||
        session.dm._id === user?._id
      );

  const userCampaigns = user?.role === 'admin' || user?.isDM 
    ? campaigns 
    : campaigns.filter(campaign => 
        campaign.players.some(player => player._id === user?._id) ||
        campaign.dm._id === user?._id
      );

  return {
    loading,
    sessions: userSessions,
    campaigns: userCampaigns,
    isAdmin: user?.role === 'admin',
    isDM: user?.isDM
  };
}
