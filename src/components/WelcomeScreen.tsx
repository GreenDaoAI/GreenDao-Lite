import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Leaf, 
  MessageCircle, 
  Vote, 
  BarChart3, 
  Shield, 
  Coins, 
  Zap,
  TrendingUp,
  Users,
  Globe,
  Brain
} from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
  onViewCarbon: () => void;
  onViewTrading: () => void;
  onViewVoting: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStartChat, 
  onViewCarbon, 
  onViewTrading,
  onViewVoting 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 matrix-bg scanlines overflow-hidden">
      {/* Hero Section */}
      <div className="text-center py-16 eco-card rounded-xl mx-4 animate-float">
        <div className="flex items-center justify-center mb-8">
          <div className="pixel-border bg-black p-6 rounded-full animate-pulse-glow">
            <Leaf className="h-16 w-16 text-green-400 neon-glow-soft" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold terminal-font neon-glow-soft readable-green mb-6 glitch-text" data-text="GreenDAO">
          GreenDAO
        </h1>
        <div className="text-xl lg:text-2xl readable-accent mb-8 terminal-font tracking-wider">
          <span className="readable-green">{'>'}</span> DECENTRALIZED ECO-GOVERNANCE PROTOCOL
        </div>
        <p className="text-lg readable-text mb-10 max-w-4xl mx-auto terminal-font">
          [SYSTEM INITIALIZED] Web3 platform for environmental governance, AI-powered sustainability coaching, 
          and carbon impact tracking on the blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            onClick={onStartChat}
            className="pixel-button text-black px-10 py-6 text-lg font-bold"
          >
            <MessageCircle className="mr-3 h-6 w-6" />
            [INIT] AI COACH
          </Button>
          
          {onViewCarbon && (
            <Button
              onClick={onViewCarbon}
              className="bg-transparent border-2 border-green-400 readable-green hover:bg-green-400 hover:text-black px-10 py-6 text-lg font-bold terminal-font transition-all duration-300"
            >
              <BarChart3 className="mr-3 h-6 w-6" />
              [ACCESS] CARBON DATA
            </Button>
          )}
          
          {onViewVoting && (
            <Button
              onClick={onViewVoting}
              className="bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black px-10 py-6 text-lg font-bold terminal-font transition-all duration-300"
            >
              <Vote className="mr-3 h-6 w-6" />
              [ENTER] DAO SPACE
            </Button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="eco-card hover:scale-105 transition-transform cursor-pointer animate-float"
            onClick={onStartChat}
          >
            <CardContent className="p-6 text-center">
              <div className="pixel-border bg-black p-4 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 animate-pulse-glow">
                <Brain className="h-8 w-8 text-green-400 neon-glow-soft" />
              </div>
              <h3 className="readable-green terminal-font font-bold text-lg mb-2 neon-glow-soft">
                [AI_NEURAL_NET]
              </h3>
              <p className="readable-text terminal-font text-sm">
                Multi-personality AI ecosystem: Eco-coach, Crypto-analyst, and Punk-hacker AIs
              </p>
            </CardContent>
          </Card>

          <Card 
            className="eco-card hover:scale-105 transition-transform cursor-pointer animate-float"
            onClick={onViewCarbon}
            style={{ animationDelay: '0.5s' }}
          >
            <CardContent className="p-6 text-center">
              <div className="pixel-border bg-black p-4 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 animate-pulse-glow">
                <Leaf className="h-8 w-8 text-green-400 neon-glow-soft" />
              </div>
              <h3 className="readable-green terminal-font font-bold text-lg mb-2 neon-glow-soft">
                [CARBON_TRACKER]
              </h3>
              <p className="readable-text terminal-font text-sm">
                Real-time carbon emissions data from OKX DEX API with environmental impact scores
              </p>
            </CardContent>
          </Card>

          <Card 
            className="eco-card hover:scale-105 transition-transform cursor-pointer animate-float"
            onClick={onViewTrading}
            style={{ animationDelay: '1s' }}
          >
            <CardContent className="p-6 text-center">
              <div className="pixel-border bg-black p-4 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 animate-pulse-glow">
                <TrendingUp className="h-8 w-8 text-green-400 neon-glow-soft" />
              </div>
              <h3 className="readable-green terminal-font font-bold text-lg mb-2 neon-glow-soft">
                [ECO_TRADING_HUB]
              </h3>
              <p className="readable-text terminal-font text-sm">
                AI-powered green crypto trading with Sensay intelligence and real-time market data
              </p>
            </CardContent>
          </Card>

          <Card 
            className="eco-card hover:scale-105 transition-transform cursor-pointer animate-float"
            onClick={onViewVoting}
            style={{ animationDelay: '1.5s' }}
          >
            <CardContent className="p-6 text-center">
              <div className="pixel-border bg-black p-4 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 animate-pulse-glow">
                <Vote className="h-8 w-8 text-green-400 neon-glow-soft" />
              </div>
              <h3 className="readable-green terminal-font font-bold text-lg mb-2 neon-glow-soft">
                [DAO_GOVERNANCE]
              </h3>
              <p className="readable-text terminal-font text-sm">
                Participate in environmental governance and shape the future of green crypto
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        <Card className="eco-card text-center animate-float" style={{animationDelay: '0.5s'}}>
          <CardHeader className="pb-4">
            <CardTitle className="terminal-font readable-green flex items-center justify-center">
              <Users className="mr-2 h-6 w-6" />
              NODES_ACTIVE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold readable-green neon-glow-soft terminal-font">2,547</div>
            <div className="readable-accent text-sm terminal-font">[+12% GROWTH]</div>
          </CardContent>
        </Card>

        <Card className="eco-card text-center animate-float" style={{animationDelay: '1s'}}>
          <CardHeader className="pb-4">
            <CardTitle className="terminal-font text-blue-400 flex items-center justify-center">
              <Coins className="mr-2 h-6 w-6" />
              GREEN_TOKENS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-400 neon-glow-soft terminal-font">15.2K</div>
            <div className="text-blue-300 text-sm terminal-font">[DISTRIBUTED]</div>
          </CardContent>
        </Card>

        <Card className="eco-card text-center animate-float" style={{animationDelay: '1.5s'}}>
          <CardHeader className="pb-4">
            <CardTitle className="terminal-font text-purple-400 flex items-center justify-center">
              <Vote className="mr-2 h-6 w-6" />
              PROPOSALS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-400 neon-glow-soft terminal-font">523</div>
            <div className="text-purple-300 text-sm terminal-font">[3 ACTIVE]</div>
          </CardContent>
        </Card>

        <Card className="eco-card text-center animate-float" style={{animationDelay: '2s'}}>
          <CardHeader className="pb-4">
            <CardTitle className="terminal-font text-orange-400 flex items-center justify-center">
              <Globe className="mr-2 h-6 w-6" />
              CO₂_OFFSET
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-400 neon-glow-soft terminal-font">89.4T</div>
            <div className="text-orange-300 text-sm terminal-font">[NETWORK IMPACT]</div>
          </CardContent>
        </Card>
      </div>

      {/* Core Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <Card className="eco-card hover:scale-105 transition-all duration-300 cursor-pointer" onClick={onStartChat}>
          <CardHeader>
            <div className="pixel-border bg-black p-4 rounded-lg mb-4 w-fit animate-pulse-glow">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="terminal-font readable-green text-xl">[MODULE] AI ECO-COACH</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="readable-text mb-6 terminal-font">
              Neural network-powered sustainability advisor. Real-time environmental impact analysis 
              and personalized optimization protocols.
            </CardDescription>
            <Button className="w-full bg-transparent border border-green-400 readable-green hover:bg-green-400 hover:text-black terminal-font">
              [EXECUTE] COACHING.EXE
            </Button>
          </CardContent>
        </Card>

        <Card className="eco-card hover:scale-105 transition-all duration-300 cursor-pointer" onClick={onViewCarbon}>
          <CardHeader>
            <div className="pixel-border bg-black p-4 rounded-lg mb-4 w-fit animate-pulse-glow">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <CardTitle className="terminal-font text-blue-400 text-xl">[MODULE] CARBON MATRIX</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="readable-text mb-6 terminal-font">
              Blockchain-verified carbon footprint tracking system. Real-time emissions monitoring 
              with immutable ledger verification.
            </CardDescription>
            <Button className="w-full bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black terminal-font">
              [ACCESS] ANALYTICS.SYS
            </Button>
          </CardContent>
        </Card>

        <Card className="eco-card hover:scale-105 transition-all duration-300 cursor-pointer" onClick={onViewVoting}>
          <CardHeader>
            <div className="pixel-border bg-black p-4 rounded-lg mb-4 w-fit animate-pulse-glow">
              <Vote className="h-8 w-8 text-purple-400" />
            </div>
            <CardTitle className="terminal-font text-purple-400 text-xl">[MODULE] DAO CONSENSUS</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="readable-text mb-6 terminal-font">
              Decentralized governance protocol for environmental initiatives. 
              Cryptographic voting with weighted token distribution.
            </CardDescription>
            <Button className="w-full bg-transparent border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black terminal-font">
              [ENTER] GOVERNANCE.DAO
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Web3 Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center terminal-font text-purple-400 text-xl">
              <Shield className="mr-3 h-8 w-8" />
              [SECURITY] PHANTOM PROTOCOL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="readable-text mb-6 terminal-font">
              Military-grade cryptographic wallet integration on Solana network. 
              Zero-knowledge proof governance participation with immutable smart contracts.
            </CardDescription>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/50 p-3 rounded border border-purple-400">
                <span className="text-purple-400 terminal-font">NETWORK:</span>
                <div className="readable-text terminal-font">SOLANA_MAINNET</div>
              </div>
              <div className="bg-black/50 p-3 rounded border border-purple-400">
                <span className="text-purple-400 terminal-font">SECURITY:</span>
                <div className="readable-text terminal-font">QUANTUM_RESISTANT</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center terminal-font text-orange-400 text-xl">
              <Zap className="mr-3 h-8 w-8" />
              [CONTRACTS] SMART_CHAIN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="readable-text mb-6 terminal-font">
              Autonomous smart contract ecosystem for carbon credit verification, 
              reward distribution, and decentralized environmental impact tracking.
            </CardDescription>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/50 p-3 rounded border border-orange-400">
                <span className="text-orange-400 terminal-font">GAS_FEES:</span>
                <div className="readable-text terminal-font">ULTRA_LOW</div>
              </div>
              <div className="bg-black/50 p-3 rounded border border-orange-400">
                <span className="text-orange-400 terminal-font">SPEED:</span>
                <div className="readable-text terminal-font">400MS_TXN</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
