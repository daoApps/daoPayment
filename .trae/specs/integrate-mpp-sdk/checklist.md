# MPP SDK 集成验证清单 - Integrate Real MPP SDK

## 依赖安装验证
- [x] 1. MPP SDK 依赖已添加到 package.json (github:monad-crypto/monad-ts#main)
- [x] 2. `bun install` 成功完成
- [x] 3. 无致命安装错误
- [x] 4. 依赖冲突已解决
- [x] 5. 所有依赖版本兼容（viem, mppx）

## MPP SDK 集成验证
- [x] 6. MPP SDK 能够正确导入到 wallet.ts 中 (`@monad-crypto/mpp/client`)
- [x] 7. viem 能够正确导入 (`viem/accounts`, `viem/chains`)
- [x] 8. Wallet 类使用真实 MPP SDK + viem 实现，模拟代码已移除
- [x] 9. MPP SDK 初始化配置正确 (`monad.charge()` with account)
- [x] 10. `getBalance()` 方法能够调用 viem 获取余额
- [x] 11. `sendTransaction()` 方法能够调用 MPP SDK 创建支付凭证
- [x] 12. 公共接口保持不变：getAddress(), getPublicKey(), getPrivateKey(), getBalance(), sendTransaction(), saveToFile(), loadFromFile()
- [x] 13. 类型定义正确导入

## 上层适配验证
- [x] 14. walletManager.ts 调用兼容
- [x] 15. mainManager.ts 调用兼容
- [x] 16. paymentExecutor.ts 参数类型转换正确 (number → bigint)
- [x] 17. agentInterface.ts 返回类型转换正确 (bigint → number)
- [x] 18. TypeScript 编译成功，无编译错误

## ESM 模块兼容性验证
- [x] 19. package.json 包含 "type": "module" 字段
- [x] 20. MPP SDK 使用 ESM 模块格式
- [x] 21. 所有导入使用 import/export 语法
- [x] 22. 无模块加载错误
- [x] 23. 模块路径解析正确

## 功能验证
- [x] 24. 创建新钱包成功
- [x] 25. 从文件加载钱包成功
- [x] 26. 保存钱包到文件成功
- [x] 27. 获取地址正确
- [x] 28. 获取余额能正常调用
- [x] 29. 发送交易能正常调用
- [x] 30. 所有上层模块对钱包接口的调用正常工作

## 构建验证
- [x] 31. `bun run build` 执行成功
- [x] 32. 无编译错误和类型错误
- [x] 33. 构建产物正常
- [x] 34. ESLint 检查通过
- [x] 35. Prettier 格式化完成

## 最终全面验证
- [x] 36. 所有业务流程能够正常调用 SDK 接口
- [x] 37. 获得预期结果（余额获取、交易创建）
- [x] 38. 项目可正常编译
- [x] 39. 没有兼容性问题
- [x] 40. MPP SDK 集成完整完成
