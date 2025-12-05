import React, { useMemo } from 'react';
import { CoinData } from '../types';

interface CryptoChartProps {
  coin: CoinData;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ coin }) => {
  // CRITICAL: Merge historical sparkline with the absolute latest LIVE price
  // This ensures the chart tip matches the big number displayed
  const dataPoints = useMemo(() => {
    const history = coin.sparkline_in_7d?.price || [];
    if (history.length === 0) return [coin.current_price, coin.current_price]; // Minimal fallback
    // Append current price to make the chart "Live"
    return [...history, coin.current_price];
  }, [coin.sparkline_in_7d, coin.current_price]);
  
  // Calculate Chart Geometry
  const { path, areaPath, min, max, isUp, lastY } = useMemo(() => {
    if (dataPoints.length === 0) return { path: '', areaPath: '', min: 0, max: 0, isUp: true, lastY: 0 };

    const maxVal = Math.max(...dataPoints);
    const minVal = Math.min(...dataPoints);
    const range = maxVal - minVal;
    // Add small buffer so lines don't touch edges
    const buffer = range === 0 ? maxVal * 0.01 : range * 0.1;
    const chartMin = minVal - buffer;
    const chartMax = maxVal + buffer;
    const chartRange = chartMax - chartMin;

    const width = 100; // SVG viewBox width
    const height = 40; // SVG viewBox height

    const points = dataPoints.map((val, index) => {
      const x = (index / (dataPoints.length - 1)) * width;
      const y = height - ((val - chartMin) / chartRange) * height;
      return `${x},${y}`;
    });

    const lastPointY = height - ((dataPoints[dataPoints.length - 1] - chartMin) / chartRange) * height;

    const linePathStr = points.length ? `M ${points.join(' L ')}` : '';
    const areaPathStr = points.length ? `${linePathStr} L ${width},${height} L 0,${height} Z` : '';

    // Determine trend based on Start vs Live End
    const startPrice = dataPoints[0];
    const endPrice = dataPoints[dataPoints.length - 1];
    const trendingUp = endPrice >= startPrice;

    return {
      path: linePathStr,
      areaPath: areaPathStr,
      min: minVal,
      max: maxVal,
      isUp: trendingUp,
      lastY: lastPointY
    };
  }, [dataPoints]);

  const colorClass = isUp ? "text-emerald-400" : "text-rose-400";
  const strokeColor = isUp ? "#34d399" : "#fb7185"; // emerald-400 or rose-400
  const gradientId = `gradient-${coin.id}`;

  return (
    <div className="bg-green-950/40 backdrop-blur-xl rounded-3xl border border-green-800/50 p-6 shadow-2xl mt-6 relative overflow-hidden group">
      
      {/* Live Blinking Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20 bg-green-950/80 px-2 py-1 rounded-full border border-green-800/50">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUp ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </span>
        <span className="text-[10px] font-bold text-green-100 tracking-widest">LIVE</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-lg" />
             <h3 className="text-white font-bold text-xl">{coin.name}</h3>
           </div>
           <p className="text-xs text-green-400/70 font-mono uppercase tracking-widest pl-1">Market Trend</p>
        </div>
        <div className="text-right mt-8"> {/* Pushed down to clear the LIVE badge */}
           <p className={`text-2xl font-bold font-mono tracking-tight ${colorClass} transition-colors duration-300`}>
             ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
           </p>
           <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{isUp ? '▲' : '▼'}</span>
              <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
              <span className="text-green-500/40 ml-1">24h</span>
           </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-48 relative">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
           <defs>
             <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
               <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
             </linearGradient>
             <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
           </defs>
           
           {/* Grid lines */}
           <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
           <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
           <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
           <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
           <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />

           {/* Area Fill */}
           <path d={areaPath} fill={`url(#${gradientId})`} />
           
           {/* Main Line */}
           <path d={path} fill="none" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" filter="url(#glow)" />
           
           {/* Pulsing Dot at current live price */}
           <circle cx="100" cy={lastY} r="1.5" fill={strokeColor} className="animate-pulse">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
           </circle>
           {/* Inner solid dot */}
           <circle cx="100" cy={lastY} r="0.8" fill="white" />
        </svg>

        {/* Min/Max Labels Overlay */}
        <div className="absolute top-0 left-0 text-[10px] text-white/40 font-mono bg-green-950/30 px-1.5 rounded border border-green-500/10">
          Max: ${max.toLocaleString()}
        </div>
        <div className="absolute bottom-0 left-0 text-[10px] text-white/40 font-mono bg-green-950/30 px-1.5 rounded border border-green-500/10">
          Min: ${min.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;