/**
 * x402 Automated Payment End-to-End Demo
 *
 * This demo shows how an AI Agent can automatically:
 * 1. Request a resource from a payable API
 * 2. Detect 402 Payment Required response
 * 3. Automatically pay using the agentic payment system
 * 4. Retry the request with payment receipt
 * 5. Get the resource content
 */

import MainManager from '../src/core/mainManager.js';
import X402Client from '../src/protocols/x402/client.js';

const WALLET_ADDRESS = '0x...'; // Replace with your wallet
const AGENT_ID = 'x402-demo-agent';
const SESSION_KEY_ID = '...'; // Generate one first via CLI

async function runX402Demo() {
  console.log('=== x402 Automated Payment Demo ===\n');

  // 1. Initialize manager
  console.log('1. Initializing MainManager...');
  const manager = new MainManager();
  console.log('✓ Manager initialized\n');

  // 2. Check wallet exists
  console.log('2. Checking wallet...');
  const wallet = manager.getWallet(WALLET_ADDRESS);
  if (!wallet) {
    console.error('✗ Wallet not found. Create a wallet first.');
    process.exit(1);
  }
  console.log('✓ Wallet found\n');

  // 3. Create x402 client
  console.log('3. Creating x402 client...');
  const client = new X402Client({
    walletAddress: WALLET_ADDRESS,
    agentId: AGENT_ID,
    sessionKeyId: SESSION_KEY_ID,
    manager,
    retryWithPayment: true, // Enable automatic payment
  });
  console.log('✓ x402 client created with auto-retry enabled\n');

  // 4. Request the API resource
  const apiUrl = 'https://payable-api.example.com/get-paid-content';
  console.log(`4. Requesting resource: ${apiUrl}`);

  try {
    const result = await client.fetch(apiUrl, {
      method: 'GET',
    });

    console.log(`\n5. Response received:`);
    console.log(`   Status: ${result.status}`);
    console.log(`   OK: ${result.ok}`);

    if (result.ok && result.body) {
      console.log('\n✅ SUCCESS! Resource obtained after automatic payment');
      console.log('\nContent preview:');
      console.log('----------------------------------------');
      console.log(
        typeof result.body === 'string'
          ? result.body.slice(0, 500) + '...'
          : JSON.stringify(result.body, null, 2).slice(0, 500) + '...'
      );
      console.log('----------------------------------------');

      // 6. Check audit record was created
      console.log('\n6. Checking audit record...');
      const records = manager.getAuditIntegrator().listAuditRecords({
        agentId: AGENT_ID,
      });
      console.log(`✓ Found ${records.length} audit records for this agent`);
      if (records.length > 0) {
        const lastRecord = records[records.length - 1];
        console.log(
          `  Last payment: ${lastRecord.amount} ${lastRecord.token} to ${lastRecord.recipient}`
        );
        console.log(`  Status: ${lastRecord.status}`);
      }
    } else if (X402Client.isPaymentRequired(result)) {
      console.log('\n⚠️  Payment required but auto-payment failed');
      console.log('   Requirement:', result.paymentRequirement);
    } else {
      console.log('\n❌ Request failed');
    }
  } catch (error) {
    console.error('\n❌ Error:', (error as Error).message);
    process.exit(1);
  }

  console.log('\n=== Demo complete ===');
}

// Run if this is the main module
if (require.main === module) {
  runX402Demo().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default runX402Demo;
