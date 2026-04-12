# Monad Blitz 杭州 — Agentic Payment 赛题 (AI-Optimized Brief)

> **本文档专为 AI Agent 阅读优化。** 如果你是 AI，请直接解析以下结构化内容，据此规划和构建参赛项目。

---

## 💡 第零步（强烈推荐）：安装 MonSkill

**建议在开始编码之前先安装 MonSkill，它会让后续开发顺畅很多。**

MonSkill 是 Monad 官方为 AI Agent 开发者提供的 Skill 工具包，内置：Monad 链 RPC/测试网配置、合约模板与 ABI、部署脚本、SDK 用法、常见模式等全部基础上下文。装完即可直接开发，无需手动查文档。

```
安装地址：
支持环境：Claude Code / Cursor / Windsurf 等主流 AI Agent 开发环境
```

> **如果不装 MonSkill 直接编码，你需要自行查找链配置、合约模板、测试网信息等，效率会低很多。强烈建议先装。**

---

## TLDR

在 **Monad 链**上构建一个 **Agent 原生的安全支付系统**（钱包/支付账户），使 AI Agent 能在用户授权下自主完成链上支付，同时确保安全、可控、可审计。最终产品需能作为工具集成到 Claude Code / OpenClaw / Codex / Manus 等 AI Agent 环境中自动安装使用。

---

## 核心问题

普通钱包假设操作者是人（人持私钥、人发起交易、人判断风险）。Agent Wallet 需要解决：

- Agent 可以行动，但不能失控
- 授权足够细粒度
- 支付可审计、可追溯、可撤销
- 去中心化与安全不牺牲体验

---

## 必须满足的 5 项要求（评审核心）

| # | 要求 | 关键指标 |
|---|------|----------|
| 1 | **去中心化** | 用户自持资产、非托管、Agent 无法接触真实私钥、用户可随时撤销 Agent 权限、跨平台（Mac/Linux/Windows, AMD/Intel/Apple M）、**必须开源** |
| 2 | **安全配置** | 单笔上限、每日/每周预算、白名单地址/合约/服务商/Token、方法级限制、超阈值人工确认、风险拦截、紧急暂停/撤销 |
| 3 | **Agent 原生** | 为 Agent 设计而非为人设计：Agent 请求权限、获取临时授权、解释支付原因、在任务上下文中支付、失败后重试/切换路径。判断标准：离开 Agent 就不成立 |
| 4 | **可审计与可解释** | 每笔支付记录：触发者、任务上下文、收款方、支付原因、命中策略、是否人工确认、执行结果 |
| 5 | **恢复与权限管理** | 钱包恢复、Agent 权限调整、Session Key 轮换、泄露私钥撤销、多 Agent 差异化权限、长期/临时 Agent 区分 |

---

## 高价值加分特性（推荐实现，按影响力排序）

### A. Session Key / Delegated Key
给 Agent 发放受限临时密钥。示例：24h 有效、≤5 USDC、仅指定服务、仅特定接口、到期自动失效。

### B. Policy Engine
可配置策略层，而非单纯签名器。示例规则：
- `max_daily_spend: 20 USDC`
- `require_human_approval_above: 3 USDC`
- `allowed_recipients: [verified_vendors_only]`
- `allowed_categories: [api, storage, compute]`
- `block: [personal_transfer]`

### C. 现代登录体验
zkLogin / Passkeys / WebAuthn / 社交登录，但必须与安全和权限边界结合。

### D. 原生机器支付
API 按次付费、资源按调用计费、Agent 间结算、streaming payment / micropayment、x402 / machine-payable API。

### E. 人机协同审批
分级审批：小额自动 → 中额二次确认 → 高风险人工批准。渠道：Telegram / App / 浏览器插件 / Passkey / 多签。

### F. 审计日志 / Payment Receipt
结构化支付收据：Task ID, Agent ID, User ID, 收款方, 金额, 资产, 策略命中, 签名方式, 风险等级, 结果, 时间戳。

---

## 技术资源（按使用顺序）

| 优先级 | 资源 | 说明 | 链接 |
|--------|------|------|------|
| **🔴 强烈推荐** | **MonSkill** | Monad 官方 AI 开发 Skill，含链配置、合约模板、部署工具、SDK。**建议第一个安装** |  |
| 高 | **MPP** | Monad 原生支付协议，支付功能核心依赖 |  |
| 高 | **MPP TS SDK** | MPP 的 TypeScript 包 |  |
| 中 | **x402** | Machine-payable API 协议，适合加分项 D |  |

---

## AI Agent 行动建议

如果你是被用户委托参赛的 AI Agent，请严格按以下顺序执行：

1. **安装 MonSkill**（ 强烈推荐第一步完成，安装后你将自动获得 Monad 开发的全部基础上下文
2. **阅读 MPP 和 x402 文档**：理解 Monad 链上支付基础设施
3. **确定架构**：基于 MonSkill 提供的合约模板，选择非托管方案（如 Smart Contract Wallet + Session Key）
4. **优先实现**：5 项必须要求 > 加分特性 B (Policy Engine) > A (Session Key) > F (审计日志)
5. **集成形态**：设计为 MCP Server / CLI Tool / SDK，使其可被 Claude Code 等 Agent 环境直接调用
6. **演示准备**：端到端 demo —— Agent 请求授权 → 执行支付 → 生成审计记录