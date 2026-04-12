import PolicyEngine, { Policy, PolicyRule } from './policyEngine.js';
import PolicyStorage from './policyStorage.js';

class EnhancedPolicyManager {
  private policyEngine: PolicyEngine;
  private policyStorage: PolicyStorage;

  constructor(storagePath: string = './policies') {
    this.policyEngine = new PolicyEngine();
    this.policyStorage = new PolicyStorage(storagePath);
  }

  async initialize(): Promise<void> {
    await this.policyStorage.initialize();
    await this.loadPolicies();
  }

  // 加载所有策略
  private async loadPolicies(): Promise<void> {
    const policies = await this.policyStorage.loadAllPolicies();
    for (const policy of policies) {
      this.policyEngine.createPolicy(
        policy.id,
        policy.name,
        policy.description,
        policy.rules
      );
    }
  }

  // 创建策略
  async createPolicy(
    id: string,
    name: string,
    description: string,
    rules: PolicyRule[],
    parentId?: string,
    tags?: string[]
  ): Promise<Policy> {
    const policy = this.policyEngine.createPolicy(id, name, description, rules, parentId, tags);
    await this.policyStorage.savePolicy(policy);
    return policy;
  }

  // 从父策略创建策略（继承）
  async createPolicyFromParent(
    id: string,
    name: string,
    description: string,
    parentId: string,
    additionalRules: PolicyRule[] = [],
    tags?: string[]
  ): Promise<Policy | null> {
    const policy = this.policyEngine.createPolicyFromParent(id, name, description, parentId, additionalRules, tags);
    if (policy) {
      await this.policyStorage.savePolicy(policy);
    }
    return policy;
  }

  // 版本控制：创建策略的新版本
  async createPolicyVersion(
    policyId: string,
    name: string,
    description: string,
    updatedRules: PolicyRule[]
  ): Promise<Policy | null> {
    const policy = this.policyEngine.createPolicyVersion(policyId, name, description, updatedRules);
    if (policy) {
      await this.policyStorage.savePolicy(policy);
    }
    return policy;
  }

  // 导出策略
  exportPolicy(policyId: string): Policy | null {
    return this.policyEngine.exportPolicy(policyId);
  }

  // 导入策略
  async importPolicy(policy: Policy): Promise<Policy> {
    const importedPolicy = this.policyEngine.importPolicy(policy);
    await this.policyStorage.savePolicy(importedPolicy);
    return importedPolicy;
  }

  // 按标签搜索策略
  searchPoliciesByTag(tag: string): Policy[] {
    return this.policyEngine.searchPoliciesByTag(tag);
  }

  // 获取策略的所有版本
  getPolicyVersions(policyBaseId: string): Policy[] {
    return this.policyEngine.getPolicyVersions(policyBaseId);
  }

  // 更新策略
  async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy | null> {
    const policy = this.policyEngine.updatePolicy(id, updates);
    if (policy) {
      await this.policyStorage.savePolicy(policy);
    }
    return policy;
  }

  // 删除策略
  async deletePolicy(id: string): Promise<boolean> {
    const result = this.policyEngine.deletePolicy(id);
    if (result) {
      await this.policyStorage.deletePolicy(id);
    }
    return result;
  }

  // 获取策略
  getPolicy(id: string): Policy | undefined {
    return this.policyEngine.getPolicy(id);
  }

  // 列出所有策略
  listPolicies(): Policy[] {
    return this.policyEngine.listPolicies();
  }

  // 评估策略
  evaluatePolicy(policyId: string, context: any) {
    return this.policyEngine.evaluatePolicy(policyId, context);
  }

  // 评估多个策略
  evaluateMultiplePolicies(policyIds: string[], context: any) {
    return this.policyEngine.evaluateMultiplePolicies(policyIds, context);
  }

  // 创建常用策略模板
  async createTemplatePolicy(
    templateType: 'default' | 'strict' | 'permissive'
  ): Promise<Policy> {
    const id = `template-${templateType}-${Date.now()}`;
    let name: string;
    let description: string;
    let rules: PolicyRule[];

    switch (templateType) {
      case 'default':
        name = 'Default Policy';
        description = 'Default policy with basic security controls';
        rules = [
          {
            id: 'rule-1',
            type: 'amount',
            operator: 'gt',
            value: 100,
            action: 'deny',
            priority: 10,
          },
          {
            id: 'rule-2',
            type: 'amount',
            operator: 'gt',
            value: 50,
            action: 'require_approval',
            priority: 9,
          },
          {
            id: 'rule-3',
            type: 'category',
            operator: 'in',
            value: ['personal_transfer'],
            action: 'deny',
            priority: 8,
          },
          {
            id: 'rule-4',
            type: 'amount',
            operator: 'gt',
            value: 0,
            action: 'allow',
            priority: 1,
          },
        ];
        break;
      case 'strict':
        name = 'Strict Policy';
        description = 'Strict policy with tight security controls';
        rules = [
          {
            id: 'rule-1',
            type: 'amount',
            operator: 'gt',
            value: 50,
            action: 'deny',
            priority: 10,
          },
          {
            id: 'rule-2',
            type: 'amount',
            operator: 'gt',
            value: 20,
            action: 'require_approval',
            priority: 9,
          },
          {
            id: 'rule-3',
            type: 'category',
            operator: 'not_in',
            value: ['api', 'storage', 'compute'],
            action: 'deny',
            priority: 8,
          },
          {
            id: 'rule-4',
            type: 'amount',
            operator: 'gt',
            value: 0,
            action: 'allow',
            priority: 1,
          },
        ];
        break;
      case 'permissive':
        name = 'Permissive Policy';
        description = 'Permissive policy with minimal restrictions';
        rules = [
          {
            id: 'rule-1',
            type: 'amount',
            operator: 'gt',
            value: 1000,
            action: 'deny',
            priority: 10,
          },
          {
            id: 'rule-2',
            type: 'amount',
            operator: 'gt',
            value: 500,
            action: 'require_approval',
            priority: 9,
          },
          {
            id: 'rule-3',
            type: 'amount',
            operator: 'gt',
            value: 0,
            action: 'allow',
            priority: 1,
          },
        ];
        break;
      default:
        throw new Error('Invalid template type');
    }

    return this.createPolicy(id, name, description, rules);
  }
}

export default EnhancedPolicyManager;
