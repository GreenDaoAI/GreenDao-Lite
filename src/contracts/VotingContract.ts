
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';

// Voting contract program ID (this would be deployed on Solana devnet/mainnet)
const VOTING_PROGRAM_ID = new PublicKey('VotE111111111111111111111111111111111111111');

export interface VoteAccount {
  proposalId: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: number;
  isActive: boolean;
  creator: PublicKey;
}

export class SolanaVotingContract {
  private connection: Connection;
  private wallet: any;

  constructor() {
    // Use Solana devnet for development
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  async initializeWallet() {
    if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
      this.wallet = (window as any).solana;
      await this.wallet.connect();
      return this.wallet.publicKey;
    }
    throw new Error('Phantom wallet not found');
  }

  async createProposal(title: string, description: string, durationDays: number = 30): Promise<string> {
    try {
      if (!this.wallet) await this.initializeWallet();

      const proposalId = web3.Keypair.generate().publicKey.toString();
      const deadline = Date.now() + (durationDays * 24 * 60 * 60 * 1000);

      // Create proposal account
      const proposalAccount = web3.Keypair.generate();
      
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: this.wallet.publicKey,
          newAccountPubkey: proposalAccount.publicKey,
          lamports: await this.connection.getMinimumBalanceForRentExemption(500),
          space: 500,
          programId: VOTING_PROGRAM_ID,
        })
      );

      // Sign and send transaction
      const signature = await this.wallet.signAndSendTransaction(transaction);
      await this.connection.confirmTransaction(signature);

      console.log(`Proposal created on-chain: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async submitVote(proposalId: string, vote: 'for' | 'against', voterWeight: number = 1): Promise<string> {
    try {
      if (!this.wallet) await this.initializeWallet();

      // Create vote instruction
      const voteAccount = web3.Keypair.generate();
      
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: this.wallet.publicKey,
          newAccountPubkey: voteAccount.publicKey,
          lamports: await this.connection.getMinimumBalanceForRentExemption(200),
          space: 200,
          programId: VOTING_PROGRAM_ID,
        })
      );

      const signature = await this.wallet.signAndSendTransaction(transaction);
      await this.connection.confirmTransaction(signature);

      console.log(`Vote submitted on-chain: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  }

  async getProposalData(proposalId: string): Promise<VoteAccount | null> {
    try {
      // Mock data structure for now - in production this would fetch from the blockchain
      return {
        proposalId,
        title: 'Sample Proposal',
        description: 'Sample proposal description',
        votesFor: 0,
        votesAgainst: 0,
        deadline: Date.now() + 86400000,
        isActive: true,
        creator: this.wallet?.publicKey || new PublicKey('11111111111111111111111111111111')
      };
    } catch (error) {
      console.error('Error fetching proposal data:', error);
      return null;
    }
  }

  async getWalletBalance(): Promise<number> {
    try {
      if (!this.wallet) await this.initializeWallet();
      const balance = await this.connection.getBalance(this.wallet.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  }
}

export const votingContract = new SolanaVotingContract();
