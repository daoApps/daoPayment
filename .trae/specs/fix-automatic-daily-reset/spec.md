# 修复每日支出自动重置逻辑缺失 Spec

## Why
当前智能合约中，`resetDailySpend` 函数只能通过外部手动调用触发，缺乏基于时间的自动重置机制。`recordSpend` 函数在记录新支出时不会检查时间周期，导致超过24小时后 `spentToday` 不会自动清零，可能造成每日预算限制失效。

## What Changes
- **新增** 在 `Budget` 结构体中添加 `lastDailyResetTimestamp` 状态变量记录上次每日重置时间戳
- **修改** 在 `recordSpend` 函数中添加时间戳检测，当当前区块时间与上次重置时间间隔超过24小时（86400秒）时自动重置 `spentToday`
- **保留** 原有外部调用 `resetDailySpend` 函数的功能不变，兼容手动重置
- **更新** `setBudget` 初始化时设置正确的 `lastDailyResetTimestamp`

## Impact
- Affected specs: 智能合约预算管理功能
- Affected code: `contracts/src/AgenticPaymentPolicy.sol`
  - `Budget` 结构体定义
  - `setBudget` 函数
  - `recordSpend` 函数
  - `resetDailySpend` 函数

## ADDED Requirements
### Requirement: 自动每日支出重置
系统应当在每次调用 `recordSpend` 时自动检测时间，当超过24小时周期时自动重置 `spentToday`。

#### Scenario: 自动触发重置
- **WHEN** 用户调用 `recordSpend` 记录新支出，且当前区块时间距离上次重置已经超过86400秒
- **THEN** 系统自动将 `spentToday` 清零，更新上次重置时间戳，然后记录新支出

#### Scenario: 不触发重置
- **WHEN** 用户调用 `recordSpend` 记录新支出，且当前区块时间距离上次重置不超过86400秒
- **THEN** 系统不进行重置，直接在原有 `spentToday` 基础上累加支出

#### Scenario: 安全时间比较
- **WHEN** 区块链区块时间被轻微操纵（例如向前调整数小时）
- **THEN** 由于使用 `block.timestamp >= lastDailyResetTimestamp + 86400` 的比较逻辑，只会延迟重置，不会提前重置，保证资金安全

## MODIFIED Requirements
### Requirement: 手动重置功能
原有 `resetDailySpend` 函数仍然保留，允许所有者手动触发重置。手动重置后更新 `lastDailyResetTimestamp` 为当前区块时间。

## REMOVED Requirements
无
