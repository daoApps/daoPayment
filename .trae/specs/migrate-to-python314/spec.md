# Migrate to Python 3.14 and FastAPI Spec

## Why
当前 `daoPayment` 项目的核心逻辑和命令行工具是基于 Node.js/TypeScript 构建的。用户希望将其核心架构渐进式地迁移到 Python 3.14，以利用 Python 强大的生态（尤其是 AI、数据处理相关领域），并使用 FastAPI 作为后端 Web 框架提供高性能的异步接口服务。

## What Changes
- 使用 `pyproject.toml` (例如通过 `uv` 或 `poetry`) 初始化 Python 3.14 项目配置。
- **BREAKING**: 将核心的智能合约交互代码（目前使用 `viem`/`wagmi`）重构为使用 `web3.py` 或同等 Python 库。
- 将 `src/core`, `src/security`, `src/audit`, `src/agent` 等核心领域逻辑使用 Python 3.14 语法和类型注解进行重写。
- **BREAKING**: 将 Node.js 实现的 MCP Server (`src/mcp`) 替换为官方 `mcp` Python SDK 实现。
- 使用 `FastAPI` 构建后端服务，取代原有的部分直接集成到 Next.js 里的业务逻辑，并提供统一的 REST API。
- 将 CLI 工具 (`src/cli.ts`) 迁移至使用 Python 框架（例如 `typer` 或 `click`）。
- 前端 (Next.js/React) 保持，但调整数据获取层以调用新的 FastAPI 后端接口。

## Impact
- Affected specs: MCP 服务集成、CLI 命令行工具、前端数据交互流程。
- Affected code: `src/*` 下的 TypeScript 核心代码，`app/*` 中的数据请求部分，以及根目录的打包、运行脚本。

## ADDED Requirements
### Requirement: Python 3.14 运行环境
系统应当支持基于 Python 3.14 的运行环境，并提供完整的依赖管理（如 `requirements.txt` 或 `pyproject.toml`）。

#### Scenario: 启动 FastAPI 后端服务
- **WHEN** 开发者运行服务启动命令（如 `fastapi dev` 或 `uvicorn app.main:app`）
- **THEN** FastAPI 服务应在本地指定端口启动，并能成功响应健康检查 API。

### Requirement: Python MCP Server
系统应当提供一个基于 Python 的 MCP Server，具备与之前 TypeScript 版本相同的 Tool 定义和处理能力。

## MODIFIED Requirements
### Requirement: 核心业务逻辑迁移
原本位于 `src/core` 及 `src/security` 下的非托管钱包（Non-Custodial Wallet）、安全策略（Security Policy）及审计记录（Audit Records）逻辑应全部移植到 Python 中，保证行为与原版一致。

## REMOVED Requirements
### Requirement: Node.js 核心后端与 CLI
**Reason**: 统一技术栈到 Python，避免 Node.js 和 Python 混合维护后端业务逻辑的复杂性。
**Migration**: 废弃 `src/cli.ts` 和 `src/mcp` 等 TypeScript 文件，替换为对应的 `.py` 实现，并清理 `package.json` 中的多余依赖。