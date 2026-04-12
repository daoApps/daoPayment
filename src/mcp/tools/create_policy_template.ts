import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({
  templateType: z.enum(['default', 'strict', 'permissive']),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  policy?: {
    id: string;
    name: string;
    description: string;
  };
  error?: string;
};

class CreatePolicyTemplateTool implements ITool<Input, Output> {
  name = 'create_policy_template';
  description =
    'Create a policy from a pre-defined template (default, strict, permissive)';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const policy = await manager.createTemplatePolicy(input.templateType);
      return {
        success: true,
        policy: {
          id: policy.id,
          name: policy.name,
          description: policy.description,
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

export default new CreatePolicyTemplateTool();
