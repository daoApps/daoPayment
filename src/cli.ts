#!/usr/bin/env node
import { program } from 'commander';
import MainManager from './core/mainManager.js';

const manager = new MainManager();

program
  .name('monad-payment')
  .description('Agent-native secure payment system for Monad blockchain')
  .version('1.0.0');

// 钱包管理命令
program
  .command('wallet')
  .description('Manage wallets')
  .addCommand(
    program
      .command('create')
      .description('Create a new wallet')
      .action(() => {
        const walletAddress = manager.createWallet();
        console.log(`Created wallet with address: ${walletAddress}`);
        console.log(
          `Recovery seed: ${manager.generateRecoverySeed(walletAddress)}`
        );
      })
  )
  .addCommand(
    program
      .command('list')
      .description('List all wallets')
      .action(() => {
        const wallets = manager.listWallets();
        console.log('Wallets:');
        wallets.forEach((address) => console.log(`- ${address}`));
      })
  )
  .addCommand(
    program
      .command('balance')
      .description('Check wallet balance')
      .argument('<address>', 'Wallet address')
      .action(async (address: string) => {
        const balance = await manager
          .getAgentInterface()
          .getWalletBalance(address);
        console.log(`Balance for ${address}: ${balance} USDC`);
      })
  );

// 权限管理命令
program
  .command('permission')
  .description('Manage permissions')
  .addCommand(
    program
      .command('create')
      .description('Create a new permission')
      .argument('<agentId>', 'Agent ID')
      .argument('<walletAddress>', 'Wallet address')
      .option(
        '-p, --permissions <permissions>',
        'Permissions (comma-separated)'
      )
      .option('-e, --expiration <expiration>', 'Expiration time (milliseconds)')
      .option('-m, --maxAmount <maxAmount>', 'Maximum amount per transaction')
      .option('-d, --dailyLimit <dailyLimit>', 'Daily limit')
      .action((agentId: string, walletAddress: string, options: any) => {
        const permissions = options.permissions
          ? options.permissions.split(',')
          : ['transfer'];
        const expiration = options.expiration
          ? parseInt(options.expiration)
          : Date.now() + 24 * 60 * 60 * 1000;
        const maxAmount = options.maxAmount
          ? parseFloat(options.maxAmount)
          : 100;
        const dailyLimit = options.dailyLimit
          ? parseFloat(options.dailyLimit)
          : 500;

        const permissionId = manager.createPermission(
          agentId,
          walletAddress,
          permissions,
          expiration,
          maxAmount,
          dailyLimit
        );

        console.log(`Created permission with ID: ${permissionId}`);
      })
  )
  .addCommand(
    program
      .command('revoke')
      .description('Revoke a permission')
      .argument('<permissionId>', 'Permission ID')
      .action((permissionId: string) => {
        const result = manager.revokePermission(permissionId);
        console.log(
          result
            ? 'Permission revoked successfully'
            : 'Failed to revoke permission'
        );
      })
  );

// Session Key 命令
program
  .command('session')
  .description('Manage session keys')
  .addCommand(
    program
      .command('generate')
      .description('Generate a new session key')
      .argument('<agentId>', 'Agent ID')
      .argument('<walletAddress>', 'Wallet address')
      .option(
        '-p, --permissions <permissions>',
        'Permissions (comma-separated)'
      )
      .option('-e, --expiration <expiration>', 'Expiration time (milliseconds)')
      .option('-m, --maxAmount <maxAmount>', 'Maximum amount per transaction')
      .option('-d, --dailyLimit <dailyLimit>', 'Daily limit')
      .action((agentId: string, walletAddress: string, options: any) => {
        const permissions = options.permissions
          ? options.permissions.split(',')
          : ['transfer'];
        const expiration = options.expiration
          ? parseInt(options.expiration)
          : Date.now() + 24 * 60 * 60 * 1000;
        const maxAmount = options.maxAmount ? parseFloat(options.maxAmount) : 5;
        const dailyLimit = options.dailyLimit
          ? parseFloat(options.dailyLimit)
          : 20;

        const sessionKey = manager.generateSessionKey(
          agentId,
          walletAddress,
          permissions,
          expiration,
          maxAmount,
          dailyLimit
        );

        console.log('Generated session key:');
        console.log(`ID: ${sessionKey.id}`);
        console.log(`Public Key: ${sessionKey.publicKey}`);
        console.log(
          `Expiration: ${new Date(sessionKey.expiration).toISOString()}`
        );
      })
  )
  .addCommand(
    program
      .command('revoke')
      .description('Revoke a session key')
      .argument('<sessionKeyId>', 'Session key ID')
      .action((sessionKeyId: string) => {
        const result = manager.revokeSessionKey(sessionKeyId);
        console.log(
          result
            ? 'Session key revoked successfully'
            : 'Failed to revoke session key'
        );
      })
  );

