import Wallet from '../core/wallet';
import SecurityManager from '../security/securityManager';

interface PaymentRequest {
  agentId: string;
  walletAddress: string;
  recipient: string;
  amount: number;
  token: string;
  category: string;
  purpose: string;
  permissionId: string;
}

interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
  requiresApproval?: boolean;
}

class PaymentExecutor {
  private securityManager: SecurityManager;
  private maxRetries: number = 3;

  constructor(securityManager: SecurityManager) {
    this.securityManager = securityManager;
  }

  async executePayment(
    wallet: Wallet,
    paymentRequest: PaymentRequest
  ): Promise<PaymentResult> {
    // 1. 检查安全策略
    const securityCheck = this.securityManager.checkSecurity(
      paymentRequest.walletAddress,
      paymentRequest.walletAddress,
      paymentRequest.amount,
      paymentRequest.recipient,
      paymentRequest.token,
      'transfer',
      paymentRequest.category
    );

    if (!securityCheck.allowed) {
      return {
        success: false,
        error: securityCheck.reason
      };
    }

    if (securityCheck.requiresHumanApproval) {
      return {
        success: false,
        requiresApproval: true,
        error: 'Payment requires human approval'
      };
    }

    // 2. 执行支付
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const txHash = await wallet.sendTransaction(
          paymentRequest.recipient,
          paymentRequest.amount
        );

        // 3. 更新预算
        this.securityManager.updateBudget(paymentRequest.walletAddress, paymentRequest.amount);

        return {
          success: true,
          txHash
        };
      } catch (error) {
        retries++;
        if (retries >= this.maxRetries) {
          return {
            success: false,
            error: `Payment failed after ${this.maxRetries} retries: ${error}`
          };
        }
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }

    return {
      success: false,
      error: 'Payment execution failed'
    };
  }

  setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }
}

export default PaymentExecutor;
export type { PaymentRequest, PaymentResult };