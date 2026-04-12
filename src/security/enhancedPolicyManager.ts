import PolicyEngine, { Policy, PolicyRule } from './policyEngine';
import PolicyStorage from './policyStorage';

class EnhancedPolicyManager {
  private policyEngine: PolicyEngine;
  private policyStorage: PolicyStorage;

  constructor(storagePath: string = './policies') {
    this.policyEngine = new PolicyEngine();
    this.policyStorage = new PolicyStorage(storagePath);
    this.loadPolicies();
  }

  // 加载所有策略
  private loadPolicies(): void {
    const policies = this.policyStorage.loadAllPolicies();
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
  createPolicy(
    id: string,
    name: string,
    description: string,
    rules: PolicyRule[]
  ): Policy {
    const policy = this.policyEngine.createPolicy(id, name, description, rules);
    this.policyStorage.savePolicy(policy);
    return policy;
  }

  // 更新策略
  updatePolicy(id: string, updates: Partial<Policy>): Policy | null {
    const policy = this.policyEngine.updatePolicy(id, updates);
    if (policy) {
      this.policyStorage.savePolicy(policy);
    }
    return policy;
  }

  // 删除策略
  deletePolicy(id: string): boolean {
    const result = this.policyEngine.deletePolicy(id);
    if (result) {
      this.policyStorage.deletePolicy(id);
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
  createTemplatePolicy(templateType: 'default' | 'strict' | 'permissive'): Policy {
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
            priority: 10
          },
          {
            id: 'rule-2',
            type: 'amount',
            operator: 'gt',
            value: 50,
            action: 'require_approval',
            priority: 9
          },
          {
            id: 'rule-3',
            type: 'category',
            operator: 'in',
            value: ['personal_transfer'],
            action: 'deny',
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
            priority: 10
          },
          {
            id: 'rule-2',
            type: 'amount',
            operator: 'gt',
            value: 20,
            action: 'require_approval',
            priority: 9
          },
          {
            id: 'rule-3',
            type: 'category',
            operator: 'not_in',
            value: ['api', 'storage', 'compute'],
            action: 'deny',
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
            type: 'amount',
            operator: 'gt',
            value: 0,
            action: 'allow',
            priority: 1
          }
        ];
        break;
      default:
        throw new Error('Invalid template type');
    }

    return this.createPolicy(id, name, description, rules);
  }
}

export default EnhancedPolicyManager;