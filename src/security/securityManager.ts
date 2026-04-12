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

  async initialize(): Promise<void> {
    await this.policyManager.initialize();
  }

  // 策略管理
  async createPolicy(
    policyId: string,
    name: string,
    description: string,
    rules: any[]
  ): Promise<void> {
    await this.policyManager.createPolicy(policyId, name, description, rules);
  }

  // 创建默认策略模板
  async createTemplatePolicy(templateType: 'default' | 'strict' | 'permissive'): Promise<any> {
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
    category: string = 'general',
    metadata?: Record<string, any>
  ): {
    allowed: boolean;
    reason?: string;
    requiresHumanApproval: boolean;
    alerts?: string[];
    riskScore?: number;
  } {
    const alerts: string[] = [];
    let riskScore = 0;

    // 1. 检查策略
    const policyCheck = this.policyManager.evaluatePolicy(policyId, {
      amount,
      category,
      recipient,
      token,
      method,
      time: Date.now(),
      metadata,
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

    if (budgetCheck.alerts) {
      alerts.push(...budgetCheck.alerts);
    }

    // 3. 检查白名单
    const whitelistCheck = this.checkWhitelist(recipient, token, category, method);
    if (!whitelistCheck.allowed) {
      return {
        allowed: false,
        reason: whitelistCheck.reason,
        requiresHumanApproval: false,
      };
    }

    // 4. 风险评估
    const riskAssessment = this.assessRisk(walletAddress, amount, recipient, token, method, category, metadata);
    riskScore = riskAssessment.score;
    if (riskAssessment.alerts) {
      alerts.push(...riskAssessment.alerts);
    }

    // 5. 异常检测
    const anomalyCheck = this.detectAnomalies(walletAddress, amount, recipient, token, method);
    if (!anomalyCheck.allowed) {
      return {
        allowed: false,
        reason: anomalyCheck.reason,
        requiresHumanApproval: false,
      };
    }

    // 6. 交易模式分析
    const patternAnalysis = this.analyzeTransactionPattern(walletAddress, amount, recipient, token, method);
    if (!patternAnalysis.allowed) {
      return {
        allowed: false,
        reason: patternAnalysis.reason,
        requiresHumanApproval: false,
      };
    }

    // 7. 综合评估
    const finalDecision = this.makeFinalDecision(policyCheck.action, riskScore, alerts);

    return {
      allowed: finalDecision.allowed,
      reason: finalDecision.reason,
      requiresHumanApproval: finalDecision.requiresHumanApproval,
      alerts: alerts.length > 0 ? alerts : undefined,
      riskScore,
    };
  }

  // 检查白名单
  private checkWhitelist(
    recipient: string,
    token: string,
    category: string,
    method: string
  ): {
    allowed: boolean;
    reason?: string;
  } {
    // 获取所有活跃的白名单
    const whitelists = this.whitelistManager.listWhitelists().filter(w => w.active);
    
    // 按优先级排序
    whitelists.sort((a, b) => b.priority - a.priority);

    for (const whitelist of whitelists) {
      switch (whitelist.type) {
        case 'recipients':
          if (whitelist.items.some(item => item.value === recipient)) {
            return { allowed: true };
          }
          break;
        case 'tokens':
          if (whitelist.items.some(item => item.value === token)) {
            return { allowed: true };
          }
          break;
        case 'categories':
          if (whitelist.items.some(item => item.value === category)) {
            return { allowed: true };
          }
          break;
        case 'methods':
          if (whitelist.items.some(item => item.value === method)) {
            return { allowed: true };
          }
          break;
        case 'mixed':
          // 混合类型白名单，检查所有条件
          const recipientAllowed = whitelist.items.some(item => item.value === recipient);
          const tokenAllowed = whitelist.items.some(item => item.value === token);
          const categoryAllowed = whitelist.items.some(item => item.value === category);
          const methodAllowed = whitelist.items.some(item => item.value === method);
          
          if (recipientAllowed && tokenAllowed && categoryAllowed && methodAllowed) {
            return { allowed: true };
          }
          break;
      }
    }

    return { 
      allowed: false, 
      reason: 'Not in any whitelist'
    };
  }

  // 风险评估
  private assessRisk(
    walletAddress: string,
    amount: number,
    recipient: string,
    token: string,
    method: string,
    category: string,
    metadata?: Record<string, any>
  ): {
    score: number;
    alerts?: string[];
  } {
    const alerts: string[] = [];
    let score = 0;

    // 金额风险
    if (amount > 10000) {
      score += 30;
      alerts.push('High amount transaction detected');
    } else if (amount > 1000) {
      score += 15;
      alerts.push('Medium amount transaction detected');
    }

    // 新地址风险
    if (metadata?.isNewRecipient) {
      score += 25;
      alerts.push('Transaction to new recipient');
    }

    // 时间风险（非工作时间）
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6 || hour > 22) {
      score += 10;
      alerts.push('Transaction during off-hours');
    }

    // 方法风险
    if (method === 'approve' || method === 'delegate') {
      score += 20;
      alerts.push('High-risk method detected');
    }

    // 类别风险
    if (category === 'high_risk') {
      score += 25;
      alerts.push('High-risk category transaction');
    }

    return { score, alerts };
  }

  // 异常检测
  private detectAnomalies(
    walletAddress: string,
    amount: number,
    recipient: string,
    token: string,
    method: string
  ): {
    allowed: boolean;
    reason?: string;
  } {
    // 这里可以实现更复杂的异常检测逻辑
    // 例如：
    // 1. 检测短时间内的重复交易
    // 2. 检测与历史交易模式的偏离
    // 3. 检测异常的交易频率

    // 简单实现：检测异常大额交易
    const budget = this.budgetManager.getBudget(walletAddress);
    if (budget) {
      const dailyPercentage = (amount / budget.dailyLimit) * 100;
      if (dailyPercentage > 90) {
        return {
          allowed: false,
          reason: 'Abnormally large transaction relative to daily budget'
        };
      }
    }

    return { allowed: true };
  }

  // 交易模式分析
  private analyzeTransactionPattern(
    walletAddress: string,
    amount: number,
    recipient: string,
    token: string,
    method: string
  ): {
    allowed: boolean;
    reason?: string;
  } {
    // 这里可以实现更复杂的交易模式分析
    // 例如：
    // 1. 检测可疑的交易模式
    // 2. 检测与已知欺诈模式的匹配
    // 3. 检测异常的交易序列

    // 简单实现：检测相同金额的重复交易
    const history = this.budgetManager.getBudgetHistory(walletAddress, 10);
    const recentSimilarTransactions = history.filter(h => 
      h.amount === amount && 
      h.type === 'debit' &&
      (Date.now() - h.timestamp) < 3600000 // 1小时内
    );

    if (recentSimilarTransactions.length > 3) {
      return {
        allowed: false,
        reason: 'Multiple similar transactions detected in a short period'
      };
    }

    return { allowed: true };
  }

  // 综合决策
  private makeFinalDecision(
    policyAction: 'allow' | 'deny' | 'require_approval',
    riskScore: number,
    alerts: string[]
  ): {
    allowed: boolean;
    reason?: string;
    requiresHumanApproval: boolean;
  } {
    // 基于风险分数和策略动作做出最终决策
    if (policyAction === 'deny') {
      return {
        allowed: false,
        reason: 'Policy denied',
        requiresHumanApproval: false,
      };
    }

    if (riskScore > 70) {
      return {
        allowed: false,
        reason: 'High risk transaction',
        requiresHumanApproval: false,
      };
    } else if (riskScore > 40 || policyAction === 'require_approval') {
      return {
        allowed: true,
        requiresHumanApproval: true,
      };
    }

    return {
      allowed: true,
      requiresHumanApproval: false,
    };
  }

  // 更新预算
  updateBudget(walletAddress: string, amount: number, description: string = 'Payment'): void {
    this.budgetManager.updateSpent(walletAddress, amount, description);
  }

  // 增加预算（用于退款等场景）
  addToBudget(walletAddress: string, amount: number, description: string = 'Refund'): void {
    this.budgetManager.addToBudget(walletAddress, amount, description);
  }

  // 获取安全评估报告
  getSecurityReport(policyId: string, walletAddress: string): {
    policy: any;
    budget: any;
    whitelists: any[];
    riskScore: number;
  } {
    const policy = this.policyManager.getPolicy(policyId);
    const budget = this.budgetManager.getBudget(walletAddress);
    const whitelists = this.whitelistManager.listWhitelists();
    
    // 计算风险分数（基于历史交易）
    const history = this.budgetManager.getBudgetHistory(walletAddress, 10);
    let riskScore = 0;
    
    if (history.length > 0) {
      const recentHighAmounts = history.filter(h => h.amount > 1000);
      riskScore = recentHighAmounts.length * 10;
    }

    return {
      policy,
      budget,
      whitelists,
      riskScore,
    };
  }

  // 白名单管理
  createWhitelist(
    whitelistId: string,
    name: string,
    description: string,
    type: 'recipients' | 'tokens' | 'categories' | 'methods' | 'mixed',
    items: string[] = [],
    priority: number = 1,
    expiresAt?: number
  ): void {
    this.whitelistManager.createWhitelist(
      whitelistId,
      name,
      description,
      type,
      items,
      priority,
      expiresAt
    );
  }

  addToWhitelist(
    whitelistId: string,
    items: string[],
    expiresAt?: number
  ): boolean {
    return this.whitelistManager.addToWhitelist(whitelistId, items, expiresAt);
  }

  removeFromWhitelist(
    whitelistId: string,
    items: string[]
  ): boolean {
    return this.whitelistManager.removeFromWhitelist(whitelistId, items);
  }

  // 激活/停用白名单
  toggleWhitelist(
    whitelistId: string,
    active: boolean
  ): boolean {
    return this.whitelistManager.toggleWhitelist(whitelistId, active);
  }

  // 清理过期白名单项目
  cleanupExpiredWhitelistItems(
    whitelistId: string
  ): number {
    return this.whitelistManager.cleanupExpiredItems(whitelistId);
  }

  // 清理所有过期白名单项目
  cleanupAllExpiredWhitelistItems(): number {
    return this.whitelistManager.cleanupAllExpiredItems();
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
