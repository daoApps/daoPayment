import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({
  agentId: z.string(),
  walletAddress: z.string(),
  permissions: z.array(z.string()).optional(),
  expirationSeconds: z.number().optional(),
  maxAmount: z.number().optional(),
  dailyLimit: z.number().optional(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  sessionKey?: {
    id: string;
    publicKey: string;
    expiration: string;
    maxAmount: number;
    dailyLimit: number;
  };
  error?: string;
};

class GenerateSessionKeyTool implements ITool<Input, Output> {
  name = 'generate_session_key';
  description = 'Generate a restricted session key for an AI Agent';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const sessionKey = manager.generateSessionKey(
        input.agentId,
        input.walletAddress as `0x${string}`,
        input.permissions || ['transfer'],
        input.expirationSeconds || 86400,
        input.maxAmount || 5,
        input.dailyLimit || 20
      );
      return {
        success: true,
        sessionKey: {
          id: sessionKey.id,
          publicKey: sessionKey.publicKey,
          expiration: new Date(sessionKey.expiration).toISOString(),
          maxAmount: sessionKey.maxAmount,
          dailyLimit: sessionKey.dailyLimit,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new GenerateSessionKeyTool();
