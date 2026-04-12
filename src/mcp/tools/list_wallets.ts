import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  wallets: string[];
  error?: string;
};

class ListWalletsTool implements ITool<Input, Output> {
  name = 'list_wallets';
  description = 'List all wallets in the system';
  inputSchema = InputSchema;

  async execute(_input: Input): Promise<Output> {
    try {
      const wallets = manager.listWallets();
      return {
        success: true,
        wallets,
      };
    } catch (error) {
      return {
        success: false,
        wallets: [],
        error: (error as Error).message,
      };
    }
  }
}

export default new ListWalletsTool();
