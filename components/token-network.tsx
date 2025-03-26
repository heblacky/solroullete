import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

export const TokenNetwork: FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Generate a random network on mount
  useEffect(() => {
    // Generate nodes
    const tokenNames = ["SOL", "BONK", "WIF", "PYTH", "RAY", "ORCA", "SAMO", "JTO", "RENDER", "STEP"];
    const colorOptions = [
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-400",
      "from-pink-500 to-purple-400",
      "from-green-400 to-cyan-500",
      "from-yellow-400 to-orange-500"
    ];
    
    const newNodes: Node[] = [];
    
    // Create the main SOL node in the center
    newNodes.push({
      id: "SOL",
      x: 50,
      y: 50,
      size: 18,
      color: colorOptions[0],
      label: "SOL"
    });
    
    // Create other nodes in a circular pattern
    for (let i = 1; i < tokenNames.length; i++) {
      const angle = ((i - 1) / (tokenNames.length - 1)) * Math.PI * 2;
      const distance = Math.random() * 15 + 20;
      
      newNodes.push({
        id: tokenNames[i],
        x: 50 + Math.cos(angle) * distance,
        y: 50 + Math.sin(angle) * distance,
        size: Math.random() * 6 + 8,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        label: tokenNames[i]
      });
    }
    
    setNodes(newNodes);
    
    // Generate connections
    const newConnections: Connection[] = [];
    
    // Connect SOL to all others
    for (let i = 1; i < newNodes.length; i++) {
      newConnections.push({
        source: "SOL",
        target: newNodes[i].id,
        strength: Math.random() * 0.7 + 0.3
      });
    }
    
    // Add some random connections between tokens
    for (let i = 0; i < 8; i++) {
      const sourceIndex = 1 + Math.floor(Math.random() * (newNodes.length - 1));
      let targetIndex = 1 + Math.floor(Math.random() * (newNodes.length - 1));
      
      // Avoid self-connections
      while (targetIndex === sourceIndex) {
        targetIndex = 1 + Math.floor(Math.random() * (newNodes.length - 1));
      }
      
      newConnections.push({
        source: newNodes[sourceIndex].id,
        target: newNodes[targetIndex].id,
        strength: Math.random() * 0.5 + 0.1
      });
    }
    
    setConnections(newConnections);
  }, []);
  
  // Function to get a node by ID
  const getNode = (id: string): Node | undefined => {
    return nodes.find(n => n.id === id);
  };
  
  return (
    <motion.div 
      className="glassmorphism w-full aspect-square mt-16 p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="absolute top-4 left-4">
        <h3 className="text-xl font-semibold gradient-text tracking-tight">Solana Token Network</h3>
        <p className="text-sm text-gray-300">Visualizing connections between tokens</p>
      </div>
      
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Connections */}
          {connections.map((connection, i) => {
            const source = getNode(connection.source);
            const target = getNode(connection.target);
            
            if (!source || !target) return null;
            
            const isHighlighted = 
              hoveredNode === source.id || 
              hoveredNode === target.id;
              
            return (
              <motion.line
                key={`${connection.source}-${connection.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
                stroke={`rgba(138, 75, 255, ${isHighlighted ? 0.7 : connection.strength})`}
                strokeWidth={isHighlighted ? 1.2 : 0.8}
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Animated pulse that travels along connections */}
          {connections.map((connection, i) => {
            const source = getNode(connection.source);
            const target = getNode(connection.target);
            
            if (!source || !target) return null;
            
            return (
              <motion.circle
                key={`pulse-${connection.source}-${connection.target}`}
                cx={source.x}
                cy={source.y}
                r={1.2}
                fill="#ec4899"
                initial={{ cx: source.x, cy: source.y }}
                animate={{ 
                  cx: [source.x, target.x],
                  cy: [source.y, target.y]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3,
                  delay: i * 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size / 2}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                className={`fill-current bg-gradient-to-r ${node.color}`}
                filter="url(#glow)"
                opacity={hoveredNode === null || hoveredNode === node.id ? 1 : 0.5}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ scale: 1.2 }}
              />
              
              <motion.text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize={node.size / 2}
                fontWeight="bold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                opacity={hoveredNode === null || hoveredNode === node.id ? 1 : 0.5}
              >
                {node.label}
              </motion.text>
            </g>
          ))}
          
          {/* SVG Filters for glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
};

export default TokenNetwork; 