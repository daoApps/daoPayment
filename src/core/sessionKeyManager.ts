import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

interface SessionKey {
  id: string;
  agentId: string;
  walletAddress: string;
  publicKey: string;
  privateKey: string;
  permissions: string[];
  expiration: number;
  maxAmount: number;
  dailyLimit: number;
  createdAt: number;
  lastUsed: number;
}

class SessionKeyManager {
  private storagePath: string;
  private sessionKeys: Map<string, SessionKey> = new Map();

  constructor(storagePath: string = './session-keys') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadSessionKeys();
    this.cleanupExpiredKeys();
  }

  private loadSessionKeys(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const keyPath = path.join(this.storagePath, file);
        try {
          const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
          this.sessionKeys.set(key.id, key);
        } catch (error) {
          console.error(`Error loading session key from ${file}:`, error);
        }
      }
    }
  }

  private saveSessionKey(key: SessionKey): void {
    const keyPath = path.join(this.storagePath, `${key.id}.json`);
    fs.writeFileSync(keyPath, JSON.stringify(key, null, 2));
  }

  // 生成 Session Key
  generateSessionKey(
    agentId: string,
    walletAddress: string,
    permissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): SessionKey {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // expiration 参数是相对秒数，转换为绝对时间戳
    const expirationTimestamp = Date.now() + expiration * 1000;

    const sessionKey: SessionKey = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      walletAddress,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString(),
      permissions,
      expiration: expirationTimestamp,
      maxAmount,
      dailyLimit,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    };

    this.sessionKeys.set(sessionKey.id, sessionKey);
    this.saveSessionKey(sessionKey);

    return sessionKey;
  }

  // 获取 Session Key
  getSessionKey(keyId: string): SessionKey | undefined {
    return this.sessionKeys.get(keyId);
  }

  // 验证 Session Key
  validateSessionKey(keyId: string, action: string, amount: number): boolean {
    const key = this.sessionKeys.get(keyId);
    if (!key) {
      return false;
    }

    // 检查是否过期
    if (Date.now() > key.expiration) {
      this.revokeSessionKey(keyId);
      return false;
    }

    // 检查权限
    if (!key.permissions.includes(action)) {
      return false;
    }

    // 检查金额限制
    if (amount > key.maxAmount) {
      return false;
    }

    // 更新最后使用时间
    key.lastUsed = Date.now();
    this.saveSessionKey(key);

    return true;
  }

  // 撤销 Session Key
  revokeSessionKey(keyId: string): boolean {
    const key = this.sessionKeys.get(keyId);
    if (key) {
      const keyPath = path.join(this.storagePath, `${keyId}.json`);
      if (fs.existsSync(keyPath)) {
        fs.unlinkSync(keyPath);
      }
      return this.sessionKeys.delete(keyId);
    }
    return false;
  }

  // 获取 Agent 的所有 Session Key
  getAgentSessionKeys(agentId: string): SessionKey[] {
    return Array.from(this.sessionKeys.values()).filter(
      (key) => key.agentId === agentId
    );
  }

  // 获取钱包的所有 Session Key
  getWalletSessionKeys(walletAddress: string): SessionKey[] {
    return Array.from(this.sessionKeys.values()).filter(
      (key) => key.walletAddress === walletAddress
    );
  }

  // 清理过期的 Session Key
  cleanupExpiredKeys(): number {
    const now = Date.now();
    let count = 0;

    for (const [keyId, key] of this.sessionKeys.entries()) {
      if (now > key.expiration) {
        this.revokeSessionKey(keyId);
        count++;
      }
    }

    return count;
  }

  // 轮换 Session Key
  rotateSessionKey(keyId: string): SessionKey | null {
    const oldKey = this.sessionKeys.get(keyId);
    if (!oldKey) {
      return null;
    }

    // 撤销旧密钥
    this.revokeSessionKey(keyId);

    // 生成新密钥
    return this.generateSessionKey(
      oldKey.agentId,
      oldKey.walletAddress,
      oldKey.permissions,
      oldKey.expiration,
      oldKey.maxAmount,
      oldKey.dailyLimit
    );
  }
}

export default SessionKeyManager;
export type { SessionKey };
