# Monad Agentic Payment - Product Requirement Document

## Overview
- **Summary**: 基于 Monad 链构建的 Agent 原生安全支付系统，使 AI Agent 能在用户授权下自主完成链上支付，同时确保安全、可控、可审计。
- **Purpose**: 解决传统钱包不适用于 AI Agent 操作的问题，提供 Agent 可操作但不失控的支付解决方案。
- **Target Users**: AI Agent 开发者、需要 Agent 自动执行支付任务的用户、希望在 Agent 环境中集成支付功能的平台。

## Goals
- 实现 Agent 原生的链上支付系统
- 确保系统去中心化、非托管
- 提供细粒度的安全配置和权限管理
- 实现可审计、可追溯的支付记录
- 支持跨平台部署和多 Agent 集成
- 支持智能合约层的安全策略执行
- 实现人机协同审批流程
- 支持 x402 机器可支付 API 集成

## Non-Goals (Out of Scope)
- 中心化托管服务
- 非 Monad 链的支付支持
- 传统人工操作的钱包功能
- 非 Agent 环境的使用场景
- 非 ERC-4337 标准的钱包实现

## Background & Context
- 普通钱包假设操作者是人，需要人工持有私钥和发起交易
- AI Agent 需要自主行动但不能失控
- Monad 链提供了 MPP (Monad Pay Protocol) 作为支付基础设施
- x402 协议为 machine-payable API 提供标准
- ERC-4337 账户抽象标准为 Agent 操作提供基础

## Functional Requirements
- **FR-1**: 去中心化钱包基础设施 - 基于 ERC-4337，用户自持资产，非托管，Agent 无法接触真实私钥
- **FR-2**: 安全配置系统 - 支持单笔上限、每日/每周预算、白名单（地址/合约/Token）、方法级限制、超阈值人工确认、风险拦截、紧急暂停
- **FR-3**: Agent 原生接口 - 为 Agent 设计的权限请求、临时授权、支付执行、失败处理、任务上下文关联
- **FR-4**: 审计与可解释系统 - 完整的支付记录，包括触发者、任务上下文、收款方、支付原因、命中策略、审批状态、执行结果
- **FR-5**: 恢复与权限管理 - 钱包恢复、权限调整、Session Key 轮换、多 Agent 差异化权限
- **FR-6**: 智能合约层 - AgentWallet、SessionKeyManager、PolicyRegistry 实现
- **FR-7**: Agent SDK - 核心支付 API、授权管理、策略客户端
- **FR-8**: MCP Server - 将 Agent SDK 封装为 MCP 工具，支持 Claude、OpenClaw、Codex 等 AI Agent 环境
- **FR-9**: 前端仪表盘 - 钱包管理、审批门户、审计查看器
- **FR-10**: 人机协同审批流程 - 分级审批模型，支持自动、确认、人工三级审批
- **FR-11**: 高级特性 - 钱包恢复机制、多 Agent 差异化权限、x402 机器可支付 API 集成、Passkey/WebAuthn 登录

## Non-Functional Requirements
- **NFR-1**: 跨平台兼容性 - 支持 Mac/Linux/Windows, AMD/Intel/Apple M
- **NFR-2**: 安全性 - 私钥保护、风险拦截、紧急暂停机制
- **NFR-3**: 可集成性 - 可作为 MCP Server / CLI Tool / SDK 集成到 AI Agent 环境
- **NFR-4**: 性能 - 支付执行响应时间 < 5 秒
- **NFR-5**: 可扩展性 - 支持多 Agent 并发操作
- **NFR-6**: 可审计性 - 完整的支付记录和策略执行日志
- **NFR-7**: 安全性 - 链上策略强制执行，非仅咨询性质

## Constraints
- **Technical**: 基于 Monad 链，使用 MPP 协议，TypeScript 开发，Solidity 智能合约
- **Business**: 开源项目，符合赛题要求，黑客松时间限制
- **Dependencies**: MonSkill, MPP TS SDK, x402 协议, viem, wagmi, Next.js, Tailwind CSS

