import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

const ConnectWalletButton: FC = () => {
  const { wallet, connected } = useWallet();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="relative">
      {!connected && isHovering && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap">
          Connect to search and explore Solana
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
      
      <div 
        className={`${!connected ? 'animate-pulse' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <WalletMultiButton
          className={`wallet-adapter-button !bg-gradient-to-r ${!connected ? 'from-purple-600 to-pink-600 !text-white' : 'from-gray-700 to-gray-800 !text-white'}`}
        />
      </div>
      
      {connected && (
        <div className="text-xs text-green-400 absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          Wallet Connected
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton; 