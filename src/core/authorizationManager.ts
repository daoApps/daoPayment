import SecureStorage from './secureStorage.js';

interface AgentPermission {
  agentId: string;
  walletAddress: string;
  permissions: string[];
  expiration: number;
  maxAmount: number;
  dailyLimit: number;
}

class AuthorizationManager {
  private secureStorage: SecureStorage;
  private permissions: Map<string, AgentPermission> = new Map();

  constructor(encryptionKey: string) {
    this.secureStorage = new SecureStorage(
      encryptionKey,
      './secure-storage/permissions'
    );
    this.loadPermissions();
  }

  private loadPermissions(): void {
    // 在实际实现中，这里应该从安全存储中加载权限
    // 目前简化实现，使用内存存储
  }

  grantPermission(
    agentId: string,
    walletAddress: string,
    permissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): string {
    const permissionId = `${agentId}:${walletAddress}:${Date.now()}`;
    const permission: AgentPermission = {
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit,
    };
    this.permissions.set(permissionId, permission);
    // 在实际实现中，这里应该将权限存储到安全存储中
    return permissionId;
  }

  checkPermission(
    permissionId: string,
    action: string,
    amount: number
  ): boolean {
    const permission = this.permissions.get(permissionId);
    if (!permission) {
      return false;
    }

    if (Date.now() > permission.expiration) {
      this.permissions.delete(permissionId);
      return false;
    }

    if (!permission.permissions.includes(action)) {
      return false;
    }

    if (amount > permission.maxAmount) {
      return false;
    }

    // 这里应该检查每日限额，简化实现

    return true;
  }

  revokePermission(permissionId: string): boolean {
    return this.permissions.delete(permissionId);
  }

  getAgentPermissions(agentId: string): AgentPermission[] {
    return Array.from(this.permissions.values()).filter(
      (p) => p.agentId === agentId
    );
  }

  clearExpiredPermissions(): void {
    const now = Date.now();
    for (const [permissionId, permission] of this.permissions.entries()) {
      if (now > permission.expiration) {
        this.permissions.delete(permissionId);
      }
    }
  }
}

export default AuthorizationManager;
