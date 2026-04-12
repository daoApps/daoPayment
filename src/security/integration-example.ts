import SecurityManager from './securityManager.js';

// 示例：整合安全组件
async function securitySystemIntegration() {
  // 初始化安全管理器
  const securityManager = new SecurityManager('0x1234567890123456789012345678901234567890');
  await securityManager.initialize();

  // 1. 创建安全策略
  await securityManager.createPolicy(
    'policy-1',
    'Default Security Policy',
    'Default security policy with basic controls',
    [
      {
        id: 'rule-1',
        type: 'amount',
        operator: 'gt',
        value: 1000,
        action: 'deny',
        priority: 10
      },
      {
        id: 'rule-2',
        type: 'amount',
        operator: 'gt',
        value: 500,
        action: 'require_approval',
        priority: 9
      },
      {
        id: 'rule-3',
        type: 'category',
        operator: 'in',
        value: ['high_risk'],
        action: 'require_approval',
        priority: 8
      },
      {
        id: 'rule-4',
        type: 'amount',
        operator: 'gt',
        value: 0,
        action: 'allow',
        priority: 1
      }
    ],
    undefined, // 无父策略
    ['default', 'basic'] // 标签
  );

  // 2. 设置预算
  securityManager.getBudgetManager().setBudget(
    '0xabcdef1234567890abcdef1234567890abcdef12',
    1000, // 每日限额
    5000, // 每周限额
    20000, // 每月限额
    240000, // 每年限额
    {
      daily: 80,
      weekly: 80,
      monthly: 80,
      yearly: 80
    }
  );

  // 3. 创建白名单
  securityManager.createWhitelist(
    'whitelist-1',
    'Trusted Recipients',
    'List of trusted recipients',
    'recipients',
    [
      '0x1111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222'
    ],
    10, // 高优先级
    Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后过期
  );

  // 4. 执行安全检查
  const securityCheck = securityManager.checkSecurity(
    'policy-1',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    600, // 金额
    '0x1111111111111111111111111111111111111111', // 接收者
    'USDC', // 代币
    'transfer', // 方法
    'general', // 类别
    { isNewRecipient: false } // 元数据
  );

  console.log('Security check result:', securityCheck);

  // 5. 如果允许，更新预算
  if (securityCheck.allowed && !securityCheck.requiresHumanApproval) {
    securityManager.updateBudget(
      '0xabcdef1234567890abcdef1234567890abcdef12',
      600,
      'Payment to trusted recipient'
    );
    console.log('Budget updated successfully');
  }

  // 6. 获取安全评估报告
  const securityReport = securityManager.getSecurityReport(
    'policy-1',
    '0xabcdef1234567890abcdef1234567890abcdef12'
  );

  console.log('Security report:', securityReport);

  // 7. 清理过期白名单项目
  const cleanedItems = securityManager.cleanupAllExpiredWhitelistItems();
  console.log(`Cleaned ${cleanedItems} expired whitelist items`);
}

// 运行示例
securitySystemIntegration().catch(console.error);