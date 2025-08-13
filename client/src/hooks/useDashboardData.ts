import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Session, Campaign } from '../types';
import { adminAPI, publicAPI } from '../lib/api';

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
        
        console.log('Fetching dashboard data for user:', user._id);
        
        // Récupérer les sessions depuis l'API
        const sessionsResponse = await adminAPI.getSessions();
        console.log('Sessions API response:', sessionsResponse);
        
        if (sessionsResponse.success && sessionsResponse.data) {
          // L'API retourne une structure paginée { data: Session[], page, limit, total }
          const sessionsData = sessionsResponse.data.data || sessionsResponse.data;
          console.log('Sessions data extracted:', sessionsData);
          setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        } else {
          console.log('Sessions API failed:', sessionsResponse.error);
          setSessions([]);
        }
        
        // Récupérer les campagnes depuis l'API
        const campaignsResponse = await adminAPI.getCampaigns();
        console.log('Campaigns API response:', campaignsResponse);
        
        if (campaignsResponse.success && campaignsResponse.data) {
          const campaignsData = campaignsResponse.data.data || campaignsResponse.data;
          console.log('Campaigns data extracted:', campaignsData);
          setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        } else {
          console.log('Campaigns API failed:', campaignsResponse.error);
          setCampaigns([]);
        }
        
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
    : sessions.filter(session => {
        const isPlayer = session.players.some(player => player._id === user?._id);
        const isDM = session.dm._id === user?._id;
        console.log(`Session ${session.title}: isPlayer=${isPlayer}, isDM=${isDM}, user=${user?._id}`);
        return isPlayer || isDM;
      });

  const userCampaigns = user?.role === 'admin' || user?.isDM 
    ? campaigns 
    : campaigns.filter(campaign => {
        const isPlayer = campaign.players.some(player => player._id === user?._id);
        const isDM = campaign.dm._id === user?._id;
        console.log(`Campaign ${campaign.name}: isPlayer=${isPlayer}, isDM=${isDM}, user=${user?._id}`);
        return isPlayer || isDM;
      });

  console.log('Dashboard data processed:', {
    totalSessions: sessions.length,
    userSessions: userSessions.length,
    totalCampaigns: campaigns.length,
    userCampaigns: userCampaigns.length,
    user: user?._id,
    isAdmin: user?.role === 'admin',
    isDM: user?.isDM
  });

  return {
    loading,
    sessions: userSessions,
    campaigns: userCampaigns,
    isAdmin: user?.role === 'admin',
    isDM: user?.isDM
  };
}
