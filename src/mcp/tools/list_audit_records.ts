import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({
  agentId: z.string().optional(),
  walletAddress: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  records: Array<{
    id: string;
    agentId: string;
    walletAddress: string;
    recipient: string;
    amount: number;
    token: string;
    category: string;
    purpose: string;
    status: string;
    timestamp: string;
  }>;
  error?: string;
};

class ListAuditRecordsTool implements ITool<Input, Output> {
  name = 'list_audit_records';
  description = 'List audit records with optional filtering';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const filters = {
        agentId: input.agentId,
        walletAddress: input.walletAddress,
        status: input.status,
        startTime: input.startTime,
        endTime: input.endTime,
      };
      const records = manager.getAuditIntegrator().listAuditRecords(filters);
      return {
        success: true,
        records: records.map((record) => ({
          id: record.id,
          agentId: record.agentId,
          walletAddress: record.walletAddress,
          recipient: record.recipient,
          amount: record.amount,
          token: record.token,
          category: record.category,
          purpose: record.purpose,
          status: record.status,
          timestamp: new Date(record.timestamp).toISOString(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        records: [],
        error: (error as Error).message,
      };
    }
  }
}

export default new ListAuditRecordsTool();
