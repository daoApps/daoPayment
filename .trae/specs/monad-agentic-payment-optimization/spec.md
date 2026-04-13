# Monad Agentic Payment - Deep Optimization Spec

## Why
虽然核心功能已经实现闭环，但为了在黑客松竞赛中获得最高荣誉并满足生产环境部署要求，需要对系统进行深度优化扩展，提升用户体验、完善协议集成、确保生产级稳定性。

## What Changes

### 一、前后端数据联调与 Wagmi Hooks 深度集成
- **动态数据交互**：将静态 Dashboard 升级为动态数据展示，使用 `useReadContract` 从智能合约读取实时限额数据
- **合约写入功能**：集成 `useWriteContract` 实现前端调用 `setPolicy` 方法，完成策略配置链上写入
- **交易审批可视化**：对接 Safe Transaction API，实现待审批交易列表，支持审批/拒绝操作和状态实时更新

### 二、MCP Server 标准化封装
- **支付逻辑模块化重构**：将 CLI 中的 Agent 支付逻辑抽象为独立模块，设计标准化接口
- **完整 MCP 协议实现**：基于 MCP 规范封装服务器端服务，支持标准 AI 助手插件协议
- **多平台兼容性保证**：确保可直接作为 Claude Code、Cursor 等主流 AI 助手插件运行

### 三、白名单策略与 Policy Engine 进阶优化
- **智能合约逻辑增强**：完善 `allowedRecipients` 数据结构与验证逻辑，支持多维度地址白名单
- **前端配置界面**：设计图形化白名单管理界面，支持配置"仅允许特定服务商支付"精细化策略
- **链上存储验证**：实现白名单配置的链上存储与验证，确保不可篡改性

### 四、MPP/x402 协议集成与自动化支付闭环
- **SDK 层协议支持**：实现 x402 "Payment Required" 状态码自动捕获机制
- **完整自动化流程**：开发从 API 请求 → 支付需求检测 → 资金授权 → 交易执行的自动化闭环
- **端到端演示场景**：构建 Agent 自动购买 API 资源的完整演示，验证系统可靠性

## Impact
- Affected capabilities: 前端交互、MCP 集成、策略引擎、协议支持
- Affected code:
  - `src/` - 新增 hooks 组件、MCP 重构、白名单逻辑增强
  - `app/` - 前端 Dashboard 动态化升级
  - `components/` - 新增交易审批、白名单管理等 React 组件
  - `contracts/` - 智能合约逻辑增强（如需要新增合约）

## ADDED Requirements

### Requirement 1: Frontend-Wagmi Integration
The system SHALL provide dynamic real-time data interaction between frontend and smart contracts using Wagmi v3 hooks.

#### Scenario: Read Policy Data
- **WHEN** user opens the dashboard page
- **THEN** the frontend automatically uses `useReadContract` to fetch current policy limits from blockchain
- **AND** displays real-time data in the UI

#### Scenario: Write Policy Configuration
- **WHEN** user configures a new policy via frontend UI
- **THEN** frontend uses `useWriteContract` to call `setPolicy` method on-chain
- **AND** shows transaction confirmation, error handling, and status feedback

#### Scenario: Approve Pending Transactions
- **WHEN** user views pending transactions via Safe integration
- **THEN** frontend displays list of pending transactions with details
- **AND** user can approve/reject directly from UI
- **AND** status updates in real-time after action

---

### Requirement 2: Standardized MCP Server
The system SHALL provide a fully standardized MCP (Model Context Protocol) server implementation that can be directly integrated into AI Agent environments.

#### Scenario: MCP Server Startup
- **WHEN** MCP server starts
- **THEN** all payment tools are registered according to MCP specification
- **AND** server listens for incoming tool call requests

#### Scenario: Claude Code Integration
- **WHEN** user adds this MCP server to Claude Code configuration
- **THEN** Claude Code can discover and call all payment tools
- **AND** authentication and permission works correctly

#### Scenario: Cursor Integration
- **WHEN** user adds this MCP server to Cursor configuration
- **THEN** Cursor can discover and call all payment tools
- **AND** works with existing AI assistant workflow

---

### Requirement 3: Advanced Whitelist Policy
The system SHALL support multi-dimensional whitelist policy configuration with on-chain storage and verification.

#### Scenario: Configure Whitelist via UI
- **WHEN** user configures whitelist through frontend UI
- **THEN** user can add/remove recipient addresses by category (OpenAI, AWS, etc.)
- **AND** sets policy to "only allow payments to whitelisted addresses"
- **AND** configuration is stored on-chain

#### Scenario: Whitelist Verification on Payment
- **WHEN** Agent initiates a payment to a recipient
- **THEN** policy engine checks if recipient is in whitelist
- **AND** blocks payment if recipient not whitelisted
- **AND** records the policy decision in audit log

#### Scenario: Multiple Category Support
- **WHEN** user configures different categories of whitelists
- **THEN** system supports categorization by service provider, token type, method type
- **AND** verification works across all categories

---

### Requirement 4: Automated x402 Payment Flow
The system SHALL provide complete automated payment闭环 for x402 protocol.

#### Scenario: Automatic Payment Detection and Execution
- **WHEN** SDK makes an API request that returns 402 Payment Required
- **THEN** SDK automatically detects the payment requirement
- **AND** extracts payment details (amount, recipient, token)
- **AND** checks policy and gets authorization
- **AND** executes payment on-chain
- **AND** retries the API request with payment receipt
- **AND** returns the final API response to caller automatically

#### Scenario: End-to-End Demo
- **WHEN** Agent needs to access a paid API endpoint
- **THEN** entire process completes autonomously
- **AND** no human intervention is required for payment step
- **AND** audit record is created with full context

## MODIFIED Requirements

### Requirement: MCP Server Integration
**Complete modified requirement:**
- MCP Server must be implemented according to official MCP specification
- All core payment functions must be exposed as MCP tools
- Server must support stdio and HTTP transport
- Must provide configuration examples for Claude Code and Cursor
- Must include integration documentation

### Requirement: Policy Engine
**Complete modified requirement:**
- Policy engine must support whitelist rules in additional to existing rules
- Whitelist verification must happen on-chain (optional: off-chain cache with on-chain root)
- Support multiple rule types combined (amount + whitelist + category)

## REMOVED Requirements

None - this is additive optimization, not removal.
