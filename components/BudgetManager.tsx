'use client';

import { useState } from 'react';
import useBudgetRead from '@/src/hooks/useBudgetRead';
import { useAccount } from 'wagmi';

const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x0000000000000000000000000000000000000000';

export function BudgetManager() {
  const { address } = useAccount();
  const { data, isLoading } = useBudgetRead({
    contractAddress: CONTRACT_ADDRESS,
    walletAddress: address || '0x0000000000000000000000000000000000000000',
  });

  const budget = data
    ? {
        dailyLimit: Number(data.dailyLimit) / 1e18,
        weeklyLimit: Number(data.weeklyLimit) / 1e18,
      }
    : undefined;

  const dailySpent = data ? Number(data.spentToday) / 1e18 : 0;
  const weeklySpent = data ? Number(data.spentThisWeek) / 1e18 : 0;

  const dailyPercent = budget
    ? Math.min((dailySpent / budget.dailyLimit) * 100, 100)
    : 0;
  const weeklyPercent = budget
    ? Math.min((weeklySpent / budget.weeklyLimit) * 100, 100)
    : 0;

  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-accent-success';
    if (percent < 80) return 'bg-accent-warning';
    return 'bg-accent-danger';
  };

  return (
    <div className="glass-panel p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Budget Overview</h2>
        <p className="text-text-muted mt-1">
          Monitor current spending against budget limits
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-text-muted">
          Loading budget...
        </div>
      ) : !budget ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-text-muted">💰</div>
          <p className="text-text-muted">No active budget policy</p>
          <p className="text-text-muted text-sm mt-1">
            Create a policy in the Policies tab first
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">Daily Budget</h3>
                <p className="text-text-muted text-sm">Spent today</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {dailySpent.toFixed(2)} MON
                </div>
                <div className="text-text-muted text-sm">
                  / {budget.dailyLimit} MON
                </div>
              </div>
            </div>
            <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressColor(dailyPercent)}`}
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-text-muted">
                {dailyPercent.toFixed(1)}% used
              </span>
              <span className="text-text-secondary">
                {(budget.dailyLimit - dailySpent).toFixed(2)} MON remaining
              </span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">Weekly Budget</h3>
                <p className="text-text-muted text-sm">Spent this week</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {weeklySpent.toFixed(2)} MON
                </div>
                <div className="text-text-muted text-sm">
                  / {budget.weeklyLimit} MON
                </div>
              </div>
            </div>
            <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressColor(weeklyPercent)}`}
                style={{ width: `${weeklyPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-text-muted">
                {weeklyPercent.toFixed(1)}% used
              </span>
              <span className="text-text-secondary">
                {(budget.weeklyLimit - weeklySpent).toFixed(2)} MON remaining
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-text-muted text-xs mb-1">
                Remaining Daily
              </div>
              <div className="text-xl font-bold">
                {(budget.dailyLimit - dailySpent).toFixed(2)}
                <span className="text-text-muted text-sm ml-1">MON</span>
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-text-muted text-xs mb-1">
                Remaining Weekly
              </div>
              <div className="text-xl font-bold">
                {(budget.weeklyLimit - weeklySpent).toFixed(2)}
                <span className="text-text-muted text-sm ml-1">MON</span>
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-text-muted text-xs mb-1">Status</div>
              {dailyPercent < 100 && weeklyPercent < 100 ? (
                <span className="badge badge-success">Within Budget</span>
              ) : (
                <span className="badge badge-danger">Limit Exceeded</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
