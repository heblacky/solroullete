import type { Socket as SocketType } from 'socket.io-client';

// We'll use dynamic import to avoid SSR issues
let socketIOClient: any = null;

if (typeof window !== 'undefined') {
  import('socket.io-client').then(module => {
    socketIOClient = module.default || module;
  });
}

export interface Player {
  walletAddress: string;
  shortAddress: string;
  seatNumber: number | null;
  shotCount: number;
  survivalCount: number;
}

export interface Room {
  id: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  timeRemaining: number;
}

interface RoomUpdateEvent {
  roomId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  timeRemaining: number;
}

interface TimerUpdateEvent {
  roomId: string;
  timeRemaining: number;
}

interface PlayerShotEvent {
  roomId: string;
  player: Player;
}

interface GameEndEvent {
  roomId: string;
  winner: Player;
}

interface ErrorEvent {
  message: string;
}

interface GameEvents {
  'room:update': (data: RoomUpdateEvent) => void;
  'timer:update': (data: TimerUpdateEvent) => void;
  'player:shot': (data: PlayerShotEvent) => void;
  'game:start': (data: { roomId: string }) => void;
  'game:end': (data: GameEndEvent) => void;
  'room:reset': (data: { roomId: string }) => void;
  'room:joined': (data: { roomId: string }) => void;
  'room:left': (data: { roomId: string }) => void;
  'seat:selected': (data: { roomId: string; seatNumber: number }) => void;
  'error': (data: ErrorEvent) => void;
  'connect': () => void;
  'disconnect': () => void;
}

export class SocketService {
  private static instance: SocketService;
  private socket: any = null;
  private eventHandlers: Partial<{
    [K in keyof GameEvents]: GameEvents[K][];
  }> = {};
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  // Get singleton instance
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  
  // Initialize socket connection
  public connect(): void {
    if (this.socket) return;
    
    if (!socketIOClient) {
      console.error('Socket.IO client not loaded yet. Trying again in 1 second.');
      setTimeout(() => this.connect(), 1000);
      return;
    }
    
    // Create socket connection
    this.socket = socketIOClient.io({
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    // Set up default event handlers
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.triggerEvent('connect');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.triggerEvent('disconnect');
    });
    
    this.socket.on('error', (data: ErrorEvent) => {
      console.error('Socket error:', data.message);
      this.triggerEvent('error', data);
    });
    
    // Set up game event handlers
    this.socket.on('room:update', (data: RoomUpdateEvent) => this.triggerEvent('room:update', data));
    this.socket.on('timer:update', (data: TimerUpdateEvent) => this.triggerEvent('timer:update', data));
    this.socket.on('player:shot', (data: PlayerShotEvent) => this.triggerEvent('player:shot', data));
    this.socket.on('game:start', (data: { roomId: string }) => this.triggerEvent('game:start', data));
    this.socket.on('game:end', (data: GameEndEvent) => this.triggerEvent('game:end', data));
    this.socket.on('room:reset', (data: { roomId: string }) => this.triggerEvent('room:reset', data));
    this.socket.on('room:joined', (data: { roomId: string }) => this.triggerEvent('room:joined', data));
    this.socket.on('room:left', (data: { roomId: string }) => this.triggerEvent('room:left', data));
    this.socket.on('seat:selected', (data: { roomId: string; seatNumber: number }) => this.triggerEvent('seat:selected', data));
  }
  
  // Join a room
  public joinRoom(roomId: string, walletAddress: string, shortAddress: string): void {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket?.emit('room:join', { roomId, walletAddress, shortAddress });
  }
  
  // Select a seat
  public selectSeat(roomId: string, seatNumber: number): void {
    this.socket?.emit('seat:select', { roomId, seatNumber });
  }
  
  // Leave a room
  public leaveRoom(roomId: string): void {
    this.socket?.emit('room:leave', { roomId });
  }
  
  // Disconnect
  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
  
  // Add event listener
  public on<K extends keyof GameEvents>(event: K, handler: GameEvents[K]): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    
    this.eventHandlers[event]?.push(handler);
  }
  
  // Remove event listener
  public off<K extends keyof GameEvents>(event: K, handler: GameEvents[K]): void {
    if (!this.eventHandlers[event]) return;
    
    this.eventHandlers[event] = this.eventHandlers[event]?.filter(h => h !== handler) as any;
  }
  
  // Trigger event
  private triggerEvent<K extends keyof GameEvents>(event: K, data?: any): void {
    if (!this.eventHandlers[event]) return;
    
    for (const handler of this.eventHandlers[event] || []) {
      (handler as Function)(data);
    }
  }
}

// Export singleton instance
export default SocketService.getInstance(); 