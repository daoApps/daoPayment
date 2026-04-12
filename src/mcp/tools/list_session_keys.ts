import { z } from 'zod';
import { ITool } from './types';
import MainManager from '../../core/mainManager';

const manager = new MainManager();

const InputSchema = z.object({
  agentId: z.string(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  sessionKeys: Array<{
    id: string;
    agentId: string;
    walletAddress: string;
    expiration: string;
    maxAmount: number;
    dailyLimit: number;
  }>;
  error?: string;
};

class ListSessionKeysTool implements ITool<Input, Output> {
  name = 'list_session_keys';
  description = 'List all session keys for an agent';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const keys = manager.getAgentSessionKeys(input.agentId);
      return {
        success: true,
        sessionKeys: keys.map((key) => ({
          id: key.id,
          agentId: key.agentId,
          walletAddress: key.walletAddress,
          expiration: new Date(key.expiration).toISOString(),
          maxAmount: key.maxAmount,
          dailyLimit: key.dailyLimit,
        })),
      };
    } catch (error) {
      return {
        success: false,
        sessionKeys: [],
        error: (error as Error).message,
      };
    }
  }
}

export default new ListSessionKeysTool();
