import WalletManager from './walletManager';
import RecoveryManager from './recoveryManager';
import PermissionManager from './permissionManager';
import SessionKeyManager from './sessionKeyManager';
import SessionKeyIntegrator from './sessionKeyIntegrator';
import SecurityManager from '../security/securityManager';
import AuditIntegrator from '../audit/auditIntegrator';
import AgentInterface from '../agent/agentInterface';
import PaymentExecutor from '../agent/paymentExecutor';

class MainManager {
  private walletManager: WalletManager;
  private recoveryManager: RecoveryManager;
  private permissionManager: PermissionManager;
  private sessionKeyManager: SessionKeyManager;
  private sessionKeyIntegrator: SessionKeyIntegrator;
  private securityManager: SecurityManager;
  private auditIntegrator: AuditIntegrator;
  private agentInterface: AgentInterface;

  constructor(encryptionKey: string = 'default-encryption-key') {
    this.walletManager = new WalletManager();
    this.recoveryManager = new RecoveryManager();
    this.permissionManager = new PermissionManager(encryptionKey);
    this.sessionKeyManager = new SessionKeyManager();
    this.securityManager = new SecurityManager();
    this.auditIntegrator = new AuditIntegrator();
    const paymentExecutor = new PaymentExecutor(this.securityManager);
    this.sessionKeyIntegrator = new SessionKeyIntegrator(paymentExecutor);
    this.agentInterface = new AgentInterface(encryptionKey, this.securityManager);
  }

  // 钱包管理
  createWallet(): string {
    const wallet = this.walletManager.createWallet();
    const walletAddress = wallet.getAddress();
    // 为新钱包生成恢复助记词
    this.recoveryManager.generateRecoverySeed(walletAddress);
    return walletAddress;
  }

  getWallet(address: string) {
    return this.walletManager.getWallet(address);
  }

  listWallets(): string[] {
    return this.walletManager.listWallets();
  }

  // 恢复管理
  generateRecoverySeed(walletAddress: string): string {
    return this.recoveryManager.generateRecoverySeed(walletAddress);
  }

  recoverWallet(seedPhrase: string) {
    return this.recoveryManager.recoverWallet(seedPhrase);
  }

  getRecoverySeed(walletAddress: string): string | null {
    return this.recoveryManager.getRecoverySeed(walletAddress);
  }

  // 权限管理
  createPermission(
    agentId: string,
    walletAddress: string,
    permissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): string {
    return this.permissionManager.createPermission(
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit
    );
  }

  updatePermission(
    permissionId: string,
    updates: {
      permissions?: string[];
      expiration?: number;
      maxAmount?: number;
      dailyLimit?: number;
    }
  ): boolean {
    return this.permissionManager.updatePermission(permissionId, updates);
  }

  revokePermission(permissionId: string): boolean {
    return this.permissionManager.revokePermission(permissionId);
  }

  getAgentPermissions(agentId: string) {
    return this.permissionManager.getAgentPermissions(agentId);
  }

  // 安全管理
  createPolicy(
    policyId: string,
    name: string,
    description: string,
    rules: any[]
  ): void {
    this.securityManager.createPolicy(policyId, name, description, rules);
  }

  // 创建默认策略模板
  createTemplatePolicy(templateType: 'default' | 'strict' | 'permissive'): any {
    return this.securityManager.createTemplatePolicy(templateType);
  }

  // Agent 接口
  getAgentInterface(): AgentInterface {
    return this.agentInterface;
  }

  // 获取审计管理器
  getAuditIntegrator(): AuditIntegrator {
    return this.auditIntegrator;
  }

  // 获取安全管理器
  getSecurityManager(): SecurityManager {
    return this.securityManager;
  }

  // 清理过期权限
  cleanupExpiredPermissions(): number {
    return this.permissionManager.cleanupExpiredPermissions();
  }

  // Session Key 管理
  generateSessionKey(
    agentId: string,
    walletAddress: string,
    permissions: string[] = ['transfer'],
    expiration: number = Date.now() + 24 * 60 * 60 * 1000,
    maxAmount: number = 5,
    dailyLimit: number = 20
  ) {
    return this.sessionKeyIntegrator.generateSessionKey(
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit
    );
  }

  executePaymentWithSessionKey(
    sessionKeyId: string,
    walletAddress: string,
    paymentRequest: any
  ) {
    const wallet = this.walletManager.getWallet(walletAddress);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return this.sessionKeyIntegrator.executePaymentWithSessionKey(
      sessionKeyId,
      wallet,
      paymentRequest
    );
  }

  revokeSessionKey(sessionKeyId: string): boolean {
    return this.sessionKeyIntegrator.revokeSessionKey(sessionKeyId);
  }

  rotateSessionKey(sessionKeyId: string) {
    return this.sessionKeyIntegrator.rotateSessionKey(sessionKeyId);
  }

  getSessionKey(sessionKeyId: string) {
    return this.sessionKeyIntegrator.getSessionKey(sessionKeyId);
  }

  getAgentSessionKeys(agentId: string) {
    return this.sessionKeyIntegrator.getAgentSessionKeys(agentId);
  }

  cleanupExpiredSessionKeys(): number {
    return this.sessionKeyIntegrator.cleanupExpiredKeys();
  }
}

export default MainManager;