import React, { useState } from 'react';
import { askGeneralQuestion } from '../services/geminiService';

interface AIAssistantProps {
  currentInsight: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentInsight }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const answer = await askGeneralQuestion(query);
    setResponse(answer);
    setLoading(false);
  };

  return (
    <div className="bg-green-900/30 backdrop-blur-md rounded-2xl border border-green-500/30 p-6 shadow-2xl mt-6">
      <div className="flex items-center mb-4">
         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-lg shadow-green-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
         </div>
         <h2 className="text-white text-lg font-bold">AI Market Pulse</h2>
      </div>

      {/* Auto Insight Box */}
      <div className="bg-green-950/60 rounded-lg p-4 border-l-4 border-green-500 mb-6">
        <p className="text-xs text-green-400 font-bold uppercase mb-1">Live Asset Analysis</p>
        <p className="text-white/90 text-sm leading-relaxed animate-pulse-slow">
           {currentInsight || "Select a coin to see AI analysis..."}
        </p>
      </div>

      {/* Interaction Area */}
      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI (e.g., 'Will Bitcoin crash?')"
          className="w-full bg-green-950/80 border border-green-700 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all placeholder-green-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          {loading ? (
             <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          )}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-emerald-900/40 rounded-xl border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-bold uppercase mb-1">AI Response</p>
          <p className="text-white text-sm leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
