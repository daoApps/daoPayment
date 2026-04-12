# daoPayment - Monad Agentic Payment

> 基于 Monad 链的 Agent 原生安全支付系统

## 项目概述

daoPayment（Monad Agentic Payment）是一个为 AI Agent 构建的原生链上支付系统，提供去中心化、非托管的安全支付解决方案。项目旨在为 AI Agent 生态提供安全、可控、可审计的支付基础设施。

## 核心功能

- ✅ **Agent 原生支付系统** - 为 AI Agent 量身设计的原生链上支付体验
- ✅ **去中心化安全机制** - 非托管、多层次安全防护
- ✅ **细粒度权限控制** - 灵活的安全配置和权限管理策略
- ✅ **完整审计追溯** - 所有支付记录可审计、可追溯
- ✅ **Session Key 管理** - 安全的会话密钥管理和权限控制
- ✅ **MCP Server 集成** - 标准 Model Context Protocol 服务器集成
- ✅ **x402 自动化支付** - 支持 x402 协议，实现自动支付闭环
- ✅ **链上白名单验证** - 智能合约存储白名单配置，防篡改

## 技术栈

- **语言**: TypeScript, Solidity
- **框架**: Next.js 16.x, React
- **区块链**: Monad, Wagmi v3, Viem
- **智能合约**: Foundry
- **标准协议**: Model Context Protocol (MCP), x402 Payment Protocol
- **工具**: Zod, TanStack Query

---

## Foundry

**Foundry 是一个用 Rust 编写的、极速、可移植且模块化的以太坊应用开发工具包。**

Foundry 包含以下组件：

- **Forge**: 以太坊测试框架（类似 Truffle、Hardhat 和 DappTools）。
- **Cast**: 与 EVM 智能合约交互、发送交易和获取链数据的瑞士军刀。
- **Anvil**: 本地以太坊节点，类似于 Ganache、Hardhat Network。
- **Chisel**: 快速、实用且功能丰富的 Solidity REPL。

## 文档

https://book.getfoundry.sh/

## 使用方法

### 构建

```shell
$ forge build
```

### 测试

```shell
$ forge test
```

### 格式化

```shell
$ forge fmt
```

### Gas 快照

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### 部署

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### 帮助

```shell
$ forge --help
$ anvil --help
$ cast --help
```
