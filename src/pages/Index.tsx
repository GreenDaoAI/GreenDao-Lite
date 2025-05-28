
import React, { useState } from 'react';
import { TopNavigation } from '../components/TopNavigation';
import { DashboardLayout } from '../components/DashboardLayout';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { ChatInterface } from '../components/ChatInterface';
import { CarbonTracker } from '../components/CarbonTracker';
import { EcoTradingHub } from '../components/EcoTradingHub';
import { VotingSystem } from '../components/VotingSystem';

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'chat' | 'carbon' | 'trading' | 'voting'>('welcome');

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onStartChat={() => setCurrentView('chat')}
            onViewCarbon={() => setCurrentView('carbon')}
            onViewTrading={() => setCurrentView('trading')}
            onViewVoting={() => setCurrentView('voting')}
          />
        );
      case 'chat':
        return <ChatInterface onBackToWelcome={() => setCurrentView('welcome')} />;
      case 'carbon':
        return <CarbonTracker />;
      case 'trading':
        return <EcoTradingHub />;
      case 'voting':
        return <VotingSystem />;
      default:
        return (
          <WelcomeScreen 
            onStartChat={() => setCurrentView('chat')}
            onViewCarbon={() => setCurrentView('carbon')}
            onViewTrading={() => setCurrentView('trading')}
            onViewVoting={() => setCurrentView('voting')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen matrix-bg scanlines">
      <TopNavigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'chat' ? (
        <div className="h-[calc(100vh-73px)]">
          {renderContent()}
        </div>
      ) : (
        <DashboardLayout>
          {renderContent()}
        </DashboardLayout>
      )}
    </div>
  );
};

export default Index;
