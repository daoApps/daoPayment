import AuthorizationManager from '../core/authorizationManager';

interface Agent {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: number;
  lastUsed: number;
}

class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private authorizationManager: AuthorizationManager;

  constructor(encryptionKey: string) {
    this.authorizationManager = new AuthorizationManager(encryptionKey);
  }

  registerAgent(id: string, name: string, description: string): void {
    const agent: Agent = {
      id,
      name,
      description,
      permissions: [],
      createdAt: Date.now(),
      lastUsed: Date.now()
    };
    this.agents.set(id, agent);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  updateAgentLastUsed(id: string): void {
    const agent = this.agents.get(id);
    if (agent) {
      agent.lastUsed = Date.now();
    }
  }

  requestPermission(
    agentId: string,
    walletAddress: string,
    requestedPermissions: string[],
    expiration: number,
    maxAmount: number,
    dailyLimit: number
  ): string {
    this.updateAgentLastUsed(agentId);
    return this.authorizationManager.grantPermission(
      agentId,
      walletAddress,
      requestedPermissions,
      expiration,
      maxAmount,
      dailyLimit
    );
  }

  checkPermission(agentId: string, permissionId: string, action: string, amount: number): boolean {
    this.updateAgentLastUsed(agentId);
    return this.authorizationManager.checkPermission(permissionId, action, amount);
  }

  revokePermission(permissionId: string): boolean {
    return this.authorizationManager.revokePermission(permissionId);
  }

  getAgentPermissions(agentId: string): any[] {
    return this.authorizationManager.getAgentPermissions(agentId);
  }
}

export default AgentManager;
export type { Agent };