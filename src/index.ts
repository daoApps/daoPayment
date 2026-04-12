import MainManager from './core/mainManager';
import Wallet from './core/wallet';
import WalletManager from './core/walletManager';
import SecurityManager from './security/securityManager';
import AgentInterface from './agent/agentInterface';
import AuditIntegrator from './audit/auditIntegrator';

// 导出核心类和功能
export {
  MainManager,
  Wallet,
  WalletManager,
  SecurityManager,
  AgentInterface,
  AuditIntegrator
};

// 默认导出 MainManager
export default MainManager;

// 创建默认实例
const defaultManager = new MainManager();
export { defaultManager };