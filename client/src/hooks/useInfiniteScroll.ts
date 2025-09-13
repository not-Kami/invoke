import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string; // Root margin for intersection observer
}

// Interfaces supprimées car non utilisées

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  lastElementRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number, ...args: any[]) => Promise<{ success: boolean; data: T[]; page: number; limit: number; total: number; error?: string }>,
  limit: number = 10,
  options: UseInfiniteScrollOptions = {},
  ...fetchArgs: any[]
): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const { threshold = 100, rootMargin = '0px' } = options;

  // Fonction pour charger plus d'éléments
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const response = await fetchFunction(page, limit, ...fetchArgs);
      
      if (response.success && response.data) {
        const newItems = response.data || [];
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
        
        // Vérifier s'il y a encore des éléments à charger
        const totalLoaded = items.length + newItems.length;
        setHasMore(totalLoaded < (response.total || 0));
      } else {
        setError(response.error || 'Failed to load more items');
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more items');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, limit, hasMore, isLoadingMore, items.length, fetchFunction, ...fetchArgs]);

  // Fonction pour réinitialiser la liste
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setIsLoadingMore(false);
  }, []);

  // Observer pour détecter quand on arrive en bas
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, loadMore, threshold, rootMargin]);

  // Charger les premiers éléments
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchFunction(1, limit, ...fetchArgs);
        
        if (response.success && response.data) {
          setItems(response.data || []);
          setPage(2); // Prochaine page à charger
          setHasMore((response.data?.length || 0) < (response.total || 0));
        } else {
          setError(response.error || 'Failed to load items');
        }
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [fetchFunction, limit, ...fetchArgs]);

  // Nettoyer l'observer
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    lastElementRef,
  };
}
