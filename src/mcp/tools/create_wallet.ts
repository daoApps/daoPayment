import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  walletAddress?: string;
  recoveryPhrase?: string;
  error?: string;
};

class CreateWalletTool implements ITool<Input, Output> {
  name = 'create_wallet';
  description = 'Create a new wallet for payments on Monad';
  inputSchema = InputSchema;

  async execute(_input: Input): Promise<Output> {
    try {
      const walletAddress = manager.createWallet();
      const recoveryPhrase = manager.getRecoverySeed(walletAddress);
      return {
        success: true,
        walletAddress,
        recoveryPhrase: recoveryPhrase || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new CreateWalletTool();
