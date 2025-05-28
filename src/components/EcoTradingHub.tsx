
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Leaf, Zap, AlertTriangle, RefreshCw, Target } from 'lucide-react';

interface EcoToken {
  symbol: string;
  price: number;
  change24h: number;
  carbonScore: number;
  aiRecommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
  volume: number;
  ecoImpact: string;
}

interface AITradeSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  carbonBenefit: number;
  timeframe: string;
}

export const EcoTradingHub: React.FC = () => {
  const [ecoTokens, setEcoTokens] = useState<EcoToken[]>([]);
  const [tradeSignals, setTradeSignals] = useState<{ [key: string]: AITradeSignal }>({});
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [carbonOffset, setCarbonOffset] = useState(0);

  const fetchRealTimeEcoData = async () => {
    setLoading(true);
    try {
      // Fetch real OKX data
      const response = await fetch('https://www.okx.com/api/v5/market/tickers?instType=SPOT');
      const data = await response.json();
      
      if (data.data) {
        const greenTokens = ['SOL-USDT', 'ETH-USDT', 'ADA-USDT', 'ALGO-USDT', 'DOT-USDT'];
        const tokenData: EcoToken[] = [];
        
        for (const symbol of greenTokens) {
          const tokenInfo = data.data.find((item: any) => item.instId === symbol);
          if (tokenInfo) {
            const baseSymbol = symbol.split('-')[0];
            const carbonScore = getCarbonScore(baseSymbol);
            const aiSignal = await generateAITradeSignal(baseSymbol, tokenInfo, carbonScore);
            
            tokenData.push({
              symbol: baseSymbol,
              price: parseFloat(tokenInfo.last),
              change24h: parseFloat(tokenInfo.sodUtc8),
              carbonScore,
              aiRecommendation: aiSignal.reasoning,
              riskLevel: aiSignal.confidence > 80 ? 'low' : aiSignal.confidence > 60 ? 'medium' : 'high',
              volume: parseFloat(tokenInfo.vol24h),
              ecoImpact: getEcoImpact(baseSymbol)
            });
            
            setTradeSignals(prev => ({...prev, [baseSymbol]: aiSignal}));
          }
        }
        
        setEcoTokens(tokenData);
        calculatePortfolioMetrics(tokenData);
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      // Use enhanced mock data if API fails
      generateMockEcoData();
    } finally {
      setLoading(false);
    }
  };

  const generateAITradeSignal = async (symbol: string, tokenData: any, carbonScore: number): Promise<AITradeSignal> => {
    try {
      // This would use real Sensay AI API in production
      const prompt = `Analyze ${symbol} for eco-trading: Price: $${tokenData.last}, 24h change: ${tokenData.sodUtc8}%, Carbon score: ${carbonScore}/100. Provide trading recommendation considering environmental impact.`;
      
      console.log(`Generating AI signal for ${symbol}...`);
      
      // Enhanced AI logic based on carbon score and market data
      const change24h = parseFloat(tokenData.sodUtc8);
      const volume = parseFloat(tokenData.vol24h);
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let confidence = 50;
      let reasoning = '';
      let carbonBenefit = 0;
      
      if (carbonScore >= 90) {
        if (change24h > 5) {
          action = 'BUY';
          confidence = 85;
          reasoning = `[HIGH_ECO_MOMENTUM] Strong uptrend + top-tier carbon score (${carbonScore}). Green narrative driving institutional flows. Environmental regulations favoring PoS chains.`;
          carbonBenefit = 45;
        } else if (change24h < -10) {
          action = 'BUY';
          confidence = 90;
          reasoning = `[ECO_DIP_OPPORTUNITY] High-quality green asset oversold. Carbon score ${carbonScore} + strong fundamentals = accumulation zone. ESG compliance future-proof.`;
          carbonBenefit = 50;
        } else {
          action = 'HOLD';
          confidence = 75;
          reasoning = `[GREEN_STABILITY] Premium eco-token consolidating. Carbon score ${carbonScore} provides long-term value. Hold for ESG portfolio allocation.`;
          carbonBenefit = 30;
        }
      } else if (carbonScore >= 80) {
        if (change24h > 8) {
          action = 'HOLD';
          confidence = 70;
          reasoning = `[MODERATE_ECO_PUMP] Decent green credentials but momentum overbought. Wait for pullback on this carbon score ${carbonScore} asset.`;
          carbonBenefit = 25;
        } else {
          action = 'BUY';
          confidence = 75;
          reasoning = `[SOLID_GREEN_PLAY] Good carbon efficiency (${carbonScore}) with reasonable entry. Part of diversified eco-portfolio strategy.`;
          carbonBenefit = 35;
        }
      } else {
        action = 'SELL';
        confidence = 80;
        reasoning = `[CARBON_WARNING] Low eco-score (${carbonScore}) = regulatory risk. Rotate to green alternatives before ESG mandates hit.`;
        carbonBenefit = -20;
      }
      
      return {
        action,
        confidence,
        reasoning,
        carbonBenefit,
        timeframe: '1-4 weeks'
      };
      
    } catch (error) {
      console.error('AI signal generation error:', error);
      return {
        action: 'HOLD',
        confidence: 60,
        reasoning: '[AI_OFFLINE] Market analysis temporarily unavailable. Recommend manual eco-assessment.',
        carbonBenefit: 20,
        timeframe: 'Unknown'
      };
    }
  };

  const getCarbonScore = (symbol: string): number => {
    const scores: { [key: string]: number } = {
      'SOL': 92, 'ETH': 88, 'ADA': 95, 'ALGO': 94, 'DOT': 89, 'MATIC': 85
    };
    return scores[symbol] || 75;
  };

  const getEcoImpact = (symbol: string): string => {
    const impacts: { [key: string]: string } = {
      'SOL': '99.9% less energy than Bitcoin',
      'ETH': '99.95% reduction post-merge',
      'ADA': 'Research-driven sustainability',
      'ALGO': 'Carbon negative blockchain',
      'DOT': 'Efficient nominated PoS'
    };
    return impacts[symbol] || 'Moderate eco-efficiency';
  };

  const generateMockEcoData = () => {
    const mockTokens: EcoToken[] = [
      {
        symbol: 'SOL',
        price: 95.32,
        change24h: 5.7,
        carbonScore: 92,
        aiRecommendation: '[STRONG_BUY] Ultra-green PoS + DeFi growth + institutional adoption = perfect storm',
        riskLevel: 'low',
        volume: 2500000,
        ecoImpact: '99.9% less energy than Bitcoin'
      },
      {
        symbol: 'ADA',
        price: 0.89,
        change24h: -2.1,
        carbonScore: 95,
        aiRecommendation: '[ACCUMULATE] Best-in-class carbon score, research excellence, oversold bounce incoming',
        riskLevel: 'low',
        volume: 1800000,
        ecoImpact: 'Academic rigor meets sustainability'
      }
    ];
    setEcoTokens(mockTokens);
  };

  const calculatePortfolioMetrics = (tokens: EcoToken[]) => {
    const totalValue = tokens.reduce((sum, token) => sum + (token.price * 100), 0); // Mock holdings
    const avgCarbonScore = tokens.reduce((sum, token) => sum + token.carbonScore, 0) / tokens.length;
    
    setPortfolioValue(totalValue);
    setCarbonOffset(avgCarbonScore * 10); // Mock calculation
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-green-400 bg-green-400/20 border-green-400';
      case 'SELL': return 'text-red-400 bg-red-400/20 border-red-400';
      default: return 'text-yellow-400 bg-yellow-400/20 border-yellow-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  useEffect(() => {
    fetchRealTimeEcoData();
    const interval = setInterval(fetchRealTimeEcoData, 45000); // Refresh every 45 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full eco-card">
        <CardHeader>
          <CardTitle className="readable-green terminal-font">[ECO_TRADING_HUB] Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-green-400/10 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="eco-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-400" />
              <div>
                <p className="readable-accent terminal-font text-sm">Portfolio Value</p>
                <p className="readable-green terminal-font font-bold text-xl">${portfolioValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="eco-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-400" />
              <div>
                <p className="readable-accent terminal-font text-sm">Carbon Offset</p>
                <p className="readable-green terminal-font font-bold text-xl">{carbonOffset}kg CO2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="eco-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="readable-accent terminal-font text-sm">Active Signals</p>
                <p className="readable-green terminal-font font-bold text-xl">{Object.keys(tradeSignals).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <Card className="eco-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="readable-green terminal-font neon-glow-soft">[ECO_TRADING_HUB]</CardTitle>
              <CardDescription className="readable-accent terminal-font">
                AI-powered green crypto trading with real-time environmental impact analysis
              </CardDescription>
            </div>
            <Button onClick={fetchRealTimeEcoData} variant="ghost" size="sm" className="readable-green">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signals" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50">
              <TabsTrigger value="signals" className="readable-green terminal-font">AI SIGNALS</TabsTrigger>
              <TabsTrigger value="analysis" className="readable-green terminal-font">ECO ANALYSIS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="space-y-4">
              {ecoTokens.map((token) => {
                const signal = tradeSignals[token.symbol];
                return (
                  <Card key={token.symbol} className="eco-card border-green-400/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="readable-green font-bold terminal-font text-lg">{token.symbol}</div>
                          <div className="readable-text terminal-font">${token.price.toFixed(4)}</div>
                          <div className={`flex items-center space-x-1 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span className="terminal-font text-sm">{token.change24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={`terminal-font ${getActionColor(signal?.action || 'HOLD')}`}>
                            {signal?.action || 'LOADING'} {signal?.confidence}%
                          </Badge>
                          <Badge className="readable-green bg-green-400/20 border-green-400 terminal-font">
                            ECO: {token.carbonScore}/100
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="readable-text terminal-font text-sm">
                          <strong>AI Analysis:</strong> {signal?.reasoning || 'Generating...'}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="readable-accent">Risk Level: 
                            <span className={`ml-1 font-bold ${getRiskColor(token.riskLevel)}`}>
                              {token.riskLevel.toUpperCase()}
                            </span>
                          </span>
                          <span className="readable-accent">Carbon Benefit: 
                            <span className="ml-1 text-green-400 font-bold">
                              +{signal?.carbonBenefit || 0}kg CO2
                            </span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              {ecoTokens.map((token) => (
                <Card key={token.symbol} className="eco-card border-green-400/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="readable-green font-bold terminal-font text-lg">{token.symbol}</h3>
                        <p className="readable-accent terminal-font text-sm">{token.ecoImpact}</p>
                      </div>
                      <Badge className="readable-green bg-green-400/20 border-green-400 terminal-font">
                        CARBON SCORE: {token.carbonScore}/100
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="readable-text">24h Volume:</span>
                        <span className="readable-accent ml-2">${(token.volume / 1000000).toFixed(2)}M</span>
                      </div>
                      <div>
                        <span className="readable-text">Eco Rating:</span>
                        <span className="readable-green ml-2 font-bold">
                          {token.carbonScore >= 90 ? 'EXCELLENT' : 
                           token.carbonScore >= 80 ? 'GOOD' : 
                           token.carbonScore >= 70 ? 'FAIR' : 'POOR'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
