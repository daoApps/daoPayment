import Wallet from './wallet';
import * as fs from 'fs';
import * as path from 'path';

class WalletManager {
  private wallets: Map<string, Wallet> = new Map();
  private storagePath: string;

  constructor(storagePath: string = './wallets') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadWallets();
  }

  private loadWallets(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const walletPath = path.join(this.storagePath, file);
        try {
          const wallet = Wallet.loadFromFile(walletPath);
          this.wallets.set(wallet.getAddress(), wallet);
        } catch (error) {
          console.error(`Error loading wallet from ${file}:`, error);
        }
      }
    }
  }

  createWallet(): Wallet {
    const wallet = new Wallet();
    const walletAddress = wallet.getAddress();
    const walletPath = path.join(this.storagePath, `${walletAddress}.json`);
    wallet.saveToFile(walletPath);
    this.wallets.set(walletAddress, wallet);
    return wallet;
  }

  getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address);
  }

  listWallets(): string[] {
    return Array.from(this.wallets.keys());
  }

  removeWallet(address: string): boolean {
    const walletPath = path.join(this.storagePath, `${address}.json`);
    if (fs.existsSync(walletPath)) {
      fs.unlinkSync(walletPath);
      return this.wallets.delete(address);
    }
    return false;
  }
}

export default WalletManager;