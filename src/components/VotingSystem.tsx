import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, Users, Clock, CheckCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VotingIssue {
  id: string;
  title: string;
  description: string;
  category: 'policy' | 'community' | 'technology';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  deadline: Date;
  userVoted: boolean;
  userVote?: 'for' | 'against';
  onChain: boolean;
  transactionId?: string;
}

export const VotingSystem: React.FC = () => {
  const { toast } = useToast();
  const [votingIssues, setVotingIssues] = useState<VotingIssue[]>([
    {
      id: '1',
      title: 'Ban Single-Use Plastics in Local Restaurants',
      description: 'Implement a city-wide ban on single-use plastic containers, utensils, and straws in all restaurants and food establishments.',
      category: 'policy',
      votesFor: 1247,
      votesAgainst: 453,
      totalVotes: 1700,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userVoted: false,
      onChain: true,
      transactionId: 'mock-tx-1'
    },
    {
      id: '2',
      title: 'Community Solar Panel Installation',
      description: 'Fund solar panel installations on community buildings using DAO treasury funds to reduce collective carbon footprint.',
      category: 'community',
      votesFor: 892,
      votesAgainst: 234,
      totalVotes: 1126,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      userVoted: true,
      userVote: 'for',
      onChain: true,
      transactionId: 'mock-tx-2'
    }
  ]);

  // Solana smart contract interaction for creating votes
  const createVoteOnChain = async (title: string, description: string, category: string) => {
    try {
      // Check if Phantom wallet is connected
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        const wallet = (window as any).solana;
        
        // Mock smart contract call - in reality, this would interact with a Solana program
        console.log('Creating vote on Solana blockchain...');
        console.log('Vote details:', { title, description, category });
        
        // Simulate transaction
        const mockTransaction = {
          id: `tx-${Date.now()}`,
          success: true
        };
        
        const newVote: VotingIssue = {
          id: Date.now().toString(),
          title,
          description,
          category: category as 'policy' | 'community' | 'technology',
          votesFor: 0,
          votesAgainst: 0,
          totalVotes: 0,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          userVoted: false,
          onChain: true,
          transactionId: mockTransaction.id
        };

        setVotingIssues(prev => [newVote, ...prev]);
        
        toast({
          title: "Vote Created On-Chain!",
          description: `Your environmental vote "${title}" has been created on Solana blockchain.`,
        });
        
        return mockTransaction.id;
      } else {
        throw new Error('Phantom wallet not connected');
      }
    } catch (error) {
      console.error('Error creating vote on chain:', error);
      toast({
        title: "Error",
        description: "Failed to create vote on blockchain. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Submit vote to Solana smart contract
  const submitVoteOnChain = async (issueId: string, vote: 'for' | 'against') => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        console.log('Submitting vote to Solana smart contract...');
        console.log('Vote details:', { issueId, vote });
        
        // Mock smart contract interaction
        const mockTx = `vote-tx-${Date.now()}`;
        
        setVotingIssues(prev => prev.map(issue => {
          if (issue.id === issueId && !issue.userVoted) {
            const newVotesFor = vote === 'for' ? issue.votesFor + 1 : issue.votesFor;
            const newVotesAgainst = vote === 'against' ? issue.votesAgainst + 1 : issue.votesAgainst;
            
            return {
              ...issue,
              votesFor: newVotesFor,
              votesAgainst: newVotesAgainst,
              totalVotes: issue.totalVotes + 1,
              userVoted: true,
              userVote: vote
            };
          }
          return issue;
        }));

        toast({
          title: "Vote Recorded On-Chain!",
          description: `Your vote ${vote === 'for' ? 'in favor' : 'against'} has been recorded on Solana blockchain.`,
        });
      } else {
        throw new Error('Phantom wallet not connected');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote to blockchain. Please connect Phantom wallet.",
        variant: "destructive"
      });
    }
  };

  const handleVote = (issueId: string, vote: 'for' | 'against') => {
    submitVoteOnChain(issueId, vote);
  };

  const handleCreateVote = () => {
    // Example of creating a new vote
    createVoteOnChain(
      'Carbon Tax Implementation for Industries',
      'Support legislation requiring carbon taxes on high-emission industries to fund renewable energy projects.',
      'policy'
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy':
        return 'bg-blue-100 text-blue-800';
      case 'community':
        return 'bg-green-100 text-green-800';
      case 'technology':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-green-600" />
            <span>Environmental Governance</span>
          </div>
          <Button
            onClick={handleCreateVote}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Vote
          </Button>
        </CardTitle>
        <CardDescription>
          Vote on environmental initiatives and policy proposals on Solana blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {votingIssues.map((issue) => {
            const forPercentage = Math.round((issue.votesFor / issue.totalVotes) * 100) || 0;
            const againstPercentage = Math.round((issue.votesAgainst / issue.totalVotes) * 100) || 0;
            
            return (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                      {issue.userVoted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {issue.onChain && (
                        <Badge variant="outline" className="text-purple-700 border-purple-200">
                          On-Chain
                        </Badge>
                      )}
                    </div>
                    <Badge className={getCategoryColor(issue.category)}>
                      {issue.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeRemaining(issue.deadline)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">{issue.description}</p>
                
                {issue.totalVotes > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-green-600">For: {forPercentage}%</span>
                      <span className="text-red-600">Against: {againstPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${forPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{issue.totalVotes.toLocaleString()} votes</span>
                    {issue.transactionId && (
                      <span className="text-xs text-purple-600">
                        • TX: {issue.transactionId.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                  
                  {!issue.userVoted ? (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleVote(issue.id, 'for')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Vote For
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVote(issue.id, 'against')}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Vote Against
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="secondary">
                      Voted {issue.userVote === 'for' ? 'For' : 'Against'}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🗳️ How Solana Voting Works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Each vote is recorded on the Solana blockchain via smart contracts</li>
            <li>• Voting power is based on your eco-impact score and wallet holdings</li>
            <li>• Results are transparent and immutable on-chain</li>
            <li>• Active voters earn green governance tokens as rewards</li>
            <li>• Connect Phantom wallet to participate in governance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
