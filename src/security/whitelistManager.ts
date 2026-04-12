import { createPublicClient, http } from 'viem';
import { AgenticPaymentPolicyAbi } from '../abis/AgenticPaymentPolicy.js';

const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';
const MONAD_CHAIN_ID = 10143;

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
  private localWhitelistCache: Map<string, Set<string>> = new Map();

  constructor(contractAddress: `0x${string}`) {
    this.contractAddress = contractAddress;
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

  createWhitelist(
    whitelistId: string,
    recipients: string[],
    _tokens: string[],
    _categories: string[],
    _methods: string[]
  ): void {
    this.localWhitelistCache.set(whitelistId, new Set(recipients));
  }

  addToWhitelist(
    whitelistId: string,
    _type: 'recipients' | 'tokens' | 'categories' | 'methods',
    items: string[]
  ): boolean {
    const whitelist = this.localWhitelistCache.get(whitelistId);
    if (!whitelist) {
      return false;
    }
    for (const item of items) {
      whitelist.add(item);
    }
    return true;
  }

  isLocallyAllowed(whitelistId: string, recipient: string): boolean {
    const whitelist = this.localWhitelistCache.get(whitelistId);
    if (!whitelist) {
      return true;
    }
    return whitelist.has(recipient);
  }
}

export default WhitelistManager;