## Assumptions
- 用户已安装 MonSkill 开发环境
- Monad 测试网可正常访问
- Agent 环境支持 MCP 或类似集成方式
- 智能合约可成功部署到 Monad 测试网

## Acceptance Criteria

### AC-1: 去中心化验证
- **Given**: 用户创建钱包
- **When**: Agent 请求执行支付
- **Then**: Agent 无法直接接触私钥，只能通过授权机制操作
- **Verification**: `programmatic`
- **Notes**: 验证私钥存储机制和授权流程

### AC-2: 安全配置功能
- **Given**: 已配置安全策略
- **When**: Agent 发起超出限制的支付
- **Then**: 系统拒绝或要求人工确认
- **Verification**: `programmatic`
- **Notes**: 测试不同安全策略场景

### AC-3: Agent 原生操作
- **Given**: Agent 环境集成支付系统
- **When**: Agent 执行任务需要支付
- **Then**: Agent 自动请求权限、执行支付、处理失败
- **Verification**: `programmatic`
- **Notes**: 测试端到端 Agent 支付流程

### AC-4: 审计记录完整性
- **Given**: Agent 执行支付
- **When**: 支付完成后
- **Then**: 生成包含完整信息的审计记录
- **Verification**: `programmatic`
- **Notes**: 验证审计记录字段完整性

### AC-5: 权限管理功能
- **Given**: 多 Agent 环境
- **When**: 管理员调整 Agent 权限
- **Then**: 权限变更立即生效，Session Key 正确轮换
- **Verification**: `programmatic`
- **Notes**: 测试权限调整和 Session Key 管理

### AC-6: Session Key 功能
- **Given**: 配置临时授权
- **When**: Agent 使用 Session Key 执行支付
- **Then**: Session Key 在指定时间后自动失效
- **Verification**: `programmatic`
- **Notes**: 测试 Session Key 生命周期

### AC-7: Policy Engine 功能
- **Given**: 配置复杂策略规则
- **When**: Agent 发起支付
- **Then**: 系统正确应用策略规则
- **Verification**: `programmatic`
- **Notes**: 测试不同策略组合场景

### AC-8: 跨平台兼容性
- **Given**: 在不同操作系统环境
- **When**: 部署和运行支付系统
- **Then**: 系统正常运行，无平台特定问题
- **Verification**: `human-judgment`
- **Notes**: 在 Mac/Linux/Windows 测试

### AC-9: 集成能力
- **Given**: AI Agent 环境
- **When**: 集成支付系统
- **Then**: Agent 可直接调用支付功能
- **Verification**: `human-judgment`
- **Notes**: 测试与 Claude Code / OpenClaw 等环境集成

### AC-10: 智能合约部署
- **Given**: 智能合约代码完成
- **When**: 部署到 Monad 测试网
- **Then**: 合约成功部署，功能正常
- **Verification**: `programmatic`
- **Notes**: 测试合约部署和基本功能

### AC-11: 前端仪表盘功能
- **Given**: 前端代码完成
- **When**: 用户访问仪表盘
- **Then**: 可查看余额、管理权限、配置策略、查看审计记录
- **Verification**: `human-judgment`
- **Notes**: 测试前端界面和功能

### AC-12: 人机协同审批
- **Given**: Agent 发起超阈值支付
- **When**: 系统触发审批流程
- **Then**: 用户收到通知，可一键同意/拒绝
- **Verification**: `programmatic`
- **Notes**: 测试审批流程和通知机制

## Open Questions
- [ ] 具体的 MPP 协议集成细节需要进一步确认
- [ ] Session Key 的具体实现方案需要根据 Monad 链特性确定
- [ ] 跨平台部署的具体技术方案需要验证
- [ ] 智能合约的具体安全审计方案需要确定
- [ ] 前端仪表盘的具体 UI/UX 设计需要细化