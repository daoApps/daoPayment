# 前端 Web3 应用开发：冲突预防与最佳实践指南

## 一、项目结构分析

### 1.1 整体架构设计

本项目采用 **Monorepo 风格的一体化架构**，将后端核心 SDK 与前端 Web 应用整合在同一个仓库中：

```
daoPayment/
├── .trae/specs/          # 规格驱动开发文档管理
│   ├── frontend-web3-application/  # 当前规格
│   ├── integrate-mpp-sdk/          # MPP SDK 集成规格
│   ├── monad-agentic-payment/      # 核心系统规格
│   └── ...
├── app/                  # Next.js 15 App Router (新增前端)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── src/                  # 后端核心 SDK (原有)
│   ├── agent/           # Agent 权限管理模块
│   ├── audit/           # 审计日志模块
│   ├── core/            # 核心钱包管理
│   ├── mcp/             # MCP 服务器集成
│   └── security/        # 安全策略引擎
├── src/ (新增前端)
│   ├── components/      # React 组件库
│   ├── hooks/           # 自定义 React Hooks
│   ├── providers/       # Web3 上下文提供者
│   ├── store/           # Zustand 状态管理
│   ├── services/        # API 服务层
│   ├── types/           # TypeScript 类型定义
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   └── __tests__/       # 单元测试和集成测试
├── public/              # 静态资源
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 构建配置
└── ...
```

### 1.2 关键设计决策

| 决策 | 理由 | 收益 |
|------|------|------|
| **Next.js 15 + App Router** | 现代化 React 框架，支持 SSR/SSG | 更好的性能和 SEO，自动代码分割 |
| **Vite 作为构建工具** | 极速冷启动，按需编译 | 提升开发体验，加快构建速度 |
| **viem + wagmi** | 当前 Web3 开发标准栈 | 类型安全，模块化，树摇友好 |
| **Zustand 状态管理** | 极简 API，无需样板代码 | 减少复杂度，易于维护 |
| **Tailwind CSS** | 实用优先的 CSS 框架 | 快速开发，一致的设计系统 |
| **TypeScript Strict 模式** | 最大程度的类型安全 | 编译时捕获错误，更好的 IDE 支持 |
| **ESLint + Prettier** | 代码质量和风格一致 | 减少代码审查争论，保持代码整洁 |

## 二、版本控制策略与冲突预防

### 2.1 Git 分支策略

**推荐工作流：Feature Branch Workflow**

```
main (主分支)
  ├── develop (开发分支)
  │   ├── feature/frontend-dashboard (功能分支)
  │   ├── feature/web3-wallet-connect (功能分支)
  │   └── bugfix/fix-connection-error (修复分支)
  └── release/v1.0.0 (发布分支)
```

**冲突预防措施：**

1. **保持短小的功能分支**
   - 单个 PR 不超过 400 行代码
   - 大型功能拆分为多个小 PR
   - 频繁合并，减少积压

2. **每日拉取最新代码**
   ```bash
   git pull origin develop --rebase
   ```
   提前解决冲突，避免最后集中处理。

3. **禁止直接推送到 main**
   - 所有改动必须通过 Pull Request
   - 需要至少一个审核才能合并
   - 未通过检查的 PR 不能合并

### 2.2 提交信息规范

**Conventional Commits 格式：**

```
<type>(<scope>): <description>

<body>

<footer>
```

**类型 (type)：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档修改
- `style`: 代码格式修改
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试修改
- `chore`: 构建/工具相关

**示例：**
```
feat(dashboard): 添加余额卡片组件

- 实现 ETH 余额展示
- 实现 ERC-20 Token 余额展示
- 添加加载状态和错误处理

Closes #123
```

**好处：**
- 自动生成变更日志
- 清晰知道每个提交的目的
- 便于快速定位问题
- 减少因提交信息混乱造成的理解冲突

### 2.3 避免合并冲突的最佳实践

