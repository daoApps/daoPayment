import { z } from 'zod';

export interface ITool<Input = any, Output = any> {
  name: string;
  description: string;
  inputSchema: z.ZodType<Input>;
  execute: (input: Input) => Promise<Output>;
}

export type ToolRegistry = Map<string, ITool>;

export * from './create_wallet';
export * from './list_wallets';
export * from './get_wallet_balance';
export * from './generate_session_key';
export * from './revoke_session_key';
export * from './list_session_keys';
export * from './execute_payment';
export * from './create_policy';
export * from './create_policy_template';
export * from './list_audit_records';
export * from './get_audit_report';
