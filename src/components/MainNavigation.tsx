
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MessageCircle, BarChart3, Vote, Wallet, Menu, X, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MainNavigationProps {
  currentView: 'welcome' | 'chat' | 'carbon' | 'voting';
  onViewChange: (view: 'welcome' | 'chat' | 'carbon' | 'voting') => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ currentView, onViewChange }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [greenTokens, setGreenTokens] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
      try {
        const response = await (window as any).solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setIsWalletConnected(true);
          setWalletAddress(response.publicKey.toString());
          await fetchWalletData(response.publicKey.toString());
        }
      } catch (error) {
        console.log('Wallet not auto-connected');
      }
    }
  };

  const fetchWalletData = async (address: string) => {
    try {
      // Mock fetching SOL balance and GREEN tokens
      setWalletBalance(2.35); // Mock SOL balance
      setGreenTokens(150); // Mock GREEN token balance
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const connectPhantomWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        const response = await (window as any).solana.connect();
        setIsWalletConnected(true);
        setWalletAddress(response.publicKey.toString());
        await fetchWalletData(response.publicKey.toString());
        
        toast({
          title: "Wallet Connected!",
          description: "Successfully connected to Phantom wallet",
        });
      } else {
        // Fallback for testing or redirect to Phantom
        if (typeof window !== 'undefined') {
          window.open('https://phantom.app/', '_blank');
        }
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom wallet to continue",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Phantom wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        await (window as any).solana.disconnect();
      }
      setIsWalletConnected(false);
      setWalletAddress('');
      setWalletBalance(0);
      setGreenTokens(0);
      
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Phantom wallet",
      });
    } catch (error) {
      console.error('Wallet disconnect error:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const viewOnExplorer = () => {
    window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank');
  };

  const navigationItems = [
    { id: 'welcome', label: 'Home', icon: Leaf, color: 'text-green-600' },
    { id: 'chat', label: 'AI Coach', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'carbon', label: 'Carbon Tracker', icon: BarChart3, color: 'text-orange-600' },
    { id: 'voting', label: 'DAO Voting', icon: Vote, color: 'text-purple-600' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-green-800 text-sm">GreenDAO</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isWalletConnected ? (
            <div className="flex items-center space-x-1">
              <div className="text-xs text-green-600 font-medium">
                {greenTokens} GREEN
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ) : (
            <Button
              onClick={connectPhantomWallet}
              disabled={isConnecting}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
            >
              <Wallet className="h-3 w-3 mr-1" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  onViewChange(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`justify-start text-xs ${currentView === item.id ? 'bg-green-600 text-white' : 'hover:bg-green-50'}`}
              >
                <item.icon className={`h-3 w-3 mr-2 ${currentView === item.id ? 'text-white' : item.color}`} />
                {item.label}
              </Button>
            ))}
          </div>
          
          {isWalletConnected && (
            <Card className="p-3 bg-green-50 border-green-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-800">Wallet Connected</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={copyAddress}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={viewOnExplorer}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={disconnectWallet}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <LogOut className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-green-600">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{walletBalance} SOL</span>
                  <span className="text-green-600 font-medium">{greenTokens} GREEN</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-72 bg-white border-r border-gray-200 flex-col shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-800">GreenDAO</h1>
              <p className="text-sm text-gray-500">Web3 Eco-Governance</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              onClick={() => onViewChange(item.id as any)}
              className={`w-full justify-start h-12 ${
                currentView === item.id 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'hover:bg-green-50 text-gray-700'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${currentView === item.id ? 'text-white' : item.color}`} />
              {item.label}
              {item.id === 'voting' && (
                <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
                  3
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Enhanced Wallet Section */}
        <div className="p-4 border-t border-gray-200">
          {isWalletConnected ? (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Phantom Wallet</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        onClick={copyAddress}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-green-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={viewOnExplorer}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-green-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-medium text-gray-800">{walletBalance} SOL</div>
                      <div className="text-gray-500">Balance</div>
                    </div>
                    <div className="bg-white rounded p-2 text-center">
                      <div className="font-medium text-green-600">{greenTokens} GREEN</div>
                      <div className="text-gray-500">Tokens</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={disconnectWallet}
                  variant="outline" 
                  size="sm" 
                  className="w-full border-green-300 text-green-700 hover:bg-green-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={connectPhantomWallet}
                disabled={isConnecting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Phantom'}
              </Button>
              <div className="text-xs text-gray-500 text-center">
                Connect your Phantom wallet to participate in DAO governance and earn GREEN tokens
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
