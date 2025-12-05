import React from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#022c22] border border-green-500/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-green-900/50 relative overflow-hidden transform transition-all scale-100">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
            {/* Verified Icon */}
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center ring-1 ring-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-wide">(Crypto Calculater)</h2>
                <div className="h-0.5 w-16 bg-green-500/50 mx-auto rounded-full mt-2"></div>
            </div>

            <div className="space-y-2 bg-green-900/20 p-4 rounded-2xl border border-green-500/20 w-full backdrop-blur-sm">
                 <p className="text-green-400 font-bold text-base leading-tight">यह सरकार द्वारा सत्यापित है</p>
                 <p className="text-green-200/70 text-xs font-medium tracking-wide uppercase">This is verified by the government</p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
                <a
                    href="https://t.me/CryptoCalculater"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                   {/* Telegram Plane Icon */}
                   <svg className="w-5 h-5 fill-current group-hover:rotate-[-10deg] transition-transform" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>
                   Join Channel
                </a>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-transparent border border-green-800 hover:bg-green-900/30 text-green-400/80 hover:text-green-300 font-semibold rounded-xl transition-all text-sm"
                >
                    Close
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;