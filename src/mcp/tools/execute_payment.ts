import { z } from 'zod';
import { ITool } from './types';
import MainManager from '../../core/mainManager';

const manager = new MainManager();

const InputSchema = z.object({
  agentId: z.string(),
  walletAddress: z.string(),
  recipient: z.string(),
  amount: z.number(),
  token: z.string().optional(),
  category: z.string().optional(),
  purpose: z.string().optional(),
  sessionKeyId: z.string().optional(),
  permissionId: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  txHash?: string;
  auditId?: string;
  requiresApproval?: boolean;
  error?: string;
};

class ExecutePaymentTool implements ITool<Input, Output> {
  name = 'execute_payment';
  description =
    'Execute a payment on Monad, can use session key or regular permission';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const paymentRequest = {
        agentId: input.agentId,
        walletAddress: input.walletAddress as `0x${string}`,
        recipient: input.recipient as `0x${string}`,
        amount: input.amount,
        token: input.token || 'USDC',
        category: input.category || 'general',
        purpose: input.purpose || 'Agent payment',
        permissionId: input.permissionId || 'default',
      };

      if (input.sessionKeyId) {
        const result = await manager.executePaymentWithSessionKey(
          input.sessionKeyId,
          input.walletAddress as `0x${string}`,
          paymentRequest
        );
        return {
          success: result.success,
          txHash: result.txHash,
          auditId: result.auditId,
          requiresApproval: result.requiresApproval,
          error: result.error,
        };
      }

      const result = await manager
        .getAgentInterface()
        .executePayment(paymentRequest);
      return {
        success: result.success,
        txHash: result.txHash,
        requiresApproval: result.requiresApproval,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new ExecutePaymentTool();
