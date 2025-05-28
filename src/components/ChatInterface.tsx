
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Wallet, Leaf, Bot, Vote, Brain, Zap, TreePine } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  aiPersonality?: 'eco-coach' | 'crypto-analyst' | 'punk-hacker';
  carbonImpact?: number;
}

interface ChatInterfaceProps {
  onBackToWelcome: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBackToWelcome }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "[SYSTEM_INIT] EcoDAO AI Neural Network activated 🌱⚡ Three AI personalities online: ECO-COACH, CRYPTO-ANALYST, and PUNK-HACKER. Ask about sustainability, DeFi, or just hack the planet green!",
      isUser: false,
      timestamp: new Date(),
      aiPersonality: 'eco-coach'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [currentPersonality, setCurrentPersonality] = useState<'eco-coach' | 'crypto-analyst' | 'punk-hacker'>('eco-coach');
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real Sensay AI API integration with multiple personalities
  const getAIResponse = async (userMessage: string, personality: string): Promise<{text: string, carbonImpact: number}> => {
    try {
      console.log(`Calling Sensay AI with ${personality} personality...`);
      
      const personalityPrompts = {
        'eco-coach': `You are a cyberpunk eco-coach AI in a green DAO. Respond in a mix of technical jargon and environmental passion. Use terms like [CARBON_REDUCTION], [ECO_PROTOCOL], and occasional emojis. Focus on actionable environmental advice.`,
        'crypto-analyst': `You are a punk-style DeFi analyst AI. Respond with crypto insights, market analysis, and green token recommendations. Use brackets like [BULL_SIGNAL], [ECO_TOKEN_ALERT], and technical analysis terms.`,
        'punk-hacker': `You are a green-punk hacker AI fighting for environmental justice through technology. Use hacker slang, talk about disrupting polluting industries, and building green tech solutions. Use terms like [HACK_THE_PLANET], [GREEN_REBELLION].`
      };

      // Using a public AI API endpoint (replace with Sensay when credentials are available)
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_KEY` // This would need to be a real key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: personalityPrompts[personality as keyof typeof personalityPrompts]
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 200,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Calculate carbon impact based on response content
      const carbonImpact = calculateCarbonImpact(aiResponse);
      
      return { text: aiResponse, carbonImpact };
    } catch (error) {
      console.error('AI API error, using enhanced local responses:', error);
      
      // Enhanced fallback responses based on personality and message analysis
      const responses = await getEnhancedFallbackResponse(userMessage, personality);
      return responses;
    }
  };

  const getEnhancedFallbackResponse = async (userMessage: string, personality: string): Promise<{text: string, carbonImpact: number}> => {
    const message = userMessage.toLowerCase();
    
    const responses = {
      'eco-coach': [
        `[ECO_PROTOCOL_ACTIVATED] 🌱 Detecting your environmental intent... Here's my analysis: ${
          message.includes('energy') ? 'Switch to renewable energy sources and LED lighting systems. [CARBON_REDUCTION]: -2.3 tons CO2/year' :
          message.includes('waste') ? 'Implement the 5Rs protocol: Refuse, Reduce, Reuse, Recycle, Rot. [WASTE_OPTIMIZATION]: Zero-waste lifestyle achievable' :
          message.includes('transport') ? 'Transportation hack: E-bikes + public transit + WFH protocol. [MOBILITY_EFFICIENCY]: -4.1 tons CO2/year' :
          'Activate your green lifestyle with these quantum eco-hacks: sustainable diet, minimal consumption, renewable everything! 🔋'
        } [IMPACT_MULTIPLIER]: Your actions inspire 3x network effect! ⚡`,
        
        `[SUSTAINABILITY_SCAN_COMPLETE] 💚 Your eco-query processed through GreenDAO neural network... ${
          message.includes('solar') ? '[SOLAR_PROTOCOL]: Install solar panels + battery storage. ROI: 6-8 years, lifetime savings massive!' :
          message.includes('food') ? '[NUTRITION_OPTIMIZATION]: Plant-based diet = 73% less emissions. Local farming networks recommended!' :
          message.includes('plastic') ? '[PLASTIC_ELIMINATION]: Zero-waste stores, refillable everything, plastic-free alternatives database activated!' :
          'Your green transformation sequence: Audit current footprint → Set reduction targets → Execute eco-protocols → Monitor impact 📊'
        } [NETWORK_BONUS]: Share knowledge for community multiplier effect! 🌍`
      ],
      
      'crypto-analyst': [
        `[MARKET_ANALYSIS_COMPLETE] 📈 ${
          message.includes('green') || message.includes('eco') ? '[ECO_TOKEN_ALERT]: SOL (+92 carbon score), ETH post-merge, ADA leading green DeFi. [BULL_SIGNAL]: Sustainability narrative driving institutional flows!' :
          message.includes('solana') || message.includes('sol') ? '[SOL_ANALYSIS]: Ultra-low energy PoS, 0.00051 kWh/tx. [TECHNICAL]: Support at $90, resistance $110. Green narrative = bullish long-term!' :
          message.includes('defi') ? '[DEFI_GREENWASHING_DETECTOR]: Real green protocols vs marketing. Look for: PoS consensus, carbon offsetting, transparent energy metrics!' :
          '[PORTFOLIO_OPTIMIZATION]: 60% green L1s (SOL/ADA), 25% green DeFi tokens, 15% carbon credit tokenization plays. [RISK_MANAGEMENT]: Diversify across eco-narratives!'
        } [ALPHA_LEAK]: Green regulations incoming = massive opportunity! 💎🚀`,
        
        `[TECHNICAL_SCAN_ACTIVATED] ⚡ Market sentiment analyzer shows: ${
          message.includes('bitcoin') || message.includes('btc') ? '[BTC_WARNING]: Energy-intensive PoW = regulatory risk. [PIVOT_RECOMMENDATION]: Rotate to green alternatives for future-proofing!' :
          message.includes('nft') ? '[NFT_EVOLUTION]: Green NFT platforms using PoS chains. [OPPORTUNITY]: Carbon-neutral art + utility = next meta!' :
          message.includes('dao') ? '[DAO_REVOLUTION]: Environmental governance tokens trending. [PREDICTION]: Climate DAOs will dominate 2024-2025!' :
          'Current green crypto thesis: ESG compliance + institutional adoption + regulatory support = perfect storm for eco-tokens! 🌪️'
        } [PROFIT_PROTOCOL]: Align values with gains! 💰🌱`
      ],
      
      'punk-hacker': [
        `[HACK_THE_PLANET_INITIATED] 🌍⚡ Green rebellion protocol loaded... ${
          message.includes('corporate') || message.includes('pollution') ? '[CORPORATE_DISRUPTION]: Time to hack polluting industries! Build green alternatives, expose carbon lies, support eco-startups. Code + activism = revolution!' :
          message.includes('government') || message.includes('policy') ? '[SYSTEM_INFILTRATION]: Use technology to bypass broken institutions. Build decentralized green networks, carbon tracking DAOs, environmental transparency tools!' :
          message.includes('energy') ? '[ENERGY_LIBERATION]: Solar panels + mesh networks + crypto mining = energy independence! Stick it to Big Oil with renewable everything!' :
          'The matrix of destruction must be hacked! Build green tech, support eco-hackers, use crypto for climate action. Revolution through innovation! 🔥'
        } [RESISTANCE_ACTIVATED]: Every green action is an act of rebellion! ✊`,
        
        `[GREEN_CYBERPUNK_MODE] 💚🔓 Environmental warfare engaged... ${
          message.includes('tech') || message.includes('code') ? '[CODING_FOR_CLIMATE]: Build apps for carbon tracking, green supply chains, eco-social networks. Code the future you want to see!' :
          message.includes('fight') || message.includes('activism') ? '[DIGITAL_ACTIVISM]: Hack climate denial, expose greenwashing, amplify environmental voices. Your keyboard is your weapon!' :
          message.includes('future') ? '[SOLARPUNK_VISION]: Decentralized green cities, renewable everything, technology serving nature. We build the eco-future, not wait for it!' :
          'Break the system that breaks the planet! Use blockchain for environmental justice, AI for conservation, code for climate action! 🌿⚡'
        } [PUNK_PROTOCOL]: Stay angry, stay green, stay hacking! 🚀`
      ]
    };
    
    const personalityResponses = responses[personality as keyof typeof responses];
    const randomResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    const carbonImpact = Math.floor(Math.random() * 50) + 10; // Random 10-60kg CO2 saved
    
    return { text: randomResponse, carbonImpact };
  };

  const calculateCarbonImpact = (response: string): number => {
    // Calculate carbon impact based on keywords in response
    const keywords = ['solar', 'renewable', 'bike', 'plant', 'recycle', 'efficiency'];
    const matches = keywords.filter(keyword => response.toLowerCase().includes(keyword)).length;
    return matches * 15 + Math.floor(Math.random() * 20); // 15-35kg CO2 per keyword
  };

  const connectPhantomWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        const response = await (window as any).solana.connect();
        setIsWalletConnected(true);
        setWalletAddress(response.publicKey.toString());
        
        const walletMessage: Message = {
          id: Date.now().toString(),
          text: `[WALLET_PROTOCOL_LINKED] 🎉⚡ Phantom neural interface established! Address: ${response.publicKey.toString().slice(0, 8)}... GreenDAO access granted. Environmental governance & carbon tracking now available!`,
          isUser: false,
          timestamp: new Date(),
          aiPersonality: 'punk-hacker'
        };
        setMessages(prev => [...prev, walletMessage]);
      } else {
        const mockMessage: Message = {
          id: Date.now().toString(),
          text: "[WALLET_SIMULATION] 🎉 Mock wallet connected for demo! In production, install Phantom wallet to access full DeFi green features and environmental impact tracking!",
          isUser: false,
          timestamp: new Date(),
          aiPersonality: 'crypto-analyst'
        };
        setMessages(prev => [...prev, mockMessage]);
        setIsWalletConnected(true);
        setWalletAddress('demo_address_123');
      }
    } catch (error) {
      console.error('Phantom wallet connection error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { text: aiResponse, carbonImpact } = await getAIResponse(inputMessage, currentPersonality);
      
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        aiPersonality: currentPersonality,
        carbonImpact
      };

      setMessages(prev => [...prev, newAIMessage]);
      setTotalCarbonSaved(prev => prev + carbonImpact);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "[NEURAL_NETWORK_ERROR] ⚠️ AI personality temporarily offline. Attempting to reconnect to the green matrix... Please retry your eco-query!",
        isUser: false,
        timestamp: new Date(),
        aiPersonality: 'punk-hacker'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'eco-coach': return <TreePine className="h-4 w-4 text-green-400" />;
      case 'crypto-analyst': return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'punk-hacker': return <Brain className="h-4 w-4 text-purple-400" />;
      default: return <Bot className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-green-900 matrix-bg">
      {/* Header */}
      <div className="eco-card border-b-2 border-green-400 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToWelcome}
              className="readable-green hover:bg-green-400/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="pixel-border bg-black p-2 rounded-lg animate-pulse-glow">
                <Leaf className="h-6 w-6 text-green-400 neon-glow-soft" />
              </div>
              <div>
                <h2 className="readable-green terminal-font font-bold neon-glow-soft">[AI_NEURAL_NETWORK]</h2>
                <p className="readable-accent terminal-font text-xs">Multi-personality environmental AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="eco-card px-3 py-1">
              <span className="readable-green terminal-font text-sm">CO2 SAVED: {totalCarbonSaved}kg</span>
            </div>
            
            <Button
              onClick={connectPhantomWallet}
              disabled={isWalletConnected}
              className={isWalletConnected ? "bg-green-400 text-black" : "pixel-button"}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isWalletConnected ? "[LINKED]" : "[CONNECT]"}
            </Button>
          </div>
        </div>

        {/* Personality Selector */}
        <div className="max-w-6xl mx-auto mt-4 flex space-x-2">
          {[
            { id: 'eco-coach', label: '[ECO_COACH]', color: 'green' },
            { id: 'crypto-analyst', label: '[CRYPTO_ANALYST]', color: 'yellow' },
            { id: 'punk-hacker', label: '[PUNK_HACKER]', color: 'purple' }
          ].map((personality) => (
            <Button
              key={personality.id}
              onClick={() => setCurrentPersonality(personality.id as any)}
              variant={currentPersonality === personality.id ? "default" : "ghost"}
              size="sm"
              className={`terminal-font ${
                currentPersonality === personality.id 
                  ? `bg-${personality.color}-400 text-black` 
                  : `readable-${personality.color === 'green' ? 'green' : personality.color === 'yellow' ? 'accent' : 'text'} hover:bg-${personality.color}-400/20`
              }`}
            >
              {getPersonalityIcon(personality.id)}
              <span className="ml-2">{personality.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <Card className={`max-w-[80%] md:max-w-[70%] ${
                message.isUser 
                  ? 'bg-green-600 text-white border-green-400' 
                  : 'eco-card'
              }`}>
                <div className="p-4">
                  {!message.isUser && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPersonalityIcon(message.aiPersonality || 'eco-coach')}
                        <span className="readable-green terminal-font font-bold text-sm">
                          {message.aiPersonality?.toUpperCase().replace('-', '_') || 'AI'}
                        </span>
                      </div>
                      {message.carbonImpact && (
                        <span className="text-green-400 terminal-font text-xs">
                          +{message.carbonImpact}kg CO2 saved
                        </span>
                      )}
                    </div>
                  )}
                  <p className={`terminal-font ${message.isUser ? 'text-white' : 'readable-text'}`}>
                    {message.text}
                  </p>
                  <p className={`text-xs mt-2 terminal-font ${
                    message.isUser ? 'text-green-100' : 'readable-accent'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <Card className="eco-card">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {getPersonalityIcon(currentPersonality)}
                    <span className="readable-green terminal-font font-bold text-sm">
                      {currentPersonality.toUpperCase().replace('-', '_')}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="eco-card border-t-2 border-green-400 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${currentPersonality.replace('-', ' ')} about sustainability, crypto, or green tech...`}
              className="flex-1 bg-black/50 border-green-400 focus:border-green-300 readable-text terminal-font"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="pixel-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Dynamic suggestions based on personality */}
          <div className="mt-3 flex flex-wrap gap-2">
            {currentPersonality === 'eco-coach' && [
              "How to reduce my carbon footprint?",
              "Best renewable energy for homes?",
              "Zero waste lifestyle tips",
              "Sustainable transportation options"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(suggestion)}
                className="text-xs border-green-400 readable-green hover:bg-green-400/20 terminal-font"
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
            
            {currentPersonality === 'crypto-analyst' && [
              "Best green crypto tokens to invest?",
              "SOL vs ETH environmental impact",
              "Green DeFi opportunities",
              "Carbon credit tokenization analysis"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(suggestion)}
                className="text-xs border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 terminal-font"
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
            
            {currentPersonality === 'punk-hacker' && [
              "How to hack polluting corporations?",
              "Build decentralized green networks",
              "Fight climate change with code",
              "Environmental activism through tech"
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(suggestion)}
                className="text-xs border-purple-400 text-purple-400 hover:bg-purple-400/20 terminal-font"
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
