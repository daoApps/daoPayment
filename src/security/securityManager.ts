import BudgetManager from './budgetManager.js';
import WhitelistManager from './whitelistManager.js';
import EnhancedPolicyManager from './enhancedPolicyManager.js';

class SecurityManager {
  private policyManager: EnhancedPolicyManager;
  private budgetManager: BudgetManager;
  private whitelistManager: WhitelistManager;

  constructor(contractAddress: `0x${string}`) {
    this.policyManager = new EnhancedPolicyManager();
    this.budgetManager = new BudgetManager();
    this.whitelistManager = new WhitelistManager(contractAddress);
  }

  // 策略管理
  createPolicy(
    policyId: string,
    name: string,
    description: string,
    rules: any[]
  ): void {
    this.policyManager.createPolicy(policyId, name, description, rules);
  }

  // 创建默认策略模板
  createTemplatePolicy(templateType: 'default' | 'strict' | 'permissive'): any {
    return this.policyManager.createTemplatePolicy(templateType);
  }

  // 安全检查
  checkSecurity(
    policyId: string,
    walletAddress: string,
    amount: number,
    recipient: string,
    token: string = 'USDC',
    method: string = 'transfer',
    category: string = 'general'
  ): {
    allowed: boolean;
    reason?: string;
    requiresHumanApproval: boolean;
  } {
    // 1. 检查策略
    const policyCheck = this.policyManager.evaluatePolicy(policyId, {
      amount,
      category,
      recipient,
      token,
      method,
      time: Date.now(),
    });

    if (policyCheck.action === 'deny') {
      return {
        allowed: false,
        reason: 'Policy denied',
        requiresHumanApproval: false,
      };
    }

    // 2. 检查预算
    const budgetCheck = this.budgetManager.checkBudget(walletAddress, amount);
    if (!budgetCheck.allowed) {
      return {
        allowed: false,
        reason: budgetCheck.reason,
        requiresHumanApproval: false,
      };
    }

    // 3. 检查白名单（如果有）
    // 这里可以根据需要添加白名单检查逻辑

    return {
      allowed: true,
      requiresHumanApproval: policyCheck.action === 'require_approval',
    };
  }

  // 更新预算
  updateBudget(walletAddress: string, amount: number): void {
    this.budgetManager.updateSpent(walletAddress, amount);
  }

  // 白名单管理
  createWhitelist(
    whitelistId: string,
    recipients: string[] = [],
    tokens: string[] = [],
    categories: string[] = [],
    methods: string[] = []
  ): void {
    this.whitelistManager.createWhitelist(
      whitelistId,
      recipients,
      tokens,
      categories,
      methods
    );
  }

  addToWhitelist(
    whitelistId: string,
    type: 'recipients' | 'tokens' | 'categories' | 'methods',
    items: string[]
  ): boolean {
    return this.whitelistManager.addToWhitelist(whitelistId, type, items);
  }

  // 获取安全管理器实例
  getPolicyManager(): EnhancedPolicyManager {
    return this.policyManager;
  }

  getBudgetManager(): BudgetManager {
    return this.budgetManager;
  }

  getWhitelistManager(): WhitelistManager {
    return this.whitelistManager;
  }
}

export default SecurityManager;
