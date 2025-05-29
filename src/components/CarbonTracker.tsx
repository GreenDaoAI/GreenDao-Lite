import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, TrendingDown, TrendingUp, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { okxDexService } from '../services/OkxDexService';

interface TokenEmission {
  symbol: string;
  name: string;
  carbonScore: number;
  trend: 'up' | 'down' | 'stable';
  emissions: string;
  description: string;
  price: string;
  change24h: string;
  volume24h: string;
  marketCap: string;
}

export const CarbonTracker: React.FC = () => {
  const [tokenEmissions, setTokenEmissions] = useState<TokenEmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchRealTokenData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching real-time eco token data from OKX...');
      
      const ecoTokens = await okxDexService.getEcoFriendlyTokens();
      const tokenData: TokenEmission[] = [];

      ecoTokens.forEach(tokenInfo => {
        const baseSymbol = tokenInfo.instId.split('-')[0];
        const carbonScore = okxDexService.calculateCarbonScore(baseSymbol);
        const ecoDescription = okxDexService.getEcoImpactDescription(baseSymbol);
        
        tokenData.push({
          symbol: baseSymbol,
          name: getTokenName(baseSymbol),
          carbonScore,
          trend: parseFloat(tokenInfo.sodUtc8) > 0 ? 'up' : parseFloat(tokenInfo.sodUtc8) < 0 ? 'down' : 'stable',
          emissions: getEmissionData(baseSymbol).kwh,
          description: ecoDescription,
          price: `$${parseFloat(tokenInfo.last).toFixed(4)}`,
          change24h: `${parseFloat(tokenInfo.sodUtc8).toFixed(2)}%`,
          volume24h: `$${(parseFloat(tokenInfo.vol24h) / 1000000).toFixed(2)}M`,
          marketCap: calculateMarketCap(baseSymbol, parseFloat(tokenInfo.last))
        });
      });

      if (tokenData.length === 0) {
        throw new Error('No eco token data received from OKX');
      }

      setTokenEmissions(tokenData);
      setLastUpdate(new Date());
      
      console.log(`Successfully processed ${tokenData.length} eco-friendly tokens`);
    } catch (error) {
      console.error('Real-time data fetch error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCarbonScore = (symbol: string): number => {
    const scores: { [key: string]: number } = {
      'SOL': 92, 'ETH': 88, 'ADA': 95, 'DOT': 89, 'ALGO': 94, 'MATIC': 85, 'BTC': 23
    };
    return scores[symbol] || 75;
  };

  const getEmissionData = (symbol: string) => {
    const emissions: { [key: string]: { kwh: string; description: string } } = {
      'SOL': { kwh: '0.00051 kWh/tx', description: 'Proof-of-Stake, eco-friendly blockchain' },
      'ETH': { kwh: '0.0026 kWh/tx', description: 'Post-merge Proof-of-Stake efficiency' },
      'ADA': { kwh: '0.0017 kWh/tx', description: 'Research-driven sustainable design' },
      'DOT': { kwh: '0.0021 kWh/tx', description: 'Nominated Proof-of-Stake consensus' },
      'ALGO': { kwh: '0.0008 kWh/tx', description: 'Pure Proof-of-Stake, carbon negative' },
      'MATIC': { kwh: '0.0079 kWh/tx', description: 'Layer 2 scaling solution' }
    };
    return emissions[symbol] || { kwh: 'N/A', description: 'Energy data unavailable' };
  };

  const getTokenName = (symbol: string): string => {
    const names: { [key: string]: string } = {
      'SOL': 'Solana', 'ETH': 'Ethereum', 'ADA': 'Cardano', 
      'DOT': 'Polkadot', 'ALGO': 'Algorand', 'MATIC': 'Polygon'
    };
    return names[symbol] || symbol;
  };

  const calculateMarketCap = (symbol: string, price: number): string => {
    const supplies: { [key: string]: number } = {
      'SOL': 471000000, 'ETH': 120000000, 'ADA': 35000000000,
      'DOT': 1400000000, 'ALGO': 10000000000, 'MATIC': 10000000000
    };
    const supply = supplies[symbol] || 1000000000;
    const marketCap = (price * supply) / 1000000000;
    return `$${marketCap.toFixed(2)}B`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'readable-green bg-green-400/20 border-green-400';
    if (score >= 80) return 'text-yellow-400 bg-yellow-400/20 border-yellow-400';
    if (score >= 60) return 'text-orange-400 bg-orange-400/20 border-orange-400';
    return 'text-red-400 bg-red-400/20 border-red-400';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  useEffect(() => {
    fetchRealTokenData();
    const interval = setInterval(fetchRealTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full eco-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-400 neon-glow-soft" />
            <span className="readable-green terminal-font">[LOADING_CARBON_DATA...]</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse eco-card p-4">
                <div className="h-16 bg-green-400/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full eco-card border-red-400">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400 terminal-font">[OKX_API_ERROR]</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="readable-text terminal-font mb-4">OKX DEX API Error: {error}</p>
          <Button 
            onClick={fetchRealTokenData} 
            className="pixel-button terminal-font"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            [RETRY_CONNECTION]
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-400 neon-glow-soft" />
            <span className="readable-green terminal-font">[OKX_CARBON_TRACKER]</span>
          </div>
          <Button 
            onClick={fetchRealTokenData} 
            variant="ghost" 
            size="sm"
            className="readable-green hover:bg-green-400/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription className="readable-accent terminal-font">
          Live environmental impact data from OKX DEX API
          {lastUpdate && (
            <span className="block text-xs mt-1">
              Last sync: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {tokenEmissions.map((token) => (
            <div key={token.symbol} className="eco-card p-4 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="readable-green font-bold terminal-font text-lg">{token.symbol}</div>
                  <div className="readable-accent terminal-font text-sm">{token.name}</div>
                  {getTrendIcon(token.trend)}
                </div>
                <Badge className={`${getScoreColor(token.carbonScore)} terminal-font`}>
                  {token.carbonScore}/100
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="readable-text terminal-font">Price:</span>
                  <span className="readable-green font-bold terminal-font">{token.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="readable-text terminal-font">24h Change:</span>
                  <span className={`font-bold terminal-font ${parseFloat(token.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change24h}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="readable-text terminal-font">Volume:</span>
                  <span className="readable-accent terminal-font">{token.volume24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="readable-text terminal-font">Market Cap:</span>
                  <span className="readable-accent terminal-font">{token.marketCap}</span>
                </div>
                <div className="border-t border-green-400/30 pt-2 mt-2">
                  <div className="readable-accent terminal-font text-xs">
                    <strong>Energy:</strong> {token.emissions}
                  </div>
                  <div className="readable-text terminal-font text-xs mt-1">
                    {token.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 eco-card p-4 border-green-400">
          <h4 className="readable-green font-bold terminal-font mb-2 neon-glow-soft">💡 [REAL_TIME_ECO_INSIGHT]</h4>
          <p className="readable-text text-sm terminal-font">
            Live OKX DEX data shows PoS tokens like {tokenEmissions.find(t => t.carbonScore >= 90)?.symbol || 'ADA'} 
            use 99.9% less energy than PoW networks. Real-time prices help optimize green investments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
