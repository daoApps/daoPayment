import * as fs from 'fs';
import * as path from 'path';
import { Policy } from './policyEngine';

class PolicyStorage {
  private storagePath: string;

  constructor(storagePath: string = './policies') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  // 保存策略
  savePolicy(policy: Policy): void {
    const policyPath = path.join(this.storagePath, `${policy.id}.json`);
    fs.writeFileSync(policyPath, JSON.stringify(policy, null, 2));
  }

  // 加载策略
  loadPolicy(id: string): Policy | null {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    if (!fs.existsSync(policyPath)) {
      return null;
    }
    try {
      const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
      return policy;
    } catch (error) {
      console.error(`Error loading policy ${id}:`, error);
      return null;
    }
  }

  // 加载所有策略
  loadAllPolicies(): Policy[] {
    const policies: Policy[] = [];
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const policyId = path.basename(file, '.json');
        const policy = this.loadPolicy(policyId);
        if (policy) {
          policies.push(policy);
        }
      }
    }
    return policies;
  }

  // 删除策略
  deletePolicy(id: string): boolean {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    if (fs.existsSync(policyPath)) {
      fs.unlinkSync(policyPath);
      return true;
    }
    return false;
  }

  // 检查策略是否存在
  policyExists(id: string): boolean {
    const policyPath = path.join(this.storagePath, `${id}.json`);
    return fs.existsSync(policyPath);
  }
}

export default PolicyStorage;