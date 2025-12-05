
import React from 'react';
import { CoinData, CurrencyOption } from '../types';

interface ExchangeComparisonProps {
  coin: CoinData;
  currency: CurrencyOption;
}

const ExchangeComparison: React.FC<ExchangeComparisonProps> = ({ coin, currency }) => {
  // Base price in selected currency
  const basePrice = coin.current_price * currency.rateToUSD;

  // Simulate realistic slight spread/variance between exchanges (Arbitrage simulation)
  // Binance: Usually high volume, very close to market avg
  const binancePrice = basePrice * 1.0002; 
  // Bybit: Slightly different
  const bybitPrice = basePrice * 0.9998;
  // Mudrex: Aggregator, often matches best or slightly higher spread
  const mudrexPrice = basePrice * 1.0005;

  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    });
  };

  const exchanges = [
    {
      name: 'Binance',
      price: binancePrice,
      // Using CoinMarketCap source for high reliability
      logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
      color: 'text-yellow-400'
    },
    {
      name: 'Bybit',
      price: bybitPrice,
      // Updated to reliable source
      logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png',
      color: 'text-gray-200'
    },
    {
      name: 'Mudrex',
      price: mudrexPrice,
      // Using Mudrex official GitHub avatar as a stable logo source
      logo: 'https://avatars.githubusercontent.com/u/43376717?s=200&v=4',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center space-x-2 px-1">
        <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
        <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest">Exchange Rates (Live)</h3>
      </div>

      <div className="bg-green-950/40 backdrop-blur-xl rounded-3xl border border-green-800/50 overflow-hidden shadow-2xl">
        {exchanges.map((ex, index) => (
          <div 
            key={ex.name} 
            className={`flex items-center justify-between p-4 ${index !== exchanges.length - 1 ? 'border-b border-green-800/30' : ''} hover:bg-green-900/20 transition-colors`}
          >
            <div className="flex items-center gap-3">
              <img 
                src={ex.logo} 
                alt={ex.name} 
                className="w-8 h-8 rounded-full shadow-lg border border-white/10 bg-white/5" 
                onError={(e) => {
                  // Fallback if even the new link fails (unlikely)
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1200px-Anonymous_emblem.svg.png';
                }}
              />
              <span className="text-white font-bold text-sm tracking-wide">{ex.name}</span>
            </div>
            
            <div className="text-right">
              <p className="text-white font-mono font-bold text-sm">
                {currency.symbol}{formatPrice(ex.price)}
              </p>
              {/* Fake Real-time updates simulation */}
              <p className="text-[10px] text-green-500/60 font-medium animate-pulse">
                Live Update
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeComparison;
