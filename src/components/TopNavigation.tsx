import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Wallet, Menu, X, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from './ThemeToggle';

interface TopNavigationProps {
  currentView: 'welcome' | 'chat' | 'carbon' | 'trading' | 'voting';
  onViewChange: (view: 'welcome' | 'chat' | 'carbon' | 'trading' | 'voting') => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ currentView, onViewChange }) => {
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
      setWalletBalance(2.35);
      setGreenTokens(150);
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
          title: "[CONNECTION] ESTABLISHED",
          description: "Phantom wallet linked to DAO network",
        });
      } else {
        if (typeof window !== 'undefined') {
          window.open('https://phantom.app/', '_blank');
        }
        toast({
          title: "[ERROR] PHANTOM REQUIRED",
          description: "Install Phantom wallet to access protocol",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Phantom wallet connection error:', error);
      toast({
        title: "[CONNECTION] FAILED",
        description: "Unable to establish wallet link",
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
        title: "[DISCONNECTION] COMPLETE",
        description: "Wallet link terminated",
      });
    } catch (error) {
      console.error('Wallet disconnect error:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "[ADDRESS] COPIED",
      description: "Wallet address stored in clipboard",
    });
  };

  const navigationItems = [
    { id: 'welcome', label: '[DASH]' },
    { id: 'chat', label: '[AI]' },
    { id: 'carbon', label: '[CARBON]' },
    { id: 'trading', label: '[TRADE]' },
    { id: 'voting', label: '[DAO]' },
  ];

  return (
    <nav className="bg-black/90 border-b-2 border-green-400 px-4 lg:px-6 py-4 backdrop-blur-md sticky top-0 z-50 scanlines">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="pixel-border bg-black p-2 rounded-lg animate-pulse-glow">
            <Leaf className="h-8 w-8 theme-text-accent theme-glow" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold theme-text-accent terminal-font">GreenDAO</h1>
            <p className="text-xs theme-text-secondary terminal-font">[ECO_PROTOCOL_v2.1]</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id as any)}
              className={`px-6 py-3 terminal-font font-bold transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-green-400 text-black border-2 border-green-400' 
                  : 'theme-text-primary border-2 border-transparent hover:border-green-400 hover:bg-green-400/10'
              }`}
            >
              {item.label}
              {item.id === 'voting' && (
                <Badge className="ml-2 bg-purple-400 text-black terminal-font text-xs">
                  3
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Theme Toggle & Wallet & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wallet Section */}
          {isWalletConnected ? (
            <div className="hidden sm:flex items-center space-x-4 eco-card px-4 py-2">
              <div className="text-sm terminal-font">
                <div className="theme-text-accent font-bold">{greenTokens} GREEN</div>
                <div className="theme-text-primary text-xs">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={copyAddress}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 theme-text-accent hover:bg-green-400/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={disconnectWallet}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/20"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={connectPhantomWallet}
              disabled={isConnecting}
              className="pixel-button text-black terminal-font"
            >
              <Wallet className="h-5 w-5 mr-2" />
              {isConnecting ? '[LINKING...]' : '[CONNECT]'}
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden theme-text-primary hover:bg-green-400/20"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t-2 border-green-400">
          <div className="space-y-3">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  onViewChange(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full justify-start terminal-font font-bold ${
                  currentView === item.id 
                    ? 'bg-green-400 text-black' 
                    : 'theme-text-primary hover:bg-green-400/20'
                }`}
              >
                {item.label}
                {item.id === 'voting' && (
                  <Badge className="ml-auto bg-purple-400 text-black terminal-font text-xs">
                    3
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Mobile Wallet Info */}
          {isWalletConnected && (
            <div className="mt-4 pt-4 border-t border-green-400">
              <div className="eco-card p-4">
                <div className="flex items-center justify-between">
                  <div className="terminal-font">
                    <div className="theme-text-accent font-bold">{greenTokens} GREEN</div>
                    <div className="theme-text-primary text-sm">
                      {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                    </div>
                    <div className="theme-text-secondary text-xs">{walletBalance} SOL</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyAddress}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 theme-text-accent"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={disconnectWallet}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
