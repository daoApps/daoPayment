# Monad Agentic Payment System — 设计方案

> **项目:** Monad Blitz 杭州黑客松 — Agentic Payment 赛道
> **目标:** 在 Monad 链上构建一个 Agent 原生的安全支付系统，使 AI Agent 能在用户授权下自主完成链上支付，同时确保安全、可控、可审计。

---

## 1. 需求概述

### 核心问题

传统钱包假设操作者是人（人持私钥、人发起交易、人判断风险）。我们需要一套为 AI Agent 设计的钱包系统：

- Agent 可以自主行动，但绝不能失控
- 授权足够细粒度
- 支付可审计、可追溯、可撤销
- 去中心化与安全不牺牲体验

### 5 项必须满足的要求

| # | 要求 | 关键指标 |
|---|------|----------|
| 1 | 去中心化 | 非托管、用户自持资产、Agent 无法接触真实私钥、用户可随时撤销权限、跨平台、开源 |
| 2 | 安全配置 | 单笔上限、每日/每周预算、白名单（地址/合约/Token）、方法级限制、超阈值人工确认、风险拦截、紧急暂停 |
| 3 | Agent 原生 | 为 Agent 而非人设计：请求权限、获取临时授权、解释支付原因、在任务上下文中支付、失败后重试/切换路径 |
| 4 | 可审计与可解释 | 每笔支付记录：触发者、任务上下文、收款方、支付原因、命中策略、是否人工确认、执行结果 |
| 5 | 恢复与权限管理 | 钱包恢复、权限调整、Session Key 轮换、泄露私钥撤销、多 Agent 差异化权限 |

### 高价值加分特性（按优先级排序）

- **B. 策略引擎 (Policy Engine)** — 可配置规则层，对安全影响最大
- **A. Session Key / 委托密钥** — 为 Agent 发放受限临时密钥
- **F. 审计日志 / 支付收据** — 结构化支付记录
- **E. 人机协同审批** — 分级审批流程
- **D. 原生机器支付** — x402 / 微支付支持
- **C. 现代登录体验** — Passkeys / WebAuthn

---

## 2. 整体架构

```
+------------------------------------------------------------------+
|                        前端层 (Next.js)                           |
|  +------------------+  +-------------------+  +-----------------+ |
|  |  仪表盘 UI       |  |  审批门户         |  |  审计查看器      | |
|  |  (钱包管理)      |  |  (人机协同)       |  |  (交易历史)      | |
|  +------------------+  +-------------------+  +-----------------+ |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|                    Agent SDK / MCP Server                         |
|  +------------------+  +-------------------+  +-----------------+ |
|  |  支付 API        |  |  授权管理器       |  |  策略客户端      | |
|  |  (交易构建)      |  |  (Session Keys)   |  |  (规则校验)      | |
|  +------------------+  +-------------------+  +-----------------+ |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|                   智能合约层 (Monad)                               |
|  +------------------+  +-------------------+  +-----------------+ |
|  |  AgentWallet     |  |  PolicyRegistry   |  |  SessionKey     | |
|  |  (ERC-4337 基础) |  |  (链上策略)       |  |  Manager        | |
|  +------------------+  +-------------------+  +-----------------+ |
+------------------------------------------------------------------+
```

### 技术栈选型

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| 前端 | Next.js 14+ / React 18 / TypeScript / Tailwind CSS | SSR 支持、类型安全、快速 UI 开发 |
| 状态管理 | Zustand | 轻量、Agent 友好的状态管理 |
| 链交互 | viem + wagmi | Monad EVM 兼容、类型安全 |
| 智能合约 | Solidity / Hardhat（或 Foundry） | EVM 标准、工具链成熟 |
| Agent SDK | TypeScript SDK + MCP Server | 集成 Droid/OpenClaw/Codex |
| 支付协议 | MPP（Monad Payment Protocol） | Monad 官方支付基础设施 |
| 包管理器 | bun | 快速、现代 |
| 测试 | Vitest + React Testing Library + Hardhat Test | 全栈测试覆盖 |

---

## 3. 功能拆解

### 第一阶段：基础设施 (P0, 第 1 周)

---

#### 子任务 1.1：项目脚手架搭建 (P0, 依赖: 无, 复杂度: 小)

