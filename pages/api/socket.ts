import { Server as NetServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

interface Player {
  walletAddress: string;
  shortAddress: string;
  seatNumber: number | null;
  shotCount: number;
  survivalCount: number;
}

interface Room {
  id: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  timeRemaining: number;
  lastUpdated: number;
}

interface JoinRoomParams {
  roomId: string;
  walletAddress: string;
  shortAddress: string;
}

interface SeatSelectParams {
  roomId: string;
  seatNumber: number;
}

interface LeaveRoomParams {
  roomId: string;
}

// Extend the Next API response type
interface NextApiResponseWithIO extends NextApiResponse {
  socket: any;
}

// Store for active rooms
const rooms: Record<string, Room> = {
  'main-room': {
    id: 'main-room',
    players: [
      {
        walletAddress: 'FakePlayer1111111111111111111111111111111',
        shortAddress: 'FakePlayer1',
        seatNumber: 1,
        shotCount: 5,
        survivalCount: 3,
      },
      {
        walletAddress: 'FakePlayer2222222222222222222222222222222',
        shortAddress: 'FakePlayer2',
        seatNumber: 3,
        shotCount: 3,
        survivalCount: 7,
      },
    ],
    status: 'waiting',
    timeRemaining: 30,
    lastUpdated: Date.now(),
  },
  'room-2': {
    id: 'room-2',
    players: [],
    status: 'waiting',
    timeRemaining: 30,
    lastUpdated: Date.now(),
  },
  'room-3': {
    id: 'room-3',
    players: [],
    status: 'waiting',
    timeRemaining: 30,
    lastUpdated: Date.now(),
  },
};

// Cooldown tracking for wallets
const playerCooldowns: Record<string, { until: number }> = {};

// Track active socket connections
const activeSockets: Record<string, { walletAddress?: string; roomId?: string }> = {};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithIO) => {
  if (!res.socket.server.io) {
    console.log('Setting up socket.io server');
    
    // Create a Socket.IO server if it doesn't exist
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
    
    // Game timer interval (every second)
    setInterval(() => {
      // Update each room's timer
      Object.values(rooms).forEach(room => {
        if (room.status === 'waiting') {
          room.timeRemaining -= 1;
          
          // Start game when timer reaches zero and there are at least 2 players
          if (room.timeRemaining <= 0 && room.players.length >= 2) {
            room.status = 'playing';
            room.timeRemaining = 30; // Reset timer for play phase
            io.to(room.id).emit('game:start', { roomId: room.id });
          } else if (room.timeRemaining <= 0) {
            // Not enough players, reset timer
            room.timeRemaining = 30;
          }
          
          io.to(room.id).emit('timer:update', { 
            roomId: room.id, 
            timeRemaining: room.timeRemaining 
          });
        } else if (room.status === 'playing') {
          // Game in progress logic
          room.timeRemaining -= 1;
          
          // Every 30 seconds, spin the revolver
          if (room.timeRemaining % 30 === 0 && room.players.length > 0) {
            // Randomly select a player
            const targetIndex = Math.floor(Math.random() * room.players.length);
            const targetPlayer = room.players[targetIndex];
            
            // 1/3 chance of being shot
            const isShot = Math.random() < 0.33;
            
            if (isShot && targetPlayer) {
              // Player is shot
              targetPlayer.shotCount += 1;
              
              // Add player to cooldown
              if (targetPlayer.walletAddress) {
                playerCooldowns[targetPlayer.walletAddress] = {
                  until: Date.now() + 10 * 60 * 1000, // 10 minute cooldown
                };
              }
              
              // Remove player from room
              room.players = room.players.filter(p => p.walletAddress !== targetPlayer.walletAddress);
              
              io.to(room.id).emit('player:shot', { 
                roomId: room.id,
                player: targetPlayer 
              });
              
              // Check if game is over (1 player left)
              if (room.players.length === 1) {
                const winner = room.players[0];
                winner.survivalCount += 1;
                
                room.status = 'finished';
                io.to(room.id).emit('game:end', { 
                  roomId: room.id,
                  winner 
                });
                
                // Reset room after 5 seconds
                setTimeout(() => {
                  room.players = [];
                  room.status = 'waiting';
                  room.timeRemaining = 30;
                  io.to(room.id).emit('room:reset', { roomId: room.id });
                }, 5000);
              }
            } else if (room.players.length > 0) {
              // No shot, continue game
              io.to(room.id).emit('revolver:spin', { 
                roomId: room.id,
                result: 'no-shot' 
              });
            }
          }
          
          io.to(room.id).emit('timer:update', { 
            roomId: room.id, 
            timeRemaining: room.timeRemaining 
          });
        }
        
        room.lastUpdated = Date.now();
      });
      
      // Clean up expired cooldowns
      const now = Date.now();
      Object.entries(playerCooldowns).forEach(([walletAddress, cooldown]) => {
        if (cooldown.until < now) {
          delete playerCooldowns[walletAddress];
        }
      });
    }, 1000);
    
    io.on('connection', (socket: Socket) => {
      console.log('A client connected', socket.id);
      activeSockets[socket.id] = {};
      
      // Handle player joining a room
      socket.on('room:join', ({ roomId, walletAddress, shortAddress }: JoinRoomParams) => {
        if (!roomId || !walletAddress) return;
        
        // Check if player is in cooldown
        if (playerCooldowns[walletAddress]) {
          const remainingCooldown = Math.ceil(
            (playerCooldowns[walletAddress].until - Date.now()) / 1000
          );
          
          socket.emit('error', { 
            message: `You are in cooldown for ${remainingCooldown} more seconds.` 
          });
          return;
        }
        
        // Check if room exists
        const room = rooms[roomId];
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        
        // Check if room is full (max 5 players)
        if (room.players.length >= 5) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }
        
        // Add player to the room
        socket.join(roomId);
        activeSockets[socket.id] = { walletAddress, roomId };
        
        // Check if player is already in the room
        const existingPlayer = room.players.find(p => p.walletAddress === walletAddress);
        if (existingPlayer) {
          socket.emit('error', { message: 'You are already in this room' });
          return;
        }
        
        // Add player to room data
        room.players.push({
          walletAddress,
          shortAddress,
          seatNumber: null, // Seat will be selected later
          shotCount: 0,
          survivalCount: 0,
        });
        
        // Notify all clients in the room
        io.to(roomId).emit('room:update', { 
          roomId, 
          players: room.players,
          status: room.status,
          timeRemaining: room.timeRemaining
        });
        
        socket.emit('room:joined', { roomId });
      });
      
      // Handle player selecting a seat
      socket.on('seat:select', ({ roomId, seatNumber }: SeatSelectParams) => {
        if (!roomId || seatNumber === undefined || seatNumber === null) return;
        
        const socketData = activeSockets[socket.id];
        if (!socketData || !socketData.walletAddress) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }
        
        const room = rooms[roomId];
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        
        // Check if seat is already taken
        if (room.players.some(p => p.seatNumber === seatNumber)) {
          socket.emit('error', { message: 'Seat already taken' });
          return;
        }
        
        // Find player and update seat
        const player = room.players.find(p => p.walletAddress === socketData.walletAddress);
        if (player) {
          player.seatNumber = seatNumber;
          
          // Notify all clients in the room
          io.to(roomId).emit('room:update', { 
            roomId, 
            players: room.players,
            status: room.status,
            timeRemaining: room.timeRemaining
          });
          
          socket.emit('seat:selected', { roomId, seatNumber });
        }
      });
      
      // Handle player leaving a room
      socket.on('room:leave', ({ roomId }: LeaveRoomParams) => {
        if (!roomId) return;
        
        const socketData = activeSockets[socket.id];
        if (!socketData || !socketData.walletAddress) return;
        
        const room = rooms[roomId];
        if (!room) return;
        
        // Remove player from room
        room.players = room.players.filter(p => p.walletAddress !== socketData.walletAddress);
        
        // Leave socket room
        socket.leave(roomId);
        activeSockets[socket.id] = { ...socketData, roomId: undefined };
        
        // Notify all clients in the room
        io.to(roomId).emit('room:update', { 
          roomId, 
          players: room.players,
          status: room.status,
          timeRemaining: room.timeRemaining
        });
        
        socket.emit('room:left', { roomId });
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        const socketData = activeSockets[socket.id];
        
        if (socketData && socketData.roomId && socketData.walletAddress) {
          const room = rooms[socketData.roomId];
          
          if (room) {
            // Remove player from room
            room.players = room.players.filter(p => p.walletAddress !== socketData.walletAddress);
            
            // Notify all clients in the room
            io.to(socketData.roomId).emit('room:update', { 
              roomId: socketData.roomId, 
              players: room.players,
              status: room.status,
              timeRemaining: room.timeRemaining
            });
          }
        }
        
        // Remove from active sockets
        delete activeSockets[socket.id];
      });
    });
  }
  
  res.end();
};

export default SocketHandler; 