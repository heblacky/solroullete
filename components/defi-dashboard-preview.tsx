import { FC } from 'react';

export const DefiDashboardPreview: FC = () => {
  // Sample data for the visualizations
  const marketData = [
    { name: 'SOL', value: 82.45, change: 3.2 },
    { name: 'BTC', value: 42.18, change: -1.5 },
    { name: 'ETH', value: 28.93, change: 2.7 },
    { name: 'BONK', value: 15.62, change: 8.3 },
    { name: 'WIF', value: 12.34, change: 5.1 },
  ];

  const liquidityData = [
    { protocol: 'Orca', value: 425, color: 'from-blue-500 to-cyan-400' },
    { protocol: 'Raydium', value: 310, color: 'from-purple-500 to-indigo-500' },
    { protocol: 'Jupiter', value: 380, color: 'from-pink-500 to-purple-400' },
    { protocol: 'Marinade', value: 220, color: 'from-yellow-400 to-orange-500' },
  ];

  const chartData = [65, 59, 80, 81, 56, 55, 70, 90, 85, 78, 95, 92];
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="w-full mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Advanced DeFi Analytics Dashboard</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Dive deep into Solana&apos;s DeFi ecosystem with our comprehensive analytics suite.
          Monitor market trends, track liquidity pools, and analyze yield farming opportunities.
        </p>
      </div>
      
      <div className="glassmorphism rounded-xl p-6 w-full max-w-6xl mx-auto shadow-2xl">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold gradient-text">Solantics Pro Dashboard</h3>
          <div className="flex space-x-2">
            {['1H', '1D', '1W', '1M', 'ALL'].map((period) => (
              <button 
                key={period} 
                className={`px-3 py-1 rounded-md text-sm ${period === '1D' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Market Overview */}
          <div className="bg-gray-900/60 rounded-lg p-4">
            <h4 className="text-white text-lg mb-3">Market Overview</h4>
            <div className="space-y-3">
              {marketData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${item.change > 0 ? 'from-green-400 to-cyan-500' : 'from-red-400 to-pink-500'}`}>
                      {item.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-white">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${item.value}</div>
                    <div className={item.change > 0 ? 'text-green-400' : 'text-red-400'}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price Chart */}
          <div className="bg-gray-900/60 rounded-lg p-4 md:col-span-2">
            <h4 className="text-white text-lg mb-3">SOL Price</h4>
            <div className="h-40 flex items-end space-x-1">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
              ))}
            </div>
            
            {/* Chart X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <div key={month}>{month}</div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liquidity Pools */}
          <div className="bg-gray-900/60 rounded-lg p-4">
            <h4 className="text-white text-lg mb-3">Top Liquidity Pools</h4>
            <div className="flex h-40 items-end space-x-6 justify-center">
              {liquidityData.map((item) => (
                <div key={item.protocol} className="flex flex-col items-center">
                  <div
                    className={`w-12 bg-gradient-to-t ${item.color} rounded-t`}
                    style={{ height: `${(item.value / 500) * 100}%` }}
                  />
                  <div className="text-xs text-gray-300 mt-2">{item.protocol}</div>
                  <div className="text-white font-medium">${item.value}M</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Yield Farming */}
          <div className="bg-gray-900/60 rounded-lg p-4">
            <h4 className="text-white text-lg mb-3">Yield Farming Opportunities</h4>
            <div className="space-y-4">
              {[
                { pair: 'SOL-USDC', apy: '8.2%', tvl: '$12.5M', platform: 'Raydium' },
                { pair: 'BONK-SOL', apy: '42.7%', tvl: '$5.2M', platform: 'Orca' },
                { pair: 'ETH-SOL', apy: '6.5%', tvl: '$18.7M', platform: 'Jupiter' }
              ].map((item) => (
                <div 
                  key={item.pair}
                  className="flex justify-between items-center p-2 border border-gray-700 rounded-lg"
                >
                  <div>
                    <div className="text-white">{item.pair}</div>
                    <div className="text-xs text-gray-400">{item.platform}</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-medium">APY: {item.apy}</div>
                    <div className="text-xs text-gray-400">TVL: {item.tvl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Coming Soon Badge */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full px-4 py-1 text-sm font-semibold">
            Pro Dashboard Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefiDashboardPreview; 