- **描述:** 使用 bun 初始化 Next.js + TypeScript + Tailwind CSS 项目。搭建项目目录结构，配置 ESLint、Prettier、Husky pre-commit hooks。安装 MonSkill 获取 Monad 开发上下文。
- **验收标准:**
  - `bun dev` 成功启动开发服务器
  - TypeScript strict 模式已启用
  - Tailwind CSS 正常工作
  - 目录结构符合约定（src/components, src/hooks, src/services 等）
  - MonSkill 已安装并提供 Monad 链配置

---

#### 子任务 1.2：智能合约 — AgentWallet 核心 (P0, 依赖: 1.1, 复杂度: 大)

- **描述:** 基于 ERC-4337（账户抽象）模式实现核心 AgentWallet 智能合约。钱包为非托管架构：用户（EOA）是所有者，Agent 通过 Session Key 获取受限的委托访问权。钱包持有资产，仅在获得授权时执行交易。
- **核心设计:**
  - `owner`: 用户的 EOA 地址（完全控制权）
  - `execute(to, value, data)`: 执行交易（仅限授权调用者）
  - `addAgent(agentAddress, permissions)`: 授予 Agent 受限访问权
  - `removeAgent(agentAddress)`: 撤销 Agent 访问权
  - `pause() / unpause()`: 紧急控制（仅所有者）
  - 支持接收 ETH/ERC-20
- **验收标准:**
  - 合约成功部署到 Monad 测试网
  - 所有者可以添加/移除 Agent
  - 未授权地址无法执行交易
  - 紧急暂停可停止所有 Agent 操作
  - 单元测试通过（核心路径 100% 覆盖）

---

#### 子任务 1.3：智能合约 — SessionKeyManager (P0, 依赖: 1.2, 复杂度: 大)

- **描述:** 实现 Session Key 管理。Agent 获得临时受限密钥而非用户私钥。每个 Session Key 包含：过期时间、消费上限、允许的目标地址/合约、允许的方法选择器。
- **核心设计:**
  ```solidity
  struct SessionKey {
    address agent;        // Agent 地址
    uint256 expiry;       // 过期时间戳
    uint256 maxAmount;    // 单笔上限
    uint256 dailyLimit;   // 每日限额
    uint256 dailySpent;   // 当日已消费
    uint256 lastResetDay; // 上次重置日期
    address[] allowedTargets;  // 允许的目标地址
    bytes4[] allowedMethods;   // 允许的方法选择器
    bool active;          // 是否激活
  }
  ```
  - `createSessionKey(params)`: 所有者为 Agent 创建受限密钥
  - `validateSessionKey(agent, to, value, data)`: 执行前校验
  - `revokeSessionKey(agent)`: 立即撤销
  - `rotateSessionKey(oldAgent, newAgent, params)`: 无停机轮换
- **验收标准:**
  - Session Key 强制执行过期机制（超时自动失效）
  - 单笔和每日限额在链上强制执行
  - 白名单（目标地址 + 方法选择器）严格执行
  - 所有者可随时撤销/轮换
  - 过期密钥自动拒绝交易

---

#### 子任务 1.4：智能合约 — PolicyRegistry 策略注册表 (P0, 依赖: 1.2, 复杂度: 中)

- **描述:** 链上可配置策略引擎。策略定义 AgentWallet 在执行交易前需要检查的消费规则。规则可组合、有序执行。
- **核心规则:**
  - `max_per_tx: uint256` — 单笔交易上限
  - `max_daily_spend: uint256` — 每日消费上限
  - `max_weekly_spend: uint256` — 每周消费上限
  - `require_approval_above: uint256` — 需人工审批的金额阈值
  - `allowed_tokens: address[]` — Token 白名单
  - `blocked_recipients: address[]` — 地址黑名单
  - `allowed_categories: bytes32[]` — 类别标签（api, storage, compute）
- **验收标准:**
  - 所有者可增删改查策略规则
  - 每笔交易执行前评估策略
  - 违反策略的交易被回滚并返回清晰错误信息
  - 策略变更立即生效
  - 所有策略变更触发事件（用于审计）

---

#### 子任务 1.5：链连接与钱包 Provider (P0, 依赖: 1.1, 复杂度: 中)

- **描述:** 使用 viem + wagmi 搭建 Monad 链连接。实现钱包连接流程（MetaMask/WalletConnect），供用户（所有者）连接并管理其 AgentWallet。
- **验收标准:**
  - 通过 RPC 连接到 Monad 测试网
  - 用户可连接钱包（MetaMask / WalletConnect）
  - 读取合约状态（余额、权限、策略）
  - 发送交易（部署钱包、配置权限）
  - 网络切换 / 错误处理

---

