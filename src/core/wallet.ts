// import { MPP } from '@monad-crypto/mpp';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

class Wallet {
  private privateKey: string;
  private publicKey: string;
  private address: string;
  // private mpp: MPP;

  constructor(privateKey?: string) {
    if (privateKey) {
      this.privateKey = privateKey;
      this.publicKey = this.generatePublicKey(privateKey);
      this.address = this.generateAddress(this.publicKey);
    } else {
      const keys = this.generateKeyPair();
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
      this.address = this.generateAddress(keys.publicKey);
    }
    
    // this.mpp = new MPP({
    //   network: 'testnet',
    //   privateKey: this.privateKey
    // });
  }

  private generateKeyPair(): { privateKey: string; publicKey: string } {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { privateKey, publicKey };
  }

  private generatePublicKey(privateKey: string): string {
    const keyObject = crypto.createPrivateKey(privateKey);
    return keyObject.export({ type: 'spki', format: 'pem' }).toString();
  }

  private generateAddress(publicKey: string): string {
    const publicKeyObject = crypto.createPublicKey(publicKey);
    const publicKeyBuffer = Buffer.from(publicKeyObject.export({ type: 'spki', format: 'der' }));
    const hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();
    const address = '0x' + hash.slice(-20).toString('hex');
    return address;
  }

  getAddress(): string {
    return this.address;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  async getBalance(): Promise<number> {
    try {
      // 模拟余额
      return 1000;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  async sendTransaction(to: string, amount: number): Promise<string> {
    try {
      // 模拟交易哈希
      return `0x${crypto.randomBytes(32).toString('hex')}`;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  saveToFile(filePath: string): void {
    const walletData = {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      address: this.address
    };
    fs.writeFileSync(filePath, JSON.stringify(walletData, null, 2));
  }

  static loadFromFile(filePath: string): Wallet {
    if (!fs.existsSync(filePath)) {
      throw new Error('Wallet file not found');
    }
    const walletData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return new Wallet(walletData.privateKey);
  }
}

export default Wallet;