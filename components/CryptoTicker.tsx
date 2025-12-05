import React from 'react';
import { CoinData } from '../types';

interface CryptoTickerProps {
  coins: CoinData[];
}

const CryptoTicker: React.FC<CryptoTickerProps> = ({ coins }) => {
  // Create a longer list for smooth marquee animation since we only have 5 coins
  const displayCoins = [...coins, ...coins, ...coins, ...coins, ...coins, ...coins];

  return (
    <div className="w-full bg-green-950/80 backdrop-blur-md border-y border-green-800 overflow-hidden py-3">
      <div className="relative flex whitespace-nowrap animate-marquee">
        {displayCoins.map((coin, index) => (
          <div key={`${coin.id}-${index}`} className="inline-flex items-center mx-8">
            <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-3 rounded-full bg-white/10" />
            <span className="text-white font-bold text-sm mr-2 tracking-wide">{coin.symbol.toUpperCase()}</span>
            <span className="text-green-300 text-sm mr-2 font-mono">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
            <span className={`text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CryptoTicker;