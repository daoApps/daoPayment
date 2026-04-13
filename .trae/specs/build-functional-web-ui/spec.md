# Build Functional Web UI Spec

## Why
项目后端已成功迁移至 Python 3.14 + FastAPI 架构，但当前前端 Web UI 仍在使用旧的架构（通过 wagmi/viem 直接连接区块链）。为了充分利用新的后端 API 并提供一个功能完备的用户界面，需要对前端进行全面重构，使其与 FastAPI 后端对接，实现钱包管理、策略管理和审计日志等完整功能的展示与交互。

## What Changes
- 重构前端数据获取层：使用 `fetch` 或 `axios` 调用本地 FastAPI 后端接口 (`/api/wallets`, `/api/policies`, `/api/audit`)。
- 完善钱包管理 (Wallet Management) UI：支持创建新钱包、查看钱包列表及余额状态。
- 完善策略管理 (Policy Management) UI：支持创建新策略表单提交，以及查看已有的策略列表及其详情（日限额、周限额、状态等）。
- 完善审计与支付 (Audit & Payment) UI：展示从后端获取的审计日志列表，并提供触发模拟支付 (Execute Payment) 的操作入口。
- 优化整体页面布局和状态流转，统一处理加载状态 (Loading) 和错误提示 (Error Handling)。
- **BREAKING**: 移除前端直接基于 Wagmi/Viem 的智能合约调用代码，业务逻辑全面转由 Python 后端接管。

## Impact
- Affected specs: 前端架构、API 集成层、组件状态管理。
- Affected code: `app/page.tsx`, `components/PolicyManager.tsx`, `components/BudgetManager.tsx`, `components/AuditList.tsx`, `components/WhitelistManager.tsx` 等现有前端组件，以及 `src/hooks/` 目录。

## ADDED Requirements
### Requirement: 完整的 API 集成
前端系统应当能够与后端的 REST API（FastAPI）完美对接，并正确处理 TypeScript 类型。

#### Scenario: 用户创建新策略
- **WHEN** 用户在策略管理界面填写表单并点击“创建策略”
- **THEN** 前端调用 FastAPI 的 `POST /api/policies` 接口，成功后刷新策略列表，并给予 UI 成功提示。

## MODIFIED Requirements
### Requirement: 现有组件状态管理
原本基于 wagmi hooks（如 `usePolicyRead`, `usePolicyWrite`）的状态管理应替换为基于原生 `useEffect/useState` 或 React Query 的 API 请求状态管理。

## REMOVED Requirements
### Requirement: 前端直接链上交互
**Reason**: 业务逻辑已下沉至 Python 后端统一管理，前端直接上链会导致状态不一致、签名逻辑冗余及架构混乱。
**Migration**: 移除 `src/hooks/` 下不再使用的 wagmi 自定义 hooks，清理相关的配置。