| 问题场景 | 预防措施 | 解决方法 |
|----------|----------|----------|
| **package.json 频繁变动** | 使用 `npm install` 而非手动编辑，依赖版本范围使用 `^` 或 `~` | `npm install` 重新生成，手动解决版本冲突 |
| **pnpm-lock.yaml/bun.lock 冲突** | 不要手动编辑锁文件，每次 `npm install` 后提交 | 在合并分支后重新运行 `bun install`，重新生成锁文件 |
| **tsconfig.json 配置冲突** | 尽量保持基础配置不变，新增选项使用注释分组 | 保留两边的有用配置，手动合并，重新编译验证 |
| **大文件多人同时修改** | 尽早拆分模块，拆分为多个小文件 | 使用可视化工具 (VS Code Merge Editor) 逐行解决 |
| **组件文件同时修改** | 按职责拆分，一个文件只做一件事 | 理解两边改动的目的，保留功能逻辑，重新组织代码 |

## 三、依赖版本冲突预防与解决

### 3.1 依赖版本管理原则

**正确的版本范围声明：**

```json
{
  "dependencies": {
    "react": "^19.0.0",       // 接受 19.x 的向后兼容更新
    "next": "^15.0.0",        // 接受 15.x 的向后兼容更新
    "viem": "~2.47.12",       // 只接受补丁更新 (2.47.x)
    "@monad-crypto/mpp": "github:monad-crypto/monad-ts#main"  // 固定分支
  }
}
```

**预防措施：**

1. **不要随意升级主版本**
   - 主版本升级可能包含破坏性变更
   - 先在分支测试，确认无问题再合并

2. **定期批量更新依赖**
   ```bash
   bun update  # 更新所有依赖到符合版本范围的最新版本
   bun run build  # 立即测试构建
   ```
   集中处理依赖更新，分散到不同 PR，避免大规模冲突。

3. **Peer Dependencies 冲突处理**
   - 多数情况下可以安全使用 `--force` 或 `--legacy-peer-deps`
   - 只有当真正发生运行时错误时才需要解决
   - 在 PR 中说明冲突情况，审核者确认后可合并

4. **锁定文件策略**
   - **总是**提交 `bun.lock` 或 `package-lock.json` 到仓库
   - 保证所有开发者安装完全相同的依赖版本
   - 避免"在我机器上能运行"的问题

### 3.2 常见依赖冲突解决流程

**场景 A：两个依赖需要同一库的不同版本**

```
error: react@18.2.0 requested by xxx, react@19.2.5 already installed
```

**解决步骤：**
1. 检查是否两个版本都需要：`bun why react`
2. 如果可以兼容，使用 `resolutions` 字段强制统一版本：
   ```json
   {
     "resolutions": {
       "react": "^19.2.5"
     }
   }
   ```
3. 重新安装并测试：`bun install && bun run build`
4. 如果运行正常，解决完成

**场景 B：从 GitHub 安装的依赖问题**

```
error: @monad-crypto/mpp 安装失败
```

**解决步骤：**
1. 清除缓存：`bun cache clean`
2. 重新安装：`bun install --force`
3. 检查 node_modules 是否正确下载
4. 如果仍然失败，考虑克隆源码到本地，使用 `npm link` 调试

### 3.3 依赖冲突检查清单

- [ ] `bun install` 成功完成，无致命错误
- [ ] 依赖警告已经审核，确认不影响使用
- [ ] `bun run build` 编译成功
- [ ] 开发服务器能正常启动
- [ ] 核心功能测试通过

## 四、接口规范冲突预防

### 4.1 TypeScript 接口设计原则

**优先使用类型复用：**

```typescript
// 好：定义基础接口，然后扩展
interface BaseWallet {
  address: `0x${string}`;
  balance: bigint;
}

interface WalletWithTransactions extends BaseWallet {
  recentTransactions: Transaction[];
}

// 避免：重复定义相同字段
interface WalletWithTransactions {
  address: `0x${string}`;
  balance: bigint;
  recentTransactions: Transaction[];
}
```

**预防接口冲突：**

1. **集中定义类型**
   - 所有共享类型放在 `src/types/` 目录
   - 避免在多个文件重复定义相同名称的接口
   - 使用命名空间或模块分组

