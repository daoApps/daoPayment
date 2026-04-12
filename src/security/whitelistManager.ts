import { createPublicClient, http } from 'viem';
import { AgenticPaymentPolicyAbi } from '../abis/AgenticPaymentPolicy.js';
import * as fs from 'fs';
import * as path from 'path';

const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';
const MONAD_CHAIN_ID = 10143;

interface WhitelistItem {
  id: string;
  value: string;
  addedAt: number;
  expiresAt?: number; // 有效期，可选
  metadata?: Record<string, any>; // 附加元数据
}

interface Whitelist {
  id: string;
  name: string;
  description: string;
  type: 'recipients' | 'tokens' | 'categories' | 'methods' | 'mixed';
  items: WhitelistItem[];
  createdAt: number;
  updatedAt: number;
  version: number;
  priority: number; // 优先级，数字越大优先级越高
  active: boolean;
}

export class WhitelistManager {
  private contractAddress: `0x${string}`;
  private cache: Map<
    string,
    {
      recipients: `0x${string}`[];
      timestamp: number;
    }
  > = new Map();
  private CACHE_TTL = 60 * 1000; // 1 minute cache
  private whitelists: Map<string, Whitelist> = new Map();
  private storagePath: string;

  constructor(
    contractAddress: `0x${string}`,
    storagePath: string = './whitelists'
  ) {
    this.contractAddress = contractAddress;
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadWhitelists();
  }

  private getClient() {
    return createPublicClient({
      transport: http(MONAD_TESTNET_RPC),
      chain: {
        id: MONAD_CHAIN_ID,
        name: 'Monad Testnet',
        nativeCurrency: {
          name: 'MON',
          symbol: 'MON',
          decimals: 18,
        },
        rpcUrls: {
          default: { http: [MONAD_TESTNET_RPC] },
        },
      },
    });
  }

