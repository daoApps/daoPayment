'use client';

import { useState } from 'react';
import usePolicyRead from '../../src/hooks/usePolicyRead';
import useBudgetRead from '../../src/hooks/useBudgetRead';
import WhitelistManagerComponent from '../../components/WhitelistManager';
import PendingTransactionsList from '../../components/PendingTransactionsList';

const CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_POLICY_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x0000000000000000000000000000000000000000';
const SAFE_ADDRESS: `0x${string}` | undefined = process.env
  .NEXT_PUBLIC_SAFE_ADDRESS as `0x${string}`;
const DEFAULT_POLICY_ID: `0x${string}` =
  '0x000000000000000000000000000000000000000000000000000000000000001';
const DEFAULT_WALLET: `0x${string}` =
  '0x0000000000000000000000000000000000000000';
const DEFAULT_WHITELIST_ID: `0x${string}` =
  '0x000000000000000000000000000000000000000000000000000000000000001';

export default function DashboardPage() {
  const [selectedWallet, setSelectedWallet] =
    useState<`0x${string}`>(DEFAULT_WALLET);

  const {
    data: policy,
    isLoading: policyLoading,
    error: policyError,
  } = usePolicyRead({
    contractAddress: CONTRACT_ADDRESS,
    policyId: DEFAULT_POLICY_ID,
  });

  const {
    data: budget,
    isLoading: budgetLoading,
    error: budgetError,
  } = useBudgetRead({
    contractAddress: CONTRACT_ADDRESS,
    walletAddress: selectedWallet,
  });

  const percentage = budget
    ? (Number(budget.spentToday) / Number(budget.dailyLimit)) * 100
    : 0;

  const getPercentageColor = () => {
    if (!budget) return 'from-indigo-500 to-purple-600';
    if (percentage > 90) return 'from-red-500 to-pink-600';
    if (percentage > 70) return 'from-amber-500 to-orange-600';
    return 'from-indigo-500 to-purple-600';
  };

  return (
    <div className="gradient-bg noise min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">DAO Payment</span> Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Monitor your policies, budgets, and payment activity in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Active Policies</p>
                <p className="text-3xl font-bold code-font text-gradient">
                  {policy ? '1' : '0'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2zM9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Total Wallets</p>
                <p className="text-3xl font-bold code-font text-gradient">1</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Active Session Keys</p>
                <p className="text-3xl font-bold code-font text-gradient">
                  {budget ? '1' : '0'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2a2 2 0 01-2 2M9 9a2 2 0 012-2m-2 2a2 2 0 01-2-2M5 12h5m2 0h5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">Today's Payments</p>
                <p className="text-3xl font-bold code-font text-gradient">
                  {budget ? budget.spentToday > 0 ? '1' : '0' : '0'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2-3-.895-3-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12c0 1.657-1.343 3-3 3s-3-.895-3-2 1.343-2 3-2 3-.895 3-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Current Policy Card */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="status-dot success"></span>
              Current Security Policy
            </h2>
            {policyLoading && (
              <div className="animate-pulse">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-bg-tertiary rounded w-1/2"></div>
              </div>
            )}
            {policyError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                Error loading policy: {policyError.message}
              </div>
            )}
            {policy && (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border-color">
                  <span className="text-text-secondary">Max Daily Spend</span>
                  <span className="font-medium code-font">
                    {Number(policy.maxDailySpend) / 1e6} USDC
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-color">
                  <span className="text-text-secondary">Require Approval Above</span>
                  <span className="font-medium code-font">
                    {Number(policy.requireApprovalAbove) / 1e6} USDC
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-color">
                  <span className="text-text-secondary">Allowed Recipients</span>
                  <span className="font-medium code-font">
                    {policy.allowedRecipients.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border-color">
                  <span className="text-text-secondary">Allowed Tokens</span>
                  <span className="font-medium code-font">
                    {policy.allowedTokens.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Budget Status Card */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Daily Budget Status
            </h2>
            {budgetLoading && (
              <div className="animate-pulse">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-bg-tertiary rounded w-1/2 mb-6"></div>
                <div className="h-8 bg-bg-tertiary rounded w-full"></div>
              </div>
            )}
            {budgetError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                Error loading budget: {budgetError.message}
              </div>
            )}
            {budget && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Daily Limit</span>
                    <span className="font-medium code-font">
                      {Number(budget.dailyLimit) / 1e6} USDC
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Spent Today</span>
                    <span className={`font-medium code-font ${
                      percentage > 90 ? 'text-red-400' : percentage > 70 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {Number(budget.spentToday) / 1e6} USDC
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Remaining</span>
                    <span className="font-medium code-font">
                      {Number(budget.remainingDaily) / 1e6} USDC
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Usage</span>
                    <span className="text-text-muted">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill bg-gradient-to-r ${getPercentageColor()}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {percentage > 90 && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    ⚠️ Daily budget nearly exhausted
                  </div>
                )}
                {percentage > 70 && percentage <= 90 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                    ⚠️ Approaching daily budget limit
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Whitelist Management */}
        {CONTRACT_ADDRESS && (
          <div className="mb-6">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Whitelist Management
              </h2>
              <WhitelistManagerComponent
                contractAddress={CONTRACT_ADDRESS}
                whitelistId={DEFAULT_WHITELIST_ID}
              />
            </div>
          </div>
        )}

        {/* Pending Transactions */}
        {SAFE_ADDRESS && (
          <div className="mb-6">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Pending Transactions
              </h2>
              <PendingTransactionsList safeAddress={SAFE_ADDRESS} network="testnet" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button className="text-left p-4 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors border border-border-color hover:border-accent-primary/50">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="font-semibold mb-1">New Wallet</div>
              <div className="text-sm text-text-muted">Create a new wallet</div>
            </button>

            <button className="text-left p-4 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors border border-border-color hover:border-accent-primary/50">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-semibold mb-1">New Policy</div>
              <div className="text-sm text-text-muted">Create security policy</div>
            </button>

            <button className="text-left p-4 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors border border-border-color hover:border-accent-primary/50">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2a2 2 0 01-2 2M5 12a2 2 0 012-2h10a2 2 0 012 2 0 01-2 2 7 2-6-6 1a1 0 00-1 1z" />
                </svg>
              </div>
              <div className="font-semibold mb-1">Generate Session Key</div>
              <div className="text-sm text-text-muted">Create session key</div>
            </button>

            <button className="text-left p-4 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors border border-border-color hover:border-accent-primary/50">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="font-semibold mb-1">View Audit Log</div>
              <div className="text-sm text-text-muted">Browse payment history</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
