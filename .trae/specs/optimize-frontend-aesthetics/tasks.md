# Tasks

- [x] Task 1: 建立全局视觉定调与高级样式系统
  - [x] SubTask 1.1: 升级 `app/layout.tsx`，从 Google Fonts 引入两种个性化字体（如 `Syne` 作为标题字体，`JetBrains Mono` 作为数据字体），并替换原本的普通字体。
  - [x] SubTask 1.2: 深度重写 `app/globals.css`：调整 CSS 变量以构建极其深邃的高对比度暗黑风格。加入高级噪点背景 (noise texture)、毛玻璃效果及科技感的霓虹边框光晕。
  - [x] SubTask 1.3: 在 `app/globals.css` 中增加统一的交错入场动画类（staggered reveals），以及具有科幻感的 Hover 状态。

- [x] Task 2: 重新设计核心着陆页 (Landing Page) 结构
  - [x] SubTask 2.1: 在 `app/page.tsx` 中彻底重构首屏（Hero Section）：采用非对称或大留白的版式设计，标题文字极具冲击力。
  - [x] SubTask 2.2: 优化页面顶部的导航栏（Header），加入科技感的流光线条，让“Connect Wallet”按钮脱颖而出。
  - [x] SubTask 2.3: 重设未连接状态下的特性介绍卡片（Non-Custodial 等），利用 CSS 网格打破呆板的平铺。

- [x] Task 3: 优化“钱包管理”组件 (WalletManager)
  - [x] SubTask 3.1: 优化 `components/WalletManager.tsx` 的卡片结构，利用高级材质和细线边框包裹。
  - [x] SubTask 3.2: 让地址与余额数据使用专属的等宽字体展示，并带有悬停发光效果（Neon glow）。
  - [x] SubTask 3.3: 确保数据加载与空状态（Empty State）的展示更具精致感与引导性。

- [x] Task 4: 优化“策略管理”组件 (PolicyManager)
  - [x] SubTask 4.1: 在 `components/PolicyManager.tsx` 中，重新排版新建策略的表单，使其更符合现代控制面板的精细感（极简的输入框与动态 Label）。
  - [x] SubTask 4.2: 列表页的每一条策略采用更紧凑但视觉层次更分明的横向排列，突出关键限额指标。

- [x] Task 5: 优化“审计日志”组件 (AuditList)
  - [x] SubTask 5.1: 彻底改造 `components/AuditList.tsx` 的表格外观：移除默认的表格线框，采用交替的极简下划线与悬停高亮（Row hover focus）。
  - [x] SubTask 5.2: 状态标签（Status Badge）改为锐利且极简的纯色线条或发光点（Glow dot）代替大块背景色。
  - [x] SubTask 5.3: “Simulate Payment”的按钮与列表融合，形成强烈的控制中心（Command Center）即视感。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]