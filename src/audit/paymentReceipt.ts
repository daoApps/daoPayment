import AuditRecord from './auditRecord';

interface PaymentReceipt {
  receiptId: string;
  transactionId: string;
  agentId: string;
  taskId: string;
  userId: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  category: string;
  purpose: string;
  policyHit: string[];
  signatureMethod: string;
  riskLevel: 'low' | 'medium' | 'high';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  completedAt?: number;
  network: string;
  blockNumber?: number;
  gasUsed?: number;
}

class PaymentReceiptGenerator {
  generateReceipt(auditRecord: AuditRecord, network: string = 'monad-testnet'): PaymentReceipt {
    return {
      receiptId: `receipt-${auditRecord.id}`,
      transactionId: auditRecord.txHash || auditRecord.id,
      agentId: auditRecord.agentId,
      taskId: auditRecord.taskId,
      userId: auditRecord.userId,
      from: auditRecord.walletAddress,
      to: auditRecord.recipient,
      amount: auditRecord.amount,
      token: auditRecord.token,
      category: auditRecord.category,
      purpose: auditRecord.purpose,
      policyHit: auditRecord.policyHit,
      signatureMethod: auditRecord.signatureMethod,
      riskLevel: auditRecord.riskLevel,
      approvalStatus: auditRecord.approvalStatus,
      status: auditRecord.status,
      timestamp: auditRecord.timestamp,
      completedAt: auditRecord.completedAt,
      network
    };
  }

  generateReceiptJSON(receipt: PaymentReceipt): string {
    return JSON.stringify(receipt, null, 2);
  }

  generateReceiptText(receipt: PaymentReceipt): string {
    return `
PAYMENT RECEIPT
===============
Receipt ID: ${receipt.receiptId}
Transaction ID: ${receipt.transactionId}

Agent: ${receipt.agentId}
Task: ${receipt.taskId}
User: ${receipt.userId}

From: ${receipt.from}
To: ${receipt.to}
Amount: ${receipt.amount} ${receipt.token}
Category: ${receipt.category}
Purpose: ${receipt.purpose}

Policy Hits: ${receipt.policyHit.join(', ')}
Signature Method: ${receipt.signatureMethod}
Risk Level: ${receipt.riskLevel}
Approval Status: ${receipt.approvalStatus}
Status: ${receipt.status}

Timestamp: ${new Date(receipt.timestamp).toISOString()}
${receipt.completedAt ? `Completed At: ${new Date(receipt.completedAt).toISOString()}` : ''}

Network: ${receipt.network}
${receipt.blockNumber ? `Block Number: ${receipt.blockNumber}` : ''}
${receipt.gasUsed ? `Gas Used: ${receipt.gasUsed}` : ''}
`;
  }
}

export default PaymentReceiptGenerator;
export type { PaymentReceipt };