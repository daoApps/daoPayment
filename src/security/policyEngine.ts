interface PolicyRule {
  id: string;
  type:
    | 'amount'
    | 'category'
    | 'recipient'
    | 'token'
    | 'method'
    | 'time'
    | 'whitelist'
    | 'token_type'
    | 'transaction_count';
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
  value: any;
  action: 'allow' | 'deny' | 'require_approval';
  priority: number;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  createdAt: number;
  updatedAt: number;
  version: number;
  parentId?: string;
  tags?: string[];
}

class PolicyEngine {
  private policies: Map<string, Policy> = new Map();

  // 创建策略
  createPolicy(
    id: string,
    name: string,
    description: string,
    rules: PolicyRule[],
    parentId?: string,
    tags?: string[]
  ): Policy {
    const policy: Policy = {
      id,
      name,
      description,
      rules: rules.sort((a, b) => b.priority - a.priority), // 按优先级排序
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      parentId,
      tags,
    };

    this.policies.set(id, policy);
    return policy;
  }

  // 从父策略创建策略（继承）
  createPolicyFromParent(
    id: string,
    name: string,
    description: string,
    parentId: string,
    additionalRules: PolicyRule[] = [],
    tags?: string[]
  ): Policy | null {
    const parentPolicy = this.policies.get(parentId);
    if (!parentPolicy) {
      return null;
    }

    // 继承父策略的规则
    const inheritedRules = [...parentPolicy.rules];
    // 添加新规则
    const allRules = [...inheritedRules, ...additionalRules];

    const policy: Policy = {
      id,
      name,
      description,
      rules: allRules.sort((a, b) => b.priority - a.priority),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      parentId,
      tags,
    };

    this.policies.set(id, policy);
    return policy;
  }

  // 版本控制：创建策略的新版本
  createPolicyVersion(
    policyId: string,
    name: string,
    description: string,
    updatedRules: PolicyRule[]
  ): Policy | null {
    const existingPolicy = this.policies.get(policyId);
    if (!existingPolicy) {
      return null;
    }

    const newVersionId = `${policyId}-v${existingPolicy.version + 1}`;
    const policy: Policy = {
      id: newVersionId,
      name,
      description,
      rules: updatedRules.sort((a, b) => b.priority - a.priority),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: existingPolicy.version + 1,
      parentId: existingPolicy.parentId,
      tags: existingPolicy.tags,
    };

    this.policies.set(newVersionId, policy);
    return policy;
  }

  // 导出策略
  exportPolicy(policyId: string): Policy | null {
    return this.policies.get(policyId) || null;
  }

  // 导入策略
  importPolicy(policy: Policy): Policy {
    // 确保策略有唯一ID
    if (!this.policies.has(policy.id)) {
      this.policies.set(policy.id, policy);
    } else {
      // 如果策略已存在，创建新版本
      const existingPolicy = this.policies.get(policy.id)!;
      const newVersionId = `${policy.id}-v${existingPolicy.version + 1}`;
      const newPolicy = {
        ...policy,
        id: newVersionId,
        version: existingPolicy.version + 1,
        updatedAt: Date.now(),
      };
      this.policies.set(newVersionId, newPolicy);
      return newPolicy;
    }
    return policy;
  }

  // 更新策略
  updatePolicy(id: string, updates: Partial<Policy>): Policy | null {
    const policy = this.policies.get(id);
    if (!policy) {
      return null;
    }

    const updatedPolicy: Policy = {
      ...policy,
      ...updates,
      updatedAt: Date.now(),
      version: policy.version + 1, // 每次更新增加版本号
    };

    if (updates.rules) {
      updatedPolicy.rules = updates.rules.sort(
        (a, b) => b.priority - a.priority
      );
    }

    this.policies.set(id, updatedPolicy);
    return updatedPolicy;
  }

  // 按标签搜索策略
  searchPoliciesByTag(tag: string): Policy[] {
    return Array.from(this.policies.values()).filter(
      (policy) => policy.tags && policy.tags.includes(tag)
    );
  }

  // 获取策略的所有版本
  getPolicyVersions(policyBaseId: string): Policy[] {
    return Array.from(this.policies.values()).filter(
      (policy) =>
        policy.id === policyBaseId || policy.id.startsWith(`${policyBaseId}-v`)
    );
  }

  // 删除策略
  deletePolicy(id: string): boolean {
    return this.policies.delete(id);
  }

  // 获取策略
  getPolicy(id: string): Policy | undefined {
    return this.policies.get(id);
  }

  // 列出所有策略
  listPolicies(): Policy[] {
    return Array.from(this.policies.values());
  }

  // 评估策略
  evaluatePolicy(
    policyId: string,
    context: {
      amount?: number;
      category?: string;
      recipient?: string;
      token?: string;
      method?: string;
      time?: number;
    }
  ): {
    action: 'allow' | 'deny' | 'require_approval';
    matchedRules: PolicyRule[];
  } {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return { action: 'deny', matchedRules: [] };
    }

    const matchedRules: PolicyRule[] = [];

    for (const rule of policy.rules) {
      if (this.evaluateRule(rule, context)) {
        matchedRules.push(rule);
        // 一旦匹配到规则，返回对应动作
        return { action: rule.action, matchedRules };
      }
    }

    // 没有匹配到任何规则，默认拒绝
    return { action: 'deny', matchedRules };
  }

  // 评估单个规则
  private evaluateRule(rule: PolicyRule, context: any): boolean {
    const value = context[rule.type];
    if (value === undefined) {
      return false;
    }

    switch (rule.operator) {
      case 'eq':
        return value === rule.value;
      case 'ne':
        return value !== rule.value;
      case 'gt':
        return value > rule.value;
      case 'lt':
        return value < rule.value;
      case 'gte':
        return value >= rule.value;
      case 'lte':
        return value <= rule.value;
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value);
      case 'not_in':
        return Array.isArray(rule.value) && !rule.value.includes(value);
      default:
        return false;
    }
  }

  // 评估多个策略
  evaluateMultiplePolicies(
    policyIds: string[],
    context: any
  ): {
    action: 'allow' | 'deny' | 'require_approval';
    matchedRules: PolicyRule[];
  } {
    let finalAction: 'allow' | 'deny' | 'require_approval' = 'allow';
    const allMatchedRules: PolicyRule[] = [];

    for (const policyId of policyIds) {
      const result = this.evaluatePolicy(policyId, context);
      allMatchedRules.push(...result.matchedRules);

      // 优先级：deny > require_approval > allow
      if (result.action === 'deny') {
        finalAction = 'deny';
      } else if (
        result.action === 'require_approval' &&
        finalAction !== 'deny'
      ) {
        finalAction = 'require_approval';
      }
    }

    return { action: finalAction, matchedRules: allMatchedRules };
  }
}

export default PolicyEngine;
export type { Policy, PolicyRule };
