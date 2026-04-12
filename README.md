# daoPayment - Monad Agentic Payment

> 🌐 **基于 Monad 链的 Agent 原生安全支付系统**

---

## 📋 项目概述

**daoPayment**（Monad Agentic Payment）是一个专为 **AI Agent** 构建的原生链上支付系统，提供去中心化、非托管的安全支付解决方案。项目旨在为 AI Agent 生态打造一套**安全、可控、可审计**的支付基础设施。

---

## ✨ 核心功能

| 功能模块 | 特性描述 |
|---------|---------|
| 🔐 **Agent 原生支付系统** | 为 AI Agent 量身设计的原生链上支付体验 |
| 🛡️ **去中心化安全机制** | 非托管架构，多层次安全防护 |
| 🎯 **细粒度权限控制** | 灵活的安全配置和精细化权限管理策略 |
| 📝 **完整审计追溯** | 所有支付记录可审计、可追溯 |
| 🔑 **Session Key 管理** | 安全的会话密钥管理和权限控制 |
| 🔌 **MCP Server 集成** | 标准 Model Context Protocol 服务器集成 |
| ⚡ **x402 自动化支付** | 支持 x402 协议，实现自动支付闭环 |
| ✅ **链上白名单验证** | 智能合约存储白名单配置，防篡改 |

---

## 🛠️ 技术栈

| 分类 | 技术选型 |
|---------|---------|
| **开发语言** | TypeScript, Solidity |
| **前端框架** | Next.js 16.x, React |
| **区块链** | Monad, Wagmi v3, Viem |
| **智能合约开发** | Foundry |
| **标准协议** | Model Context Protocol (MCP), x402 Payment Protocol |
| **工具库** | Zod, TanStack Query |

---

## 📖 Foundry 开发指南

**Foundry** 是一个用 Rust 编写的极速、可移植且模块化的以太坊应用开发工具包。

### 核心组件

- 🔨 **Forge**：以太坊测试框架（类似 Truffle、Hardhat 和 DappTools）
- 🛠️ **Cast**：与 EVM 智能合约交互、发送交易和获取链数据的瑞士军刀
- 🏝️ **Anvil**：本地以太坊节点，类似于 Ganache、Hardhat Network
- ⚙️ **Chisel**：快速、实用且功能丰富的 Solidity REPL

### 官方文档

📚 详细文档请访问：[https://book.getfoundry.sh/](https://book.getfoundry.sh/)

### 常用命令

#### 构建项目
```shell
forge build
```

#### 运行测试
```shell
forge test
```

#### 代码格式化
```shell
forge fmt
```

#### Gas 快照
```shell
forge snapshot
```

#### 启动本地节点
```shell
anvil
```

#### 部署合约
```shell
forge script script/Counter.solv:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

#### 使用 Cast
```shell
cast <subcommand>
```

#### 获取帮助
```shell
forge --help
anvil --help
cast --help
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Foundry

### 安装依赖

```shell
npm install
```

### 构建项目

```shell
npm run build
```

### 启动 MCP 服务器

```shell
npm run mcp
```

### 使用 CLI 工具

```shell
npx daoPayment <command>
```

---

## 📄 许可证

MIT
