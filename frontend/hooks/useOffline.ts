'use client';

import { useEffect, useState } from 'react';

export interface UseOfflineReturn {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  sync: () => Promise<void>;
}

export function useOffline(): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      sync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending changes from localStorage
    const loadPendingChanges = () => {
      try {
        const pending = localStorage.getItem('pendingChanges');
        if (pending) {
          const changes = JSON.parse(pending);
          setPendingChanges(changes.length);
        }
      } catch (error) {
        console.error('Failed to load pending changes:', error);
      }
    };

    loadPendingChanges();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      // Get pending changes from localStorage
      const pending = localStorage.getItem('pendingChanges');
      if (!pending) {
        setIsSyncing(false);
        return;
      }

      const changes = JSON.parse(pending);
      
      // Sync each change
      for (const change of changes) {
        try {
          // Send change to server
          await fetch(change.endpoint, {
            method: change.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(change.data),
          });
        } catch (error) {
          console.error('Failed to sync change:', error);
          // Keep this change for next sync attempt
          continue;
        }
      }

      // Clear synced changes
      localStorage.removeItem('pendingChanges');
      setPendingChanges(0);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    sync,
  };
}

// Helper function to queue changes when offline
export function queueOfflineChange(endpoint: string, method: string, data: any) {
  try {
    const pending = localStorage.getItem('pendingChanges');
    const changes = pending ? JSON.parse(pending) : [];
    
    changes.push({
      endpoint,
      method,
      data,
      timestamp: Date.now(),
    });

    localStorage.setItem('pendingChanges', JSON.stringify(changes));
  } catch (error) {
    console.error('Failed to queue offline change:', error);
  }
}
