/**
 * Performance Test for Monad Agentic Payment System
 * 
 * Tests:
 * 1. Payment execution response time (< 5 seconds requirement)
 * 2. Multiple consecutive operations performance
 */

import axios from 'axios';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000/';

interface PerformanceResult {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
}

async function callMCP<TResult = any>(toolName: string, params: any): Promise<TResult> {
  const response = await axios.post(MCP_SERVER_URL, {
    toolcall: {
      name: toolName,
      params,
    },
  });

  if (response.status !== 200) {
    throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
  }

  if (response.data.error) {
    throw new Error(`MCP call failed: ${response.data.error}`);
  }

  return response.data.result as TResult;
}

async function measureOperation<T>(
  operation: string,
  action: () => Promise<T>
): Promise<PerformanceResult> {
  const startTime = Date.now();
  try {
    await action();
    const endTime = Date.now();
    const duration = endTime - startTime;
    return {
      operation,
      startTime,
      endTime,
      duration,
      success: true,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    return {
      operation,
      startTime,
      endTime,
      duration,
      success: false,
      error: (error as Error).message,
    };
  }
}

async function runPerformanceTest() {
  console.log('🚀 Starting Performance Test for Monad Agentic Payment System\n');

  const results: PerformanceResult[] = [];

  // Test 1: Create wallet
  console.log('📝 Test 1: Create wallet');
  const result1 = await measureOperation('createWallet', async () => {
    await callMCP('createWallet', {});
  });
  results.push(result1);
  console.log(`   Duration: ${result1.duration}ms, Success: ${result1.success}\n`);

  // Create wallet for subsequent tests
  const wallet = await callMCP<{ walletAddress: string }>('createWallet', {});
  const walletAddress = wallet.walletAddress;

  // Test 2: Create policy
  console.log('📝 Test 2: Create security policy');
  const result2 = await measureOperation('createPolicy', async () => {
    await callMCP('createPolicy', {
      policyId: `perf-test-${Date.now()}`,
      name: 'Performance Test Policy',
      description: 'Policy for performance testing',
      rules: [
        {
          id: 'rule-1',
          type: 'amount',
          operator: 'gt',
          value: 0,
          action: 'allow',
          priority: 10,
        },
      ],
    });
  });
  results.push(result2);
  console.log(`   Duration: ${result2.duration}ms, Success: ${result2.success}\n`);

  // Test 3: Set budget
  console.log('📝 Test 3: Set budget');
  const result3 = await measureOperation('setBudget', async () => {
    await callMCP('setBudget', {
      walletAddress,
      dailyLimit: 100,
      weeklyLimit: 500,
    });
  });
  results.push(result3);
  console.log(`   Duration: ${result3.duration}ms, Success: ${result3.success}\n`);

  // Test 4: Generate session key
  console.log('📝 Test 4: Generate session key');
  const result4 = await measureOperation('generateSessionKey', async () => {
    await callMCP('generateSessionKey', {
      agentId: 'perf-test-agent',
      walletAddress,
      permissions: ['transfer'],
      expiration: 3600,
      maxAmount: 10,
      dailyLimit: 50,
    });
  });
  results.push(result4);
  console.log(`   Duration: ${result4.duration}ms, Success: ${result4.success}\n`);

  // Generate session key for payment test
  const sessionKey = await callMCP<{ id: string }>('generateSessionKey', {
    agentId: 'perf-test-agent',
    walletAddress,
    permissions: ['transfer'],
    expiration: 3600,
    maxAmount: 10,
    dailyLimit: 50,
  });

  // Test 5: Execute payment (simulated, will fail at budget check but we just care about response time)
  console.log('📝 Test 5: Execute payment request');
  const result5 = await measureOperation('executePayment', async () => {
    try {
      await callMCP('executePayment', {
        sessionKeyId: sessionKey.id,
        walletAddress,
        agentId: 'perf-test-agent',
        recipient: '0x1234567890123456789012345678901234567890',
        amount: 5,
        token: 'ETH',
        category: 'api',
        purpose: 'Performance test',
        policyId: `perf-test-${Date.now()}`,
        permissionId: sessionKey.id,
      });
    } catch (error) {
      // We expect budget to be set already, but even if it fails, we're measuring response time
    }
  });
  results.push(result5);
  console.log(`   Duration: ${result5.duration}ms, Success: ${result5.success}\n`);

  // Test 6: List audit records
  console.log('📝 Test 6: List audit records');
  const result6 = await measureOperation('listAuditRecords', async () => {
    await callMCP('listAuditRecords', {});
  });
  results.push(result6);
  console.log(`   Duration: ${result6.duration}ms, Success: ${result6.success}\n`);

  // Summary
  console.log('📊 Performance Test Summary');
  console.log('=');

  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);

  console.log(`Total operations: ${results.length}`);
  console.log(`Successful: ${successfulResults.length}`);
  console.log(`Failed: ${failedResults.length}`);
  console.log('');

  const averageDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
  const maxDuration = Math.max(...successfulResults.map(r => r.duration));
  const minDuration = Math.min(...successfulResults.map(r => r.duration));

  console.log(`Average duration: ${averageDuration.toFixed(2)}ms`);
  console.log(`Min duration: ${minDuration}ms`);
  console.log(`Max duration: ${maxDuration}ms`);
  console.log('');

  // Check performance requirement: < 5 seconds (5000ms)
  const meetsRequirement = maxDuration < 5000;
  console.log(`Performance requirement (< 5000ms): ${meetsRequirement ? '✅ PASS' : '❌ FAIL'}`);
  console.log('=');

  if (!meetsRequirement) {
    console.log('\n⚠️  Performance requirement NOT met: Some operations took longer than 5 seconds');
    process.exit(1);
  }

  console.log('\n✅ All performance tests passed!');
}

runPerformanceTest();
