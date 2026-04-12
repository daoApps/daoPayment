import MainManager from './core/mainManager.js';
import Wallet from './core/wallet.js';
import WalletManager from './core/walletManager.js';
import SecurityManager from './security/securityManager.js';
import AgentInterface from './agent/agentInterface.js';
import AuditIntegrator from './audit/auditIntegrator.js';

// 导出核心类和功能
export {
  MainManager,
  Wallet,
  WalletManager,
  SecurityManager,
  AgentInterface,
  AuditIntegrator,
};

// 默认导出 MainManager
export default MainManager;

// 创建默认实例
const defaultManager = new MainManager();
export { defaultManager };