### 第二阶段：Agent 集成层 (P0, 第 2 周)

---

#### 子任务 2.1：Agent SDK — 核心支付 API (P0, 依赖: 1.2 + 1.3, 复杂度: 大)

- **描述:** TypeScript SDK，供 Agent 导入使用以与 AgentWallet 系统交互。提供完整支付生命周期的高级 API：请求授权、执行支付、查询状态、处理失败。
- **核心 API:**
  ```typescript
  interface AgentPaymentSDK {
    // 授权
    requestAuthorization(params: AuthRequest): Promise<SessionKey>;
    checkPermissions(): Promise<PermissionSet>;
    
    // 支付
    pay(params: PaymentRequest): Promise<PaymentResult>;
    batchPay(params: PaymentRequest[]): Promise<PaymentResult[]>;
    
    // 查询
    getBalance(token?: Address): Promise<bigint>;
    getTransactionHistory(filter?: TxFilter): Promise<AuditRecord[]>;
    
    // 策略
    checkPolicy(params: PaymentRequest): Promise<PolicyCheckResult>;
    
    // 上下文
    explainPayment(params: PaymentRequest): string;
  }
  ```
- **验收标准:**
  - Agent 可使用 Session Key 初始化 SDK
  - `pay()` 在提交前自动校验策略
  - 失败交易返回可操作的错误信息（原因 + 建议）
  - `explainPayment()` 生成人类可读的支付理由说明
  - 导出 TypeScript 类型，保障开发体验

---

#### 子任务 2.2：MCP Server 实现 (P0, 依赖: 2.1, 复杂度: 大)

- **描述:** 将 Agent SDK 封装为 MCP（Model Context Protocol）Server，使 Claude、OpenClaw、Codex、Manus 等 AI Agent 环境可直接调用支付能力。
- **MCP 工具集:**
  - `agent_wallet_pay` — 执行支付
  - `agent_wallet_balance` — 查询余额
  - `agent_wallet_authorize` — 请求/检查授权
  - `agent_wallet_history` — 查询交易历史
  - `agent_wallet_policy_check` — 预检策略校验
  - `agent_wallet_explain` — 在上下文中解释支付
- **验收标准:**
  - MCP Server 启动并注册工具
  - Claude 可发现并调用工具
  - 工具输入/输出遵循 MCP 规范
  - 错误消息可被 Agent 解析（结构化 JSON）
  - 支持通过 `npx` 或 `bunx` 安装

---

#### 子任务 2.3：人机协同审批流程 (P0, 依赖: 1.4 + 1.5, 复杂度: 中)

- **描述:** 当支付超过策略阈值（如 `require_approval_above`）时，系统暂停执行并请求人工审批。实现分级模型：
  - **第一级（自动）：** 金额低于阈值 → 自动通过
  - **第二级（确认）：** 金额超过阈值但未达危险值 → 推送通知，一键同意/拒绝
  - **第三级（人工）：** 高风险 → 展示完整上下文后由人工审核批准
- **通知渠道:** 浏览器通知（MVP），可扩展至 Telegram/Slack
- **验收标准:**
  - 低于阈值的支付自动执行
  - 超阈值支付暂停并在前端提示用户
  - 用户可一键同意/拒绝
  - 被拒绝的支付向 Agent 返回结构化的拒绝信息
  - 超时处理（可配置窗口期后自动拒绝）

---

### 第三阶段：前端仪表盘 (P1, 第 2-3 周)

---

#### 子任务 3.1：钱包仪表盘 — 概览与余额 (P1, 依赖: 1.5, 复杂度: 中)

- **描述:** 主仪表盘页面展示 AgentWallet 状态：余额（ETH + Token）、已连接 Agent、活跃 Session Key、近期交易、消费预算对比。
- **验收标准:**
  - 展示钱包余额（ETH + ERC-20）
  - 显示已连接 Agent 列表及权限摘要
  - 展示活跃 Session Key 及过期倒计时
  - 近期交易（最近 20 条）及状态指示器
  - 预算使用可视化（每日/每周进度条）
  - 响应式布局（桌面端 + 移动端）

---

#### 子任务 3.2：Agent 权限管理界面 (P1, 依赖: 1.2 + 1.3 + 3.1, 复杂度: 中)

- **描述:** 管理 Agent 权限的界面。用户可添加新 Agent、配置 Session Key 参数、调整现有权限、撤销访问权、查看权限变更历史。
- **验收标准:**
  - 添加 Agent 表单：地址、过期时间、限额、白名单配置
  - 编辑现有 Agent 权限
  - 一键撤销（带确认对话框）
  - Session Key 轮换流程
  - 权限变更可视化对比
  - 权限变更历史日志

