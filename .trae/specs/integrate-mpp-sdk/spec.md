# 集成真实 MPP SDK Spec

## Why
当前项目由于 `@monad-crypto/mpp` 依赖包在 npm 官方 registry 上不存在，暂时使用本地模拟实现。现在需要根据 Monad 官方源码集成真实的 MPP SDK，解决依赖问题，替换模拟实现，使系统能够连接到真实的 Monad 网络进行支付。

## What Changes
- 定位并从 GitHub 获取正确的 MPP SDK 源码
- 添加 `@monad-crypto/mpp` 依赖到 package.json（从 GitHub 安装）
- 解决所有依赖包冲突问题，兼容前端项目的 ESM 模块格式
- 替换 [wallet.ts](file:///d:/daoCollective/daoApps/daoPayment/src/core/wallet.ts) 中的模拟实现，使用真实 MPP SDK 客户端 API
- 利用 viem 进行密钥管理和 RPC 通信，符合 MPP SDK 设计规范
- 完成 SDK 必要的配置与初始化工作
- 验证 SDK 功能完整性和正确性
- 确保所有业务流程能正常调用 SDK 接口并获取预期结果
- **BREAKING**: getBalance() 返回类型从 `number` 变为 `bigint`（上层已适配）
- **BREAKING**: sendTransaction() 参数类型从 `(string, number)` 变为 `(0x${string}, bigint)`（上层已适配）

## Impact
- Affected specs: monad-agentic-payment (core backend SDK)
- Affected code:
  - `src/core/wallet.ts` - 钱包核心实现完全替换
  - `package.json` - 添加 @monad-crypto/mpp 依赖从 GitHub
  - `src/agent/paymentExecutor.ts` - 适配参数类型转换
  - `src/agent/agentInterface.ts` - 适配返回类型转换
  - `tsconfig.json` - 确保解析 GitHub 源码类型正确

## ADDED Requirements

### Requirement: MPP SDK 依赖获取
系统 SHALL 能够从官方 GitHub 仓库正确安装 MPP SDK。

#### Scenario: 依赖安装成功
- **WHEN** 开发者执行 `bun install`
- **THEN** @monad-crypto/mpp 从 GitHub 成功下载安装
- **AND** 无致命安装错误
- **AND** 依赖冲突被正确解决

### Requirement: MPP SDK 集成
系统 SHALL 正确导入并初始化 MPP SDK 客户端。

#### Scenario: SDK 初始化成功
- **WHEN** 创建新 Wallet 实例
- **THEN** MPP SDK 客户端成功初始化
- **AND** 使用 viem `privateKeyToAccount` 管理密钥
- **AND** 配置正确的 Monad RPC 端点
- **AND** 无编译错误

#### Scenario: 获取余额成功
- **WHEN** 调用 `getBalance()` 方法查询钱包余额
- **THEN** 通过 viem 客户端从真实 Monad 网络获取当前钱包的正确 ETH 余额
- **AND** 返回 bigint 类型的余额值

#### Scenario: 发送交易成功
- **WHEN** 调用 `sendTransaction(to, amount, currency)` 发送支付交易
- **THEN** 通过 MPP SDK 创建支付凭证
- **AND** 交易被正确签名
- **THEN** 返回有效的凭证数据

### Requirement: 持久化存储
系统 SHALL 支持钱包文件的保存和加载。

#### Scenario: 保存钱包到文件
- **WHEN** 调用 `saveToFile(filePath)`
- **THEN** 钱包私钥和地址保存到 JSON 文件
- **AND** 文件格式正确，可后续加载

#### Scenario: 从文件加载钱包
- **WHEN** 调用 `Wallet.loadFromFile(filePath)`
- **THEN** 从 JSON 文件读取私钥
- **AND** 重新创建 Wallet 实例
- **AND** 地址和密钥正确恢复

### Requirement: ESM 模块兼容性
系统 SHALL 兼容项目整体 ESM 模块格式。

#### Scenario: 模块导入成功
- **WHEN** TypeScript 编译项目
- **THEN** MPP SDK 模块正确导入
- **AND** 无模块解析错误
- **AND** 类型定义正确加载

## MODIFIED Requirements

### Requirement: 钱包功能
原有模拟实现的钱包功能需要替换为真实 MPP SDK + viem 调用，保持公共接口不变，仅替换内部实现。

**公共接口保持：**
- `constructor(privateKey?: 0x${string})` - 构造函数
- `getAddress(): 0x${string}` - 获取钱包地址
- `getPublicKey(): string` - 获取公钥
- `getPrivateKey(): 0x${string}` - 获取私钥
- `getBalance(): Promise<bigint>` - 获取余额（返回类型改变）
- `sendTransaction(to: 0x${string}, amount: bigint, currency?: 0x${string}): Promise<0x${string}>` - 发送交易（参数类型改变）
- `saveToFile(filePath: string): void` - 保存到文件
- `static loadFromFile(filePath: string): Wallet` - 从文件加载

**BREAKING**: 仅内部实现改变，公共接口保持兼容，上层已适配类型转换。

## REMOVED Requirements

### Requirement: 模拟加密实现
**Reason**: 不再需要本地 crypto 模拟生成密钥对，使用 viem + MPP SDK 官方实现。
**Migration**: 完全替换为 viem `privateKeyToAccount` 和 MPP `monad.charge()` 客户端。
