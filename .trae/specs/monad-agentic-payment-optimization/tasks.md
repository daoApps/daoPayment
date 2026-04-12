# Monad Agentic Payment - Deep Optimization Tasks

## Phase 1: 前后端数据联调与 Wagmi Hooks 深度集成

- [x] Task 1.1: 项目依赖与配置准备
  - [x] 确保 wagmi v3 和相关依赖正确安装
  - [x] 配置 Wagmi 客户端和 Monad 链信息
  - [x] 创建 `src/hooks/` 目录用于存放自定义 hooks

- [x] Task 1.2: 动态数据读取 hooks 实现
  - [x] 创建 `usePolicyRead.ts` hook 使用 `useReadContract` 读取策略数据
  - [x] 创建 `useBudgetRead.ts` hook 读取预算限额
  - [x] 创建 `useWhitelistRead.ts` hook 读取白名单配置
  - [x] 验证：从链上正确读取数据并返回

- [x] Task 1.3: 合约写入功能实现
  - [x] 创建 `usePolicyWrite.ts` hook 使用 `useWriteContract` 写入策略配置
  - [x] 添加交易确认等待机制
  - [x] 添加错误处理和用户反馈
  - [x] 添加交易状态管理
  - [x] 验证：成功调用 `setPolicy` 并在链上确认

- [x] Task 1.4: Safe Transaction API 集成
  - [x] 实现 Safe API 客户端获取待审批交易
  - [x] 创建 `PendingTransactionsList` React 组件
  - [x] 实现交易详情查看功能
  - [x] 实现审批/拒绝操作
  - [x] 添加状态实时更新
  - [x] 验证：正确显示待审批列表，操作后状态更新

- [x] Task 1.5: Dashboard UI 动态升级
  - [x] 重构现有 Dashboard 页面，替换静态数据为动态数据
  - [x] 添加加载状态和错误处理UI
  - [x] 集成新创建的 hooks
  - [x] 验证：页面加载后自动显示最新链上数据

## Phase 2: MCP Server 标准化封装

- [x] Task 2.1: 支付逻辑模块化重构
  - [x] 将 CLI 中的支付逻辑提取到独立模块 `src/mcp/tools/`
  - [x] 为每个工具定义清晰的输入输出类型
  - [x] 创建 `ITool` 接口规范
  - [x] 验证：模块独立可测试，类型正确

- [x] Task 2.2: 基于官方 MCP 规范实现服务器
  - [x] 添加 `@modelcontextprotocol/sdk` 依赖
  - [x] 实现 MCP Server 类，注册所有工具
  - [x] 支持 stdio 传输（用于 Claude Code/Cursor 集成）
  - [x] 支持 HTTP 传输（用于远程服务）
  - [x] 实现工具调用错误处理
  - [x] 验证：服务器启动成功，所有工具注册成功

- [x] Task 2.3: 工具实现 - 钱包管理
  - [x] 实现 `create_wallet` 工具
  - [x] 实现 `list_wallets` 工具
  - [x] 实现 `get_wallet_balance` 工具
  - [x] 验证：工具调用返回正确结果

- [x] Task 2.4: 工具实现 - Session Key 管理
  - [x] 实现 `generate_session_key` 工具
  - [x] 实现 `revoke_session_key` 工具
  - [x] 实现 `list_session_keys` 工具
  - [x] 验证：Session Key 生成和撤销正常

- [x] Task 2.5: 工具实现 - 支付执行
  - [x] 实现 `execute_payment` 工具（支持 Session Key 和普通权限两种方式）
  - [x] 实现 `check_payment_status` 工具
  - [x] 验证：支付流程正确执行

- [x] Task 2.6: 工具实现 - 策略与审计
  - [x] 实现 `create_policy` 工具
  - [x] 实现 `create_policy_template` 工具
  - [x] 实现 `list_audit_records` 工具
  - [x] 实现 `get_audit_report` 工具
  - [x] 验证：策略创建和审计查询正常