---

#### 子任务 3.3：策略配置界面 (P1, 依赖: 1.4 + 3.1, 复杂度: 中)

- **描述:** 可视化策略编辑器。用户可创建、编辑、启用/禁用、删除消费策略。支持常用模板（保守型、适中型、激进型）和自定义规则。
- **验收标准:**
  - 策略 CRUD 及表单验证
  - 预置模板（一键应用）
  - 自定义规则构建器（条件 + 动作）
  - 按规则启用/禁用开关
  - 策略模拟（"如果 Agent 发送 X 会怎样？"）
  - 变更需要钱包签名

---

#### 子任务 3.4：审计日志与支付收据查看器 (P1, 依赖: 2.1, 复杂度: 中)

- **描述:** 完整的审计轨迹界面。展示所有支付记录的完整上下文：哪个 Agent、哪个任务、什么金额、触发了哪条策略、审批状态、链上交易哈希。
- **记录结构:**
  ```typescript
  interface AuditRecord {
    id: string;                    // 记录 ID
    timestamp: number;             // 时间戳
    agentId: Address;              // Agent 地址
    taskId: string;                // 任务 ID
    taskContext: string;           // 任务上下文
    recipient: Address;            // 收款方
    amount: bigint;                // 金额
    token: Address;                // Token 地址
    reason: string;                // 支付原因
    policyMatched: string[];       // 命中的策略
    approvalType: 'auto' | 'human_approved' | 'human_denied';  // 审批类型
    riskLevel: 'low' | 'medium' | 'high';  // 风险等级
    txHash?: Hash;                 // 交易哈希
    status: 'success' | 'failed' | 'pending' | 'denied';  // 状态
  }
  ```
- **验收标准:**
  - 可搜索/可筛选的交易列表
  - 每笔交易的详情视图（含完整上下文）
  - 导出为 JSON/CSV
  - 链上验证链接（交易哈希 → 区块浏览器）
  - 风险等级可视化指示器

---

### 第四阶段：高级特性 (P2, 第 3 周)

---

#### 子任务 4.1：钱包恢复机制 (P2, 依赖: 1.2, 复杂度: 中)

- **描述:** 通过社交恢复模式实现钱包恢复。所有者指定守护者（可信地址），当密钥丢失时守护者可集体授权新的所有者。
- **验收标准:**
  - 所有者可添加/移除守护者
  - 恢复需要 M-of-N 守护者批准
  - 恢复有时间锁（如 48 小时延迟以确保安全）
  - 当前所有者可在时间锁期间取消恢复
  - 所有恢复事件记录在链上

---

#### 子任务 4.2：多 Agent 差异化权限 (P2, 依赖: 1.3 + 2.1, 复杂度: 中)

- **描述:** 支持多个 Agent 拥有不同的权限配置。例如："研究 Agent"拥有只读 + 低额 API 支付权限；"采购 Agent"拥有更高的供应商支付限额；"应急 Agent"拥有广泛但时间有限的访问权。
- **验收标准:**
  - 多个 Agent 可同时活跃
  - 每个 Agent 拥有独立的 Session Key + 策略
  - Agent 级别的消费追踪（按 Agent 的每日/每周统计）
  - 权限模板库（预设配置）
  - 仪表盘展示按 Agent 分类的统计

---

#### 子任务 4.3：x402 机器可支付 API 集成 (P2, 依赖: 2.1, 复杂度: 中)

- **描述:** 集成 x402 协议实现机器对机器支付。Agent 可按需支付 API 调用、计算资源和存储费用，无需人工干预（在策略范围内）。
- **验收标准:**
  - SDK 中支持 x402 支付头
  - 对 x402 启用的 API 自动支付
  - 按调用成本追踪
  - 消费速率告警
  - SDK 辅助方法：`x402Client.fetch(url, options)` 封装标准 fetch

---

#### 子任务 4.4：Passkey / WebAuthn 登录 (P2, 依赖: 1.5, 复杂度: 中)

- **描述:** 使用 Passkey/WebAuthn 实现现代认证方式，用于钱包访问和交易审批。消除助记词带来的用户体验摩擦，同时保持安全性。
- **验收标准:**
  - 注册 Passkey 用于钱包访问
  - 通过生物识别（Face ID / 指纹）审批交易
  - 支持回退到传统钱包连接
  - 跨设备支持（在平台允许的情况下）

