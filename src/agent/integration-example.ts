#!/usr/bin/env node

// Agent 集成示例脚本
// 展示如何在 Agent 环境中使用 Monad Agentic Payment 系统

import axios from 'axios';

// MCP 服务器地址
const MCP_SERVER_URL = 'http://localhost:3000';

// 模拟 Agent ID
const AGENT_ID = 'agent-123';

async function main() {
  console.log('Monad Agentic Payment - Agent Integration Example');
  console.log('===============================================');

  try {
    // 1. 创建钱包
    console.log('\n1. Creating a new wallet...');
    const createWalletResponse = await axios.post(MCP_SERVER_URL, {
      toolcall: {
        name: 'createWallet',
        params: {},
      },
    });
    const walletAddress = createWalletResponse.data.result.walletAddress;
    console.log(`Created wallet with address: ${walletAddress}`);

    // 2. 获取钱包余额
    console.log('\n2. Checking wallet balance...');
    const balanceResponse = await axios.post(MCP_SERVER_URL, {
      toolcall: {
        name: 'getWalletBalance',
        params: {
          walletAddress,
        },
      },
    });
    const balance = balanceResponse.data.result.balance;
    console.log(`Wallet balance: ${balance} USDC`);

    // 3. 生成 Session Key
    console.log('\n3. Generating session key...');
    const sessionKeyResponse = await axios.post(MCP_SERVER_URL, {
      toolcall: {
        name: 'generateSessionKey',
        params: {
          agentId: AGENT_ID,
          walletAddress,
          permissions: ['transfer'],
          expiration: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          maxAmount: 5,
          dailyLimit: 20,
        },
      },
    });
    const sessionKey = sessionKeyResponse.data.result;
    console.log(`Generated session key with ID: ${sessionKey.id}`);
    console.log(
      `Session key expires at: ${new Date(sessionKey.expiration).toISOString()}`
    );

    // 4. 执行支付
    console.log('\n4. Executing payment...');
    const paymentResponse = await axios.post(MCP_SERVER_URL, {
      toolcall: {
        name: 'executePayment',
        params: {
          agentId: AGENT_ID,
          walletAddress,
          recipient: '0x1234567890123456789012345678901234567890',
          amount: 1.5,
          token: 'USDC',
          category: 'api',
          purpose: 'API payment for service',
          permissionId: 'default',
        },
      },
    });
    const paymentResult = paymentResponse.data.result;
    console.log(
      `Payment result: ${paymentResult.success ? 'Success' : 'Failed'}`
    );
    if (paymentResult.success) {
      console.log(`Transaction hash: ${paymentResult.txHash}`);
    } else {
      console.log(`Error: ${paymentResult.error}`);
    }

    // 5. 查询审计记录
    console.log('\n5. Listing audit records...');
    const auditResponse = await axios.post(MCP_SERVER_URL, {
      toolcall: {
        name: 'listAuditRecords',
        params: {
          agentId: AGENT_ID,
        },
      },
    });
    const auditRecords = auditResponse.data.result;
    console.log(`Found ${auditRecords.length} audit records`);
    if (auditRecords.length > 0) {
      console.log('Latest audit record:');
      console.log(JSON.stringify(auditRecords[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

// 运行示例
main();
