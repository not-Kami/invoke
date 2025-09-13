import { useState, useCallback } from 'react';
import { searchAPI } from '../lib/api';

interface SearchResult {
  users: any[];
  sessions: any[];
  games: any[];
  campaigns: any[];
  total: number;
  query: string;
  type: string;
}

interface SearchSuggestion {
  type: 'user' | 'session' | 'game' | 'campaign';
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, type?: string, limit?: number) => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await searchAPI.globalSearch(query.trim(), type, limit);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError('Search failed');
        setResults(null);
      }
    } catch (err) {
      setError('Search failed');
      setResults(null);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchAPI.getSuggestions(query.trim());
      
      if (response.success && response.data) {
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setSuggestions([]);
      console.error('Suggestions error:', err);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    results,
    suggestions,
    loading,
    error,
    search,
    getSuggestions,
    clearResults
  };
}
