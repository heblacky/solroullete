import { FC } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  delay: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon, delay }) => {
  return (
    <motion.div 
      className="info-card overflow-hidden relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500 opacity-10 rounded-full blur-xl" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <motion.div 
            className="mr-3 text-3xl"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: delay + 0.2 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-semibold gradient-text tracking-tight">{title}</h3>
        </div>
        <p className="text-gray-300 font-light">{description}</p>
      </div>
    </motion.div>
  );
};

// Token Pulse Chart Component - Demonstrates price movement animation
const TokenPulseChart: FC = () => {
  return (
    <div className="h-24 flex items-end w-full mb-4">
      {Array.from({ length: 20 }).map((_, i) => {
        const height = 30 + Math.sin(i * 0.5) * 20 + Math.random() * 15;
        return (
          <motion.div
            key={i}
            className="w-full bg-gradient-to-t from-purple-600 to-pink-400 rounded-sm mx-px"
            style={{ height: 1 }}
            initial={{ height: 1 }}
            whileInView={{ height }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.04,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Liquidity Pool Visualization Component
const LiquidityPoolViz: FC = () => {
  const tokensInPool = 20;
  
  return (
    <div className="h-32 w-full mb-4 flex items-center justify-center relative">
      <motion.div 
        className="w-32 h-32 rounded-full border-2 border-purple-400 flex items-center justify-center relative"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1, rotate: 360 }}
        viewport={{ once: true }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <motion.div 
          className="absolute inset-2 rounded-full border-2 border-pink-400"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        
        {Array.from({ length: tokensInPool }).map((_, i) => {
          const angle = (i / tokensInPool) * Math.PI * 2;
          const x = Math.cos(angle) * 50;
          const y = Math.sin(angle) * 50;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
              style={{ 
                left: 'calc(50% - 4px)', 
                top: 'calc(50% - 4px)',
                x, y
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.5, 1] }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5 + (i * 0.02),
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

// Staking Rewards Animation
const StakingRewardsAnimation: FC = () => {
  return (
    <div className="h-32 flex items-center justify-center mb-4">
      <div className="relative">
        <motion.div 
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"
          animate={{ 
            boxShadow: [
              "0 0 0 0px rgba(139, 92, 246, 0.3)",
              "0 0 0 10px rgba(139, 92, 246, 0)",
            ],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <span className="text-white text-sm font-bold">SOL</span>
        </motion.div>
        
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 40;
          
          return (
            <motion.div
              key={i}
              className="absolute w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center"
              style={{ 
                left: 'calc(50% - 10px)', 
                top: 'calc(50% - 10px)',
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              animate={{
                x: [
                  Math.cos(angle) * distance,
                  Math.cos(angle) * (distance - 10),
                  Math.cos(angle) * distance
                ],
                y: [
                  Math.sin(angle) * distance,
                  Math.sin(angle) * (distance - 10),
                  Math.sin(angle) * distance
                ],
              }}
              whileHover={{ scale: 1.2 }}
            >
              <span className="text-white text-xs">+</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const DefiFeatures: FC = () => {
  // Features data
  const features = [
    {
      title: "Real-time DeFi Pulse",
      description: "Track TVL, yields, and token movements across Solana DeFi protocols with millisecond latency.",
      icon: "📊",
      visualization: <TokenPulseChart />,
    },
    {
      title: "MEV Protection Shield",
      description: "Analyze and visualize MEV activity to protect your transactions from front-running and sandwich attacks.",
      icon: "🛡️",
      visualization: null,
    },
    {
      title: "Impermanent Loss Calculator",
      description: "Interactive calculator to visualize potential impermanent loss based on price movements in liquidity pools.",
      icon: "💧",
      visualization: <LiquidityPoolViz />,
    },
    {
      title: "Smart Money Tracking",
      description: "Follow whale wallets and institutional movements with real-time alerts and pattern recognition.",
      icon: "🐋",
      visualization: null,
    },
    {
      title: "Yield Farming Optimizer",
      description: "AI-powered analysis to discover the highest yielding farming strategies adjusted for risk and gas fees.",
      icon: "🌾",
      visualization: null,
    },
    {
      title: "Auto-compounding Visualizer",
      description: "See how your staking rewards grow with different compounding frequencies through animated projections.",
      icon: "📈",
      visualization: <StakingRewardsAnimation />,
    },
    {
      title: "Gas Fee Predictor",
      description: "Machine learning model that predicts optimal transaction times to minimize gas fees.",
      icon: "⛽",
      visualization: null,
    },
    {
      title: "Rugpull Risk Analysis",
      description: "Analyze token contracts and team behavior patterns to assess potential rugpull risks before investing.",
      icon: "🚨",
      visualization: null,
    },
    {
      title: "Protocol Health Monitor",
      description: "Real-time monitoring of Solana DeFi protocols with risk scoring based on TVL, code audits and governance.",
      icon: "❤️",
      visualization: null,
    }
  ];

  return (
    <section className="my-24">
      <motion.h2 
        className="text-3xl font-bold mb-4 text-center gradient-text tracking-tight"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Advanced DeFi Analytics
      </motion.h2>
      
      <motion.p 
        className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-16 font-light"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Unlock the full potential of Solana DeFi with our cutting-edge analytics and interactive visualizations
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col h-full">
            {feature.visualization && (
              <div className="glassmorphism p-4 mb-4 overflow-hidden">
                {feature.visualization}
              </div>
            )}
            <FeatureCard 
              title={feature.title}
              description={feature.description}
              icon={<span>{feature.icon}</span>}
              delay={0.1 * index}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DefiFeatures; 