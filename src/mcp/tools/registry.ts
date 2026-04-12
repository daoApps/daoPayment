import { ToolRegistry } from './types.js';
import create_wallet from './create_wallet.js';
import list_wallets from './list_wallets.js';
import get_wallet_balance from './get_wallet_balance.js';
import generate_session_key from './generate_session_key.js';
import revoke_session_key from './revoke_session_key.js';
import list_session_keys from './list_session_keys.js';
import execute_payment from './execute_payment.js';
import create_policy from './create_policy.js';
import create_policy_template from './create_policy_template.js';
import list_audit_records from './list_audit_records.js';
import get_audit_report from './get_audit_report.js';

const registry: ToolRegistry = new Map();

registry.set(create_wallet.name, create_wallet);
registry.set(list_wallets.name, list_wallets);
registry.set(get_wallet_balance.name, get_wallet_balance);
registry.set(generate_session_key.name, generate_session_key);
registry.set(revoke_session_key.name, revoke_session_key);
registry.set(list_session_keys.name, list_session_keys);
registry.set(execute_payment.name, execute_payment);
registry.set(create_policy.name, create_policy);
registry.set(create_policy_template.name, create_policy_template);
registry.set(list_audit_records.name, list_audit_records);
registry.set(get_audit_report.name, get_audit_report);

export default registry;
