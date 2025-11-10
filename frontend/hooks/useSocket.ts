'use client';

import { useEffect, useRef, useCallback } from 'react';
import socketClient from '@/utils/socket';

export interface UseSocketOptions {
  autoConnect?: boolean;
  room?: string;
}

/**
 * Hook for Socket.IO real-time updates
 */
export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, room } = options;
  const socketRef = useRef(socketClient);

  useEffect(() => {
    if (autoConnect) {
      socketRef.current.connect();
    }

    if (room) {
      socketRef.current.joinRoom(room);
    }

    return () => {
      if (room) {
        socketRef.current.leaveRoom(room);
      }
    };
  }, [autoConnect, room]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketRef.current.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
    socketRef.current.off(event, callback);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current.emit(event, data);
  }, []);

  return {
    socket: socketRef.current,
    on,
    off,
    emit,
    isConnected: socketRef.current.isConnected(),
  };
}

/**
 * Hook for shelter updates
 */
export function useShelterUpdates(callback: (data: any) => void) {
  const { on, off } = useSocket();

  useEffect(() => {
    on('shelter_update', callback);

    return () => {
      off('shelter_update', callback);
    };
  }, [on, off, callback]);
}

/**
 * Hook for new individual notifications
 */
export function useNewIndividualNotifications(callback: (data: any) => void) {
  const { on, off } = useSocket();

  useEffect(() => {
    on('new_individual', callback);

    return () => {
      off('new_individual', callback);
    };
  }, [on, off, callback]);
}

/**
 * Hook for job placement notifications
 */
export function useJobPlacementNotifications(callback: (data: any) => void) {
  const { on, off } = useSocket();

  useEffect(() => {
    on('job_placement', callback);

    return () => {
      off('job_placement', callback);
    };
  }, [on, off, callback]);
}

/**
 * Hook for AI recommendation notifications
 */
export function useRecommendationNotifications(callback: (data: any) => void) {
  const { on, off } = useSocket();

  useEffect(() => {
    on('recommendation_ready', callback);

    return () => {
      off('recommendation_ready', callback);
    };
  }, [on, off, callback]);
}

/**
 * Hook for emergency alerts
 */
export function useEmergencyAlerts(callback: (data: any) => void) {
  const { on, off } = useSocket();

  useEffect(() => {
    on('emergency_alert', callback);

    return () => {
      off('emergency_alert', callback);
    };
  }, [on, off, callback]);
}

/**
 * Hook for chat messages
 */
export function useChatMessages(callback: (data: any) => void, roomId?: string) {
  const { on, off } = useSocket({ room: roomId });

  useEffect(() => {
    on('chat_message', callback);

    return () => {
      off('chat_message', callback);
    };
  }, [on, off, callback]);
}
