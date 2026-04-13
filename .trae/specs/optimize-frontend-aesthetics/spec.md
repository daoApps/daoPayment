# 优化前端 UI 规格说明 (Optimize Frontend Aesthetics Spec)

## Why
目前 `daoPayment` 的 Web UI 虽然已经具备完整的功能并且采用了深色科技风格，但从视觉表现力、细节排版以及品牌辨识度上还有提升空间。用户希望“好好优化下前端 UI”，为了脱离千篇一律的 AI 生成感，我们需要引入更加风格化、精致且具有视觉冲击力的设计语言（如“极致控制感”的赛博工业或高定科技风），提升整个平台的视觉体验。

## What Changes
- **视觉定调 (Aesthetic Direction)**: 采用**高级硬核科技风 (Refined Cyber-Industrial)**，强调极致的秩序感与深邃的科技感。
- **字体升级**: 引入极具个性的无衬线标题字体（例如 `Syne` 或 `Clash Display`）以及专业的等宽字体（例如 `JetBrains Mono`）用于数据和地址展示。
- **颜色与材质**: 增加磨砂玻璃的高级质感，引入细微的噪点纹理 (Noise Texture) 作为背景，并用极细的高亮边框 (Neon Tracing) 代替生硬的色块分割。
- **动画与微交互**: 引入高度协调的 CSS 页面加载动画（交错显现 staggered reveals），悬停时发光边框跟随，以及具有科技感的数字滚动或解码效果。
- **空间与排版重构**: 增加留白 (Negative space)，使核心数据更具呼吸感；打破传统对称的呆板布局，采用更具动感的卡片叠放或非对称结构。

## Impact
- Affected specs: 页面全局样式、视觉系统组件。
- Affected code: `app/globals.css`, `app/layout.tsx`, `app/page.tsx` 以及 `components/` 下的所有业务组件（如 `WalletManager`, `PolicyManager`, `AuditList` 等）。

## ADDED Requirements
### Requirement: 高级字体系统集成
系统必须从 Google Fonts 或其他来源引入至少两种高质量字体，并分别应用到标题与数据展示上。

#### Scenario: 用户访问平台
- **WHEN** 用户首次加载页面
- **THEN** 标题呈现独特的现代几何感字体，地址和余额等数据呈现清晰的等宽字体，视觉层次分明。

### Requirement: 页面级连贯动效
整个页面组件的加载必须具有连贯的入场动画，而不是生硬地突然出现。

## MODIFIED Requirements
### Requirement: 全局 CSS 变量与主题
修改 `app/globals.css` 中的 CSS 变量，采用更深邃的背景色（极黑或深渊蓝）与高饱和度、高亮度的点缀色（如霓虹紫或电光青），并增加特殊的 CSS 类实现高级毛玻璃、发光边框及背景噪点效果。

## REMOVED Requirements
### Requirement: 过于基础的默认阴影和圆角
**Reason**: 为了摆脱普通后台管理系统的塑料感，移除过于圆滑的大圆角和生硬的黑色阴影。
**Migration**: 替换为锐利的倒角（或极小圆角）、高亮的发光描边以及精细的内发光材质。