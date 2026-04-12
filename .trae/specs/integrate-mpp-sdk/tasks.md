# Tasks for Integrate Real MPP SDK - MPP SDK 真实集成任务

- [x] Task 1: 定位 MPP SDK 依赖
  - [x] SubTask 1.1: 搜索并验证 MPP SDK 的正确包名和获取方式
  - [x] SubTask 1.2: 确认官方文档中的集成方式
  - [x] SubTask 1.3: 解决依赖包可用性问题
  - **Acceptance Criteria**:
    - 找到可安装的 MPP SDK 来源 (GitHub: monad-crypto/monad-ts)
    - 确认正确的安装方式 (npm install from GitHub)

- [x] Task 2: 安装依赖并解决冲突
  - [x] SubTask 2.1: 添加 MPP SDK 依赖到 package.json (github:monad-crypto/monad-ts#main)
  - [x] SubTask 2.2: 执行安装，解决所有依赖冲突
  - [x] SubTask 2.3: 修复 TypeScript 类型问题
  - **Acceptance Criteria**:
    - `bun install` 成功完成
    - 无依赖冲突和安装错误
    - 兼容项目已有的 viem 依赖版本

- [x] Task 3: 替换 wallet.ts 中的模拟实现
  - [x] SubTask 3.1: 移除 crypto 模拟生成密钥对代码
  - [x] SubTask 3.2: 添加 MPP SDK 和 viem 导入 (`@monad-crypto/mpp/client`, `viem/accounts`)
  - [x] SubTask 3.3: 使用 viem `privateKeyToAccount` 管理密钥
  - [x] SubTask 3.4: 使用 MPP `monad.charge()` 创建客户端
  - [x] SubTask 3.5: 实现 `getBalance()` 使用 viem Client 获取余额
  - [x] SubTask 3.6: 实现 `sendTransaction()` 使用 MPP 创建支付凭证
  - [x] SubTask 3.7: 更新 `saveToFile` 和 `loadFromFile` 适配新的数据结构
  - [x] SubTask 3.8: TypeScript 编译验证
  - **Acceptance Criteria**:
    - 移除所有模拟代码
    - 使用 MPP SDK 提供的 API 实现所有方法
    - TypeScript 编译通过

- [x] Task 4: 验证上层调用适配
  - [x] SubTask 4.1: 检查 `walletManager.ts` 调用兼容性
  - [x] SubTask 4.2: 检查 `mainManager.ts` 调用兼容性
  - [x] SubTask 4.3: 适配 `paymentExecutor.ts` 参数类型转换 (number → bigint)
  - [x] SubTask 4.4: 适配 `agentInterface.ts` 返回类型转换 (bigint → number)
  - [x] SubTask 4.5: 解决所有编译类型错误
  - **Acceptance Criteria**:
    - 所有调用钱包接口的代码正常编译
    - 无类型错误
    - 保持公共接口不变

- [x] Task 5: ESM 模块兼容性验证
  - [x] SubTask 5.1: 检查 MPP SDK 模块格式
  - [x] SubTask 5.2: 验证 ESM 导入正常工作
  - [x] SubTask 5.3: 解决模块路径解析问题
  - [x] SubTask 5.4: 验证类型定义正确加载
  - **Acceptance Criteria**:
    - MPP SDK 兼容 ESM 格式
    - 无模块加载错误
    - TypeScript 能正确导入类型

- [x] Task 6: 依赖兼容性与类型检查
  - [x] SubTask 6.1: 验证 viem 版本兼容性 (项目已安装 viem@2.47.12)
  - [x] SubTask 6.2: 验证 mppx 依赖正确安装
  - [x] SubTask 6.3: 检查 TypeScript 类型全部正确解析
  - [x] SubTask 6.4: 修复类型不匹配问题
  - **Acceptance Criteria**:
    - 所有依赖版本兼容
    - 无 missing types 错误

- [x] Task 7: 构建验证与功能测试
  - [x] SubTask 7.1: 执行完整构建 `bun run build`
  - [x] SubTask 7.2: 验证所有模块编译通过
  - [x] SubTask 7.3: 测试钱包创建流程
  - [x] SubTask 7.4: 测试余额查询流程
  - [x] SubTask 7.5: 测试交易发送流程
  - [x] SubTask 7.6: 测试文件保存和加载
  - **Acceptance Criteria**:
    - 构建成功，无编译错误
    - SDK 初始化和接口调用正常
    - 所有业务流程能正常执行

- [x] Task 8: 全面功能验证与冲突检查
  - [x] SubTask 8.1: ESLint 检查代码质量
  - [x] SubTask 8.2: Prettier 格式化代码
  - [x] SubTask 8.3: 验证 Git 没有冲突
  - [x] SubTask 8.4: 最终验证项目可正常编译
  - **Acceptance Criteria**:
    - 代码质量检查通过
    - 无 lint 错误
    - 项目编译成功

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 7]
