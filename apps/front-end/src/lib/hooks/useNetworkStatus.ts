import { useState, useEffect } from 'react';

export interface UseNetworkStatusReturn {
  isOnline: boolean;
  isReconnecting: boolean;
  error: string | null;
}

export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
      setError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError('Network connection lost');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to manually trigger reconnection
  const reconnect = async () => {
    setIsReconnecting(true);
    
    try {
      // Test network connectivity
      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setIsOnline(true);
        setError(null);
      } else {
        setError('Server unavailable');
      }
    } catch {
      setError('Unable to connect to server');
    } finally {
      setIsReconnecting(false);
    }
  };

  return { isOnline, isReconnecting, error };
};