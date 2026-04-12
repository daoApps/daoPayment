# Prompts 文件夹分析学习报告 Spec

## Why
项目根目录下的 `prompts` 文件夹存放着专为 AI Agent 优化的项目说明文档，对其进行系统分析能够帮助我们：
1. 理解该项目作为 Hackathon 参赛项目的背景和需求
2. 掌握 AI-Optimized 文档的设计思路和应用方法
3. 为后续开发提供清晰的需求指导和参考框架

## What Changes
- 创建一份完整的结构化学习报告，分析 `prompts` 文件夹的内容
- 梳理文档组织结构、内容格式和设计思路
- 总结项目需求和技术方向，为开发提供参考

## Impact
- Affected specs: 无现有 spec 受影响
- Affected code: 无代码变更，仅生成分析文档
- Output: `prompts/analysis-report.md` - 结构化分析报告

## ADDED Requirements
### Requirement: Prompts 文件夹结构化分析
系统 SHALL 对 `prompts` 文件夹进行全面分析，包括：

#### 组织结构分析
- **WHEN** 分析文件夹结构
- **THEN** 识别当前文件数量、目录层级、文件命名方式
- **THEN** 总结组织结构特点

#### 内容格式分析
- **WHEN** 分析文件内容格式
- **THEN** 识别使用的 Markdown 语法结构
- **THEN** 识别标题层级、分隔线、表格、代码块等元素的使用规律
- **THEN** 分析 AI-Optimized 设计特点

#### 功能用途分析
- **WHEN** 分析各文件功能用途
- **THEN** 明确 `intro.md` 的作用和定位
- **THEN** 判断是否存在其他提示词模板或资源

#### 设计思路总结
- **WHEN** 总结设计思路
- **THEN** 提炼 AI-Optimized Brief 的设计原则
- **THEN** 分析结构化内容对 AI Agent 的优势

#### 应用场景分析
- **WHEN** 分析应用场景
- **THEN** 识别该文档的适用场景
- **THEN** 总结对 AI 辅助开发的价值

## Scenario: 完整分析输出
- **WHEN** 分析完成
- **THEN** 生成一份结构化的 Markdown 报告
- **THEN** 报告包含：概述、组织结构、内容格式、功能用途、设计思路、应用场景、总结建议
