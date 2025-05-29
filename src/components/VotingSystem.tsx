import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vote, Users, Clock, CheckCircle, Plus, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { votingContract, VoteAccount } from '../contracts/VotingContract';
import { greenTokenContract } from '../contracts/GreenTokenContract';

interface VotingIssue extends VoteAccount {
  category: 'policy' | 'community' | 'technology';
  userVoted: boolean;
  userVote?: 'for' | 'against';
  onChain: boolean;
  transactionId?: string;
}

interface VoteFormData {
  title: string;
  description: string;
  category: 'policy' | 'community' | 'technology';
  durationDays: number;
}

export const VotingSystem: React.FC = () => {
  const { toast } = useToast();
  const [votingIssues, setVotingIssues] = useState<VotingIssue[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreatingVote, setIsCreatingVote] = useState(false);
  const [greenTokenBalance, setGreenTokenBalance] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<VoteFormData>({
    title: '',
    description: '',
    category: 'policy',
    durationDays: 30
  });

  useEffect(() => {
    checkWalletAndLoadData();
  }, []);

  const checkWalletAndLoadData = async () => {
    try {
      await votingContract.initializeWallet();
      setIsWalletConnected(true);
      
      const tokenData = await greenTokenContract.getGreenTokenBalance();
      setGreenTokenBalance(tokenData.balance);
      
      // Load existing proposals
      loadProposals();
    } catch (error) {
      console.log('Wallet not connected');
      setIsWalletConnected(false);
    }
  };

  const loadProposals = () => {
    // Mock proposals with blockchain integration markers
    setVotingIssues([
      {
        proposalId: '1',
        title: 'Ban Single-Use Plastics in Local Restaurants',
        description: 'Implement a city-wide ban on single-use plastic containers, utensils, and straws in all restaurants and food establishments.',
        category: 'policy',
        votesFor: 1247,
        votesAgainst: 453,
        deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
        userVoted: false,
        onChain: true,
        transactionId: 'real-solana-tx-1',
        isActive: true,
        creator: new (require('@solana/web3.js')).PublicKey('11111111111111111111111111111111')
      },
      {
        proposalId: '2',
        title: 'Community Solar Panel Installation',
        description: 'Fund solar panel installations on community buildings using DAO treasury funds to reduce collective carbon footprint.',
        category: 'community',
        votesFor: 892,
        votesAgainst: 234,
        deadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
        userVoted: true,
        userVote: 'for',
        onChain: true,
        transactionId: 'real-solana-tx-2',
        isActive: true,
        creator: new (require('@solana/web3.js')).PublicKey('11111111111111111111111111111111')
      }
    ]);
  };

  const createVoteOnChain = async (title: string, description: string, category: 'policy' | 'community' | 'technology', durationDays: number = 30) => {
    if (!isWalletConnected) {
      toast({
        title: "[WALLET_ERROR]",
        description: "Connect Phantom wallet to create proposals",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingVote(true);
    try {
      const signature = await votingContract.createProposal(title, description, durationDays);

      // Mint GREEN tokens as reward for creating proposal
      await greenTokenContract.mintGreenTokens(50, 'community_action');

      const newVote: VotingIssue = {
        proposalId: signature,
        title: title,
        description: description,
        category: category,
        votesFor: 0,
        votesAgainst: 0,
        deadline: Date.now() + durationDays * 24 * 60 * 60 * 1000,
        userVoted: false,
        onChain: true,
        transactionId: signature,
        isActive: true,
        creator: new (require('@solana/web3.js')).PublicKey('11111111111111111111111111111111')
      };

      setVotingIssues(prev => [newVote, ...prev]);
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        category: 'policy',
        durationDays: 30
      });
      setIsDialogOpen(false);
      
      toast({
        title: "[PROPOSAL_CREATED]",
        description: `Environmental proposal created on Solana blockchain. +50 GREEN tokens earned!`,
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "[BLOCKCHAIN_ERROR]",
        description: "Failed to create proposal on Solana. Check wallet connection.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingVote(false);
    }
  };

  const submitVoteOnChain = async (proposalId: string, vote: 'for' | 'against') => {
    if (!isWalletConnected) {
      toast({
        title: "[WALLET_ERROR]",
        description: "Connect Phantom wallet to vote",
        variant: "destructive"
      });
      return;
    }

    try {
      const signature = await votingContract.submitVote(proposalId, vote, greenTokenBalance);
      
      // Mint GREEN tokens as reward for voting
      await greenTokenContract.mintGreenTokens(10, 'community_action');

      setVotingIssues(prev => prev.map(issue => {
        if (issue.proposalId === proposalId && !issue.userVoted) {
          return {
            ...issue,
            votesFor: vote === 'for' ? issue.votesFor + 1 : issue.votesFor,
            votesAgainst: vote === 'against' ? issue.votesAgainst + 1 : issue.votesAgainst,
            userVoted: true,
            userVote: vote,
            transactionId: signature
          };
        }
        return issue;
      }));

      toast({
        title: "[VOTE_RECORDED]",
        description: `Vote ${vote === 'for' ? 'FOR' : 'AGAINST'} recorded on Solana blockchain. +10 GREEN tokens earned!`,
      });
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "[BLOCKCHAIN_ERROR]",
        description: "Failed to submit vote to Solana. Try again.",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "[FORM_ERROR]",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createVoteOnChain(
      formData.title,
      formData.description,
      formData.category,
      formData.durationDays
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

  const getTimeRemaining = (deadline: number) => {
    const now = Date.now();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <Card className="w-full eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-green-400 neon-glow-soft" />
            <span className="readable-green terminal-font">[SOLANA_DAO_GOVERNANCE]</span>
          </div>
          <div className="flex items-center space-x-4">
            {isWalletConnected && (
              <Badge className="readable-green bg-green-400/20 border-green-400 terminal-font">
                {greenTokenBalance} GREEN
              </Badge>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!isWalletConnected}
                  className="pixel-button terminal-font"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  [CREATE_VOTE]
                </Button>
              </DialogTrigger>
              <DialogContent className="eco-card border-green-400 max-w-md">
                <DialogHeader>
                  <DialogTitle className="readable-green terminal-font">[CREATE_PROPOSAL]</DialogTitle>
                  <DialogDescription className="readable-text terminal-font">
                    Create a new environmental governance proposal on Solana blockchain
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="readable-green terminal-font">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter proposal title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-gray-800 border-green-400/30 text-green-300 terminal-font"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="readable-green terminal-font">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your environmental proposal..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-800 border-green-400/30 text-green-300 terminal-font min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="readable-green terminal-font">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: 'policy' | 'community' | 'technology') => 
                        setFormData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-green-400/30 text-green-300 terminal-font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-green-400/30">
                        <SelectItem value="policy" className="text-green-300 terminal-font">POLICY</SelectItem>
                        <SelectItem value="community" className="text-green-300 terminal-font">COMMUNITY</SelectItem>
                        <SelectItem value="technology" className="text-green-300 terminal-font">TECHNOLOGY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration" className="readable-green terminal-font">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.durationDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 30 }))}
                      className="bg-gray-800 border-green-400/30 text-green-300 terminal-font"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={isCreatingVote}
                    className="pixel-button terminal-font w-full"
                  >
                    {isCreatingVote ? '[CREATING...]' : '[CREATE_ON_CHAIN]'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
        <CardDescription className="readable-accent terminal-font">
          {isWalletConnected 
            ? "Vote on environmental initiatives using Solana smart contracts"
            : "Connect Phantom wallet to participate in governance"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isWalletConnected ? (
          <div className="eco-card p-6 text-center border-yellow-400">
            <Wallet className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="readable-green terminal-font font-bold mb-2">[WALLET_REQUIRED]</h3>
            <p className="readable-text terminal-font mb-4">
              Connect your Phantom wallet to participate in DAO governance
            </p>
            <Button 
              onClick={checkWalletAndLoadData}
              className="pixel-button terminal-font"
            >
              [CONNECT_PHANTOM]
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {votingIssues.map((issue) => {
              const totalVotes = issue.votesFor + issue.votesAgainst;
              const forPercentage = totalVotes > 0 ? Math.round((issue.votesFor / totalVotes) * 100) : 0;
              const againstPercentage = totalVotes > 0 ? Math.round((issue.votesAgainst / totalVotes) * 100) : 0;
              
              return (
                <div key={issue.proposalId} className="eco-card p-4 border-green-400/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="readable-green font-bold terminal-font">{issue.title}</h3>
                        {issue.userVoted && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                        <Badge className="readable-green bg-green-400/20 border-green-400 terminal-font text-xs">
                          ON-CHAIN
                        </Badge>
                      </div>
                      <Badge className={`${getCategoryColor(issue.category)} terminal-font text-xs`}>
                        {issue.category.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm readable-accent">
                      <Clock className="h-4 w-4" />
                      <span className="terminal-font">{getTimeRemaining(issue.deadline)}</span>
                    </div>
                  </div>
                  
                  <p className="readable-text terminal-font text-sm mb-4">{issue.description}</p>
                  
                  {totalVotes > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="readable-green terminal-font">FOR: {forPercentage}%</span>
                        <span className="text-red-400 terminal-font">AGAINST: {againstPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${forPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm readable-accent terminal-font">
                      <Users className="h-4 w-4" />
                      <span>{totalVotes.toLocaleString()} votes</span>
                      {issue.transactionId && (
                        <span className="text-xs readable-green">
                          • TX: {issue.transactionId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                    
                    {!issue.userVoted ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => submitVoteOnChain(issue.proposalId, 'for')}
                          className="pixel-button-small terminal-font"
                        >
                          [FOR]
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => submitVoteOnChain(issue.proposalId, 'against')}
                          className="bg-red-400 hover:bg-red-500 text-black terminal-font"
                        >
                          [AGAINST]
                        </Button>
                      </div>
                    ) : (
                      <Badge className="readable-green bg-green-400/20 border-green-400 terminal-font">
                        VOTED_{issue.userVote?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 eco-card p-4 border-green-400">
          <h4 className="readable-green font-bold terminal-font mb-2 neon-glow-soft">🔗 [SOLANA_BLOCKCHAIN_INFO]</h4>
          <ul className="readable-text terminal-font text-sm space-y-1">
            <li>• Each vote recorded via Solana smart contracts</li>
            <li>• Voting power based on GREEN token holdings + eco-score</li>
            <li>• Transparent, immutable results on blockchain</li>
            <li>• Earn GREEN tokens for participation</li>
            <li>• Phantom wallet required for governance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
