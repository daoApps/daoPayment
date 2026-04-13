# 非托管钱包核心功能文档

## 概述

非托管钱包（Non-Custodial Wallet）是一种用户完全控制私钥的钱包解决方案，用户拥有对资产的完全控制权，无需依赖第三方托管服务。本实现提供了安全的私钥存储机制、基本的钱包操作接口以及MPP协议集成。

## 核心功能

### 1. 私钥安全存储

- **安全加密存储**：使用AES-256-CBC加密算法存储私钥
- **密钥管理**：用户可自定义加密密钥，增强安全性
- **备份与恢复**：支持钱包导出和导入功能

### 2. 基本钱包操作

- **创建钱包**：生成新的私钥和地址
- **查询余额**：获取钱包在指定链上的余额
- **发送交易**：通过MPP协议发送交易
- **执行原始交易**：直接执行以太坊交易

### 3. MPP协议集成

- **MPP凭证生成**：生成MPP协议的支付凭证
- **MPP凭证验证**：验证MPP凭证的有效性
- **批量支付**：支持批量生成支付凭证

## 安装与使用

### 安装依赖

```bash
npm install
```

### 基本使用示例

#### 创建新钱包

```javascript
import NonCustodialWallet from './src/core/nonCustodialWallet.js';

// 创建新钱包
const wallet = new NonCustodialWallet();
console.log('钱包地址:', wallet.getAddress());
```

#### 安全存储钱包

```javascript
// 初始化安全存储
const encryptionKey = 'your-secure-encryption-key';
wallet.initSecureStorage(encryptionKey);

// 安全存储钱包
wallet.saveSecurely();
console.log('钱包已安全存储');
```

#### 从安全存储加载钱包

```javascript
// 从安全存储加载钱包
const loadedWallet = NonCustodialWallet.loadSecurely(
  wallet.getAddress(),
  encryptionKey
);
console.log('加载的钱包地址:', loadedWallet.getAddress());
```

#### 查询余额

```javascript
// 查询余额
const balance = await wallet.getBalance();
console.log('钱包余额:', balance.toString(), 'wei');
```

#### 发送交易

```javascript
// 发送交易
const recipient = '0x1234567890123456789012345678901234567890';
const amount = 1000000000000000n; // 0.001 ETH
const txHash = await wallet.sendTransaction(recipient, amount);
console.log('交易哈希:', txHash);
```

#### 批量支付

```javascript
// 批量支付
const payments = [
  {
    to: '0x1234567890123456789012345678901234567890',
    amount: 1000000000000000n,
  },
  {
    to: '0x0987654321098765432109876543210987654321',
    amount: 2000000000000000n,
  },
];
const credentials = await wallet.batchPayments(payments);
console.log('生成的凭证数量:', credentials.length);
```

## 安全最佳实践

1. **保护加密密钥**：加密密钥是访问安全存储的关键，应妥善保管
2. **定期备份**：定期导出钱包数据并存储在安全的地方
3. **使用强密码**：选择复杂的加密密钥，避免使用简单密码
4. **避免在不安全环境使用**：不在公共网络或不安全设备上使用钱包
5. **验证交易信息**：在发送交易前仔细核对接收地址和金额

## 技术实现细节

### 私钥生成与管理

- 使用 `viem/accounts` 生成安全的私钥
- 私钥存储在本地，通过 AES-256-CBC 加密保护
- 支持多链操作，默认链为 Monad (10143)

### MPP协议集成

- 使用 `@monad-crypto/mpp` 库实现 MPP 协议
- 支持生成和验证 MPP 凭证
- 提供批量支付功能，提高交易效率

### 网络连接

- 使用 `viem` 库连接到区块链网络
- 支持自定义 RPC 节点
- 处理网络错误和超时情况

## 故障排除

### 常见问题

1. **无法加载钱包**：检查加密密钥是否正确，确保安全存储文件存在
2. **余额查询失败**：检查网络连接，确保 RPC 节点可访问
3. **交易发送失败**：检查 gas 费用是否足够，确保网络状态正常
4. **MPP 凭证生成失败**：检查 MPP 库版本，确保依赖正确安装

### 日志与调试

- 所有操作都会在控制台输出详细日志
- 错误信息会清晰显示，便于排查问题
- 建议在开发环境中开启详细日志模式

## 未来规划

1. **硬件钱包集成**：支持与硬件钱包的连接
2. **多签名功能**：实现多签名钱包功能
3. **智能合约交互**：增强与智能合约的交互能力
4. **跨链支持**：扩展到更多区块链网络
5. **用户界面**：开发用户友好的界面

## 结论

非托管钱包提供了一种安全、自主的数字资产管理方案，用户完全控制自己的私钥和资产。本实现结合了安全的存储机制、便捷的操作接口和MPP协议的优势，为用户提供了一个功能完整、安全可靠的钱包解决方案。