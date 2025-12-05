export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number; // Simplified for demo, relative to USD
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}