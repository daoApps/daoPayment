# Tasks for Frontend Web3 Application - Full Stack Reconstruction (Next.js 15 + Vite + React + TypeScript)

- [ ] Task 0: 项目初始化与依赖配置
  - [ ] SubTask 0.1: 使用 bun create next-app 初始化 Next.js 15 + React 18 + TypeScript 项目
  - [ ] SubTask 0.2: 安装并配置 Vite 构建工具
  - [ ] SubTask 0.3: 安装并配置 Tailwind CSS
  - [ ] SubTask 0.4: 安装核心 Web3 依赖（viem, wagmi, @wagmi/core, @wagmi/connectors）
  - [ ] SubTask 0.5: 安装状态管理（zustand）和路由（next/navigation）
  - [ ] SubTask 0.6: 安装并配置 ESLint + Prettier
  - [ ] SubTask 0.7: 更新所有依赖到最新兼容版本
  - [ ] SubTask 0.8: 配置 TypeScript strict 模式
  - [ ] SubTask 0.9: 创建 next.config.js 和 vite.config.ts 配置文件
  - [ ] SubTask 0.10: 创建 .env.example 环境变量示例文件
  - [ ] SubTask 0.11: 验证开发服务器可正常启动

- [ ] Task 1: 项目结构重构
  - [ ] SubTask 1.1: 创建现代化目录结构（app/, src/components, src/hooks, src/providers, src/store, src/services, src/types, src/styles, src/utils, src/__tests__）
  - [ ] SubTask 1.2: 配置 Next.js App Router 路由结构
  - [ ] SubTask 1.3: 配置 Monad 测试网链信息
  - [ ] SubTask 1.4: 验证项目结构符合最佳实践

- [ ] Task 2: 配置 Web3 基础架构
  - [ ] SubTask 2.1: 创建 Wagmi 提供者配置
  - [ ] SubTask 2.2: 配置 MetaMask 和 WalletConnect 连接器
  - [ ] SubTask 2.3: 创建 Web3 hooks 封装（useWallet, useBalance, useContractRead, useContractWrite）
  - [ ] SubTask 2.4: 创建 Zustand store 管理钱包和应用状态
  - [ ] SubTask 2.5: 创建 React 上下文提供者
  - [ ] SubTask 2.6: 测试钱包连接功能

- [ ] Task 3: 创建基础 UI 组件和布局
  - [ ] SubTask 3.1: 创建全局布局组件（Header, Footer, Navigation）
  - [ ] SubTask 3.2: 创建连接钱包按钮组件
  - [ ] SubTask 3.3: 创建通用 UI 组件（Button, Card, Modal, Table, Badge, Loading, ErrorBoundary）
  - [ ] SubTask 3.4: 配置 Tailwind 主题和全局样式
  - [ ] SubTask 3.5: 配置 Next.js 根布局（metadata, fonts）
  - [ ] SubTask 3.6: 验证响应式布局基础框架

- [ ] Task 4: 实现钱包仪表盘页面
  - [ ] SubTask 4.1: 创建仪表盘主页面（app/dashboard/page.tsx）
  - [ ] SubTask 4.2: 实现余额卡片组件（ETH + ERC-20）
  - [ ] SubTask 4.3: 实现已连接 Agent 列表组件
  - [ ] SubTask 4.4: 实现活跃 Session Key 列表组件
  - [ ] SubTask 4.5: 实现近期交易列表组件
  - [ ] SubTask 4.6: 实现预算进度条可视化
  - [ ] SubTask 4.7: 测试仪表盘数据加载和展示

- [ ] Task 5: 实现 Agent 权限管理界面
  - [ ] SubTask 5.1: 创建 Agent 管理列表页面（app/agents/page.tsx）
  - [ ] SubTask 5.2: 创建添加 Agent 表单对话框
  - [ ] SubTask 5.3: 创建编辑 Agent 权限表单
  - [ ] SubTask 5.4: 实现撤销 Agent 确认对话框
  - [ ] SubTask 5.5: 集成合约调用（addAgent, removeAgent, rotateSessionKey）
  - [ ] SubTask 5.6: 测试增删改查完整流程

- [ ] Task 6: 实现策略配置界面
  - [ ] SubTask 6.1: 创建策略配置列表页面（app/policies/page.tsx）
  - [ ] SubTask 6.2: 实现策略模板选择组件（保守型/适中型/激进型）
  - [ ] SubTask 6.3: 创建策略编辑表单
  - [ ] SubTask 6.4: 实现策略模拟测试功能
  - [ ] SubTask 6.5: 集成合约调用（创建/更新/删除策略）
  - [ ] SubTask 6.6: 测试策略配置流程

- [ ] Task 7: 实现审计日志查看器
  - [ ] SubTask 7.1: 创建审计日志列表页面（app/audit/page.tsx）
  - [ ] SubTask 7.2: 实现搜索和筛选功能
  - [ ] SubTask 7.3: 创建交易详情模态框
  - [ ] SubTask 7.4: 实现导出功能（JSON/CSV）
  - [ ] SubTask 7.5: 添加区块浏览器链接
  - [ ] SubTask 7.6: 风险等级可视化指示器
  - [ ] SubTask 7.7: 测试审计日志查询和导出

