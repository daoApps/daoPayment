import { z } from 'zod';
import { ITool } from './types';
import MainManager from '../../core/mainManager';

const manager = new MainManager();

const InputSchema = z.object({
  walletAddress: z.string(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  balance?: number;
  error?: string;
};

class GetWalletBalanceTool implements ITool<Input, Output> {
  name = 'get_wallet_balance';
  description = 'Get the balance of a wallet in USDC';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const balance = await manager
        .getAgentInterface()
        .getWalletBalance(input.walletAddress as `0x${string}`);
      return {
        success: true,
        balance,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new GetWalletBalanceTool();
