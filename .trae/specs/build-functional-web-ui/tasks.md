# Tasks

- [x] Task 1: 清理旧的前端 Web3 依赖和 Hooks
  - [x] SubTask 1.1: 移除 `src/hooks/` 下不再使用的 wagmi hooks（如 `usePolicyRead.ts`, `usePolicyWrite.ts`, `useBudgetRead.ts`, `useWhitelistRead.ts`）。
  - [x] SubTask 1.2: 移除 `app/providers.tsx` 或 `app/page.tsx` 中冗余的 wagmi/viem 连接配置（如果完全交由后端代理）。
- [x] Task 2: 建立前端 API 客户端层
  - [x] SubTask 2.1: 在 `src/api/client.ts` 下创建通用的 HTTP 请求封装（如基于 `axios` 或原生 `fetch`），设置基础 URL 为 FastAPI 后端地址（如 `http://localhost:8000`）。
  - [x] SubTask 2.2: 定义后端相关的 TypeScript 接口响应类型（如 `Wallet`, `Policy`, `AuditRecord`）。
- [x] Task 3: 重构钱包与概览组件
  - [x] SubTask 3.1: 创建或修改 `components/WalletManager.tsx`，对接 `/api/wallets` 接口获取并展示后端管理的钱包地址及余额。
  - [x] SubTask 3.2: 增加“创建新钱包”的按钮，调用 POST 接口并处理响应及错误。
- [x] Task 4: 重构策略管理组件 (PolicyManager)
  - [x] SubTask 4.1: 修改 `components/PolicyManager.tsx`，对接 `GET /api/policies` 渲染策略列表及状态。
  - [x] SubTask 4.2: 对接 `POST /api/policies` 处理创建策略的表单提交，支持自动刷新列表。
- [x] Task 5: 重构审计与支付组件 (AuditList & Execute Payment)
  - [x] SubTask 5.1: 修改 `components/AuditList.tsx`，对接 `GET /api/audit` 获取并展示历史审计记录。
  - [x] SubTask 5.2: 提供一个“测试支付”的交互入口，调用后端的模拟支付接口并更新审计日志列表。
- [x] Task 6: UI 优化与联调测试
  - [x] SubTask 6.1: 统一各组件的 Loading 和 Error 状态 UI 提示。
  - [x] SubTask 6.2: 启动前后端服务进行全链路测试，确保前后端联调成功。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 3], [Task 4], [Task 5]