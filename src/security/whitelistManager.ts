import * as fs from 'fs';
import * as path from 'path';

interface Whitelist {
  recipients: string[];
  tokens: string[];
  categories: string[];
  methods: string[];
}

class WhitelistManager {
  private whitelists: Map<string, Whitelist> = new Map();
  private storagePath: string;

  constructor(storagePath: string = './whitelists') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadWhitelists();
  }

  private loadWhitelists(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const whitelistPath = path.join(this.storagePath, file);
        try {
          const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
          const whitelistId = path.basename(file, '.json');
          this.whitelists.set(whitelistId, whitelist);
        } catch (error) {
          console.error(`Error loading whitelist from ${file}:`, error);
        }
      }
    }
  }

  private saveWhitelist(whitelistId: string, whitelist: Whitelist): void {
    const whitelistPath = path.join(this.storagePath, `${whitelistId}.json`);
    fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2));
  }

  createWhitelist(
    whitelistId: string,
    recipients: string[] = [],
    tokens: string[] = [],
    categories: string[] = [],
    methods: string[] = []
  ): void {
    const whitelist: Whitelist = {
      recipients,
      tokens,
      categories,
      methods,
    };
    this.whitelists.set(whitelistId, whitelist);
    this.saveWhitelist(whitelistId, whitelist);
  }

  addToWhitelist(
    whitelistId: string,
    type: keyof Whitelist,
    items: string[]
  ): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }

    const existingItems = whitelist[type];
    const newItems = items.filter((item) => !existingItems.includes(item));
    whitelist[type] = [...existingItems, ...newItems];
    this.saveWhitelist(whitelistId, whitelist);
    return true;
  }

  removeFromWhitelist(
    whitelistId: string,
    type: keyof Whitelist,
    items: string[]
  ): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }

    whitelist[type] = whitelist[type].filter((item) => !items.includes(item));
    this.saveWhitelist(whitelistId, whitelist);
    return true;
  }

  checkWhitelist(
    whitelistId: string,
    type: keyof Whitelist,
    item: string
  ): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }
    return whitelist[type].includes(item);
  }

  getWhitelist(whitelistId: string): Whitelist | undefined {
    return this.whitelists.get(whitelistId);
  }

  deleteWhitelist(whitelistId: string): boolean {
    const whitelistPath = path.join(this.storagePath, `${whitelistId}.json`);
    if (fs.existsSync(whitelistPath)) {
      fs.unlinkSync(whitelistPath);
      return this.whitelists.delete(whitelistId);
    }
    return false;
  }

  listWhitelists(): string[] {
    return Array.from(this.whitelists.keys());
  }
}

export default WhitelistManager;