// 策略管理命令
program
  .command('policy')
  .description('Manage policies')
  .addCommand(
    program
      .command('create')
      .description('Create a new policy')
      .argument('<id>', 'Policy ID')
      .argument('<name>', 'Policy name')
      .argument('<description>', 'Policy description')
      .action(async (_id: string, _name: string, _description: string) => {
        // 创建默认策略
        const policy = await manager
          .getSecurityManager()
          .createTemplatePolicy('default');
        console.log(`Created policy: ${policy.name}`);
        console.log(`Policy ID: ${policy.id}`);
      })
  );

// 支付命令
program
  .command('pay')
  .description('Execute a payment')
  .argument('<agentId>', 'Agent ID')
  .argument('<walletAddress>', 'Wallet address')
  .argument('<recipient>', 'Recipient address')
  .argument('<amount>', 'Amount to send')
  .option('-t, --token <token>', 'Token type', 'USDC')
  .option('-c, --category <category>', 'Payment category', 'general')
  .option('-p, --purpose <purpose>', 'Payment purpose', 'Agent payment')
  .option('-s, --sessionKey <sessionKey>', 'Session key ID')
  .action(
    async (
      agentId: string,
      walletAddress: string,
      recipient: string,
      amount: string,
      options: any
    ) => {
      const paymentRequest = {
        agentId,
        walletAddress,
        recipient,
        amount: parseFloat(amount),
        token: options.token,
        category: options.category,
        purpose: options.purpose,
        permissionId: 'default', // 默认权限 ID
      };

      if (options.sessionKey) {
        // 使用 Session Key 执行支付
        const result = await manager.executePaymentWithSessionKey(
          options.sessionKey,
          walletAddress,
          paymentRequest
        );
        console.log('Payment result:', result);
      } else {
        // 使用普通权限执行支付
        const result = await manager
          .getAgentInterface()
          .executePayment(paymentRequest);
        console.log('Payment result:', result);
      }
    }
  );

// 审计命令
program
  .command('audit')
  .description('Manage audit records')
  .addCommand(
    program
      .command('list')
      .description('List audit records')
      .option('-a, --agentId <agentId>', 'Filter by agent ID')
      .option('-w, --walletAddress <walletAddress>', 'Filter by wallet address')
      .action((options: any) => {
        const filters: any = {};
        if (options.agentId) filters.agentId = options.agentId;
        if (options.walletAddress)
          filters.walletAddress = options.walletAddress;

        const records = manager.getAuditIntegrator().listAuditRecords(filters);
        console.log('Audit records:');
        records.forEach((record) => {
          console.log(`- ID: ${record.id}`);
          console.log(`  Agent: ${record.agentId}`);
          console.log(`  Amount: ${record.amount} ${record.token}`);
          console.log(`  Status: ${record.status}`);
          console.log(
            `  Timestamp: ${new Date(record.timestamp).toISOString()}`
          );
          console.log('');
        });
      })
  )
  .addCommand(
    program
      .command('report')
      .description('Generate audit report')
      .argument('<startTime>', 'Start time (timestamp)')
      .argument('<endTime>', 'End time (timestamp)')
      .action((startTime: string, endTime: string) => {
        const report = manager
          .getAuditIntegrator()
          .generateAuditReport(parseInt(startTime), parseInt(endTime));
        console.log('Audit report:');
        console.log(`Total payments: ${report.totalPayments}`);
        console.log(`Total amount: ${report.totalAmount}`);
        console.log(`Successful payments: ${report.successfulPayments}`);
        console.log(`Failed payments: ${report.failedPayments}`);
        console.log(`Pending payments: ${report.pendingPayments}`);
        console.log('By agent:', report.byAgent);
        console.log('By category:', report.byCategory);
      })
  );

// 运行命令
program.parse(process.argv);
