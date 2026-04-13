# Tasks
- [x] Task 1: Verify the issue exists in the code
  - [x] Confirm that `createPolicy` is called without `await` keyword at lines 44-51
  - [x] Confirm that async errors cannot be caught by existing try-catch

- [x] Task 2: Add `await` keyword to `createPolicy` call
  - [x] Modify `src/mcp/tools/create_policy.ts` at lines 44-51
  - [x] Add `await` before `manager.getSecurityManager().createPolicy()` call

- [x] Task 3: Verify the fix compiles correctly
  - [x] Check TypeScript compilation for any errors
  - [x] Confirm function signature remains compatible
