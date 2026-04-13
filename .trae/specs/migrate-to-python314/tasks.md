# Tasks

- [x] Task 1: 初始化 Python 3.14 项目基础结构
  - [x] SubTask 1.1: 创建 `pyproject.toml` 或 `requirements.txt` 并锁定 Python 3.14 版本，配置 `fastapi`, `uvicorn`, `web3`, `typer` 等依赖库。
  - [x] SubTask 1.2: 创建基础目录结构（例如 `app/api/`, `app/core/`, `app/mcp/`），并设置 FastAPI 的入口 `app/main.py` 及健康检查 API `/health`。
  - [x] SubTask 1.3: 配置 `.gitignore` 并完成第一次 Git Commit 提交 Python 基础环境配置。
- [x] Task 2: 迁移基础配置和安全领域逻辑 (`src/security` & `src/core`)
  - [x] SubTask 2.1: 将非托管钱包、审计管理和 Session Key 的基本类型、接口和管理逻辑迁移到 Python 模块（如 `app/core/wallet.py`, `app/core/audit.py` 等）。
  - [x] SubTask 2.2: 将安全策略解析、风险配置加载（`src/security`）等逻辑迁移为 Python Pydantic Models。
  - [x] SubTask 2.3: 实现相关的 Python 单元测试并提交变更。
- [x] Task 3: 迁移区块链交互与协议层 (`src/core` & `src/protocols`)
  - [x] SubTask 3.1: 使用 `web3.py` 实现对 `AgenticPaymentPolicy` 智能合约的调用，替换掉 `viem`。
  - [x] SubTask 3.2: 迁移 `safeApi.ts` 和 X402 协议的逻辑。
  - [x] SubTask 3.3: 验证调用流程并提交变更。
- [x] Task 4: 迁移 MCP Server (`src/mcp`)
  - [x] SubTask 4.1: 使用官方的 Python MCP SDK 建立新的 MCP Server 入口 (`app/mcp/server.py`)。
  - [x] SubTask 4.2: 重写所有 MCP Tools（如 `create_wallet`, `execute_payment`, `list_audit_records`）为 Python 函数，注册到 MCP Server 中。
  - [x] SubTask 4.3: 测试 MCP Server 是否能够正确暴露和执行，然后提交变更。
- [x] Task 5: 构建 FastAPI 接口 (`app/api/`)
  - [x] SubTask 5.1: 将以前的业务层和状态管理封装为 FastAPI 的路由节点（例如 `/api/wallets`, `/api/policies`），以便前端通过 REST 方式请求。
  - [x] SubTask 5.2: 配置 CORS 跨域规则允许本地 Next.js 应用访问。
  - [x] SubTask 5.3: 生成并验证 OpenAPI (Swagger UI) 文档，提交变更。
- [x] Task 6: 迁移 CLI 命令行工具 (`src/cli.ts`)
  - [x] SubTask 6.1: 使用 `typer` 或 `click` 框架重写原有的 `monad-payment` 命令行工具为 `app/cli.py`。
  - [x] SubTask 6.2: 确保所有 CLI 子命令行为和原有功能对齐，验证后提交变更。
- [x] Task 7: 前端适配与旧代码清理
  - [x] SubTask 7.1: 修改 Next.js 客户端数据请求逻辑（如 Wagmi hooks 或 API 层），调用新的 FastAPI 后端服务。
  - [x] SubTask 7.2: 移除 `package.json` 中的冗余 Node.js 依赖及 `src/` 目录下被迁移的旧 TypeScript 后端代码。
  - [x] SubTask 7.3: 更新根目录的 `README.md`，添加 Python 和 FastAPI 启动说明。
  - [x] SubTask 7.4: 提交最终整合与清理代码。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2], [Task 3]
- [Task 5] depends on [Task 2], [Task 3]
- [Task 6] depends on [Task 2], [Task 3]
- [Task 7] depends on [Task 5]