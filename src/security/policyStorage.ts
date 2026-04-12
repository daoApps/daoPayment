import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Policy } from './policyEngine.js';

class PolicyStorage {
  private storagePath: string;

  constructor(storagePath: string = './policies') {
    this.storagePath = storagePath;
  }

  async initialize(): Promise<void> {
    try {
      await fsPromises.access(this.storagePath);
    } catch {
      await fsPromises.mkdir(this.storagePath, { recursive: true });
    }
  }

  // 保存策略
  async savePolicy(policy: Policy): Promise<void> {
    const policyPath = path.join(this.storagePath, `${policy.id}.json`);
    await fsPromises.writeFile(policyPath, JSON.stringify(policy, null, 2), 'utf8');
  }

  // 加载策略
  async loadPolicy(id: string): Promise<Policy | null> {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    try {
      await fsPromises.access(policyPath);
      const data = await fsPromises.readFile(policyPath, 'utf8');
      const policy = JSON.parse(data);
      return policy;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      console.error(`Error loading policy ${id}:`, error);
      return null;
    }
  }

  // 加载所有策略
  async loadAllPolicies(): Promise<Policy[]> {
    const policies: Policy[] = [];
    try {
      const files = await fsPromises.readdir(this.storagePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const policyId = path.basename(file, '.json');
          const policy = await this.loadPolicy(policyId);
          if (policy) {
            policies.push(policy);
          }
        }
      }
    } catch (error) {
      console.error('Error loading all policies:', error);
    }
    return policies;
  }

  // 删除策略
  async deletePolicy(id: string): Promise<boolean> {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    try {
      await fsPromises.unlink(policyPath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  // 检查策略是否存在
  async policyExists(id: string): Promise<boolean> {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    try {
      await fsPromises.access(policyPath);
      return true;
    } catch {
      return false;
    }
  }
}

export default PolicyStorage;
