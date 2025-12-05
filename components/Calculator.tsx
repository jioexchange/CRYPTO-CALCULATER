
import React, { useState, useMemo, useEffect } from 'react';
import { CoinData, CurrencyOption } from '../types';

interface CalculatorProps {
  coins: CoinData[];
  currencies: CurrencyOption[];
  selectedCoinId: string;
  onCoinChange: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCurrencyChange?: (code: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ coins, currencies, selectedCoinId, onCoinChange, onRefresh, isRefreshing, onCurrencyChange }) => {
  // Default: INR
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('inr');
  const [amount, setAmount] = useState<string>('1');

  // Sync internal state with parent if provided
  useEffect(() => {
    if (onCurrencyChange) {
      onCurrencyChange(selectedCurrencyCode);
    }
  }, [selectedCurrencyCode, onCurrencyChange]);

  // Ensure selected items exist even if data updates
  const selectedCoin = useMemo(() => 
    coins.find(c => c.id === selectedCoinId) || coins[0], 
  [coins, selectedCoinId]);

  const selectedCurrency = useMemo(() => 
    currencies.find(c => c.code === selectedCurrencyCode) || currencies[0],
  [currencies, selectedCurrencyCode]);

  const result = useMemo(() => {
    if (!selectedCoin || !selectedCurrency) return 0;
    const val = parseFloat(amount);
    if (isNaN(val)) return 0;
    
    // Calculation: CoinPrice(USD) * CurrencyRate(PerUSD) * Amount
    return selectedCoin.current_price * selectedCurrency.rateToUSD * val;
  }, [selectedCoin, selectedCurrency, amount]);

  return (
    <div className="bg-green-950/40 backdrop-blur-xl rounded-3xl border border-green-800/50 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-bold flex items-center">
          <span className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></span>
          Converter
        </h2>
        <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          REAL TIME
        </span>
      </div>

      <div className="space-y-4">
        {/* Amount Input */}
        <div className="bg-green-900/30 p-4 rounded-2xl border border-green-800/50 focus-within:border-green-500/50 transition-colors">
          <label className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-white text-3xl font-bold focus:ring-0 placeholder-green-800 font-mono"
            placeholder="0.00"
          />
        </div>

        {/* Coin Selector */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
           {/* From Coin */}
           <div className="relative group">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {selectedCoin && <img src={selectedCoin.image} alt="icon" className="w-6 h-6 rounded-full shadow-md" />}
             </div>
             <select
               value={selectedCoinId}
               onChange={(e) => onCoinChange(e.target.value)}
               className="w-full bg-green-900/30 hover:bg-green-900/50 border border-green-800/50 rounded-2xl pl-12 pr-8 py-4 text-white font-bold appearance-none focus:outline-none focus:border-green-500 transition-all cursor-pointer text-sm"
             >
               {coins.map(c => (
                 <option key={c.id} value={c.id} className="bg-green-950 text-white">
                   {c.symbol.toUpperCase()}
                 </option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
               <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
             </div>
           </div>

           {/* Swap Indicator */}
           <div className="flex justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
           </div>

           {/* To Currency */}
           <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none justify-center w-6">
                <span className="text-lg font-bold text-green-300">{selectedCurrency?.symbol}</span>
             </div>
             <select
               value={selectedCurrencyCode}
               onChange={(e) => setSelectedCurrencyCode(e.target.value)}
               className="w-full bg-green-900/30 hover:bg-green-900/50 border border-green-800/50 rounded-2xl pl-12 pr-8 py-4 text-white font-bold appearance-none focus:outline-none focus:border-green-500 transition-all cursor-pointer text-sm"
             >
               {currencies.map(c => (
                 <option key={c.code} value={c.code} className="bg-green-950 text-white">
                   {c.code.toUpperCase()}
                 </option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
               <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
             </div>
           </div>
        </div>

        {/* Result */}
        <div className="mt-6 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-6 border border-green-700/50 shadow-inner relative">
           <div className="flex justify-between items-center mb-2">
             <p className="text-green-300/80 text-xs uppercase font-bold tracking-wider">Market Value (Real-Time)</p>
             <button 
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`p-1.5 rounded-full transition-all border border-green-500/30 ${isRefreshing ? 'bg-green-800 text-green-400 cursor-wait' : 'bg-green-700 hover:bg-green-600 text-white shadow-sm'}`}
                title="Refresh Rate"
             >
                <svg className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
             </button>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-3xl font-bold text-white tracking-tight break-all font-mono">
                    {selectedCurrency?.symbol}{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
                 <span className="text-green-400 text-xs mt-1 font-medium">
                   {selectedCurrency?.name}
                 </span>
              </div>
              {selectedCoin && (
                 <div className="text-right">
                    <p className="text-xs text-green-500 mb-1">Live Rate</p>
                    <p className="text-sm font-bold text-white">
                       1 {selectedCoin.symbol.toUpperCase()} = {selectedCurrency?.symbol}{(selectedCoin.current_price * selectedCurrency.rateToUSD).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
