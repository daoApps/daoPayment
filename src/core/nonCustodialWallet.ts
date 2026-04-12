import { monad } from '@monad-crypto/mpp/packages/mpp/dist/client/index.js';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import type { LocalAccount } from 'viem/accounts';
import SecureStorage from './secureStorage.js';
import { createClient, http } from 'viem';
import { monad as monadChain } from 'viem/chains';

class NonCustodialWallet {
  private account: LocalAccount;
  private charge: ReturnType<typeof monad.charge>;
  private secureStorage: SecureStorage | null = null;
  private walletId: string;

  constructor(privateKey?: `0x${string}`, walletId?: string) {
    if (privateKey) {
      this.account = privateKeyToAccount(privateKey);
    } else {
      const newPrivateKey = generatePrivateKey();
      this.account = privateKeyToAccount(newPrivateKey);
    }

    this.walletId = walletId || this.account.address;

    this.charge = monad.charge({
      account: this.account as any,
      mode: 'pull',
    });
  }

  /**
   * 初始化安全存储
   * @param encryptionKey 加密密钥
   * @param storagePath 存储路径
   */
  initSecureStorage(
    encryptionKey: string,
    storagePath: string = './secure-storage'
  ): void {
    this.secureStorage = new SecureStorage(encryptionKey, storagePath);
  }

  /**
   * 安全存储钱包
   */
  saveSecurely(): void {
    if (!this.secureStorage) {
      throw new Error('Secure storage not initialized');
    }

    const walletData = {
      privateKey: (this.account as any).privateKey,
      address: this.account.address,
      walletId: this.walletId,
    };

    this.secureStorage.save(this.walletId, JSON.stringify(walletData));
  }

  /**
   * 从安全存储加载钱包
   * @param walletId 钱包ID
   * @param encryptionKey 加密密钥
   * @param storagePath 存储路径
   */
  static loadSecurely(
    walletId: string,
    encryptionKey: string,
    storagePath: string = './secure-storage'
  ): NonCustodialWallet {
    const secureStorage = new SecureStorage(encryptionKey, storagePath);
    const walletDataStr = secureStorage.load(walletId);

    if (!walletDataStr) {
      throw new Error('Wallet not found in secure storage');
    }

    try {
      const walletData = JSON.parse(walletDataStr);
      if (!walletData.privateKey) {
        throw new Error('Invalid wallet data: missing privateKey');
      }

      const wallet = new NonCustodialWallet(
        walletData.privateKey as `0x${string}`,
        walletId
      );
      wallet.secureStorage = secureStorage;
      return wallet;
    } catch (error) {
      throw new Error('Failed to load wallet from secure storage');
    }
  }

  /**
   * 获取钱包地址
   */
  getAddress(): `0x${string}` {
    return this.account.address;
  }

  /**
   * 获取公钥
   */
  getPublicKey(): string {
    return (this.account as any).publicKey || '';
  }

  /**
   * 获取私钥（仅用于特殊操作，应谨慎使用）
   */
  getPrivateKey(): `0x${string}` {
    return (this.account as any).privateKey;
  }

  /**
   * 获取账户对象
   */
  getAccount(): LocalAccount {
    return this.account;
  }

  /**
   * 获取MPP charge客户端
   */
  getChargeClient() {
    return this.charge;
  }

