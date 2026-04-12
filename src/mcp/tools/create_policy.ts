import { z } from 'zod';
import { ITool } from './types';
import MainManager from '../../core/mainManager';

const manager = new MainManager();

const InputSchema = z.object({
  policyId: z.string(),
  name: z.string(),
  description: z.string(),
  rules: z.array(
    z.object({
      id: z.string(),
      type: z.enum([
        'amount',
        'category',
        'recipient',
        'token',
        'method',
        'time',
        'whitelist',
      ]),
      operator: z.enum(['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'in', 'not_in']),
      value: z.any(),
      action: z.enum(['allow', 'deny', 'require_approval']),
      priority: z.number(),
    })
  ),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  error?: string;
};

class CreatePolicyTool implements ITool<Input, Output> {
  name = 'create_policy';
  description = 'Create a new security policy with custom rules';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      await manager
        .getSecurityManager()
        .createPolicy(
          input.policyId,
          input.name,
          input.description,
          input.rules
        );
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new CreatePolicyTool();
