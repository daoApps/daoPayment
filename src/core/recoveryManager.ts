import Wallet from './wallet.js';
import * as fs from 'fs';
import * as path from 'path';

interface RecoverySeed {
  id: string;
  walletAddress: string;
  seedPhrase: string;
  createdAt: number;
  lastUsed: number;
}

class RecoveryManager {
  private storagePath: string;
  private seeds: Map<string, RecoverySeed> = new Map();

  constructor(storagePath: string = './recovery-seeds') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadSeeds();
  }

  private loadSeeds(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const seedPath = path.join(this.storagePath, file);
        try {
          const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          this.seeds.set(seed.walletAddress, seed);
        } catch (error) {
          console.error(`Error loading recovery seed from ${file}:`, error);
        }
      }
    }
  }

  private saveSeed(seed: RecoverySeed): void {
    const seedPath = path.join(this.storagePath, `${seed.walletAddress}.json`);
    fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  }

  // 生成恢复助记词
  generateRecoverySeed(walletAddress: string): string {
    // 生成 12 个随机单词作为助记词
    const words = this.generateRandomWords(12);
    const seedPhrase = words.join(' ');

    const seed: RecoverySeed = {
      id: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      walletAddress,
      seedPhrase,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

    this.seeds.set(walletAddress, seed);
    this.saveSeed(seed);

    return seedPhrase;
  }

  // 从助记词恢复钱包
  recoverWallet(seedPhrase: string): Wallet | null {
    // 查找匹配的助记词
    for (const seed of this.seeds.values()) {
      if (seed.seedPhrase === seedPhrase) {
        // 更新最后使用时间
        seed.lastUsed = Date.now();
        this.saveSeed(seed);

        // 这里应该实现从助记词生成私钥的逻辑
        // 简化实现，返回一个新钱包
        return new Wallet();
      }
    }
    return null;
  }

  // 获取钱包的恢复助记词
  getRecoverySeed(walletAddress: string): string | null {
    const seed = this.seeds.get(walletAddress);
    return seed ? seed.seedPhrase : null;
  }

  // 删除恢复助记词
  deleteRecoverySeed(walletAddress: string): boolean {
    const seed = this.seeds.get(walletAddress);
    if (seed) {
      const seedPath = path.join(this.storagePath, `${walletAddress}.json`);
      if (fs.existsSync(seedPath)) {
        fs.unlinkSync(seedPath);
      }
      return this.seeds.delete(walletAddress);
    }
    return false;
  }

  // 生成随机单词
  private generateRandomWords(count: number): string[] {
    const wordList = [
      'apple',
      'banana',
      'cherry',
      'date',
      'elderberry',
      'fig',
      'grape',
      'honeydew',
      'kiwi',
      'lemon',
      'mango',
      'orange',
      'peach',
      'quince',
      'raspberry',
      'strawberry',
      'tangerine',
      'watermelon',
      'apricot',
      'blueberry',
      'cantaloupe',
      'dragonfruit',
      'eggplant',
      'guava',
      'jackfruit',
      'lime',
      'nectarine',
      'papaya',
      'persimmon',
      'plum',
    ];
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      words.push(wordList[randomIndex]);
    }
    return words;
  }
}

export default RecoveryManager;