  private loadWhitelists(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const whitelistPath = path.join(this.storagePath, file);
        try {
          const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
          this.whitelists.set(whitelist.id, whitelist);
        } catch (error) {
          console.error(`Error loading whitelist from ${file}:`, error);
        }
      }
    }
  }

  private saveWhitelist(whitelist: Whitelist): void {
    const whitelistPath = path.join(this.storagePath, `${whitelist.id}.json`);
    fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2));
  }

  async isRecipientAllowed(
    whitelistId: `0x${string}`,
    recipient: `0x${string}`
  ): Promise<boolean> {
    const client = this.getClient();

    try {
      const result = await client.readContract({
        address: this.contractAddress,
        abi: AgenticPaymentPolicyAbi,
        functionName: 'isRecipientAllowed',
        args: [whitelistId, recipient],
      });
      return result as boolean;
    } catch (error) {
      console.error('Failed to check whitelist on-chain:', error);
      return false;
    }
  }

  async getWhitelistRecipients(
    whitelistId: `0x${string}`
  ): Promise<`0x${string}`[]> {
    const cached = this.cache.get(whitelistId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.recipients;
    }

    const client = this.getClient();

    try {
      const result = await client.readContract({
        address: this.contractAddress,
        abi: AgenticPaymentPolicyAbi,
        functionName: 'getWhitelistRecipients',
        args: [whitelistId],
      });
      const recipients = result as `0x${string}`[];

      this.cache.set(whitelistId, {
        recipients,
        timestamp: Date.now(),
      });

      return recipients;
    } catch (error) {
      console.error('Failed to get whitelist recipients from chain:', error);
      return [];
    }
  }

  invalidateCache(whitelistId: string): void {
    this.cache.delete(whitelistId);
  }

  // 创建白名单
  createWhitelist(
    id: string,
    name: string,
    description: string,
    type: 'recipients' | 'tokens' | 'categories' | 'methods' | 'mixed',
    items: string[] = [],
    priority: number = 1,
    expiresAt?: number
  ): Whitelist {
    const whitelistItems: WhitelistItem[] = items.map((item, index) => ({
      id: `${id}-item-${index}-${Date.now()}`,
      value: item,
      addedAt: Date.now(),
      expiresAt,
    }));

    const whitelist: Whitelist = {
      id,
      name,
      description,
      type,
      items: whitelistItems,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      priority,
      active: true,
    };

    this.whitelists.set(id, whitelist);
    this.saveWhitelist(whitelist);
    return whitelist;
  }

  // 添加到白名单
  addToWhitelist(
    whitelistId: string,
    items: string[],
    expiresAt?: number
  ): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }

    const newItems: WhitelistItem[] = items.map((item, index) => ({
      id: `${whitelistId}-item-${whitelist.items.length + index}-${Date.now()}`,
      value: item,
      addedAt: Date.now(),
      expiresAt,
    }));

    whitelist.items = [...whitelist.items, ...newItems];
    whitelist.updatedAt = Date.now();
    whitelist.version += 1;

    this.whitelists.set(whitelistId, whitelist);
    this.saveWhitelist(whitelist);
    return true;
  }

  // 从白名单中移除
  removeFromWhitelist(whitelistId: string, items: string[]): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }

    whitelist.items = whitelist.items.filter(
      (item) => !items.includes(item.value)
    );
    whitelist.updatedAt = Date.now();
    whitelist.version += 1;

    this.whitelists.set(whitelistId, whitelist);
    this.saveWhitelist(whitelist);
    return true;
  }

  // 检查项目是否在白名单中
  isAllowed(whitelistId: string, value: string): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist || !whitelist.active) {
      return false;
    }

    const item = whitelist.items.find((item) => item.value === value);
    if (!item) {
      return false;
    }

    // 检查是否过期
    if (item.expiresAt && item.expiresAt < Date.now()) {
      return false;
    }

    return true;
  }

  // 批量检查
  batchCheck(
    whitelistId: string,
    values: string[]
  ): { [key: string]: boolean } {
    const result: { [key: string]: boolean } = {};
    values.forEach((value) => {
      result[value] = this.isAllowed(whitelistId, value);
    });
    return result;
  }

  // 获取白名单
  getWhitelist(whitelistId: string): Whitelist | undefined {
    return this.whitelists.get(whitelistId);
  }

  // 列出所有白名单
  listWhitelists(): Whitelist[] {
    return Array.from(this.whitelists.values()).sort(
      (a, b) => b.priority - a.priority
    );
  }

  // 按类型列出白名单
  listWhitelistsByType(type: Whitelist['type']): Whitelist[] {
    return Array.from(this.whitelists.values())
      .filter((whitelist) => whitelist.type === type)
      .sort((a, b) => b.priority - a.priority);
  }

  // 更新白名单
  updateWhitelist(
    whitelistId: string,
    updates: Partial<Whitelist>
  ): Whitelist | null {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return null;
    }

    const updatedWhitelist = {
      ...whitelist,
      ...updates,
      updatedAt: Date.now(),
      version: whitelist.version + 1,
    };

    this.whitelists.set(whitelistId, updatedWhitelist);
    this.saveWhitelist(updatedWhitelist);
    return updatedWhitelist;
  }

  // 删除白名单
  deleteWhitelist(whitelistId: string): boolean {
    const result = this.whitelists.delete(whitelistId);
    if (result) {
      const whitelistPath = path.join(this.storagePath, `${whitelistId}.json`);
      if (fs.existsSync(whitelistPath)) {
        fs.unlinkSync(whitelistPath);
      }
    }
    return result;
  }

  // 导入白名单
  importWhitelist(whitelist: Whitelist): Whitelist {
    // 确保白名单有唯一ID
    if (!this.whitelists.has(whitelist.id)) {
      this.whitelists.set(whitelist.id, whitelist);
    } else {
      // 如果白名单已存在，创建新版本
      const existingWhitelist = this.whitelists.get(whitelist.id)!;
      const newVersionId = `${whitelist.id}-v${existingWhitelist.version + 1}`;
      const newWhitelist = {
        ...whitelist,
        id: newVersionId,
        version: existingWhitelist.version + 1,
        updatedAt: Date.now(),
      };
      this.whitelists.set(newVersionId, newWhitelist);
      this.saveWhitelist(newWhitelist);
      return newWhitelist;
    }
    this.saveWhitelist(whitelist);
    return whitelist;
  }

  // 导出白名单
  exportWhitelist(whitelistId: string): Whitelist | null {
    return this.whitelists.get(whitelistId) || null;
  }

  // 激活/停用白名单
  toggleWhitelist(whitelistId: string, active: boolean): boolean {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return false;
    }

    whitelist.active = active;
    whitelist.updatedAt = Date.now();
    whitelist.version += 1;

    this.whitelists.set(whitelistId, whitelist);
    this.saveWhitelist(whitelist);
    return true;
  }

  // 清理过期项目
  cleanupExpiredItems(whitelistId: string): number {
    const whitelist = this.whitelists.get(whitelistId);
    if (!whitelist) {
      return 0;
    }

    const originalLength = whitelist.items.length;
    whitelist.items = whitelist.items.filter(
      (item) => !item.expiresAt || item.expiresAt >= Date.now()
    );

    if (whitelist.items.length !== originalLength) {
      whitelist.updatedAt = Date.now();
      whitelist.version += 1;
      this.whitelists.set(whitelistId, whitelist);
      this.saveWhitelist(whitelist);
    }

    return originalLength - whitelist.items.length;
  }

  // 清理所有过期项目
  cleanupAllExpiredItems(): number {
    let totalCleaned = 0;
    for (const whitelist of this.whitelists.values()) {
      totalCleaned += this.cleanupExpiredItems(whitelist.id);
    }
    return totalCleaned;
  }
}

export default WhitelistManager;
