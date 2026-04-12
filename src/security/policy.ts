interface SecurityPolicy {
  maxSingleAmount: number;
  dailyLimit: number;
  weeklyLimit: number;
  requireHumanApprovalAbove: number;
  allowedRecipients: string[];
  allowedTokens: string[];
  allowedMethods: string[];
  blockedCategories: string[];
  allowedCategories: string[];
}

class PolicyManager {
  private policies: Map<string, SecurityPolicy> = new Map();

  createPolicy(
    policyId: string,
    maxSingleAmount: number,
    dailyLimit: number,
    weeklyLimit: number,
    requireHumanApprovalAbove: number,
    allowedRecipients: string[] = [],
    allowedTokens: string[] = [],
    allowedMethods: string[] = [],
    blockedCategories: string[] = [],
    allowedCategories: string[] = []
  ): void {
    const policy: SecurityPolicy = {
      maxSingleAmount,
      dailyLimit,
      weeklyLimit,
      requireHumanApprovalAbove,
      allowedRecipients,
      allowedTokens,
      allowedMethods,
      blockedCategories,
      allowedCategories
    };
    this.policies.set(policyId, policy);
  }

  getPolicy(policyId: string): SecurityPolicy | undefined {
    return this.policies.get(policyId);
  }

  updatePolicy(policyId: string, updates: Partial<SecurityPolicy>): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return false;
    }
    this.policies.set(policyId, { ...policy, ...updates });
    return true;
  }

  deletePolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  listPolicies(): string[] {
    return Array.from(this.policies.keys());
  }

  validateTransaction(
    policyId: string,
    amount: number,
    recipient: string,
    token: string,
    method: string,
    category: string
  ): {
    allowed: boolean;
    reason?: string;
    requiresHumanApproval: boolean;
  } {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return { allowed: false, reason: 'Policy not found', requiresHumanApproval: false };
    }

    if (amount > policy.maxSingleAmount) {
      return { 
        allowed: false, 
        reason: `Amount exceeds maximum single amount of ${policy.maxSingleAmount}`, 
        requiresHumanApproval: false 
      };
    }

    if (amount > policy.requireHumanApprovalAbove) {
      return { 
        allowed: true, 
        requiresHumanApproval: true 
      };
    }

    if (policy.allowedRecipients.length > 0 && !policy.allowedRecipients.includes(recipient)) {
      return { 
        allowed: false, 
        reason: 'Recipient not in allowed list', 
        requiresHumanApproval: false 
      };
    }

    if (policy.allowedTokens.length > 0 && !policy.allowedTokens.includes(token)) {
      return { 
        allowed: false, 
        reason: 'Token not in allowed list', 
        requiresHumanApproval: false 
      };
    }

    if (policy.allowedMethods.length > 0 && !policy.allowedMethods.includes(method)) {
      return { 
        allowed: false, 
        reason: 'Method not allowed', 
        requiresHumanApproval: false 
      };
    }

    if (policy.blockedCategories.includes(category)) {
      return { 
        allowed: false, 
        reason: 'Category is blocked', 
        requiresHumanApproval: false 
      };
    }

    if (policy.allowedCategories.length > 0 && !policy.allowedCategories.includes(category)) {
      return { 
        allowed: false, 
        reason: 'Category not in allowed list', 
        requiresHumanApproval: false 
      };
    }

    return { 
      allowed: true, 
      requiresHumanApproval: false 
    };
  }
}

export default PolicyManager;
export type { SecurityPolicy };