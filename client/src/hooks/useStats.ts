import { useState, useEffect } from 'react';
import { usersApi } from '../lib/api';

interface Stats {
  totalUsers: number;
  activeSessions: number;
  totalSessions: number;
  totalDMs: number;
  uniquePlayers: number;
  totalCampaigns: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await usersApi.getStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (err) {
        setError('Failed to fetch stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
