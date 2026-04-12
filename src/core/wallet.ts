import { monad } from '../../node_modules/@monad-crypto/mpp/packages/mpp/dist/client/index.js';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import * as fs from 'fs';
import type { LocalAccount } from 'viem/accounts';

class Wallet {
  private account: LocalAccount;
  private charge: ReturnType<typeof monad.charge>;

  constructor(privateKey?: `0x${string}`) {
    if (privateKey) {
      this.account = privateKeyToAccount(privateKey);
    } else {
      const newPrivateKey = generatePrivateKey();
      this.account = privateKeyToAccount(newPrivateKey);
    }

    this.charge = monad.charge({
      account: this.account as any,
      mode: 'pull',
    });
  }

  getAddress(): `0x${string}` {
    return this.account.address;
  }

  getPublicKey(): string {
    return (this.account as any).publicKey || '';
  }

  getPrivateKey(): `0x${string}` {
    return (this.account as any).privateKey;
  }

  getAccount(): LocalAccount {
    return this.account;
  }

  getChargeClient() {
    return this.charge;
  }

  async getBalance(): Promise<bigint> {
    try {
      const client =
        (await (this.charge as any).parameters?.getClient?.({
          chainId: 10143,
        })) || this.getDefaultClient(10143);
      const balance = await client.getBalance({
        address: this.account.address,
      });
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0n;
    }
  }

  async sendTransaction(
    to: `0x${string}`,
    amount: bigint,
    currency?: `0x${string}`
  ): Promise<`0x${string}`> {
    try {
      const credential = await (this.charge as any).createCredential({
        challenge: {
          request: {
            recipient: to,
            amount: amount.toString(),
            currency: currency || '0x0000000000000000000000000000000000000000',
            chainId: 10143,
          },
        },
        context: {
          account: this.account,
        },
      });
      return credential as `0x${string}`;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  private async getDefaultClient(chainId: number) {
    const { createClient, http } = await import('viem');
    const { monad } = await import('viem/chains');
    const defaultChain =
      monad.id === chainId
        ? monad
        : {
            id: chainId,
            name: `Chain ${chainId}`,
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: [`https://rpc.chain${chainId}.xyz`],
              },
            },
          };
    const url = `https://rpc.monad.xyz`;
    return createClient({ chain: defaultChain, transport: http(url) });
  }

  saveToFile(filePath: string): void {
    const walletData = {
      privateKey: (this.account as any).privateKey,
      address: this.account.address,
    };
    fs.writeFileSync(filePath, JSON.stringify(walletData, null, 2));
  }

  static loadFromFile(filePath: string): Wallet {
    if (!fs.existsSync(filePath)) {
      throw new Error('Wallet file not found');
    }
    const walletData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return new Wallet(walletData.privateKey as `0x${string}`);
  }
}

export default Wallet;