---

### 第五阶段：打磨与演示 (P0, 第 3-4 周)

---

#### 子任务 5.1：端到端演示流程 (P0, 依赖: 2.1 + 2.2 + 3.1, 复杂度: 中)

- **描述:** 构建完整演示场景：Agent 请求授权 → 获得 Session Key → 为某个 API 服务执行支付 → 支付自动通过（在限额内） → 生成审计记录 → 用户在仪表盘查看。
- **验收标准:**
  - 完整生命周期在一个连续流程中工作
  - 演示脚本已文档化（分步指引）
  - 可在 Claude 作为 AI Agent 环境中运行
  - 可录屏（干净的 UI、清晰的状态转换）
  - 错误场景优雅处理

---

#### 子任务 5.2：文档与安装指南 (P1, 依赖: 全部, 复杂度: 小)

- **描述:** 编写开发者文档：快速开始、SDK API 参考、MCP Server 配置、智能合约地址、架构概览。包含作为 Claude Skill/MCP Server 的安装说明。
- **验收标准:**
  - README 包含快速开始（< 5 分钟完成首次支付）
  - SDK API 参考及代码示例
  - MCP Server 安装与配置指南
  - 智能合约部署指南
  - 架构图

---

## 4. 依赖关系图

```
1.1 (项目脚手架)
 ├── 1.2 (AgentWallet 合约)
 │    ├── 1.3 (SessionKeyManager)
 │    │    ├── 2.1 (Agent SDK)
 │    │    │    ├── 2.2 (MCP Server)
 │    │    │    ├── 3.4 (审计查看器)
 │    │    │    ├── 4.2 (多 Agent 权限)
 │    │    │    ├── 4.3 (x402 集成)
 │    │    │    └── 5.1 (端到端演示)
 │    │    └── 2.3 (审批流程)
 │    ├── 1.4 (PolicyRegistry 策略注册表)
 │    │    ├── 2.3 (审批流程)
 │    │    └── 3.3 (策略配置 UI)
 │    └── 4.1 (钱包恢复)
 ├── 1.5 (链连接)
 │    ├── 2.3 (审批流程)
 │    ├── 3.1 (仪表盘)
 │    │    ├── 3.2 (权限管理 UI)
 │    │    ├── 3.3 (策略配置 UI)
 │    │    ├── 3.4 (审计查看器)
 │    │    └── 5.1 (端到端演示)
 │    └── 4.4 (Passkey 登录)
 └── 5.2 (文档)
```

---

## 5. 复杂度与工作量概览

| 阶段 | 子任务数 | 总复杂度 | 优先级 |
|------|---------|----------|--------|
| 第一阶段：基础设施 | 5 | 2 大 + 2 中 + 1 小 | P0 |
| 第二阶段：Agent 集成 | 3 | 2 大 + 1 中 | P0 |
| 第三阶段：前端仪表盘 | 4 | 4 中 | P1 |
| 第四阶段：高级特性 | 4 | 4 中 | P2 |
| 第五阶段：打磨与演示 | 2 | 1 中 + 1 小 | P0/P1 |

**关键路径:** 1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 5.1

---

## 6. 风险与缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Monad 测试网不稳定 | 阻塞所有链上开发 | 先用本地 fork 开发，最终测试再部署测试网 |
| 智能合约安全漏洞 | 严重 — 用户资金风险 | 遵循 OpenZeppelin 模式，编写充分测试，考虑审计 |
| MCP 协议兼容性 | 阻塞 Agent 集成 | 尽早用 Claude 测试，严格遵循规范 |
| Session Key 泄露 | Agent 超额消费 | 链上限额作为硬性底线，默认短过期时间，即时撤销 |
| 演示复杂度 | 黑客松时间压力 | 优先实现核心路径，错误处理逐步完善 |

---

## 7. 关键技术决策

1. **ERC-4337（账户抽象）** 作为钱包基础 — 实现可编程的交易验证，Agent 操作无需用户对每笔交易签名
2. **链上策略引擎** 而非链下 — 策略可强制执行且无需信任，非仅咨询性质
3. **MCP Server 作为主要集成方式** — 最广泛的 Agent 生态兼容性（Claude、OpenClaw、Codex）
4. **集成 MPP** 作为支付协议 — Monad 官方支付基础设施，针对该链优化
5. **Session Key 优于委托签名** — 更细粒度、有时间限制、可撤销、不暴露所有者密钥材料
