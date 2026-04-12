import { z } from 'zod';

export interface ITool<Input = any, Output = any> {
  name: string;
  description: string;
  inputSchema: z.ZodType<Input>;
  execute: (input: Input) => Promise<Output>;
}

export type ToolRegistry = Map<string, ITool>;

export * from './create_wallet.js';
export * from './list_wallets.js';
export * from './get_wallet_balance.js';
export * from './generate_session_key.js';
export * from './revoke_session_key.js';
export * from './list_session_keys.js';
export * from './execute_payment.js';
export * from './create_policy.js';
export * from './create_policy_template.js';
export * from './list_audit_records.js';
export * from './get_audit_report.js';
