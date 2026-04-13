# Frontend Web3 Application Spec

## Why
根据 `docs/plan.md` 的整体设计，Monad Agentic Payment 系统需要一个现代化的前端应用，提供用户仪表盘、权限管理、策略配置和审计日志查看功能。用户需要通过 Web 界面来管理他们的 AgentWallet、配置安全策略、审批支付和查看审计记录。

## What Changes
- **BREAKING**: 全面技术栈重构，基于 **Next.js 15+ + Vite + React 18 + TypeScript** 现代化架构
- **BREAKING**: 将所有 JavaScript 配置文件从 CommonJS 迁移到 ECMAScript 模块 (ESM) 格式
- 使用 import/export 语法替代 require/module.exports
- 更新 package.json 添加 "type": "module" 字段
- 解决模块路径解析问题（添加 .js 扩展名）
- 确保所有依赖包兼容 ESM 格式
- 配置 Vite 作为构建工具，提供极速开发体验和优化的构建性能
- 集成 Next.js 框架，实现服务端渲染 (SSR) 和静态站点生成 (SSG)
- 完整配置 TypeScript 开发环境，严格类型检查消除类型错误
- 配置 ESLint + Prettier，确保代码质量和风格一致性
- 重构项目结构，遵循现代前端开发最佳实践
- 模块化组件设计 + Zustand 状态管理方案
- 建立清晰的 API 请求层与数据处理流程
- 配置完整的 Web3 基础设施（viem + wagmi）
- 集成 viem + wagmi 进行 Monad 区块链交互
- 实现钱包连接功能（MetaMask/WalletConnect）
- 开发钱包仪表盘主页面，展示余额、活跃 Agent、近期交易
- 开发 Agent 权限管理界面，支持添加/编辑/撤销 Agent 权限
- 开发策略配置界面，支持可视化策略编辑和模板选择
- 开发审计日志查看器，支持搜索、筛选和导出功能
- 实现人机协同审批流程，支持一键同意/拒绝超阈值支付
- 实现响应式设计，支持桌面端和移动端
- 配置多环境环境变量管理（开发/测试/生产）
- 实现生产环境优化（代码分割、懒加载、资源压缩）
- 遵循 Web3 安全最佳实践，实现必要的安全防护
- 编写单元测试与集成测试，确保核心功能稳定性
- 更新所有依赖到最新兼容版本
- 解决重构过程中的兼容性问题
- 解决 ESM 迁移过程中的模块加载错误
- 全面测试验证确保功能正常运行

## Impact
- Affected specs: monad-agentic-payment (extends with frontend UI)
- Affected code:
  - New: `app/` - Next.js 15 App Router 页面和路由
  - New: `src/components/` - 模块化 React 组件
  - New: `src/hooks/` - 自定义 React hooks
  - New: `src/providers/` - Wagmi/Web3 反应提供者
  - New: `src/store/` - Zustand 状态管理
  - New: `src/services/` - API 服务层和数据处理
  - New: `src/types/` - TypeScript 类型定义
  - New: `src/styles/` - 全局样式和 Tailwind 配置
  - New: `src/utils/` - 工具函数
  - New: `src/__tests__/` - 单元测试和集成测试
  - New: `public/` - 静态资源
  - New: `vite.config.ts` - Vite 构建配置 (ESM)
  - New: `next.config.cjs` - Next.js 配置 (CommonJS 保留，因为 Next.js 仍需要)
  - New: `tsconfig.json` - TypeScript 配置（strict 模式）
  - New: `.eslintrc.json` - ESLint 配置 (JSON 格式，不受 CJS/ESM 影响)
  - New: `.prettierrc` - Prettier 配置 (JSON 格式，不受 CJS/ESM 影响)
  - New: `.env.example` - 环境变量示例
  - Updated: `package.json` - 添加 `"type": "module"`，更新所有依赖到最新版本
  - **BREAKING**: 所有 JavaScript 配置文件从 .js/.jsx 迁移为 ESM 格式
  - **BREAKING**: 使用 import/export 替代 require/module.exports

