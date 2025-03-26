import { FC, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import SolanticsNavbar from '../components/solexplore-navbar';
import dynamic from 'next/dynamic';
import { PublicKey } from '@solana/web3.js';
import socketService, { Player, Room } from '../services/socket-service';

// Dynamically import Three.js components to avoid SSR issues
const Game = dynamic(() => import('../components/game/RouletteGame'), {
  ssr: false,
});

const SolRoulette: FC = () => {
  const { connected, publicKey } = useWallet();
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [playerStats, setPlayerStats] = useState<Player[]>([]);
  const [gameStartCountdown, setGameStartCountdown] = useState<number>(30);
  const [isPlayerJoined, setIsPlayerJoined] = useState<boolean>(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [cooldownTimer, setCooldownTimer] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Initialize sockets and event handlers
  useEffect(() => {
    // Connect to socket server
    socketService.connect();
    
    // Set up event listeners
    socketService.on('room:update', handleRoomUpdate);
    socketService.on('timer:update', handleTimerUpdate);
    socketService.on('player:shot', handlePlayerShot);
    socketService.on('game:start', handleGameStart);
    socketService.on('game:end', handleGameEnd);
    socketService.on('room:reset', handleRoomReset);
    socketService.on('error', handleError);
    
    // Request initial rooms data
    const initialRooms: Room[] = [
      {
        id: 'main-room',
        players: [],
        status: 'waiting',
        timeRemaining: 30,
      },
      {
        id: 'room-2',
        players: [],
        status: 'waiting',
        timeRemaining: 30,
      },
      {
        id: 'room-3',
        players: [],
        status: 'waiting',
        timeRemaining: 30,
      },
    ];
    
    setAvailableRooms(initialRooms);
    setCurrentRoom(initialRooms[0]);
    
    // Cleanup on unmount
    return () => {
      socketService.off('room:update', handleRoomUpdate);
      socketService.off('timer:update', handleTimerUpdate);
      socketService.off('player:shot', handlePlayerShot);
      socketService.off('game:start', handleGameStart);
      socketService.off('game:end', handleGameEnd);
      socketService.off('room:reset', handleRoomReset);
      socketService.off('error', handleError);
      
      // Leave any joined room
      if (isPlayerJoined && currentRoom && publicKey) {
        socketService.leaveRoom(currentRoom.id);
      }
      
      // Disconnect from socket server
      socketService.disconnect();
    };
  }, []);
  
  // Event handlers
  const handleRoomUpdate = (data: { roomId: string; players: Player[]; status: 'waiting' | 'playing' | 'finished'; timeRemaining: number }) => {
    // Update the specific room in the availableRooms list
    setAvailableRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === data.roomId ? { ...room, players: data.players, status: data.status, timeRemaining: data.timeRemaining } : room
      )
    );
    
    // If this is our current room, update it
    if (currentRoom?.id === data.roomId) {
      setCurrentRoom(prev => prev ? { ...prev, players: data.players, status: data.status, timeRemaining: data.timeRemaining } : null);
    }
    
    // Update player stats
    const allPlayers = data.players;
    setPlayerStats(allPlayers);
    
    // Check if we are still in the room
    if (publicKey) {
      const isInRoom = data.players.some(p => p.walletAddress === publicKey.toString());
      setIsPlayerJoined(isInRoom);
      
      if (!isInRoom) {
        setSelectedSeat(null);
      } else {
        // Update our seat number
        const playerData = data.players.find(p => p.walletAddress === publicKey.toString());
        if (playerData) {
          setSelectedSeat(playerData.seatNumber);
        }
      }
    }
  };
  
  const handleTimerUpdate = (data: { roomId: string; timeRemaining: number }) => {
    if (currentRoom?.id === data.roomId) {
      setGameStartCountdown(data.timeRemaining);
    }
  };
  
  const handlePlayerShot = (data: { roomId: string; player: Player }) => {
    if (currentRoom?.id === data.roomId) {
      // If this is us, we're out!
      if (publicKey && data.player.walletAddress === publicKey.toString()) {
        setIsPlayerJoined(false);
        setSelectedSeat(null);
        setCooldownTimer(10 * 60); // 10 minute cooldown
      }
    }
  };
  
  const handleGameStart = (data: { roomId: string }) => {
    if (currentRoom?.id === data.roomId) {
      setCurrentRoom(prev => prev ? { ...prev, status: 'playing' } : null);
    }
  };
  
  const handleGameEnd = (data: { roomId: string; winner: Player }) => {
    if (currentRoom?.id === data.roomId) {
      setCurrentRoom(prev => prev ? { ...prev, status: 'finished' } : null);
      
      // If we are the winner
      if (publicKey && data.winner.walletAddress === publicKey.toString()) {
        alert('Congratulations! You are the last one standing!');
      }
    }
  };
  
  const handleRoomReset = (data: { roomId: string }) => {
    if (currentRoom?.id === data.roomId) {
      setCurrentRoom(prev => prev ? { ...prev, status: 'waiting', players: [] } : null);
    }
  };
  
  const handleError = (data: { message: string }) => {
    setErrorMessage(data.message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  
  // Cooldown timer
  useEffect(() => {
    if (cooldownTimer <= 0) return;
    
    const interval = setInterval(() => {
      setCooldownTimer(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownTimer]);
  
  // Handle joining a seat
  const handleJoinSeat = (seatNumber: number) => {
    if (!connected || !publicKey) {
      setErrorMessage('Please connect your wallet first!');
      return;
    }
    
    if (cooldownTimer > 0) {
      setErrorMessage(`You are in cooldown for ${cooldownTimer} more seconds!`);
      return;
    }
    
    if (isPlayerJoined) {
      setErrorMessage('You have already joined a seat!');
      return;
    }
    
    if (!currentRoom) {
      setErrorMessage('No room selected!');
      return;
    }
    
    // Send seat selection to server
    socketService.selectSeat(currentRoom.id, seatNumber);
  };
  
  const handleJoinRoom = () => {
    if (!connected || !publicKey || !currentRoom) {
      setErrorMessage('Please connect your wallet first!');
      return;
    }
    
    if (cooldownTimer > 0) {
      setErrorMessage(`You are in cooldown for ${cooldownTimer} more seconds!`);
      return;
    }
    
    const walletAddress = publicKey.toString();
    const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
    
    // Join the current room
    socketService.joinRoom(currentRoom.id, walletAddress, shortAddress);
  };
  
  const handleLeaveGame = () => {
    if (!connected || !publicKey || !currentRoom || !isPlayerJoined) return;
    
    // Leave the current room
    socketService.leaveRoom(currentRoom.id);
  };
  
  const handleRoomChange = (roomId: string) => {
    const selectedRoom = availableRooms.find(room => room.id === roomId);
    if (selectedRoom) {
      // If player is in a room, leave it first
      if (isPlayerJoined && currentRoom && publicKey) {
        socketService.leaveRoom(currentRoom.id);
      }
      setCurrentRoom(selectedRoom);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900">
      <Head>
        <title>SolRoulette | Solana Russian Roulette Game</title>
        <meta name="description" content="Play Russian Roulette with your Solana wallet. Join a table, spin the revolver, and test your luck!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SolanticsNavbar />

      <main className="container mx-auto px-4 pt-10 pb-20">
        <section className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 text-white">
            SolRoulette
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Spin the revolver, test your luck, and be the last one standing!
          </p>
          
          <div className="flex justify-center space-x-4 mt-4">
            <a 
              href="https://twitter.com/solroulette" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Twitter
            </a>
            <a 
              href="https://t.me/solroulette" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Telegram
            </a>
          </div>
        </section>

        {!connected ? (
          <div className="text-center p-8 bg-gray-800 bg-opacity-50 rounded-lg mb-8">
            <p className="text-xl text-yellow-400 mb-4">Connect your wallet to join the game!</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Room Selection</h2>
              <div className="flex space-x-4 overflow-x-auto py-2">
                {availableRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    className={`px-4 py-2 rounded ${
                      currentRoom?.id === room.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {room.id} ({room.players.length}/5 players)
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Game Status</h2>
                {currentRoom?.status === 'waiting' && (
                  <div className="text-yellow-400">
                    Game starts in: {gameStartCountdown} seconds
                  </div>
                )}
                {currentRoom?.status === 'playing' && (
                  <div className="text-green-400">
                    Game in progress!
                  </div>
                )}
                {currentRoom?.status === 'finished' && (
                  <div className="text-red-400">
                    Game finished!
                  </div>
                )}
              </div>
              
              {cooldownTimer > 0 && (
                <div className="text-red-400 mb-4">
                  You're in cooldown! Can join again in: {cooldownTimer} seconds
                </div>
              )}
              
              {errorMessage && (
                <div className="text-red-400 mb-4">
                  {errorMessage}
                </div>
              )}

              {isPlayerJoined ? (
                <button
                  onClick={handleLeaveGame}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Leave Game
                </button>
              ) : (
                <button
                  onClick={handleJoinRoom}
                  disabled={cooldownTimer > 0}
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                    cooldownTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Join Game
                </button>
              )}
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">3D Game</h2>
              <div className="relative w-full h-[500px] bg-black rounded-lg overflow-hidden">
                <Game 
                  players={currentRoom?.players || []}
                  onJoinSeat={handleJoinSeat}
                  userWallet={publicKey?.toString() || ''}
                  selectedSeat={selectedSeat}
                  isPlayerJoined={isPlayerJoined}
                  gameStatus={currentRoom?.status || 'waiting'}
                  countdown={gameStartCountdown}
                />
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Scoreboard</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-purple-900">
                      <th className="py-2 px-4 text-left text-white">Player</th>
                      <th className="py-2 px-4 text-left text-white">Shots Taken</th>
                      <th className="py-2 px-4 text-left text-white">Times Survived</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player, index) => (
                      <tr key={index} className="border-t border-gray-800">
                        <td className="py-2 px-4 text-left text-white">
                          {player.shortAddress}
                          {player.walletAddress === publicKey?.toString() && ' (You)'}
                        </td>
                        <td className="py-2 px-4 text-left text-white">{player.shotCount}</td>
                        <td className="py-2 px-4 text-left text-white">{player.survivalCount}</td>
                      </tr>
                    ))}
                    {playerStats.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 px-4 text-center text-gray-400">
                          No players yet. Be the first to join!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SolRoulette; 