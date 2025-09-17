import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI, tableAPI } from '../lib/api';
import { Session, Campaign, Table } from '../types';

export function useDashboardData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch sessions
        const sessionsResponse = await adminAPI.getSessions();
        let sessionsData: Session[] = [];
        
        if (sessionsResponse.success && sessionsResponse.data) {
          sessionsData = sessionsResponse.data.data || sessionsResponse.data;
        }

        // Fetch campaigns
        const campaignsResponse = await adminAPI.getCampaigns();
        let campaignsData: Campaign[] = [];
        
        if (campaignsResponse.success && campaignsResponse.data) {
          campaignsData = Array.isArray(campaignsResponse.data) ? campaignsResponse.data : [campaignsResponse.data];
        }

        // Fetch user tables
        const tablesResponse = await tableAPI.getUserTables();
        console.log('Tables response:', tablesResponse);
        let tablesData: Table[] = [];
        
        if (tablesResponse.success && tablesResponse.data) {
          tablesData = Array.isArray(tablesResponse.data) ? tablesResponse.data : [];
        }

        setSessions(sessionsData);
        setCampaigns(campaignsData);
        setTables(tablesData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Filter sessions and campaigns for the current user
  const userSessions = sessions.filter(session => {
    const isPlayer = session.players.some(player => 
      typeof player === 'string' ? player === user?._id : player._id === user?._id
    );
    const isDM = typeof session.dm === 'string' ? session.dm === user?._id : session.dm._id === user?._id;
    return isPlayer || isDM;
  });

  const userCampaigns = campaigns.filter(campaign => {
    const isPlayer = campaign.players.some(player => 
      typeof player === 'string' ? player === user?._id : player._id === user?._id
    );
    const isDM = typeof campaign.dm === 'string' ? campaign.dm === user?._id : campaign.dm._id === user?._id;
    return isPlayer || isDM;
  });

  // Get upcoming sessions (next 5, excluding finished/cancelled)
  const upcomingSessions = userSessions
    .filter(session => !['finished', 'cancelled'].includes(session.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const isAdmin = user?.role === 'admin';
  const isDM = user?.isDM;

  const refreshData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch sessions
      const sessionsResponse = await adminAPI.getSessions();
      let sessionsData: Session[] = [];
      
      if (sessionsResponse.success && sessionsResponse.data) {
        sessionsData = sessionsResponse.data.data || sessionsResponse.data;
      }

      // Fetch campaigns
      const campaignsResponse = await adminAPI.getCampaigns();
      let campaignsData: Campaign[] = [];
      
      if (campaignsResponse.success && campaignsResponse.data) {
        campaignsData = Array.isArray(campaignsResponse.data) ? campaignsResponse.data : [campaignsResponse.data];
      }

      // Fetch user tables
      const tablesResponse = await tableAPI.getUserTables();
      let tablesData: Table[] = [];
      
      if (tablesResponse.success && tablesResponse.data) {
        tablesData = tablesResponse.data;
      }

      setSessions(sessionsData);
      setCampaigns(campaignsData);
      setTables(tablesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sessions,
    campaigns,
    tables,
    userSessions,
    userCampaigns,
    upcomingSessions,
    isAdmin,
    isDM,
    refreshData
  };
}