## ADDED Requirements

### Requirement: 现代化项目脚手架
系统 SHALL 使用 **Next.js 15+ + Vite + React 18 + TypeScript + Tailwind CSS** 初始化项目。

#### Scenario: 项目初始化
- **WHEN** 开发者运行 `bun install` 和 `bun dev`
- **THEN** Next.js 开发服务器成功启动
- **AND** Vite 构建工具配置正确
- **AND** TypeScript strict 模式启用
- **AND** ESLint + Prettier 配置正确
- **AND** Tailwind CSS 正常工作
- **AND** 所有依赖版本为最新兼容版本

### Requirement: 代码质量工具配置
系统 SHALL 配置完整的代码质量工具链。

#### Scenario: 代码检查
- **WHEN** 开发者编写代码
- **THEN** ESLint 自动检测语法错误和代码风格问题
- **AND** Prettier 自动格式化代码
- **AND** TypeScript 严格类型检查

### Requirement: 多环境配置
系统 SHALL 支持多环境配置管理。

#### Scenario: 环境切换
- **WHEN** 在开发环境运行
- **THEN** 使用开发环境配置
- **WHEN** 在生产环境构建
- **THEN** 使用生产环境配置
- **AND** 敏感信息不会提交到代码仓库

### Requirement: 安全防护
系统 SHALL 实现 Web3 应用必要的安全防护措施。

#### Scenario: 安全验证
- **WHEN** 用户发起交易
- **THEN** 私钥不会暴露给前端应用
- **AND** 所有交易需要用户签名确认
- **AND** 遵循 Web3 安全最佳实践

### Requirement: 测试覆盖
系统 SHALL 包含单元测试和集成测试。

#### Scenario: 测试运行
- **WHEN** 运行测试命令
- **THEN** 核心功能单元测试通过
- **AND** 集成测试验证关键用户流程
- **AND** 测试覆盖率满足基本要求

### Requirement: ECMAScript 模块 (ESM) 迁移
系统 SHALL 将所有 JavaScript 文件从 CommonJS 迁移到 ESM 模块格式。

#### Scenario: 模块格式迁移
- **WHEN** Node.js 加载模块
- **THEN** 使用 import/export 语法而非 require/module.exports
- **AND** package.json 包含 "type": "module" 字段
- **AND** 所有相对导入包含正确的文件扩展名
- **AND** 无模块加载错误

#### Scenario: 兼容性验证
- **WHEN** 应用启动
- **THEN** 所有依赖包兼容 ESM 格式
- **AND** 开发环境正常运行
- **AND** 生产构建成功完成

### Requirement: Web3 钱包连接
系统 SHALL 提供钱包连接功能，支持 MetaMask 和 WalletConnect 连接到 Monad 测试网。

#### Scenario: 用户连接钱包
- **WHEN** 用户点击"连接钱包"按钮
- **THEN** 显示可用钱包选项
- **WHEN** 用户选择钱包并授权
- **THEN** 成功连接到 Monad 网络
- **AND** 用户地址和余额显示在界面上

#### Scenario: 用户断开钱包
- **WHEN** 用户点击"断开连接"
- **THEN** 钱包成功断开连接
- **AND** 界面重置为未连接状态

### Requirement: 钱包仪表盘
系统 SHALL 提供主仪表盘页面，展示钱包概览信息。

#### Scenario: 仪表盘展示
- **WHEN** 用户连接钱包后访问仪表盘
- **THEN** 显示 ETH 和 ERC-20 Token 余额
- **AND** 显示已连接 Agent 列表及权限摘要
- **AND** 显示活跃 Session Key 及过期时间
- **AND** 显示最近 20 条交易记录
- **AND** 显示每日/每周预算使用进度条
- **AND** 界面响应式适配不同屏幕尺寸

### Requirement: Agent 权限管理界面
系统 SHALL 提供可视化界面来管理 Agent 权限。