- [x] Task 2.7: 多平台兼容性测试与文档
  - [x] 编写 Claude Code 集成配置示例
  - [x] 编写 Cursor 集成配置示例
  - [x] 创建 `docs/MCP-INTEGRATION.md` 详细说明
  - [x] 验证：按照文档可以正确集成到对应的 AI 编辑器

## Phase 3: 白名单策略与 Policy Engine 进阶优化

- [x] Task 3.1: 智能合约逻辑设计与实现（如果需要新增/修改合约）
  - [x] 设计 `allowedRecipients` 数据结构
  - [x] 添加多维度分类支持（by service, by token, by category）
  - [x] 实现验证逻辑
  - [x] 编译完成（可部署到 Monad 测试网）
  - [x] 验证：合约编译通过

- [x] Task 3.2: Policy Engine 增强
  - [x] 添加 whitelist 规则类型到 `PolicyRule`
  - [x] 实现白名单验证逻辑
  - [x] 集成到策略评估流程
  - [x] 验证：白名单规则正确评估

- [x] Task 3.3: 前端白名单管理界面
  - [x] 创建 `WhitelistManager` 组件
  - [x] 实现添加/删除地址功能
  - [x] 实现分类管理（OpenAI, AWS, 等）
  - [x] 验证：UI 交互流畅，配置正确保存

- [x] Task 3.4: 链上存储与验证集成
  - [x] 前端：实现将白名单配置写入合约
  - [x] 后端/引擎：在支付验证时读取链上白名单
  - [x] 添加本地缓存优化（可选）
  - [x] 验证：配置正确存储链上，验证时正确读取

## Phase 4: MPP/x402 协议集成与自动化支付闭环

- [x] Task 4.1: x402 协议客户端实现
  - [x] 创建 `x402Client.ts` 封装 HTTP 请求
  - [x] 实现 402 状态码检测
  - [x] 解析 payment requirement 响应
  - [x] 验证：正确捕获和解析 402 响应

- [x] Task 4.2: 自动化支付流程集成
  - [x] 检测到 402 后，提取支付信息（recipient, amount, token）
  - [x] 调用安全检查（策略、预算、白名单）
  - [x] 安全检查通过后，自动执行支付（MPP）
  - [x] 获取支付收据后，重新发起原请求
  - [x] 返回最终响应给调用者
  - [x] 创建审计记录
  - [x] 验证：完整流程自动完成，无需人工干预

- [x] Task 4.3: MPP 支付流程优化
  - [x] 确认 MPP 集成正确性
  - [x] 处理 push/pull 两种模式
  - [x] 添加支付失败重试机制
  - [x] 验证：MPP 支付成功完成

- [x] Task 4.4: 端到端演示场景构建
  - [x] 创建示例：Agent 自动调用付费 API
  - [x] 示例代码展示完整流程
  - [x] 添加 README 说明如何运行演示
  - [x] 验证：从资源请求 → 支付 → 获取资源完整流程可运行

## Phase 5: 测试与文档

- [x] Task 5.1: 文档完善
  - [x] 更新主 README 添加新功能说明
  - [x] 创建 `docs/X402-INTEGRATION.md`
  - [x] 创建 `docs/MCP-INTEGRATION.md`
  - [x] 更新架构说明

- [x] Task 5.4: 最终验证
  - [x] 全量构建测试 `npm run build` ✓ (success)
  - [x] 类型检查 `npm run typecheck` ✓ (success)
  - [x] 格式化 `npm run format` ✓ (success)
  - [x] 所有检查通过

## Task Dependencies

- Phase 1 无依赖，可以并行进行 ✓
- Phase 2 依赖 Phase 1 的模块化设计 ✓
- Phase 3 依赖 Phase 2 的策略引擎基础 ✓
- Phase 4 依赖 Phase 1-3 的所有基础功能 ✓
- Phase 5 依赖所有前置任务完成 ✓
