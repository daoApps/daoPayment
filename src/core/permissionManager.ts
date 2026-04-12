import AuthorizationManager from './authorizationManager.js';

interface Permission {
  id: string;
  agentId: string;
  walletAddress: string;
  permissions: string[];
  expiration: number;
  maxAmount: number;
  dailyLimit: number;
  createdAt: number;
  lastUsed: number;
}

class PermissionManager {
  private authorizationManager: AuthorizationManager;
  private permissions: Map<string, Permission> = new Map();

  constructor(encryptionKey: string) {
    this.authorizationManager = new AuthorizationManager(encryptionKey);
  }

  // 创建权限
  createPermission(
    agentId: string,
    walletAddress: string,
    permissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): string {
    const permissionId = this.authorizationManager.grantPermission(
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit
    );

    const permission: Permission = {
      id: permissionId,
      agentId,
      walletAddress,
      permissions,
      expiration,
      maxAmount,
      dailyLimit,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

    this.permissions.set(permissionId, permission);
    return permissionId;
  }

  // 更新权限
  updatePermission(
    permissionId: string,
    updates: {
      permissions?: string[];
      expiration?: number;
      maxAmount?: number;
      dailyLimit?: number;
    }
  ): boolean {
    const permission = this.permissions.get(permissionId);
    if (!permission) {
      return false;
    }

    // 撤销旧权限
    this.authorizationManager.revokePermission(permissionId);

    // 创建新权限
    const newPermissionId = this.authorizationManager.grantPermission(
      permission.agentId,
      permission.walletAddress,
      updates.permissions || permission.permissions,
      updates.expiration || permission.expiration,
      updates.maxAmount || permission.maxAmount,
      updates.dailyLimit || permission.dailyLimit
    );

    // 更新权限记录
    const updatedPermission: Permission = {
      ...permission,
      ...updates,
      id: newPermissionId,
      lastUsed: Date.now(),
    };

    this.permissions.delete(permissionId);
    this.permissions.set(newPermissionId, updatedPermission);

    return true;
  }

  // 撤销权限
  revokePermission(permissionId: string): boolean {
    const result = this.authorizationManager.revokePermission(permissionId);
    if (result) {
      this.permissions.delete(permissionId);
    }
    return result;
  }

  // 获取权限
  getPermission(permissionId: string): Permission | undefined {
    return this.permissions.get(permissionId);
  }

  // 获取 Agent 的所有权限
  getAgentPermissions(agentId: string): Permission[] {
    return Array.from(this.permissions.values()).filter(
      (p) => p.agentId === agentId
    );
  }

  // 获取钱包的所有权限
  getWalletPermissions(walletAddress: string): Permission[] {
    return Array.from(this.permissions.values()).filter(
      (p) => p.walletAddress === walletAddress
    );
  }

  // 检查权限
  checkPermission(
    permissionId: string,
    action: string,
    amount: number
  ): boolean {
    const permission = this.permissions.get(permissionId);
    if (permission) {
      permission.lastUsed = Date.now();
      return this.authorizationManager.checkPermission(
        permissionId,
        action,
        amount
      );
    }
    return false;
  }

  // 清理过期权限
  cleanupExpiredPermissions(): number {
    const now = Date.now();
    let count = 0;

    for (const [permissionId, permission] of this.permissions.entries()) {
      if (now > permission.expiration) {
        this.revokePermission(permissionId);
        count++;
      }
    }

    return count;
  }
}

export default PermissionManager;
