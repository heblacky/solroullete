import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Text, PerspectiveCamera } from '@react-three/drei';
import { Vector3, Euler, Group, Mesh } from 'three';
import { Physics, useBox, useCylinder, useCompoundBody } from '@react-three/cannon';

// Player type (same as in solroulette.tsx)
interface Player {
  walletAddress: string;
  shortAddress: string;
  seatNumber: number | null;
  shotCount: number;
  survivalCount: number;
}

interface GameProps {
  players: Player[];
  onJoinSeat: (seatNumber: number) => void;
  userWallet: string;
  selectedSeat: number | null;
  isPlayerJoined: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
  countdown: number;
}

// Table component
const Table = () => {
  const [ref] = useBox(() => ({
    mass: 0,
    position: [0, -0.25, 0],
    args: [8, 0.5, 8],
    type: 'Static',
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <boxGeometry args={[8, 0.5, 8]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
  );
};

// Chair component
const Chair = ({ position, seatNumber, isTaken, playerName, onClick }: {
  position: [number, number, number];
  seatNumber: number;
  isTaken: boolean;
  playerName?: string;
  onClick: () => void;
}) => {
  const chairRef = useRef<Group>(null);
  
  return (
    <group position={position} ref={chairRef}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow onClick={onClick}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color={isTaken ? "#e91e63" : "#2196f3"} />
      </mesh>
      
      {/* Chair back */}
      <mesh position={[0, 1.5, -0.5]} castShadow>
        <boxGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial color={isTaken ? "#ad1457" : "#1565c0"} />
      </mesh>
      
      {/* Player name if seat is taken */}
      {isTaken && playerName && (
        <Text
          position={[0, 3, -0.5]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          userData={{ customProp: 'playerName' }}
        >
          {playerName}
        </Text>
      )}
      
      {/* Seat number */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        userData={{ customProp: 'seatNumber' }}
      >
        {seatNumber}
      </Text>
    </group>
  );
};

// Revolver component
const Revolver = ({ isSpinning, onSpinComplete }: { 
  isSpinning: boolean;
  onSpinComplete: (willFire: boolean) => void;
}) => {
  const revolverRef = useRef<Group>(null);
  const [rotation, setRotation] = useState(0);
  const spinSpeed = useRef(0);
  const spinCompleteRef = useRef(false);
  
  // Use a simplified revolver shape
  useFrame((state, delta) => {
    if (revolverRef.current) {
      if (isSpinning && !spinCompleteRef.current) {
        // Accelerate first, then decelerate
        if (spinSpeed.current < 20) {
          spinSpeed.current += delta * 5;
        } else if (Math.random() < 0.005) { // Randomly decide to stop
          spinSpeed.current *= 0.98; // Start slowing down
          
          if (spinSpeed.current < 0.1) {
            spinSpeed.current = 0;
            spinCompleteRef.current = true;
            
            // 1/3 chance of firing
            const willFire = Math.random() < 0.33;
            onSpinComplete(willFire);
          }
        }
        
        setRotation(prev => prev + spinSpeed.current * delta);
        revolverRef.current.rotation.y = rotation;
      }
    }
  });
  
  useEffect(() => {
    if (!isSpinning) {
      spinSpeed.current = 0;
      spinCompleteRef.current = false;
    }
  }, [isSpinning]);

  return (
    <group ref={revolverRef} position={[0, 1, 0]}>
      {/* Cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      
      {/* Barrel */}
      <group position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
          <meshStandardMaterial color="#212121" />
        </mesh>
      </group>
      
      {/* Handle */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[0.3, 1, 0.2]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
    </group>
  );
};

// Shooting effect
const ShootingEffect = ({ position, isVisible }: { position: [number, number, number], isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <group position={position}>
      {/* Muzzle flash */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffeb3b" emissive="#ff9800" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

// Main scene component
const GameScene = ({
  players,
  onJoinSeat,
  userWallet,
  selectedSeat,
  gameStatus,
  countdown,
}: GameProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [firedAt, setFiredAt] = useState<number | null>(null);
  const [showEffect, setShowEffect] = useState(false);
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera
    camera.position.set(0, 10, 12);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  useEffect(() => {
    if (gameStatus === 'playing' && !isSpinning) {
      // Start spinning the revolver
      setIsSpinning(true);
    }
  }, [gameStatus, isSpinning]);
  
  // Handle spin complete
  const handleSpinComplete = (willFire: boolean) => {
    if (willFire && players.length > 0) {
      // Randomly select a player to fire at
      const targetIndex = Math.floor(Math.random() * players.length);
      const targetSeat = players[targetIndex].seatNumber;
      
      if (targetSeat !== null) {
        setFiredAt(targetSeat);
        setShowEffect(true);
        
        // Hide effect after a delay
        setTimeout(() => {
          setShowEffect(false);
          setFiredAt(null);
          
          // Reset spinning state
          setIsSpinning(false);
        }, 2000);
      }
    } else {
      // Reset spinning state
      setTimeout(() => {
        setIsSpinning(false);
      }, 1000);
    }
  };
  
  // Calculate positions for 5 chairs around the table
  const chairPositions: [number, number, number][] = [
    [0, 0, 5],       // Position 1 (front)
    [4.8, 0, 1.5],   // Position 2 (right front)
    [3, 0, -4],      // Position 3 (right back)
    [-3, 0, -4],     // Position 4 (left back)
    [-4.8, 0, 1.5],  // Position 5 (left front)
  ];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} castShadow />
      
      {/* Camera controls */}
      <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2 - 0.1} />
      
      <Physics>
        {/* Table */}
        <Table />
        
        {/* Revolver */}
        <Revolver isSpinning={isSpinning} onSpinComplete={handleSpinComplete} />
        
        {/* Shooting effect */}
        {chairPositions.map((position, idx) => (
          <ShootingEffect 
            key={idx}
            position={position} 
            isVisible={showEffect && firedAt === idx + 1} 
          />
        ))}
        
        {/* Chairs */}
        {chairPositions.map((position, idx) => {
          const seatNumber = idx + 1;
          const player = players.find(p => p.seatNumber === seatNumber);
          const isTaken = !!player;
          const isCurrentPlayer = player?.walletAddress === userWallet;
          
          return (
            <Chair
              key={idx}
              position={position}
              seatNumber={seatNumber}
              isTaken={isTaken}
              playerName={player?.shortAddress}
              onClick={() => {
                if (!isTaken && selectedSeat === null) {
                  onJoinSeat(seatNumber);
                }
              }}
            />
          );
        })}
      </Physics>
      
      {/* Game status display */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        userData={{ customProp: 'statusText' }}
      >
        {gameStatus === 'waiting' ? `Game starts in: ${countdown}s` : 
         gameStatus === 'playing' ? 'Game in progress!' : 
         'Game finished!'}
      </Text>
    </>
  );
};

// Main exported component
const RouletteGame = (props: GameProps) => {
  return (
    <Canvas shadows>
      <GameScene {...props} />
    </Canvas>
  );
};

export default RouletteGame; 