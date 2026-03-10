import { useEffect, useRef, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Global cache instance shared across components
const apiCache = new Map<string, CacheEntry<any>>();

/**
 * Hook for client-side API response caching with TTL
 * Reduces redundant API calls and improves performance
 * 
 * @param url - The API endpoint to fetch from
 * @param ttl - Time to live for cache in milliseconds (default: 5 minutes)
 * @returns { data, isLoading, error, refetch }
 */
export function useApiCache<T>(
  url: string,
  ttl: number = 5 * 60 * 1000 // 5 minutes by default
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedEntry = apiCache.get(url);
      const now = Date.now();

      if (cachedEntry && now - cachedEntry.timestamp < cachedEntry.ttl) {
        // Use cached data
        setData(cachedEntry.data);
        setIsLoading(false);
        return;
      }

      // Fetch from API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Store in cache
      apiCache.set(url, {
        data: result,
        timestamp: now,
        ttl,
      });

      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Try to use stale cache data on error
      const cachedEntry = apiCache.get(url);
      if (cachedEntry) {
        setData(cachedEntry.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Cleanup timeout on unmount
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [url, ttl]);

  const refetch = async () => {
    // Clear cache for this URL to force fresh data
    apiCache.delete(url);
    await fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    // Utility to clear specific cache entry
    clearCache: () => apiCache.delete(url),
    // Utility to clear all cache
    clearAllCache: () => apiCache.clear(),
  };
}

/**
 * Preload API data into cache before components render
 * Use in route handlers or loaders for better UX
 */
export async function preloadApiCache<T>(url: string, ttl: number = 5 * 60 * 1000) {
  const cachedEntry = apiCache.get(url);
  const now = Date.now();

  // Skip if cache is still valid
  if (cachedEntry && now - cachedEntry.timestamp < cachedEntry.ttl) {
    return cachedEntry.data;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    apiCache.set(url, { data, timestamp: now, ttl });
    return data;
  } catch (error) {
    console.error(`Failed to preload cache for ${url}:`, error);
    return null;
  }
}
