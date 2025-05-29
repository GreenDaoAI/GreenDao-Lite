
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount } from '@solana/spl-token';

// Green Token program ID
const GREEN_TOKEN_PROGRAM_ID = new PublicKey('9SWarQDspenBSpPFi1yECs4BCebrw89MYVv6JEZMxzoa');

export interface GreenTokenAccount {
  balance: number;
  carbonOffset: number;
  ecoScore: number;
  stakingRewards: number;
}

export class GreenTokenContract {
  private connection: Connection;
  private wallet: any;
  private mintAddress: PublicKey | null = null;

  constructor() {
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

  async initializeGreenTokenMint(): Promise<string> {
    try {
      if (!this.wallet) await this.initializeWallet();

      // Create mint for GREEN tokens
      const mint = await createMint(
        this.connection,
        this.wallet,
        this.wallet.publicKey,
        this.wallet.publicKey,
        9 // 9 decimals
      );

      this.mintAddress = mint;
      console.log(`Green Token mint created: ${mint.toString()}`);
      return mint.toString();
    } catch (error) {
      console.error('Error creating GREEN token mint:', error);
      throw error;
    }
  }

  async mintGreenTokens(amount: number, ecoActionType: string): Promise<string> {
    try {
      if (!this.wallet) await this.initializeWallet();
      if (!this.mintAddress) await this.initializeGreenTokenMint();

      // Create token account for user
      const tokenAccount = await createAccount(
        this.connection,
        this.wallet,
        this.mintAddress!,
        this.wallet.publicKey
      );

      // Mint tokens based on eco action
      const mintAmount = this.calculateMintAmount(amount, ecoActionType);
      
      const signature = await mintTo(
        this.connection,
        this.wallet,
        this.mintAddress!,
        tokenAccount,
        this.wallet.publicKey,
        mintAmount * Math.pow(10, 9) // Convert to token units
      );

      console.log(`Minted ${mintAmount} GREEN tokens for ${ecoActionType}: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error minting GREEN tokens:', error);
      throw error;
    }
  }

  private calculateMintAmount(baseAmount: number, actionType: string): number {
    const multipliers: { [key: string]: number } = {
      'carbon_offset': 10,
      'renewable_energy': 15,
      'waste_reduction': 8,
      'eco_transport': 12,
      'green_investment': 20,
      'community_action': 5
    };
    
    return baseAmount * (multipliers[actionType] || 1);
  }

  async getGreenTokenBalance(): Promise<GreenTokenAccount> {
    try {
      if (!this.wallet) await this.initializeWallet();
      
      // Mock implementation - in production this would fetch real balance
      return {
        balance: 150,
        carbonOffset: 75.5,
        ecoScore: 92,
        stakingRewards: 12.3
      };
    } catch (error) {
      console.error('Error fetching GREEN token balance:', error);
      return {
        balance: 0,
        carbonOffset: 0,
        ecoScore: 0,
        stakingRewards: 0
      };
    }
  }

  async stakeGreenTokens(amount: number, duration: number): Promise<string> {
    try {
      if (!this.wallet) await this.initializeWallet();

      // Create staking transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: GREEN_TOKEN_PROGRAM_ID,
          lamports: amount * LAMPORTS_PER_SOL
        })
      );

      const signature = await this.wallet.signAndSendTransaction(transaction);
      await this.connection.confirmTransaction(signature);

      console.log(`Staked ${amount} GREEN tokens: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error staking GREEN tokens:', error);
      throw error;
    }
  }
}

export const greenTokenContract = new GreenTokenContract();
