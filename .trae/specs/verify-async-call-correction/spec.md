# Verify Async Call Correction Spec

## Why
之前在 `create_policy.ts` 中添加了 `await` 关键字修复异步调用，但需要验证 `getSecurityManager().createPolicy()` 方法是否确实返回 Promise。分析发现该方法实际上是同步操作，不返回 Promise，错误地添加 `await` 会导致问题。

## What Changes
- **BREAKING**: 移除 `await manager.getSecurityManager().createPolicy()` 调用前的错误 `await` 关键字
- 将 `createPolicy`、`savePolicy` 等文件操作改为异步 API（使用 fs/promises）
- 使 `createPolicy` 真正返回 Promise<void>，符合 `await` 调用预期
- 添加单元测试验证异步调用正确性

## Impact
- Affected specs: fix-create-policy-error-handling (需要修正)
- Affected code:
  - `src/mcp/tools/create_policy.ts`
  - `src/security/policyStorage.ts` - 将同步 fs 改为异步 fs/promises
  - `src/security/enhancedPolicyManager.ts` - update return type to Promise
  - `src/security/securityManager.ts` - update return type to Promise
  - `src/core/mainManager.ts` - update return type to Promise

## ADDED Requirements
### Requirement: Correct Promise-based Asynchronous API
The system SHALL use asynchronous file operations for policy storage, and `createPolicy` SHALL return a Promise that resolves when the file write operation completes.

#### Scenario: Async file operations
- **WHEN** `createPolicy` is called with valid parameters
- **THEN** method returns a Promise that resolves when policy is persisted to disk
- **THEN** `await` correctly waits for I/O operation to complete
- **THEN** error from file system errors are correctly propagated and can be caught by try-catch

#### Scenario: Synchronous API consistency
- **WHEN** existing code expects synchronous API
- **THEN** all public method signatures are updated consistently across the call chain

## MODIFIED Requirements
### Requirement: Policy Storage API
All file operations changed from synchronous fs.*Sync to asynchronous fs/promises. Method signatures return Promise instead of void/Policy.

## REMOVED Requirements
None

## Issue Summary
**问题确认：
1. 当前状态：`create_policy.ts` 第 44 行错误地添加了 `await`，但 `createPolicy` 方法签名返回 `void`，不是 Promise
2. 修复方案选择：将文件操作改为真正的异步 API（推荐），使 `await` 调用正确

两种修复方案：
- 方案 A：移除 `await`（简单修复）- 保持现有同步设计
- 方案 B：升级为异步 API（正确设计）- 将所有文件 IO 改为异步，符合现代 Node.js 实践
