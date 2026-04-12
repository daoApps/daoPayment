interface AuditRecord {
  id: string;
  agentId: string;
  taskId: string;
  userId: string;
  walletAddress: string;
  recipient: string;
  amount: number;
  token: string;
  category: string;
  purpose: string;
  policyHit: string[];
  signatureMethod: string;
  riskLevel: 'low' | 'medium' | 'high';
  requiresApproval: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  timestamp: number;
  completedAt?: number;
}

export default AuditRecord;