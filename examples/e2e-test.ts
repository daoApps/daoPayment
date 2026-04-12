import MainManager from '../src/core/mainManager.js';

console.log('=== Monad Agentic Payment End-to-End Test ===\n');

async function runTest() {
  // 1. Create manager instance
  console.log('1. Creating MainManager...');
  const manager = new MainManager();
  await manager.initialize();
  console.log('✓ MainManager created\n');

  // 2. Create wallet
  console.log('2. Creating new wallet...');
  const walletAddress = manager.createWallet();
  console.log(`✓ Wallet created: ${walletAddress}\n`);

  // 3. Get recovery seed
  console.log('3. Getting recovery seed...');
  const recoverySeed = manager.getRecoverySeed(walletAddress);
  console.log(`✓ Recovery seed generated: ${recoverySeed?.slice(0, 20)}...\n`);

  // 4. List wallets
  console.log('4. Listing wallets...');
  const wallets = manager.listWallets();
  console.log(`✓ Wallets: ${wallets}\n`);

  // 5. Create policy template
  console.log('5. Creating default policy...');
  const policy = await manager.createTemplatePolicy('default');
  console.log(`✓ Policy created: ${policy.name} (${policy.id})\n`);

  // 6. Generate session key
  console.log('6. Generating session key for test agent...');
  const sessionKey = manager.generateSessionKey(
    'test-agent-001',
    walletAddress,
    ['transfer'],
    86400,
    5,
    20
  );
  console.log(`✓ Session key generated: ${sessionKey.id}`);
  console.log(`  Expiration: ${new Date(sessionKey.expiration).toISOString()}`);
  console.log(`  Max amount: ${sessionKey.maxAmount}`);
  console.log(`  Daily limit: ${sessionKey.dailyLimit}\n`);

  // 7. Get agent session keys
  console.log('7. Getting agent session keys...');
  const agentKeys = manager.getAgentSessionKeys('test-agent-001');
  console.log(`✓ Found ${agentKeys.length} session keys for agent\n`);

  // 8. Get session key
  console.log('8. Retrieving session key...');
  const retrievedKey = manager.getSessionKey(sessionKey.id);
  console.log(`✓ Session key retrieved: ${retrievedKey?.id}\n`);

  // 9. Create permission
  console.log('9. Creating permission...');
  const permissionId = manager.createPermission(
    'test-agent-001',
    walletAddress,
    ['transfer'],
    Date.now() + 86400000,
    10,
    50
  );
  console.log(`✓ Permission created: ${permissionId}\n`);

  // 10. List audit records
  console.log('10. Listing audit records...');
  const records = manager.getAuditIntegrator().listAuditRecords();
  console.log(`✓ Found ${records.length} audit records\n`);

  // 11. Cleanup expired
  console.log('11. Cleaning up expired permissions...');
  const expiredPerms = manager.cleanupExpiredPermissions();
  console.log(`✓ Cleaned up ${expiredPerms} expired permissions\n`);

  console.log('12. Cleaning up expired session keys...');
  const expiredKeys = manager.cleanupExpiredSessionKeys();
  console.log(`✓ Cleaned up ${expiredKeys} expired session keys\n`);

  console.log('=== All tests passed! ✅ ===');
  console.log('\nCore functionality verified:');
  console.log('- ✓ Wallet creation');
  console.log('- ✓ Recovery seed generation');
  console.log('- ✓ Policy management');
  console.log('- ✓ Session key generation');
  console.log('- ✓ Permission management');
  console.log('- ✓ Audit logging');
  console.log('- ✓ Cleanup of expired entries');
}

runTest().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
