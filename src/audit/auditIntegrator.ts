import AuditManager from './auditManager.js';
import PaymentReceiptGenerator from './paymentReceipt.js';
import { PaymentRequest, PaymentResult } from '../agent/paymentExecutor.js';

class AuditIntegrator {
  private auditManager: AuditManager;
  private receiptGenerator: PaymentReceiptGenerator;

  constructor() {
    this.auditManager = new AuditManager();
    this.receiptGenerator = new PaymentReceiptGenerator();
  }

  // 创建支付审计记录
  createPaymentAudit(
    paymentRequest: PaymentRequest,
    userId: string = 'default',
    taskId: string = 'default'
  ) {
    return this.auditManager.createRecord({
      agentId: paymentRequest.agentId,
      taskId,
      userId,
      walletAddress: paymentRequest.walletAddress,
      recipient: paymentRequest.recipient,
      amount: paymentRequest.amount,
      token: paymentRequest.token,
      category: paymentRequest.category,
      purpose: paymentRequest.purpose,
      policyHit: [], // 将在支付过程中更新
      signatureMethod: 'session-key', // 默认签名方法
      riskLevel:
        paymentRequest.amount > 100
          ? 'high'
          : paymentRequest.amount > 10
            ? 'medium'
            : 'low',
      requiresApproval: paymentRequest.amount > 50,
      approvalStatus: paymentRequest.amount > 50 ? 'pending' : 'approved',
      status: 'pending',
    });
  }

  // 更新支付审计记录
  updatePaymentAudit(
    auditId: string,
    paymentResult: PaymentResult,
    policyHit: string[] = []
  ) {
    const updates: any = {
      policyHit,
      status: paymentResult.success ? 'completed' : 'failed',
      completedAt: Date.now(),
    };

    if (paymentResult.txHash) {
      updates.txHash = paymentResult.txHash;
    }

    if (paymentResult.error) {
      updates.error = paymentResult.error;
    }

    if (paymentResult.requiresApproval) {
      updates.approvalStatus = 'pending';
    }

    return this.auditManager.updateRecord(auditId, updates);
  }

  // 生成支付收据
  generateReceipt(auditId: string) {
    const auditRecord = this.auditManager.getRecord(auditId);
    if (!auditRecord) {
      throw new Error('Audit record not found');
    }
    return this.receiptGenerator.generateReceipt(auditRecord);
  }

  // 获取审计记录
  getAuditRecord(auditId: string) {
    return this.auditManager.getRecord(auditId);
  }

  // 列出审计记录
  listAuditRecords(filters?: any) {
    return this.auditManager.listRecords(filters);
  }

  // 生成审计报告
  generateAuditReport(startTime: number, endTime: number) {
    return this.auditManager.generateReport(startTime, endTime);
  }
}

export default AuditIntegrator;