2. **使用渐进式类型扩展**
   ```typescript
   // 好：可选字段，不破坏现有代码
   interface PaymentRequest {
     to: `0x${string}`;
     amount: bigint;
     currency?: `0x${string}`;  // 新增可选字段
   }

   // 坏：必填字段，破坏现有调用
   interface PaymentRequest {
     to: `0x${string}`;
     amount: bigint;
     currency: `0x${string}`;  // 所有现有调用都需要修改
   }
   ```

3. **向后兼容原则**
   - 新增字段保持可选
   - 不要删除已有字段，标记 `@deprecated`
   - 经过一个发布周期后再删除

### 4.2 API 层设计规范

**统一的错误处理：**

```typescript
// 所有 API 响应遵循相同格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

// 统一的异步错误处理
async function executePayment(req: PaymentRequest): Promise<ApiResponse<PaymentResult>> {
  try {
    const result = await wallet.sendTransaction(req.to, req.amount);
    return { success: true, data: { txHash: result } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
```

**避免接口冲突的实践：**

1. **API 路由版本化**
   - `/api/v1/payment`
   - `/api/v2/payment` (当需要不兼容变更时)
   - 旧版本保持运行，逐步迁移

2. **前后端接口协商**
   - 在 PR 中明确说明接口变更
   - 前端和后端同时修改同一个 PR，保证一致性
   - 使用 TypeScript 共享类型（如果前后端在同一仓库则很容易）

3. **文档即时更新**
   - 接口变更时同步更新注释
   - 重大变更更新 README

## 五、开发环境配置冲突预防

### 5.1 环境变量管理

**必须：**
- 提交 `.env.example` 到仓库，包含所有必需的环境变量键（值留空）
- **绝不**提交 `.env.local` 或 `.env` 到仓库
- `.env` 添加到 `.gitignore`

```
# .env.example - 提交到仓库
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=10143
```

```
# .env - 本地文件，不提交
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
```

**好处：**
- 新开发者可以快速开始
- 不会泄露敏感信息
- 避免因环境变量配置不同造成的运行时冲突

### 5.2 编辑器配置统一

**推荐提交到仓库的配置：**

```
.editorconfig        - 基本缩进配置
.vscode/settings.json - 项目特定设置（可选）
```

**.editorconfig 示例：**
```editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

确保所有开发者使用相同的缩进和换行格式，避免因格式不同造成的 Git 冲突。

### 5.3 多环境配置

```
.env.development      开发环境
.env.test            测试环境
.env.production      生产环境
```

Next.js 自动加载对应环境的变量，避免开发/生产配置混在一起。

## 六、代码规范与质量保障

### 6.1 ESLint + Prettier 配置

**必须在提交前运行：**
```bash
bun run lint       # 检查代码错误
bun run lint:fix  # 自动修复
bun run format    # Prettier 格式化
```

**VS Code 用户：**
- 启用 "Format On Save"
- 保存时自动格式化
- 保证提交的代码已经格式化

**避免的问题：**
- 不同开发者使用不同的缩进
- 代码风格争论浪费时间
- PR 中充斥大量格式改动，掩盖真实逻辑变更

### 6.2 TypeScript Strict 模式

**tsconfig.json 必须启用：**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**好处：**
- 编译时捕获大多数类型错误
- 更好的 IDE 自动补全
- 减少因类型不匹配造成的运行时冲突

**处理类型错误：**
- `any` 类型只能作为临时方案
- 真正不知道类型时使用 `unknown`
- 为所有数据定义明确的接口

### 6.3 代码审查清单

PR 创建者应该检查：

- [ ] 代码符合项目的代码风格
- [ ] 所有 TypeScript 编译通过
- [ ] `bun run lint` 没有错误
- [ ] 新增功能有相应测试
- [ ] 环境变量变更更新了 `.env.example`
- [ ] 没有提交敏感信息（私钥、API key 等）

审核者应该检查：

- [ ] 功能逻辑正确
- [ ] 接口设计合理，向后兼容
- [ ] 没有引入不必要的依赖
- [ ] 安全问题检查（私钥暴露等）

## 七、解决冲突的工作流程

### 7.1 合并冲突解决步骤

当 Git 报告合并冲突：

```
1. 停下来，不要慌张
2. 查看冲突文件：git diff
3. 理解两边改动：
   - 当前分支 (HEAD) 改了什么
   - 传入分支 改了什么
   - 为什么会冲突
