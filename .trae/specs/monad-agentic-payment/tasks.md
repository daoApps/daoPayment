# Monad Agentic Payment - The Implementation Plan (Decomposed and Prioritized Task List)

## [ ] Task 1: 项目脚手架搭建
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 使用 bun 初始化 Next.js + TypeScript + Tailwind CSS 项目
  - 搭建项目目录结构，配置 ESLint、Prettier、Husky pre-commit hooks
  - 安装 MonSkill 获取 Monad 开发上下文
- **Acceptance Criteria Addressed**: AC-8, AC-9
- **Test Requirements**:
  - `programmatic` TR-1.1: `bun dev` 成功启动开发服务器
  - `programmatic` TR-1.2: TypeScript strict 模式已启用
  - `programmatic` TR-1.3: Tailwind CSS 正常工作
  - `programmatic` TR-1.4: 目录结构符合约定
  - `programmatic` TR-1.5: MonSkill 已安装并提供 Monad 链配置
- **Notes**: 按照项目规范搭建基础架构

## [ ] Task 2: 智能合约 — AgentWallet 核心
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 基于 ERC-4337（账户抽象）模式实现核心 AgentWallet 智能合约
  - 实现非托管架构：用户（EOA）是所有者，Agent 通过 Session Key 获取受限的委托访问权
  - 实现核心功能：execute、addAgent、removeAgent、pause/unpause
- **Acceptance Criteria Addressed**: AC-1, AC-10
- **Test Requirements**:
  - `programmatic` TR-2.1: 合约成功部署到 Monad 测试网
  - `programmatic` TR-2.2: 所有者可以添加/移除 Agent
  - `programmatic` TR-2.3: 未授权地址无法执行交易
  - `programmatic` TR-2.4: 紧急暂停可停止所有 Agent 操作
  - `programmatic` TR-2.5: 单元测试通过（核心路径 100% 覆盖）
- **Notes**: 参考 ERC-4337 标准实现

## [ ] Task 3: 智能合约 — SessionKeyManager
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 实现 Session Key 管理，Agent 获得临时受限密钥而非用户私钥
  - 实现 Session Key 结构：过期时间、消费上限、允许的目标地址/合约、允许的方法选择器
  - 实现核心功能：createSessionKey、validateSessionKey、revokeSessionKey、rotateSessionKey
- **Acceptance Criteria Addressed**: AC-6, AC-10
- **Test Requirements**:
  - `programmatic` TR-3.1: Session Key 强制执行过期机制
  - `programmatic` TR-3.2: 单笔和每日限额在链上强制执行
  - `programmatic` TR-3.3: 白名单（目标地址 + 方法选择器）严格执行
  - `programmatic` TR-3.4: 所有者可随时撤销/轮换
  - `programmatic` TR-3.5: 过期密钥自动拒绝交易
- **Notes**: 确保 Session Key 的安全性和灵活性

## [ ] Task 4: 智能合约 — PolicyRegistry 策略注册表
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 实现链上可配置策略引擎，策略定义 AgentWallet 在执行交易前需要检查的消费规则
  - 实现核心规则：单笔上限、每日/每周消费上限、需人工审批的金额阈值、Token 白名单、地址黑名单、类别标签
- **Acceptance Criteria Addressed**: AC-2, AC-7, AC-10
- **Test Requirements**:
  - `programmatic` TR-4.1: 所有者可增删改查策略规则
  - `programmatic` TR-4.2: 每笔交易执行前评估策略
  - `programmatic` TR-4.3: 违反策略的交易被回滚并返回清晰错误信息
  - `programmatic` TR-4.4: 策略变更立即生效
  - `programmatic` TR-4.5: 所有策略变更触发事件（用于审计）
- **Notes**: 确保策略的链上强制执行

## [ ] Task 5: 链连接与钱包 Provider
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 使用 viem + wagmi 搭建 Monad 链连接
  - 实现钱包连接流程（MetaMask/WalletConnect），供用户（所有者）连接并管理其 AgentWallet
- **Acceptance Criteria Addressed**: AC-1, AC-11
- **Test Requirements**:
  - `programmatic` TR-5.1: 通过 RPC 连接到 Monad 测试网
  - `programmatic` TR-5.2: 用户可连接钱包（MetaMask / WalletConnect）
  - `programmatic` TR-5.3: 读取合约状态（余额、权限、策略）
  - `programmatic` TR-5.4: 发送交易（部署钱包、配置权限）
  - `programmatic` TR-5.5: 网络切换 / 错误处理
- **Notes**: 确保链连接的稳定性和安全性

## [ ] Task 6: Agent SDK — 核心支付 API
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - TypeScript SDK，供 Agent 导入使用以与 AgentWallet 系统交互
  - 提供完整支付生命周期的高级 API：请求授权、执行支付、查询状态、处理失败
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `programmatic` TR-6.1: Agent 可使用 Session Key 初始化 SDK
  - `programmatic` TR-6.2: `pay()` 在提交前自动校验策略
  - `programmatic` TR-6.3: 失败交易返回可操作的错误信息（原因 + 建议）
  - `programmatic` TR-6.4: `explainPayment()` 生成人类可读的支付理由说明
  - `programmatic` TR-6.5: 导出 TypeScript 类型，保障开发体验
