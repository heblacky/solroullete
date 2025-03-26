import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TokenInfo {
  name?: string;
  symbol?: string;
  address: string;
  supply?: number;
  decimals?: number;
  holderCount?: number;
  price?: number;
  marketCap?: number;
  volume24h?: number;
  topHolders?: Array<{ address: string; percentage: number }>;
  isContract?: boolean;
}

interface TokenInfographicsProps {
  tokenInfo: TokenInfo | null;
  isLoading: boolean;
}

const TokenInfoCard: FC<{ title: string; value: string | number; icon: string }> = ({ 
  title, value, icon 
}) => {
  return (
    <motion.div 
      className="info-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">{icon}</span>
        <h3 className="text-lg font-semibold gradient-text tracking-tight">{title}</h3>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </motion.div>
  );
};

const HolderDistribution: FC<{ holders?: Array<{ address: string; percentage: number }> }> = ({ 
  holders = [] 
}) => {
  return (
    <motion.div 
      className="infographic-container mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-4 gradient-text">Top Holders Distribution</h3>
      <div className="flex h-16 w-full overflow-hidden rounded-lg">
        {holders.map((holder, idx) => (
          <motion.div
            key={holder.address}
            className="h-full"
            style={{ 
              backgroundColor: `hsl(${(idx * 30) % 360}, 80%, 60%)`,
              width: `${holder.percentage}%` 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${holder.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.1 * idx }}
            title={`${holder.address}: ${holder.percentage.toFixed(2)}%`}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {holders.map((holder, idx) => (
          <div key={holder.address} className="flex items-center text-sm">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: `hsl(${(idx * 30) % 360}, 80%, 60%)` }} 
            />
            <span className="truncate">
              {holder.address.slice(0, 4)}...{holder.address.slice(-4)}: {holder.percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const TokenInfographics: FC<TokenInfographicsProps> = ({ tokenInfo, isLoading }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (tokenInfo) {
      const timer = setTimeout(() => setAnimationComplete(true), 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [tokenInfo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <motion.div 
          className="w-16 h-16 border-4 border-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!tokenInfo) return null;

  const isWallet = !tokenInfo.isContract;

  return (
    <motion.div
      className="mt-8 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-4 text-center gradient-text tracking-tight"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isWallet ? 'Wallet Overview' : 'Token Information'}
      </motion.h2>
      
      <motion.div 
        className="glassmorphism p-6 mb-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold">
              {isWallet ? 'Wallet Address' : (tokenInfo.name || 'Unknown Token')}
            </h3>
            {!isWallet && tokenInfo.symbol && (
              <p className="text-xl text-gray-300">{tokenInfo.symbol}</p>
            )}
          </div>
          <div className="glassmorphism px-4 py-2 text-sm">
            {tokenInfo.address.slice(0, 6)}...{tokenInfo.address.slice(-6)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {!isWallet && tokenInfo.supply !== undefined && (
            <TokenInfoCard 
              title="Total Supply" 
              value={tokenInfo.supply.toLocaleString()} 
              icon="💰" 
            />
          )}
          
          {!isWallet && tokenInfo.decimals !== undefined && (
            <TokenInfoCard 
              title="Decimals" 
              value={tokenInfo.decimals} 
              icon="🔢" 
            />
          )}
          
          {!isWallet && tokenInfo.holderCount !== undefined && (
            <TokenInfoCard 
              title="Holders" 
              value={tokenInfo.holderCount.toLocaleString()} 
              icon="👥" 
            />
          )}
          
          {!isWallet && tokenInfo.price !== undefined && (
            <TokenInfoCard 
              title="Price" 
              value={`$${tokenInfo.price.toFixed(tokenInfo.price < 0.01 ? 8 : 4)}`} 
              icon="💲" 
            />
          )}
          
          {!isWallet && tokenInfo.marketCap !== undefined && (
            <TokenInfoCard 
              title="Market Cap" 
              value={`$${tokenInfo.marketCap.toLocaleString()}`} 
              icon="📊" 
            />
          )}
          
          {!isWallet && tokenInfo.volume24h !== undefined && (
            <TokenInfoCard 
              title="24h Volume" 
              value={`$${tokenInfo.volume24h.toLocaleString()}`} 
              icon="📈" 
            />
          )}
        </div>
      </motion.div>
      
      {animationComplete && tokenInfo.topHolders && tokenInfo.topHolders.length > 0 && (
        <HolderDistribution holders={tokenInfo.topHolders} />
      )}
    </motion.div>
  );
};

export default TokenInfographics; 