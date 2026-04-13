# .gitignore 优化规范

## Why
当前.gitignore文件存在冗余规则和缺失必要忽略项，存在重复规则（如*.so出现两次，*.log出现两次），且缺少针对Node.js/TypeScript项目、IDE配置文件的标准忽略规则，可能导致敏感文件和构建产物被错误提交到版本库。遵循最佳实践优化.gitignore可以提高仓库整洁度，避免敏感信息泄露，并减少仓库大小。

## What Changes
- **清理冗余规则**：移除重复的忽略规则（*.so、*.log等）
- **补充缺失规则**：添加Node.js/TypeScript项目常用的忽略规则
- **补充IDE规则**：添加VS Code、WebStorm、PhpStorm等常见IDE的配置文件忽略
- **补充OS规则**：添加Windows、macOS、Linux系统生成的文件忽略
- **补充构建产物**：确保所有构建输出目录都被正确忽略
- **格式整理**：按类别整理规则，提高可读性
- **保持当前保留必要例外**：保留.env.example等示例文件不被忽略

## Impact
- Affected specs: 项目配置
- Affected code: [.gitignore](file:///d:/daoCollective/daoApps/daoPayment/.gitignore)

## ADDED Requirements
### Requirement: 标准.gitignore优化
系统 SHALL 根据.gitignore最佳实践，提供一个干净、完整、无冗余的忽略规则文件。

#### Scenario: 冗余规则清理
- **WHEN** 查看.gitignore文件
- **THEN** 不存在重复的忽略规则

#### Scenario: 必要规则覆盖
- **WHEN** 项目生成node_modules、日志文件、IDE配置、系统临时文件
- **THEN** 这些文件都会被正确忽略，不会被提交到版本控制

#### Scenario: 重要文件保护
- **WHEN** 用户创建环境变量示例文件（.env.example
- **THEN** 该文件不被忽略，允许提交到仓库供其他开发者参考

## MODIFIED Requirements
### Requirement: 现有.gitignore规则整理
现有规则按类别重新组织，合并重复项，修正格式优化可读性。

## REMOVED Requirements
无，只移除重复规则，不删除任何必要规则。
