import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({
  sessionKeyId: z.string(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  error?: string;
};

class RevokeSessionKeyTool implements ITool<Input, Output> {
  name = 'revoke_session_key';
  description = 'Revoke a session key';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const result = manager.revokeSessionKey(input.sessionKeyId);
      return {
        success: result,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new RevokeSessionKeyTool();
