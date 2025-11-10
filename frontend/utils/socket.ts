'use client';

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Connected to Flask backend via Socket.io');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from backend:', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect to server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event listeners
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  // Event emitters
  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, attempting to connect...');
      this.connect();
    }
    this.socket?.emit(event, data);
  }

  // Room management
  joinRoom(roomId: string) {
    this.emit('join_room', { room: roomId });
  }

  leaveRoom(roomId: string) {
    this.emit('leave_room', { room: roomId });
  }

  // Specific event handlers
  onShelterUpdate(callback: (data: any) => void) {
    this.on('shelter_update', callback);
  }

  onNewIndividual(callback: (data: any) => void) {
    this.on('new_individual', callback);
  }

  onJobPlacement(callback: (data: any) => void) {
    this.on('job_placement', callback);
  }

  onRecommendationReady(callback: (data: any) => void) {
    this.on('recommendation_ready', callback);
  }

  onEmergencyAlert(callback: (data: any) => void) {
    this.on('emergency_alert', callback);
  }

  onChatMessage(callback: (data: any) => void) {
    this.on('chat_message', callback);
  }

  // Send events
  updateLocation(location: { lat: number; lng: number }) {
    this.emit('update_location', location);
  }

  sendMessage(message: string, roomId?: string) {
    this.emit('send_message', { message, room: roomId });
  }

  // Get socket instance
  getSocket() {
    if (!this.socket) {
      this.connect();
    }
    return this.socket;
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;
export { socketClient };
