# 修正 README.md 项目名称 Spec

## Why
当前 `README.md` 文件只包含 Foundry 工具的介绍内容，缺少项目本身的介绍信息，需要修正为正确反映 `daoPayment` 项目的内容。根据参考文件夹中的项目复盘报告，这是一个基于 Monad 链的 Agent 原生安全支付系统项目。

## What Changes
- 在 README.md 开头添加完整的项目介绍信息
- 项目名称修正为 `daoPayment - Monad Agentic Payment`
- 添加项目概述、核心功能、技术栈等关键信息
- 保留原有的 Foundry 使用说明（因为项目使用 Foundry 进行智能合约开发）
- 确保内容与参考文件夹中的项目描述保持一致

## Impact
- Affected specs: 文档规范
- Affected code: `README.md`

## ADDED Requirements
### Requirement: 项目介绍
README.md 开头必须添加完整的 `daoPayment` 项目介绍信息。

#### Scenario: 正确展示项目信息
- **WHEN** 用户查看 README.md
- **THEN** 用户首先看到的是 daoPayment 项目的介绍，而不是 Foundry 工具的介绍
- **THEN** 项目名称、描述、核心功能、技术栈等信息准确反映项目实际情况
