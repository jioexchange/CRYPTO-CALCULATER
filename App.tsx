import React, { useEffect, useState, useMemo } from 'react';
import CryptoTicker from './components/CryptoTicker';
import Calculator from './components/Calculator';
import CryptoChart from './components/CryptoChart';
import ExchangeComparison from './components/ExchangeComparison';
import WelcomeModal from './components/WelcomeModal';
import { getTopCoins, getLiveCurrencyRates, DEFAULT_FIAT_CURRENCIES } from './services/cryptoService';
import { CoinData, CurrencyOption } from './types';

const App: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>(DEFAULT_FIAT_CURRENCIES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('tether');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('inr'); // Track currency for exchange rates
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Fetch both coins and live currency rates in parallel
      const [coinsData, currencyData] = await Promise.all([
        getTopCoins('usd'),
        getLiveCurrencyRates()
      ]);
      
      setCoins(coinsData);
      setCurrencies(currencyData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error updating data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const selectedCoin = useMemo(() => 
    coins.find(c => c.id === selectedCoinId) || coins[0], 
  [coins, selectedCoinId]);

  const selectedCurrency = useMemo(() =>
    currencies.find(c => c.code === selectedCurrencyCode) || currencies[0],
  [currencies, selectedCurrencyCode]);

  return (
    <div className="min-h-screen bg-[#052e16] text-white font-sans selection:bg-green-500 selection:text-white pb-20 overflow-x-hidden">
      
      {/* Welcome Modal Popup */}
      {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <header className="w-full max-w-md px-5 py-5 flex justify-between items-center bg-green-950/50 backdrop-blur-xl sticky top-0 border-b border-green-800/50 z-50">
          <div className="flex items-center gap-3">
            {/* Custom Crypto-Calculater Logo */}
            <div className="relative w-11 h-11 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/50 border border-green-400/30 group overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <svg className="w-7 h-7 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 {/* Calculator Body */}
                 <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="1.5" className="text-green-100" />
                 {/* Screen */}
                 <rect x="7" y="5" width="10" height="4" rx="1" fill="rgba(16, 185, 129, 0.3)" stroke="none" />
                 {/* Buttons Grid */}
                 <circle cx="8" cy="12" r="1" fill="currentColor" className="text-green-200" />
                 <circle cx="12" cy="12" r="1" fill="currentColor" className="text-green-200" />
                 <circle cx="16" cy="12" r="1" fill="currentColor" className="text-green-200" />
                 <circle cx="8" cy="16" r="1" fill="currentColor" className="text-green-200" />
                 <circle cx="12" cy="16" r="1" fill="currentColor" className="text-green-200" />
                 <circle cx="16" cy="16" r="1" fill="currentColor" className="text-green-200" />
                 
                 {/* Coin Overlay */}
                 <circle cx="14" cy="18" r="5" className="fill-green-500 stroke-green-200" strokeWidth="1.5" />
                 <path d="M14 16v4m-1-2h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
               </svg>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-wide leading-none">Crypto-Calculater</h1>
              <span className="text-[10px] text-green-400 font-medium tracking-widest uppercase mt-1">Professional Tool</span>
            </div>
          </div>
          
          {/* Help Button with Logo */}
          <a 
            href="https://t.me/EARNEASY_2025" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 pl-1 pr-4 py-1 bg-green-900/30 hover:bg-green-800/50 border border-green-600/30 rounded-full transition-all duration-300 shadow-md hover:shadow-green-500/20"
          >
            {/* Phone Logo Container */}
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform relative overflow-hidden">
               {/* Subtle shine effect */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/30 to-transparent opacity-30"></div>
               {/* Solid Phone Icon */}
               <svg className="w-4 h-4 text-white fill-current drop-shadow-sm" viewBox="0 0 24 24">
                 <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
               </svg>
            </div>
            <span className="text-xs font-bold text-white group-hover:text-green-300 tracking-wide">Help</span>
          </a>
        </header>

        {/* Ticker */}
        <div className="w-full max-w-md">
           {!loading && <CryptoTicker coins={coins} />}
        </div>

        {/* Main Content */}
        <main className="w-full max-w-md px-4 mt-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 space-y-4">
               <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-green-300 animate-pulse text-sm font-medium tracking-wider">CONNECTING LIVE MARKETS...</p>
             </div>
          ) : (
            <div className="space-y-6">
              <Calculator 
                coins={coins} 
                currencies={currencies} 
                selectedCoinId={selectedCoinId}
                onCoinChange={setSelectedCoinId}
                onRefresh={fetchData}
                isRefreshing={refreshing}
                onCurrencyChange={setSelectedCurrencyCode}
              />
              {selectedCoin && <CryptoChart coin={selectedCoin} />}
              {selectedCoin && selectedCurrency && (
                 <ExchangeComparison coin={selectedCoin} currency={selectedCurrency} />
              )}
            </div>
          )}
        </main>
        
        {/* Footer info */}
        <footer className="w-full max-w-md text-center mt-12 mb-10 px-6">
           <div className="p-6 bg-green-950/30 rounded-3xl border border-green-800/30">
              <h2 className="text-green-400 text-lg font-bold tracking-widest uppercase glow-text animate-pulse">
                (JIO EXCHANGE)
              </h2>
              <p className="text-white/60 text-xs font-bold mt-2 tracking-[0.2em]">
                ( COMING SOON )
              </p>
           </div>
           
           <div className="mt-8">
             <p className="text-green-500/40 text-[10px] uppercase tracking-widest font-semibold">
               Rates Updated: {lastUpdated} • Data by CoinGecko & OpenExchange
             </p>
          </div>
        </footer>
      </div>
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;