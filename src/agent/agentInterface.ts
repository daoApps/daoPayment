import AgentManager from './agentManager.js';
import PaymentExecutor from './paymentExecutor.js';
import WalletManager from '../core/walletManager.js';
import SecurityManager from '../security/securityManager.js';
import { PaymentRequest, PaymentResult } from './paymentExecutor.js';

class AgentInterface {
  private agentManager: AgentManager;
  private paymentExecutor: PaymentExecutor;
  private walletManager: WalletManager;
  private securityManager: SecurityManager;

  constructor(encryptionKey: string, securityManager: SecurityManager) {
    this.agentManager = new AgentManager(encryptionKey);
    this.paymentExecutor = new PaymentExecutor(securityManager);
    this.walletManager = new WalletManager();
    this.securityManager = securityManager;
  }

  // 注册 Agent
  registerAgent(agentId: string, name: string, description: string): void {
    this.agentManager.registerAgent(agentId, name, description);
  }

  // 请求权限
  requestPermission(
    agentId: string,
    walletAddress: string,
    requestedPermissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): string {
    return this.agentManager.requestPermission(
      agentId,
      walletAddress,
      requestedPermissions,
      expiration,
      maxAmount,
      dailyLimit
    );
  }

  // 执行支付
  async executePayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    // 检查权限
    const hasPermission = this.agentManager.checkPermission(
      paymentRequest.agentId,
      paymentRequest.permissionId,
      'transfer',
      paymentRequest.amount
    );

    if (!hasPermission) {
      return {
        success: false,
        error: 'Agent does not have permission to execute this payment',
      };
    }

    // 获取钱包
    const wallet = this.walletManager.getWallet(paymentRequest.walletAddress);
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    // 执行支付
    return this.paymentExecutor.executePayment(wallet, paymentRequest);
  }

  // 检查支付状态
  async checkPaymentStatus(
    _txHash: string
  ): Promise<{ status: string; blockNumber?: number }> {
    // 这里应该实现查询交易状态的逻辑
    // 简化实现，返回模拟数据
    return {
      status: 'pending',
    };
  }

  // 获取 Agent 信息
  getAgentInfo(agentId: string): any {
    return this.agentManager.getAgent(agentId);
  }

  // 获取钱包余额
  async getWalletBalance(walletAddress: string): Promise<number> {
    const wallet = this.walletManager.getWallet(walletAddress);
    if (!wallet) {
      return 0;
    }
    const balance = await wallet.getBalance();
    return Number(balance);
  }

  // 创建新钱包
  createWallet(): string {
    const wallet = this.walletManager.createWallet();
    return wallet.getAddress();
  }

  // 列出钱包
  listWallets(): string[] {
    return this.walletManager.listWallets();
  }
}

export default AgentInterface;
