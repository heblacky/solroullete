import axios from 'axios';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export interface TokenInfo {
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

interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  holderCount: number;
  price: number;
  marketCap: number;
  volume24h: number;
  topHolders: Array<{ address: string; percentage: number }>;
}

// Mock data for demo purposes
const MOCK_TOKEN_DATA: Record<string, TokenData> = {
  'So11111111111111111111111111111111111111112': {
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    decimals: 9,
    supply: 10000000,
    holderCount: 123456,
    price: 68.45,
    marketCap: 684500000,
    volume24h: 12345678,
    topHolders: Array(5).fill(0).map((_, i) => ({
      address: `So111${i}111111111111111111111111111111111${i}`,
      percentage: 30 / (i + 1),
    })),
  },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
    name: 'BONK',
    symbol: 'BONK',
    decimals: 5,
    supply: 990000000000000,
    holderCount: 987654,
    price: 0.00001234,
    marketCap: 12211600,
    volume24h: 3456789,
    topHolders: Array(5).fill(0).map((_, i) => ({
      address: `DezXA${i}8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB26${i}`,
      percentage: 20 / (i + 1),
    })),
  }
};

// For demo purposes - replace with real data in production
const mockWalletData = (address: string) => {
  return {
    address,
    isContract: false,
    topHolders: [
      { address: `${address.slice(0, 10)}...1`, percentage: 45 },
      { address: `${address.slice(0, 10)}...2`, percentage: 25 },
      { address: `${address.slice(0, 10)}...3`, percentage: 15 },
      { address: `${address.slice(0, 10)}...4`, percentage: 10 },
      { address: `${address.slice(0, 10)}...5`, percentage: 5 },
    ]
  };
};

// Create a Solana connection
const connection = new Connection(clusterApiUrl('mainnet-beta'));

/**
 * Check if an address is valid Solana address
 */
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if an address is a contract
 */
export const isContract = async (address: string): Promise<boolean> => {
  try {
    // In a real implementation, check if this is a token contract
    // For now, for demo purposes, let's assume certain addresses are contracts
    return address in MOCK_TOKEN_DATA;
  } catch (error) {
    console.error('Error checking if address is contract:', error);
    return false;
  }
};

/**
 * Get token or wallet information
 */
export const getAddressInfo = async (address: string): Promise<TokenInfo | null> => {
  try {
    if (!isValidSolanaAddress(address)) {
      throw new Error('Invalid Solana address');
    }

    // In production, use real data from APIs like Solscan, SolanaFM, etc.
    // For demo purposes, we're using mock data
    const isTokenContract = await isContract(address);
    
    if (isTokenContract && address in MOCK_TOKEN_DATA) {
      return {
        ...MOCK_TOKEN_DATA[address],
        address,
        isContract: true,
      };
    }

    // If it's not a recognized token, assume it's a wallet address
    return mockWalletData(address);
  } catch (error) {
    console.error('Error fetching address info:', error);
    return null;
  }
};

export default {
  getAddressInfo,
  isValidSolanaAddress,
}; 