4. 手动编辑解决冲突
   - 删除 <<<<<<< HEAD 和 >>>>>>> 标记
   - 保留需要的代码
   - 去除重复的代码
5. 测试：bun run build
6. 确认功能正常
7. git add <resolved-files>
8. git commit
```

**VS Code 内置合并工具很好用，善用它！**

### 7.2 依赖冲突解决思维导图

```
安装失败 → 查看错误信息
   ↓
是否网络问题 → 重试 / 换源
   ↓
是否版本冲突 → 查看 peer dependencies
   ↓
是否可以忽略 → --force 安装，测试构建
   ↓
不能忽略 → 检查 resolutions，调整版本范围
   ↓
仍然不行 → 锁定具体版本，重新安装
```

### 7.3 类型冲突解决要点

```
TypeScript 编译报错 → 仔细阅读错误信息
   ↓
接口不兼容 → 检查是否两边都定义了同名接口
   ↓
合并接口定义 → 保留所有字段，检查兼容性
   ↓
必需 vs 可选 → 确认哪个正确，统一修改
   ↓
重新编译 → 验证解决
```

## 八、团队协作最佳实践

### 8.1 沟通原则

- **小批量，频繁合并**：大功能拆成多个小 PR，每天都有进展
- **早合并，常合并**：减少代码积压，冲突更容易解决
- **同步设计**：较大的接口变更先讨论，达成共识再编码
- **写明意图**：PR 描述清楚为什么改，改了什么，便于审核

### 8.2 PR 大小指南

| PR 大小 | 推荐 | 说明 |
|---------|------|------|
| < 200 行 | ✅ 理想 | 容易审核，冲突少 |
| 200-400 行 | ⚠️ 可以接受 | 尽量拆分 |
| > 400 行 | ❌ 不推荐 | 很难审核，冲突风险高 |

例外：大规模重构可以一次性提交，但需要提前说明。

### 8.3 持续集成

推荐在 PR 触发时自动运行：
```
- bun run lint
- bun run typecheck
- bun run build
- bun test
```

确保：
- 代码能编译通过
- 没有 lint 错误
- 测试全部通过
- 才能合并

自动化检查减少人工遗漏，避免把问题带到主分支。

## 九、总结：冲突预防总原则

1. ****预防胜于治疗**：提前规范，减少冲突发生的可能性
2. **小步快跑**：小 PR 频繁合并，冲突少且容易解决
3. **工具自动化**：ESLint + Prettier + TypeScript 提前发现问题
4. **规范明确**：所有人都遵循相同的规范，减少理解分歧
5. **及时解决**：遇到冲突立即解决，不要累积

## 十、快速参考卡片

### 遇到冲突时，按顺序检查：

1. **Git 合并冲突** → 手动解决，测试构建
2. **依赖安装冲突** → `bun install --force`，测试构建
3. **TypeScript 类型冲突** → 阅读错误信息，统一接口定义
4. **环境变量问题** → 对比 `.env.example`，补充缺少的变量
5. **ESLint 错误** → `bun run lint:fix` 自动修复

### 日常开发命令：

```bash
bun install              # 安装依赖
bun install --force      # 强制重新安装（解决依赖冲突）
bun run dev             # 启动开发服务器
bun run build           # 生产构建
bun run lint            # 检查代码错误
bun run lint:fix        # 自动修复错误
bun run format          # 格式化代码
bun test                # 运行测试
```

### Git 常用：

```bash
git pull --rebase origin main  # 拉取主分支并变基
git checkout -b feature/xxx   # 创建功能分支
git push origin feature/xxx   # 推送分支
# 解决冲突后
git add <file>
git rebase --continue
```

---

**最后一句话：** 规范是为人服务的，不是人为规范服务。保持灵活性，遇到问题具体分析，持续改进团队流程。
