import SessionKeyManager from './sessionKeyManager';
import PaymentExecutor from '../agent/paymentExecutor';
import Wallet from './wallet';
import { PaymentRequest, PaymentResult } from '../agent/paymentExecutor';

class SessionKeyIntegrator {
  private sessionKeyManager: SessionKeyManager;
  private paymentExecutor: PaymentExecutor;

  constructor(paymentExecutor: PaymentExecutor) {
    this.sessionKeyManager = new SessionKeyManager();
    this.paymentExecutor = paymentExecutor;
  }

  // 为 Agent 生成 Session Key
  generateSessionKey(
    agentId: string,
    walletAddress: string,
    permissions: string[] = ['transfer'],
    expiration: number = Date.now() + 24 * 60 * 60 * 1000, // 默认 24 小时
    maxAmount: number = 5, // 默认 5 USDC
    dailyLimit: number = 20 // 默认 20 USDC
  ) {
    return this.sessionKeyManager.generateSessionKey(
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit
    );
  }

  // 使用 Session Key 执行支付
  async executePaymentWithSessionKey(
    sessionKeyId: string,
    wallet: Wallet,
    paymentRequest: PaymentRequest
  ): Promise<PaymentResult> {
    // 验证 Session Key
    const isValid = this.sessionKeyManager.validateSessionKey(
      sessionKeyId,
      'transfer',
      paymentRequest.amount
    );

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid or expired session key'
      };
    }

    // 执行支付
    return this.paymentExecutor.executePayment(wallet, paymentRequest);
  }

  // 撤销 Session Key
  revokeSessionKey(sessionKeyId: string): boolean {
    return this.sessionKeyManager.revokeSessionKey(sessionKeyId);
  }

  // 轮换 Session Key
  rotateSessionKey(sessionKeyId: string) {
    return this.sessionKeyManager.rotateSessionKey(sessionKeyId);
  }

  // 获取 Session Key 信息
  getSessionKey(sessionKeyId: string) {
    return this.sessionKeyManager.getSessionKey(sessionKeyId);
  }

  // 获取 Agent 的所有 Session Key
  getAgentSessionKeys(agentId: string) {
    return this.sessionKeyManager.getAgentSessionKeys(agentId);
  }

  // 清理过期的 Session Key
  cleanupExpiredKeys(): number {
    return this.sessionKeyManager.cleanupExpiredKeys();
  }
}

export default SessionKeyIntegrator;