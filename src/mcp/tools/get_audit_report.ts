import { z } from 'zod';
import { ITool } from './types.js';
import MainManager from '../../core/mainManager.js';

const manager = new MainManager();

const InputSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
});

type Input = z.infer<typeof InputSchema>;
type Output = {
  success: boolean;
  report?: {
    totalPayments: number;
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    byAgent: Record<string, number>;
    byCategory: Record<string, number>;
  };
  error?: string;
};

class GetAuditReportTool implements ITool<Input, Output> {
  name = 'get_audit_report';
  description = 'Generate an audit report for a time period';
  inputSchema = InputSchema;

  async execute(input: Input): Promise<Output> {
    try {
      const report = manager
        .getAuditIntegrator()
        .generateAuditReport(input.startTime, input.endTime);
      return {
        success: true,
        report,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

export default new GetAuditReportTool();
