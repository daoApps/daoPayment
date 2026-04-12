# Monad Agentic Payment

Agent-native secure payment system for Monad blockchain.

## Overview

This project is built for the Monad Blitz Hackathon - Agentic Payment track. It enables AI Agents to autonomously execute on-chain payments under user authorization, while ensuring security, controllability, and auditability.

## Key Features

### ✅ Core Requirements (5 Must-Haves) (Completed)

1. **Decentralized** - User self-custody of assets, non-custodial, Agent never accesses real private key, user can revoke permissions anytime
2. **Security Configuration** - Single transaction limit, daily/weekly budget, whitelist addresses/contracts/tokens, method-level restrictions, human confirmation above threshold, risk interception, emergency pause
3. **Agent-native** - Designed for AI Agents, not humans: Agent requests permission, obtains temporary authorization, explains payment reason, executes payment in task context, retries on failure
4. **Auditable & Explainable** - Complete payment records: trigger, task context, recipient, payment reason, matched policy, human confirmation, execution result
5. **Recovery & Permission Management** - Wallet recovery, Agent permission adjustment, Session Key rotation, leaked key revocation, multi-Agent differentiated permissions

### ⭐ High-Value Bonus Features Implemented (Completed)

- **A. Session Key / Delegated Key** - Issue restricted temporary keys to Agents: 24h expiration, ≤5 USDC limit, specific services only
- **B. Policy Engine** - Configurable policy layer with rules including **whitelist support**:
  - `max_daily_spend: 20 USDC`
  - `require_human_approval_above: 3 USDC`
  - `allowed_recipients: [verified_vendors_only]`
  - `allowed_categories: [api, storage, compute]`
  - `block: [personal_transfer]`
  - On-chain whitelist storage for tamper-proof configuration
- **D. Native Machine Payments** - Integrated with **MPP** (Machine Payments Protocol) and **x402** for API per-call billing
- **D+ Enhanced**: Fully automated x402 payment flow detects 402 Payment Required → automatic payment → retry with receipt
- **F. Audit Logging & Payment Receipt** - Structured payment receipts with Task ID, Agent ID, User ID, recipient, amount, asset, policy match, signature method, risk level, result, timestamp

## Architecture

```
monad-agentic-payment/
├── contracts/
│   └── src/
│       └── AgenticPaymentPolicy.sol  # On-chain policy and whitelist storage
├── components/                        # React components
│   ├── PendingTransactionsList.tsx     # Safe pending transactions list
│   └── WhitelistManager.tsx           # Frontend whitelist management
├── app/                               # Next.js app router
│   ├── dashboard/                     # Dynamic dashboard page
│   ├── layout.tsx                     # Root layout with Wagmi provider
│   └── page.tsx                       # Home page
├── src/
│   ├── abis/                          # Contract ABIs
│   │   └── AgenticPaymentPolicy.ts
│   ├── core/                          # Core management systems
│   │   ├── mainManager.ts             # Main manager integrating all subsystems
│   │   ├── wallet.ts                  # Wallet implementation with MPP integration
│   │   ├── walletManager.ts           # Wallet management
│   │   ├── permissionManager.ts       # Permission management
│   │   ├── sessionKeyManager.ts       # Session Key management
│   │   ├── sessionKeyIntegrator.ts     # Session Key integration
│   │   ├── recoveryManager.ts         # Recovery functionality
│   │   └── secureStorage.ts           # Secure storage utilities
│   ├── hooks/                         # Wagmi React hooks
│   │   ├── usePolicyRead.ts           # Read policy from chain
│   │   ├── useBudgetRead.ts           # Read budget from chain
│   │   ├── useWhitelistRead.ts        # Read whitelist from chain
│   │   └── usePolicyWrite.ts          # Write policy to chain
│   ├── security/                      # Security and policy system
│   │   ├── policyEngine.ts            # Policy evaluation engine (+whitelist support)
│   │   ├── policy.ts                  # Policy types
│   │   ├── enhancedPolicyManager.ts   # Policy management
│   │   ├── securityManager.ts         # Main security coordinator
│   │   ├── budgetManager.ts           # Budget tracking
│   │   └── whitelistManager.ts        # On-chain whitelist management with cache
│   ├── clients/                       # External API clients
│   │   └── safeApi.ts                 # Safe Transaction API client
│   ├── protocols/                     # Protocol integrations
│   │   └── x402/                      # x402 protocol
│   │       └── client.ts               # x402 client with auto payment
│   ├── agent/                         # Agent interface
│   │   ├── agentInterface.ts          # Agent-facing API
│   │   ├── agentManager.ts            # Agent registration and permission
│   │   ├── paymentExecutor.ts         # Payment execution with retries
│   │   └── integration-example.ts       # Usage example
│   ├── audit/                         # Audit system
│   │   ├── auditManager.ts            # Audit record management
│   │   ├── auditIntegrator.ts         # Audit integration
│   │   ├── auditRecord.ts             # Audit record types
│   │   └── paymentReceipt.ts          # Payment receipt generation
│   ├── mcp/                           # MCP Server for AI Agent integration (standardized)
│   │   ├── server.ts                  # MCP Server using official @modelcontextprotocol/sdk
│   │   ├── tools/                     # All MCP tools
│   │   │   ├── types.ts               # Tool interface
│   │   │   ├── registry.ts            # Tool registry
│   │   │   ├── create_wallet.ts
│   │   │   ├── list_wallets.ts
│   │   │   ├── get_wallet_balance.ts
│   │   │   ├── generate_session_key.ts
│   │   │   ├── revoke_session_key.ts
│   │   │   ├── list_session_keys.ts
│   │   │   ├── execute_payment.ts
│   │   │   ├── create_policy.ts
│   │   │   ├── create_policy_template.ts
│   │   │   ├── list_audit_records.ts
│   │   │   └── get_audit_report.ts
│   │   └── index.ts                   # MCP entry point
│   ├── wagmi/                         # Wagmi configuration
│   │   └── config.ts
│   ├── index.ts                       # Main export
│   └── cli.ts                         # CLI entry point
├── docs/                              # Documentation
│   ├── MCP-INTEGRATION.md              # Claude Code/Cursor integration guide
│   └── X402-INTEGRATION.md            # x402 integration guide
├── examples/                          # Example code
│   ├── e2e-test.ts                     # End-to-end core functionality test
│   └── x402-demo.ts                   # x402 automatic payment demo
├── package.json
├── tsconfig.json
├── tsconfig.cli.json
└── README.md
```