- **Notes**: 设计符合 Agent 操作习惯的 API

## [ ] Task 7: MCP Server 实现
- **Priority**: P0
- **Depends On**: Task 6
- **Description**:
  - 将 Agent SDK 封装为 MCP（Model Context Protocol）Server，使 Claude、OpenClaw、Codex、Manus 等 AI Agent 环境可直接调用支付能力
  - 实现 MCP 工具集：agent_wallet_pay、agent_wallet_balance、agent_wallet_authorize、agent_wallet_history、agent_wallet_policy_check、agent_wallet_explain
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `programmatic` TR-7.1: MCP Server 启动并注册工具
  - `programmatic` TR-7.2: Claude 可发现并调用工具
  - `programmatic` TR-7.3: 工具输入/输出遵循 MCP 规范
  - `programmatic` TR-7.4: 错误消息可被 Agent 解析（结构化 JSON）
  - `programmatic` TR-7.5: 支持通过 `npx` 或 `bunx` 安装
- **Notes**: 确保 MCP 规范的严格遵守

## [ ] Task 8: 人机协同审批流程
- **Priority**: P0
- **Depends On**: Task 4, Task 5
- **Description**:
  - 实现分级审批模型：第一级（自动）、第二级（确认）、第三级（人工）
  - 实现通知渠道：浏览器通知（MVP），可扩展至 Telegram/Slack
- **Acceptance Criteria Addressed**: AC-12
- **Test Requirements**:
  - `programmatic` TR-8.1: 低于阈值的支付自动执行
  - `programmatic` TR-8.2: 超阈值支付暂停并在前端提示用户
  - `programmatic` TR-8.3: 用户可一键同意/拒绝
  - `programmatic` TR-8.4: 被拒绝的支付向 Agent 返回结构化的拒绝信息
  - `programmatic` TR-8.5: 超时处理（可配置窗口期后自动拒绝）
- **Notes**: 确保审批流程的流畅性和安全性

## [ ] Task 9: 钱包仪表盘 — 概览与余额
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 主仪表盘页面展示 AgentWallet 状态：余额（ETH + Token）、已连接 Agent、活跃 Session Key、近期交易、消费预算对比
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `human-judgment` TR-9.1: 展示钱包余额（ETH + ERC-20）
  - `human-judgment` TR-9.2: 显示已连接 Agent 列表及权限摘要
  - `human-judgment` TR-9.3: 展示活跃 Session Key 及过期倒计时
  - `human-judgment` TR-9.4: 近期交易（最近 20 条）及状态指示器
  - `human-judgment` TR-9.5: 预算使用可视化（每日/每周进度条）
  - `human-judgment` TR-9.6: 响应式布局（桌面端 + 移动端）
- **Notes**: 确保 UI 的美观性和可用性

## [ ] Task 10: Agent 权限管理界面
- **Priority**: P1
- **Depends On**: Task 2, Task 3, Task 9
- **Description**:
  - 管理 Agent 权限的界面。用户可添加新 Agent、配置 Session Key 参数、调整现有权限、撤销访问权、查看权限变更历史
- **Acceptance Criteria Addressed**: AC-5, AC-11
- **Test Requirements**:
  - `human-judgment` TR-10.1: 添加 Agent 表单：地址、过期时间、限额、白名单配置
  - `human-judgment` TR-10.2: 编辑现有 Agent 权限
  - `human-judgment` TR-10.3: 一键撤销（带确认对话框）
  - `human-judgment` TR-10.4: Session Key 轮换流程
  - `human-judgment` TR-10.5: 权限变更可视化对比
  - `human-judgment` TR-10.6: 权限变更历史日志
- **Notes**: 确保权限管理的直观性和安全性

## [ ] Task 11: 策略配置界面
- **Priority**: P1
- **Depends On**: Task 4, Task 9
- **Description**:
  - 可视化策略编辑器。用户可创建、编辑、启用/禁用、删除消费策略。支持常用模板（保守型、适中型、激进型）和自定义规则
- **Acceptance Criteria Addressed**: AC-2, AC-7, AC-11
- **Test Requirements**:
  - `human-judgment` TR-11.1: 策略 CRUD 及表单验证
  - `human-judgment` TR-11.2: 预置模板（一键应用）
  - `human-judgment` TR-11.3: 自定义规则构建器（条件 + 动作）
  - `human-judgment` TR-11.4: 按规则启用/禁用开关
  - `human-judgment` TR-11.5: 策略模拟（"如果 Agent 发送 X 会怎样？"）
  - `programmatic` TR-11.6: 变更需要钱包签名
- **Notes**: 确保策略配置的灵活性和易用性

## [ ] Task 12: 审计日志与支付收据查看器
- **Priority**: P1
- **Depends On**: Task 6
- **Description**:
  - 完整的审计轨迹界面。展示所有支付记录的完整上下文：哪个 Agent、哪个任务、什么金额、触发了哪条策略、审批状态、链上交易哈希