  /**
   * 获取钱包余额
   * @param chainId 链ID
   */
  async getBalance(chainId: number = 10143): Promise<bigint> {
    try {
      const { getBalance } = await import('viem/actions');
      const client = await this.getClient(chainId);
      const balance = await getBalance(client, {
        address: this.account.address,
      });
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  /**
   * 发送交易
   * @param to 接收地址
   * @param amount 金额
   * @param currency 货币合约地址（可选）
   * @param chainId 链ID
   */
  async sendTransaction(
    to: `0x${string}`,
    amount: bigint,
    currency?: `0x${string}`,
    chainId: number = 10143
  ): Promise<`0x${string}`> {
    try {
      const credential = await (this.charge as any).createCredential({
        challenge: {
          request: {
            recipient: to,
            amount: amount.toString(),
            currency: currency || '0x0000000000000000000000000000000000000000',
            chainId: chainId,
          },
        },
        context: {
          account: this.account,
        },
      });
      return credential as `0x${string}`;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  /**
   * 执行原始交易
   * @param transaction 交易对象
   * @param chainId 链ID
   */
  async executeTransaction(
    transaction: any,
    chainId: number = 10143
  ): Promise<`0x${string}`> {
    try {
      const { sendTransaction } = await import('viem/actions');
      const client = await this.getClient(chainId);
      const hash = await sendTransaction(client, {
        ...transaction,
        account: this.account,
      });
      return hash;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw new Error('Failed to execute transaction');
    }
  }

  /**
   * 获取RPC客户端
   * @param chainId 链ID
   */
  private async getClient(chainId: number) {
    const defaultChain =
      chainId === monadChain.id
        ? monadChain
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

    const url =
      chainId === monadChain.id
        ? `https://rpc.monad.xyz`
        : `https://rpc.chain${chainId}.xyz`;

    const client = createClient({
      chain: defaultChain,
      transport: http(url),
      account: this.account,
    });

    return client;
  }

  /**
   * 生成MPP凭证
   * @param request 请求参数
   */
  async generateMPPCredential(request: any): Promise<`0x${string}`> {
    try {
      const credential = await (this.charge as any).createCredential({
        challenge: {
          request: {
            ...request,
            chainId: request.chainId || 10143,
          },
        },
        context: {
          account: this.account,
        },
      });
      return credential as `0x${string}`;
    } catch (error) {
      console.error('Error generating MPP credential:', error);
      throw new Error('Failed to generate MPP credential');
    }
  }

  /**
   * 验证MPP凭证
   * @param credential 凭证
   */
  async verifyMPPCredential(credential: `0x${string}`): Promise<boolean> {
    try {
      const result = await (this.charge as any).verifyCredential({
        credential,
      });
      return result.valid;
    } catch (error) {
      console.error('Error verifying MPP credential:', error);
      return false;
    }
  }

  /**
   * 获取MPP协议信息
   */
  async getMPPInfo(): Promise<any> {
    try {
      const info = await (this.charge as any).getInfo();
      return info;
    } catch (error) {
      console.error('Error getting MPP info:', error);
      throw new Error('Failed to get MPP info');
    }
  }

  /**
   * 使用MPP协议进行批量支付
   * @param payments 支付列表
   */
  async batchPayments(
    payments: Array<{
      to: `0x${string}`;
      amount: bigint;
      currency?: `0x${string}`;
    }>
  ): Promise<Array<`0x${string}`>> {
    try {
      const credentials = await Promise.all(
        payments.map(async (payment) => {
          return this.generateMPPCredential({
            recipient: payment.to,
            amount: payment.amount.toString(),
            currency:
              payment.currency || '0x0000000000000000000000000000000000000000',
          });
        })
      );
      return credentials;
    } catch (error) {
      console.error('Error processing batch payments:', error);
      throw new Error('Failed to process batch payments');
    }
  }

  /**
   * 导出钱包（用于备份）
   */
  exportWallet(): {
    privateKey: `0x${string}`;
    address: `0x${string}`;
    walletId: string;
  } {
    return {
      privateKey: (this.account as any).privateKey,
      address: this.account.address,
      walletId: this.walletId,
    };
  }

  /**
   * 从导出数据创建钱包
   * @param exportedData 导出的钱包数据
   */
  static fromExportedData(exportedData: {
    privateKey: `0x${string}`;
    walletId?: string;
  }): NonCustodialWallet {
    return new NonCustodialWallet(
      exportedData.privateKey,
      exportedData.walletId
    );
  }
}

export default NonCustodialWallet;
