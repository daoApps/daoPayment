export interface Wallet {
  address: string;
  balance?: string;
  isDeployed?: boolean;
}

export interface Policy {
  id: string;
  name: string;
  maxDailySpend: string;
  requireApprovalAbove: string;
  allowedRecipients: string[];
  allowedTokens: string[];
  allowedCategories: string[];
  blockedMethods: string[];
  isActive?: boolean;
  createdAt?: number;
}

export interface AuditRecord {
  id: string;
  timestamp: number;
  action: string;
  amount?: string;
  recipient?: string;
  status: 'success' | 'failed' | 'pending';
  txHash?: string;
  policyId?: string;
  details?: Record<string, any>;
}
