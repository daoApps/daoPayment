# MCP Integration Guide

Monad Agentic Payment can be used as an MCP (Model Context Protocol) server in AI editors like Claude Code and Cursor.

## Prerequisites

- Node.js 18+ installed
- Your Monad wallet has been created and funded with MON/USDC

## Installation

### 1. Build the project

```bash
npm install
npm run build
```

### 2. Configuration

#### Claude Code

Add this to your Claude Code MCP configuration (`~/.config/claude-code/claude_code.json` on macOS/Linux, `%APPDATA%\claude-code\claude_code.json` on Windows):

```json
{
  "mcpServers": {
    "monad-agentic-payment": {
      "command": "node",
      "args": ["/absolute/path/to/monad-agentic-payment/dist/src/mcp/index.js"]
    }
  }
}
```

#### Cursor

Add this to your Cursor `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "monad-agentic-payment": {
        "command": "node",
        "args": ["/absolute/path/to/monad-agentic-payment/dist/src/mcp/index.js"]
      }
    }
  }
}
```

**Note**: Replace `/absolute/path/to/` with the actual absolute path to your project directory.

## Available MCP Tools

### 1. `create_wallet`
Create a new wallet for payments on Monad.
- **Input**: `{}` (no parameters needed)
- **Output**: `success: boolean, walletAddress?: string, recoveryPhrase?: string`

### 2. `list_wallets`
List all wallets in the system.
- **Input**: `{}` (no parameters needed)
- **Output**: `success: boolean, wallets: string[]`

### 3. `get_wallet_balance`
Get the balance of a wallet in USDC.
- **Input**: `{ walletAddress: string }`
- **Output**: `success: boolean, balance?: number`

### 4. `generate_session_key`
Generate a restricted session key for an AI Agent.
- **Input**:
  ```typescript
  {
    agentId: string;
    walletAddress: string;
    permissions?: string[];      // default: ['transfer']
    expirationSeconds?: number;  // default: 86400 (24h)
    maxAmount?: number;          // default: 5 USDC
    dailyLimit?: number;         // default: 20 USDC
  }
  ```
- **Output**: `success: boolean, sessionKey?: { id, publicKey, expiration, maxAmount, dailyLimit }`

### 5. `revoke_session_key`
Revoke a session key.
- **Input**: `{ sessionKeyId: string }`
- **Output**: `success: boolean`

### 6. `list_session_keys`
List all session keys for an agent.
- **Input**: `{ agentId: string }`
- **Output**: `success: boolean, sessionKeys: SessionKeyInfo[]`

### 7. `execute_payment`
Execute a payment on Monad, can use session key or regular permission.
- **Input**:
  ```typescript
  {
    agentId: string;
    walletAddress: string;
    recipient: string;
    amount: number;
    token?: string;           // default: 'USDC'
    category?: string;         // default: 'general'
    purpose?: string;          // default: 'Agent payment'
    sessionKeyId?: string;     // optional: use session key auth
    permissionId?: string;     // optional: use regular permission auth
  }
  ```
- **Output**: `success: boolean, txHash?: string, auditId?: string, requiresApproval?: boolean, error?: string`

### 8. `create_policy`
Create a new security policy with custom rules.
- **Input**:
  ```typescript
  {
    policyId: string;
    name: string;
    description: string;
    rules: PolicyRule[];
  }
  ```
- **Output**: `success: boolean, error?: string`

### 9. `create_policy_template`
Create a policy from a pre-defined template.
- **Input**: `{ templateType: 'default' | 'strict' | 'permissive' }`
- **Output**: `success: boolean, policy?: { id, name, description }`

### 10. `list_audit_records`
List audit records with optional filtering.
- **Input**:
  ```typescript
  {
    agentId?: string;
    walletAddress?: string;
    status?: 'pending' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
  }
  ```
- **Output**: `success: boolean, records: AuditRecord[]`

### 11. `get_audit_report`
Generate an audit report for a time period.
- **Input**: `{ startTime: number, endTime: number }`
- **Output**:
  ```typescript
  {
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
  }
  ```

## Usage Example in AI Agent

When an AI Agent needs to make a payment for API access:

1. Agent calls `generate_session_key` to get a restricted session key
2. Agent calls `execute_payment` with the session key when payment is required
3. The system automatically checks policies, budget, and executes the payment
4. An audit record is created automatically
5. Agent gets the result and continues the task

## Security Notes

- The MCP server runs locally on your machine
- Wallet keys are stored locally on your machine, never sent to any remote server
- Session keys have restricted permissions and expire automatically
- All payments are logged for auditing
- You can revoke session keys at any time

## Troubleshooting

### MCP server not connecting

1. Check that the path in your configuration is absolute
2. Check that you have run `npm run build`
3. Check that `dist/src/mcp/index.js` exists
4. Check Node.js version: `node --version` (must be 18+)

### Tool call fails

1. Check that all required parameters are provided
2. Check that the wallet exists and is funded
3. Check that the session key hasn't expired
4. Check that the payment complies with your security policies

## Testing

You can test the MCP server manually with:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/src/mcp/index.js
```

This should return a list of all available tools.
