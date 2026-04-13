# x402 Protocol Integration

x402 is the HTTP 402 "Payment Required" status code reborn as a minimal protocol for internet-native micropayments. This integration enables fully automated machine-to-machine payments for AI Agents.

## How It Works

1. **Agent** requests a resource from a payable API endpoint
2. **Server** responds with 402 Payment Required containing payment details
3. **x402 Client** automatically detects the 402 response
4. **Payment** is executed on Monad using your configured policies
5. **Client** retries the original request with payment receipt
6. **Server** accepts payment and returns the requested content
7. **Agent** gets the content fully automatically - no human intervention needed

## Usage

### Basic Usage

```typescript
import MainManager from './src/core/mainManager.js';
import X402Client from './src/protocols/x402/client.js';

// Initialize manager
const manager = new MainManager();

// Create x402 client with automatic payment enabled
const client = new X402Client({
  walletAddress: '0xYourWalletAddress',
  agentId: 'my-ai-agent',
  sessionKeyId: 'generated-session-key-id',
  manager,
  retryWithPayment: true, // This enables fully automatic payment
});

// Request content - payment happens automatically if required
const result = await client.fetch('https://api.example.com/paid-content');

if (result.ok) {
  console.log('Got content:', result.body);
}
```

### Manual Mode

If you want to handle payment confirmation manually:

```typescript
const client = new X402Client({
  ...,
  retryWithPayment: false, // Don't auto-pay
});

const result = await client.fetch('https://api.example.com/paid-content');

if (X402Client.isPaymentRequired(result)) {
  console.log('Payment required:', result.paymentRequirement);
  // Ask user for confirmation here
  // Then execute payment manually and retry
}
```

## Payment Requirement Format

The Payment-Required header can be either:

1. **JSON format**:
   ```json
   {
     "network": "eip155:10143",
     "currency": "USDC",
     "amount": 0.001,
     "recipient": "0x...",
     "instructionUrl": "https://..."
   }
   ```

2. **Simple format**:
   ```
   eip155:10143 USDC 0.001 0x...
   ```

Both formats are supported.

## Security

- All payments still go through your security policy checks:
  - Daily budget limits
  - Whitelist verification
  - Amount thresholds
  - Require approval above threshold
- Every payment is logged in the audit trail
- Session key restrictions still apply
- You can revoke the session key at any time

## End-to-End Demo

See `examples/x402-demo.ts` for a complete working example.

To run the demo:

```bash
# 1. Create a wallet if you don't have one
npx monad-payment wallet create

# 2. Generate a session key
npx monad-payment session generate <agentId> <walletAddress> --maxAmount 1 --dailyLimit 5

# 3. Update the demo with your wallet and session key
# Edit examples/x402-demo.ts to set WALLET_ADDRESS and SESSION_KEY_ID

# 4. Run the demo
node dist/examples/x402-demo.js
```

## Benefits for AI Agents

- **Fully autonomous**: AI Agents can access paid resources without human intervention
- **Micro payments**: Low gas fees on Monad make micropayments feasible
- **No accounts**: Users don't need to create accounts with service providers
- **Pay-per-use**: Only pay for what you use
- **Transparent**: All payments are on-chain and auditable

## Monad x402 Resources

- Official guide: https://docs.monad.xyz/guides/x402-guide
- Monad Testnet Chain ID: 10143
- USDC contract on Monad Testnet: `0x534b2f3A21130d7a60830c2Df862319e593943A3`
