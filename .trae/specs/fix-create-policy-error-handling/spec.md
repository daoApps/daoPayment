# Fix create_policy Async Error Handling Spec

## Why
在 `create_policy.ts` 文件中，`createPolicy` 异步方法调用缺少 `await` 关键字，导致异步操作无法正确等待完成，且错误无法被 try-catch 捕获。这可能导致策略创建未完成就返回成功状态，且错误无法正确处理。

## What Changes
- 在 `manager.getSecurityManager().createPolicy()` 调用前添加 `await` 关键字
- 确保异步操作正确完成后再返回结果
- 不改变现有函数签名，已有的 `async` 关键字正确

## Impact
- Affected specs: None
- Affected code: `src/mcp/tools/create_policy.ts`

## ADDED Requirements
### Requirement: Correct Async Error Handling
The system SHALL correctly await asynchronous `createPolicy` calls before returning results.

#### Scenario: Success case
- **WHEN** user calls `create_policy` tool with valid parameters
- **THEN** system waits for `createPolicy` to complete asynchronously
- **THEN** returns `{ success: true }` after successful creation

#### Scenario: Error case
- **WHEN** `createPolicy` throws an error during policy creation
- **THEN** error is correctly caught by the try-catch block
- **THEN** returns `{ success: false, error: error message }`

## MODIFIED Requirements
### Requirement: Existing create_policy execution
Existing `execute` method signature remains `async execute(input: Input): Promise<Output>`, only adds missing `await` keyword.

## REMOVED Requirements
None
