
interface OkxTokenData {
  instId: string;
  last: string;
  sodUtc8: string;
  vol24h: string;
  high24h: string;
  low24h: string;
  ts: string;
}

interface OkxApiResponse {
  code: string;
  msg: string;
  data: OkxTokenData[];
}

export class OkxDexService {
  private baseUrl = 'https://www.okx.com/api/v5';
  private proxyUrl = 'https://api.allorigins.win/raw?url=';

  async getMarketTickers(): Promise<OkxTokenData[]> {
    try {
      console.log('Fetching OKX market data...');
      
      // Use proxy to avoid CORS issues
      const url = `${this.proxyUrl}${encodeURIComponent(`${this.baseUrl}/market/tickers?instType=SPOT`)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`OKX API error: ${response.status} ${response.statusText}`);
      }

      const data: OkxApiResponse = await response.json();
      
      if (data.code !== '0') {
        throw new Error(`OKX API error: ${data.msg}`);
      }

      console.log(`Successfully fetched ${data.data.length} tokens from OKX`);
      return data.data;
    } catch (error) {
      console.error('OKX API fetch error:', error);
      
      // Fallback to mock data if API fails
      return this.getFallbackData();
    }
  }

  async getEcoFriendlyTokens(): Promise<OkxTokenData[]> {
    try {
      const allTokens = await this.getMarketTickers();
      
      // Filter for eco-friendly tokens
      const ecoTokens = ['SOL-USDT', 'ETH-USDT', 'ADA-USDT', 'DOT-USDT', 'ALGO-USDT', 'MATIC-USDT'];
      
      return allTokens.filter(token => ecoTokens.includes(token.instId));
    } catch (error) {
      console.error('Error filtering eco tokens:', error);
      return this.getFallbackData();
    }
  }

  async getTokenPrice(symbol: string): Promise<number> {
    try {
      const tokens = await this.getMarketTickers();
      const token = tokens.find(t => t.instId === `${symbol}-USDT`);
      
      if (!token) {
        throw new Error(`Token ${symbol} not found`);
      }
      
      return parseFloat(token.last);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0;
    }
  }

  async getTokenVolume(symbol: string): Promise<number> {
    try {
      const tokens = await this.getMarketTickers();
      const token = tokens.find(t => t.instId === `${symbol}-USDT`);
      
      if (!token) {
        throw new Error(`Token ${symbol} not found`);
      }
      
      return parseFloat(token.vol24h);
    } catch (error) {
      console.error(`Error fetching volume for ${symbol}:`, error);
      return 0;
    }
  }

  private getFallbackData(): OkxTokenData[] {
    return [
      {
        instId: 'SOL-USDT',
        last: '95.32',
        sodUtc8: '5.7',
        vol24h: '2500000',
        high24h: '98.50',
        low24h: '92.10',
        ts: Date.now().toString()
      },
      {
        instId: 'ETH-USDT',
        last: '2342.15',
        sodUtc8: '3.2',
        vol24h: '1800000',
        high24h: '2380.00',
        low24h: '2290.50',
        ts: Date.now().toString()
      },
      {
        instId: 'ADA-USDT',
        last: '0.89',
        sodUtc8: '-2.1',
        vol24h: '950000',
        high24h: '0.92',
        low24h: '0.86',
        ts: Date.now().toString()
      }
    ];
  }

  calculateCarbonScore(symbol: string): number {
    const scores: { [key: string]: number } = {
      'SOL': 92,
      'ETH': 88,
      'ADA': 95,
      'DOT': 89,
      'ALGO': 94,
      'MATIC': 85,
      'BTC': 23
    };
    return scores[symbol] || 75;
  }

  getEcoImpactDescription(symbol: string): string {
    const impacts: { [key: string]: string } = {
      'SOL': '99.9% less energy than Bitcoin',
      'ETH': '99.95% reduction post-merge',
      'ADA': 'Research-driven sustainability',
      'DOT': 'Efficient nominated PoS',
      'ALGO': 'Carbon negative blockchain',
      'MATIC': 'Layer 2 scaling efficiency'
    };
    return impacts[symbol] || 'Standard blockchain efficiency';
  }
}

export const okxDexService = new OkxDexService();