- **Acceptance Criteria Addressed**: AC-4, AC-11
- **Test Requirements**:
  - `human-judgment` TR-12.1: 可搜索/可筛选的交易列表
  - `human-judgment` TR-12.2: 每笔交易的详情视图（含完整上下文）
  - `programmatic` TR-12.3: 导出为 JSON/CSV
  - `programmatic` TR-12.4: 链上验证链接（交易哈希 → 区块浏览器）
  - `human-judgment` TR-12.5: 风险等级可视化指示器
- **Notes**: 确保审计记录的完整性和可追溯性

## [ ] Task 13: 钱包恢复机制
- **Priority**: P2
- **Depends On**: Task 2
- **Description**:
  - 通过社交恢复模式实现钱包恢复。所有者指定守护者（可信地址），当密钥丢失时守护者可集体授权新的所有者
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-13.1: 所有者可添加/移除守护者
  - `programmatic` TR-13.2: 恢复需要 M-of-N 守护者批准
  - `programmatic` TR-13.3: 恢复有时间锁（如 48 小时延迟以确保安全）
  - `programmatic` TR-13.4: 当前所有者可在时间锁期间取消恢复
  - `programmatic` TR-13.5: 所有恢复事件记录在链上
- **Notes**: 确保钱包恢复的安全性和可靠性

## [ ] Task 14: 多 Agent 差异化权限
- **Priority**: P2
- **Depends On**: Task 3, Task 6
- **Description**:
  - 支持多个 Agent 拥有不同的权限配置。例如："研究 Agent"拥有只读 + 低额 API 支付权限；"采购 Agent"拥有更高的供应商支付限额；"应急 Agent"拥有广泛但时间有限的访问权
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-14.1: 多个 Agent 可同时活跃
  - `programmatic` TR-14.2: 每个 Agent 拥有独立的 Session Key + 策略
  - `programmatic` TR-14.3: Agent 级别的消费追踪（按 Agent 的每日/每周统计）
  - `human-judgment` TR-14.4: 权限模板库（预设配置）
  - `human-judgment` TR-14.5: 仪表盘展示按 Agent 分类的统计
- **Notes**: 确保权限的细粒度和灵活性

## [ ] Task 15: x402 机器可支付 API 集成
- **Priority**: P2
- **Depends On**: Task 6
- **Description**:
  - 集成 x402 协议实现机器对机器支付。Agent 可按需支付 API 调用、计算资源和存储费用，无需人工干预（在策略范围内）
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-15.1: SDK 中支持 x402 支付头
  - `programmatic` TR-15.2: 对 x402 启用的 API 自动支付
  - `programmatic` TR-15.3: 按调用成本追踪
  - `programmatic` TR-15.4: 消费速率告警
  - `programmatic` TR-15.5: SDK 辅助方法：`x402Client.fetch(url, options)` 封装标准 fetch
- **Notes**: 确保 x402 集成的标准合规性

## [ ] Task 16: Passkey / WebAuthn 登录
- **Priority**: P2
- **Depends On**: Task 5
- **Description**:
  - 使用 Passkey/WebAuthn 实现现代认证方式，用于钱包访问和交易审批。消除助记词带来的用户体验摩擦，同时保持安全性
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `programmatic` TR-16.1: 注册 Passkey 用于钱包访问
  - `programmatic` TR-16.2: 通过生物识别（Face ID / 指纹）审批交易
  - `programmatic` TR-16.3: 支持回退到传统钱包连接
  - `human-judgment` TR-16.4: 跨设备支持（在平台允许的情况下）
- **Notes**: 确保认证方式的安全性和用户体验

## [ ] Task 17: 端到端演示流程
- **Priority**: P0
- **Depends On**: Task 6, Task 7, Task 9
- **Description**:
  - 构建完整演示场景：Agent 请求授权 → 获得 Session Key → 为某个 API 服务执行支付 → 支付自动通过（在限额内） → 生成审计记录 → 用户在仪表盘查看
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-9, AC-11
- **Test Requirements**:
  - `human-judgment` TR-17.1: 完整生命周期在一个连续流程中工作
  - `programmatic` TR-17.2: 演示脚本已文档化（分步指引）
  - `human-judgment` TR-17.3: 可在 Claude 作为 AI Agent 环境中运行
  - `human-judgment` TR-17.4: 可录屏（干净的 UI、清晰的状态转换）
  - `programmatic` TR-17.5: 错误场景优雅处理
- **Notes**: 确保演示流程的流畅性和完整性

## [ ] Task 18: 文档与安装指南
- **Priority**: P1
- **Depends On**: All
- **Description**:
  - 编写开发者文档：快速开始、SDK API 参考、MCP Server 配置、智能合约地址、架构概览。包含作为 Claude Skill/MCP Server 的安装说明
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `human-judgment` TR-18.1: README 包含快速开始（< 5 分钟完成首次支付）
  - `human-judgment` TR-18.2: SDK API 参考及代码示例
  - `human-judgment` TR-18.3: MCP Server 安装与配置指南
  - `human-judgment` TR-18.4: 智能合约部署指南
  - `human-judgment` TR-18.5: 架构图
- **Notes**: 确保文档的完整性和可读性