import { FC } from 'react';
import Link from 'next/link';
import ConnectWalletButton from './connect-wallet-button';
import { useWallet } from '@solana/wallet-adapter-react';
import { TwitterIcon } from './icons';

// Logo component that combines blockchain and magnifying glass
const BlockchainSearchLogo: FC = () => {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      {/* Magnifying glass handle */}
      <path 
        d="M32 32L24 24" 
        stroke="url(#logoGradient)" 
        strokeWidth="3" 
        strokeLinecap="round"
      />

      {/* Blockchain nodes */}
      <circle 
        cx="12" cy="15" r="3" 
        fill="url(#logoGradient)"
      />
      <circle 
        cx="20" cy="10" r="3" 
        fill="url(#logoGradient)"
      />
      <circle 
        cx="18" cy="20" r="3" 
        fill="url(#logoGradient)"
      />
      <circle 
        cx="10" cy="25" r="3" 
        fill="url(#logoGradient)"
      />

      {/* Connections between nodes */}
      <path 
        d="M12 15L20 10M20 10L18 20M18 20L10 25M10 25L12 15" 
        stroke="url(#logoGradient)" 
        strokeWidth="1.5"
      />

      {/* Magnifying glass circle */}
      <circle 
        cx="16" cy="16" r="10" 
        stroke="url(#logoGradient)" 
        strokeWidth="2.5" 
        fill="transparent"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const SolanticsNavbar: FC = () => {
  const { connected } = useWallet();
  
  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 flex items-center justify-center">
              <BlockchainSearchLogo />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">
              Solantics
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className={`transition-colors font-medium ${connected ? 'text-white hover:text-purple-400' : 'text-gray-500 cursor-not-allowed'}`}>
            Home
          </Link>
          <Link href="#features" className={`transition-colors font-medium ${connected ? 'text-white hover:text-purple-400' : 'text-gray-500 cursor-not-allowed'}`}>
            Features
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://x.com/solanticsxyz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-purple-400 transition-colors"
            aria-label="Twitter"
          >
            <TwitterIcon size={20} />
          </a>
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  );
};

export default SolanticsNavbar; 