## Installation

```bash
npm install
npm run build
```

## Usage

### As CLI Tool

```bash
# Create a new wallet
npx monad-payment wallet create

# List all wallets
npx monad-payment wallet list

# Check balance
npx monad-payment wallet balance <address>

# Generate a session key for an Agent
npx monad-payment session generate <agentId> <walletAddress> \
  --permissions transfer \
  --expiration 86400 \
  --maxAmount 5 \
  --dailyLimit 20

# Revoke a session key
npx monad-payment session revoke <sessionKeyId>

# Execute payment with session key
npx monad-payment pay <agentId> <walletAddress> <recipient> <amount> \
  --token USDC \
  --category api \
  --purpose "API service payment" \
  --sessionKey <sessionKeyId>

# List audit records
npx monad-payment audit list --agentId <agentId>

# Generate audit report
npx monad-payment audit report <startTime> <endTime>
```

### As MCP Server

```bash
# Start MCP Server on port 3000
node dist/mcp/server.js
```

The MCP Server exposes these tools:

- `createWallet` - Create a new wallet
- `getWalletBalance` - Get wallet balance
- `executePayment` - Execute a payment (supports session key)
- `generateSessionKey` - Generate a restricted session key
- `listAuditRecords` - List audit records with filtering
- `createPolicy` - Create a security policy
- `createTemplatePolicy` - Create a policy from template
- `setBudget` - Set budget limits
- `getBudget` - Get current budget status

### As SDK

```typescript
import MainManager from 'monad-agentic-payment';

// Create manager instance
const manager = new MainManager();

// Create wallet
const walletAddress = manager.createWallet();
console.log('Wallet:', walletAddress);

// Get recovery phrase
const recoveryPhrase = manager.getRecoverySeed(walletAddress);

// Generate session key for an Agent
const sessionKey = manager.generateSessionKey(
  'claude-code',           // agentId
  walletAddress,           // walletAddress
  ['transfer'],            // permissions
  86400,                   // expiration (seconds)
  5,                       // maxAmount per transaction
  20                       // dailyLimit
);
console.log('Session Key ID:', sessionKey.id);

// Execute payment with session key
const result = await manager.executePaymentWithSessionKey(
  sessionKey.id,
  walletAddress,
  {
    agentId: 'claude-code',
    recipient: '0x...',
    amount: 1.5,
    token: 'USDC',
    category: 'api',
    purpose: 'OpenAI API payment',
    permissionId: 'default'
  }
);

console.log('Payment result:', result);
console.log('Audit ID:', result.auditId);

// List audit records
const records = manager.getAuditIntegrator().listAuditRecords({
  agentId: 'claude-code'
});
console.log('Payment history:', records);
```

## Configuration

### Policy Templates

Three built-in policy templates:

- `default` - Balanced security: 20 USDC daily limit, require approval above 3 USDC
- `strict` - High security: 5 USDC daily limit, require approval above 1 USDC, only allows verified recipients
- `permissive` - Low restriction: 100 USDC daily limit, require approval above 20 USDC

### Example Policy Rules

```typescript
const rules = [
  {
    id: 'max-amount',
    type: 'amount',
    operator: 'gt',
    value: 10,
    action: 'require_approval',
    priority: 100
  },
  {
    id: 'block-personal',
    type: 'category',
    operator: 'eq',
    value: 'personal_transfer',
    action: 'deny',
    priority: 200
  },
  {
    id: 'allowed-recipients',
    type: 'recipient',
    operator: 'not_in',
    value: ['0x...', '0x...'],
    action: 'deny',
    priority: 150
  }
];
```

## Security Model

- **Private Key Protection**: User's master private key is encrypted at rest, never exposed to Agent
- **Session Key**: Agent only gets a temporary restricted key with limited capabilities
- **Policy Engine**: Every payment is checked against configured policies before execution
- **Budget Tracking**: Daily/weekly spending is tracked and enforced
- **Audit Logging**: Every payment is logged with full context for later review
- **Revocation**: Permissions and session keys can be revoked anytime

## Monad Integration

- Built on **Monad** (10,000 TPS, 400ms block time, 800ms finality)
- Integrated with **MPP (Machine Payments Protocol)** for native machine-to-machine payments
- Uses USDC as the default payment token (address: `0x534b2f3A21130d7a60830c2Df862319e593943A3` on Monad Testnet)
- Chain ID: `10143` (Monad Testnet)

## Getting Testnet Funds

1. Get MON from [Monad Faucet](https://faucet.monad.xyz/)
2. Get USDC from [Circle Faucet](https://faucet.circle.com/), select Monad Testnet

## Development

```bash
# Install dependencies
npm install

# Type checking
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

## Integration with AI Agents

This system is designed to be integrated as an MCP Server into AI Agent environments like:

- Claude Code
- OpenClaw
- Codex
- Manus

Add this to your MCP configuration:

```json
{
  "mcpServers": {
    "monad-payment": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## License

MIT

## Author

Monad Blitz 2025 Hackathon - Agentic Payment Track