- [ ] Task 8: 实现人机协同审批门户
  - [ ] SubTask 8.1: 创建待审批列表页面（app/approvals/page.tsx）
  - [ ] SubTask 8.2: 创建审批详情视图
  - [ ] SubTask 8.3: 实现一键同意/拒绝按钮
  - [ ] SubTask 8.4: 集成审批结果合约调用
  - [ ] SubTask 8.5: 实现浏览器通知提醒
  - [ ] SubTask 8.6: 测试审批完整流程

- [ ] Task 9: 响应式设计优化
  - [ ] SubTask 9.1: 优化桌面端布局
  - [ ] SubTask 9.2: 适配移动端导航和布局（汉堡菜单）
  - [ ] SubTask 9.3: 优化触摸交互
  - [ ] SubTask 9.4: 测试不同屏幕尺寸（桌面/平板/移动）

- [ ] Task 10: 集成后端 SDK 和类型定义
  - [ ] SubTask 10.1: 导入现有的后端 Agent SDK 类型
  - [ ] SubTask 10.2: 创建 API 服务层封装
  - [ ] SubTask 10.3: 连接前端状态与后端逻辑
  - [ ] SubTask 10.4: 修复类型错误
  - [ ] SubTask 10.5: 验证端到端数据流动

- [ ] Task 11: 环境配置与生产优化
  - [ ] SubTask 11.1: 配置开发环境变量
  - [ ] SubTask 11.2: 配置生产环境变量
  - [ ] SubTask 11.3: 启用代码分割和懒加载
  - [ ] SubTask 11.4: 配置资源压缩和优化
  - [ ] SubTask 11.5: 验证 SSR/SSG 功能正常

- [ ] Task 12: 安全配置与合规检查
  - [ ] SubTask 12.1: 配置 Content Security Policy (CSP)
  - [ ] SubTask 12.2: 确保私钥不会暴露给前端
  - [ ] SubTask 12.3: 验证所有交易需要用户签名
  - [ ] SubTask 12.4: 添加防 CSRF 防护
  - [ ] SubTask 12.5: 验证符合 Web3 安全最佳实践

- [ ] Task 13: 编写测试
  - [ ] SubTask 13.1: 配置测试框架（Vitest + React Testing Library）
  - [ ] SubTask 13.2: 编写核心组件单元测试
  - [ ] SubTask 13.3: 编写工具函数单元测试
  - [ ] SubTask 13.4: 编写关键用户流程集成测试
  - [ ] SubTask 13.5: 运行测试并确保全部通过

- [ ] Task 14: 功能测试与错误处理
  - [ ] SubTask 14.1: 测试钱包连接/断开流程
  - [ ] SubTask 14.2: 测试各页面导航和数据加载
  - [ ] SubTask 14.3: 添加网络错误处理
  - [ ] SubTask 14.4: 添加交易失败错误提示
  - [ ] SubTask 14.5: 验证用户交互反馈
  - [ ] SubTask 14.6: 测试跨浏览器兼容性

- [ ] Task 15: 依赖兼容性测试与构建验证
  - [ ] SubTask 15.1: 检查所有依赖版本兼容性
  - [ ] SubTask 15.2: 执行开发构建验证
  - [ ] SubTask 15.3: 执行生产构建 `bun run build`
  - [ ] SubTask 15.4: 修复构建过程中的类型错误
  - [ ] SubTask 15.5: 解决 Vite + Next.js 特定兼容性问题
  - [ ] SubTask 15.6: 验证构建产物正常

- [x] Task 16: ESM 模块格式迁移
  - [x] SubTask 16.1: 检查当前项目中所有 CommonJS 格式文件
  - [x] SubTask 16.2: 更新 package.json 添加 "type": "module" 字段
  - [x] SubTask 16.3: 将 JavaScript 配置文件从 require/module.exports 转换为 import/export
  - [x] SubTask 16.4: 修复模块路径解析问题，添加必要的文件扩展名
  - [x] SubTask 16.5: 验证所有依赖包兼容 ESM 格式
  - [x] SubTask 16.6: 解决 ESM 迁移过程中的模块加载错误
  - [x] SubTask 16.7: 测试 ESM 迁移后的开发环境启动

- [x] Task 17: 全面功能验证
  - [x] SubTask 17.1: 开发环境运行测试
  - [x] SubTask 17.2: 生产构建产物测试
  - [x] SubTask 17.3: 验证 SSR/SSG 功能正常工作
  - [x] SubTask 17.4: 验证所有主要功能模块完整性
  - [x] SubTask 17.5: 检查并修复兼容性问题
  - [x] SubTask 17.6: ESLint 检查通过
  - [x] SubTask 17.7: TypeScript 编译无错误
  - [x] SubTask 17.8: 最终验证项目可正常启动和运行

# Task Dependencies
- [Task 1] depends on [Task 0]
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 4]
- [Task 7] depends on [Task 4]
- [Task 8] depends on [Task 4]
- [Task 9] depends on [Task 8]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 10]
- [Task 12] depends on [Task 11]
- [Task 13] depends on [Task 12]
- [Task 14] depends on [Task 13]
- [Task 15] depends on [Task 14]
- [Task 16] depends on [Task 15]
- [Task 17] depends on [Task 16]