#### Scenario: 添加 Agent
- **WHEN** 用户点击"添加 Agent"
- **THEN** 显示添加表单
- **AND** 用户可以输入 Agent 地址、设置过期时间、配置限额、添加白名单地址
- **WHEN** 用户提交表单并签名
- **THEN** 成功创建 Session Key
- **AND** 界面刷新显示新添加的 Agent

#### Scenario: 编辑 Agent 权限
- **WHEN** 用户点击编辑现有 Agent
- **THEN** 显示编辑表单，预填充当前配置
- **AND** 用户可以修改权限配置
- **WHEN** 用户保存变更并签名
- **THEN** 权限更新成功

#### Scenario: 撤销 Agent
- **WHEN** 用户点击撤销 Agent
- **THEN** 显示确认对话框
- **WHEN** 用户确认撤销并签名
- **THEN** Agent 权限被成功撤销
- **AND** Agent 从列表中移除

### Requirement: 策略配置界面
系统 SHALL 提供可视化策略编辑器，支持配置安全策略。

#### Scenario: 策略模板选择
- **WHEN** 用户进入策略配置页面
- **THEN** 显示预置模板选项：保守型、适中型、激进型
- **WHEN** 用户选择模板
- **THEN** 表单自动填充模板配置

#### Scenario: 自定义策略
- **WHEN** 用户选择自定义策略
- **THEN** 用户可以配置：单笔上限、每日上限、每周上限、需审批阈值、Token 白名单、地址黑名单
- **WHEN** 用户保存策略并签名
- **THEN** 策略成功保存到链上

#### Scenario: 策略模拟
- **WHEN** 用户配置完策略后点击"模拟测试"
- **THEN** 用户可以输入测试支付参数
- **AND** 系统显示策略检查结果（通过/拒绝）

### Requirement: 审计日志查看器
系统 SHALL 提供完整的审计日志查询和展示功能。

#### Scenario: 审计列表展示
- **WHEN** 用户进入审计日志页面
- **THEN** 显示所有支付记录列表
- **AND** 支持按 Agent、时间范围、状态、风险等级筛选
- **AND** 支持关键词搜索

#### Scenario: 交易详情查看
- **WHEN** 用户点击某条交易记录
- **THEN** 显示交易详情，包括：Agent 地址、任务上下文、收款方、金额、Token、支付原因、命中策略、审批类型、风险等级、交易哈希
- **AND** 提供区块浏览器链接

#### Scenario: 导出审计记录
- **WHEN** 用户点击"导出"
- **THEN** 用户可以选择导出为 JSON 或 CSV 格式
- **AND** 文件下载到本地

### Requirement: 人机协同审批
系统 SHALL 支持超阈值支付的人工审批流程。

#### Scenario: 自动审批通过
- **WHEN** 支付金额低于策略阈值
- **THEN** 支付自动执行，无需人工干预

#### Scenario: 需要人工审批
- **WHEN** 支付金额超过策略阈值
- **THEN** 系统暂停执行
- **AND** 前端推送通知给用户
- **AND** 在审批门户显示待审批支付

#### Scenario: 用户审批操作
- **WHEN** 用户查看待审批支付
- **THEN** 显示完整支付上下文和风险评估
- **WHEN** 用户点击"同意"或"拒绝"并签名
- **THEN** 支付继续执行或被拒绝
- **AND** Agent 收到结构化响应

### Requirement: 响应式设计
系统 SHALL 在桌面端和移动端都提供良好的用户体验。

#### Scenario: 桌面端适配
- **WHEN** 用户在桌面浏览器访问
- **THEN** 充分利用屏幕空间，多列布局显示

#### Scenario: 移动端适配
- **WHEN** 用户在移动设备访问
- **THEN** 自动切换为单列布局
- **AND** 触摸交互优化
- **AND** 导航栏适配移动端

## MODIFIED Requirements
None - this is a new feature addition to the existing project.

## REMOVED Requirements
None.
