'use client';

import { useState, useEffect } from 'react';
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
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

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
    <div className="gradient-bg noise min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 transform transition-all duration-700 hover:scale-105">
            <span className="text-gradient">DAO Payment</span> Dashboard
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Monitor your policies, budgets, and payment activity in one place with real-time insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              title: 'Active Policies',
              value: policy ? '1' : '0',
              icon: (
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2V7a2 2 0 00-2-2h-2zM9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              color: 'bg-indigo-500/20 text-indigo-400',
              delay: 0.1
            },
            {
              title: 'Total Wallets',
              value: '1',
              icon: (
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              ),
              color: 'bg-green-500/20 text-green-400',
              delay: 0.2
            },
            {
              title: 'Active Session Keys',
              value: budget ? '1' : '0',
              icon: (
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2a2 2 0 01-2 2M9 9a2 2 0 012-2m-2 2a2 2 0 01-2-2M5 12h5m2 0h5" />
                </svg>
              ),
              color: 'bg-amber-500/20 text-amber-400',
              delay: 0.3
            },
            {
              title: 'Today\'s Payments',
              value: budget ? budget.spentToday > 0 ? '1' : '0' : '0',
              icon: (
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2-3-.895-3-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12c0 1.657-1.343 3-3 3s-3-.895-3-2 1.343-2 3-2 3-.895 3-2z" />
                </svg>
              ),
              color: 'bg-blue-500/20 text-blue-400',
              delay: 0.4
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`glass-card p-4 sm:p-5 transform transition-all duration-700 hover:translate-y-[-4px] hover:shadow-xl ${animateCards ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: `${stat.delay}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-text-muted text-xs">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold code-font text-gradient">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Current Policy Card */}
          <div className="glass-card p-4 sm:p-6 transform transition-all duration-700 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="status-dot success"></span>
              Current Security Policy
            </h2>
            {policyLoading && (
              <div className="animate-pulse">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-bg-tertiary rounded w-1/2"></div>
              </div>
            )}
            {policyError && (
              <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Error loading policy: {policyError.message}
                {!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
                  <div className="mt-2 text-xs">
                    💡 <strong>Hint:</strong> Set <code className="bg-red-500/20 px-1 rounded">NEXT_PUBLIC_POLICY_CONTRACT_ADDRESS</code> in your .env file
                  </div>
                )}
              </div>
            )}
            {!policyLoading && !policyError && !policy && (
              <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                No policy data found.
                {!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
                  <div className="mt-2 text-xs">
                    💡 <strong>Hint:</strong> Set <code className="bg-yellow-500/20 px-1 rounded">NEXT_PUBLIC_POLICY_CONTRACT_ADDRESS</code> in your .env file
                  </div>
                )}
              </div>
            )}
            {policy && (
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: 'Max Daily Spend', value: `${Number(policy.maxDailySpend) / 1e6} USDC` },
                  { label: 'Require Approval Above', value: `${Number(policy.requireApprovalAbove) / 1e6} USDC` },
                  { label: 'Allowed Recipients', value: policy.allowedRecipients.length },
                  { label: 'Allowed Tokens', value: policy.allowedTokens.length }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border-color hover:border-accent-primary/30 transition-colors">
                    <span className="text-text-secondary text-sm">{item.label}</span>
                    <span className="font-medium code-font text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget Status Card */}
          <div className="glass-card p-4 sm:p-6 transform transition-all duration-700 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Daily Budget Status
            </h2>
            {budgetLoading && (
              <div className="animate-pulse">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-bg-tertiary rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-bg-tertiary rounded w-full"></div>
              </div>
            )}
            {budgetError && (
              <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                Error loading budget: {budgetError.message}
                {!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
                  <div className="mt-2 text-xs">
                    💡 <strong>Hint:</strong> Set <code className="bg-red-500/20 px-1 rounded">NEXT_PUBLIC_POLICY_CONTRACT_ADDRESS</code> in your .env file
                  </div>
                )}
              </div>
            )}
            {!budgetLoading && !budgetError && !budget && (
              <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                No budget data found.
                {!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' && (
                  <div className="mt-2 text-xs">
                    💡 <strong>Hint:</strong> Set <code className="bg-yellow-500/20 px-1 rounded">NEXT_PUBLIC_POLICY_CONTRACT_ADDRESS</code> in your .env file
                  </div>
                )}
              </div>
            )}
            {budget && (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { label: 'Daily Limit', value: `${Number(budget.dailyLimit) / 1e6} USDC` },
                    { 
                      label: 'Spent Today', 
                      value: `${Number(budget.spentToday) / 1e6} USDC`,
                      className: percentage > 90 ? 'text-red-400' : percentage > 70 ? 'text-amber-400' : 'text-green-400'
                    },
                    { label: 'Remaining', value: `${Number(budget.remainingDaily) / 1e6} USDC` }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center hover:scale-105 transition-transform">
                      <span className="text-text-secondary text-sm">{item.label}</span>
                      <span className={`font-medium code-font text-sm ${item.className || ''}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
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
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm animate-pulse">
                    ⚠️ Daily budget nearly exhausted
                  </div>
                )}
                {percentage > 70 && percentage <= 90 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm animate-pulse">
                    ⚠️ Approaching daily budget limit
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Whitelist Management */}
        {CONTRACT_ADDRESS && (
          <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <div className="glass-card p-4 sm:p-6 transform transition-all duration-700 hover:shadow-xl">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
          <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="glass-card p-4 sm:p-6 transform transition-all duration-700 hover:shadow-xl">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 00-2-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Pending Transactions
              </h2>
              <PendingTransactionsList safeAddress={SAFE_ADDRESS} network="testnet" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="glass-card p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                title: 'New Wallet',
                description: 'Create a new wallet',
                icon: (
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                ),
                color: 'bg-indigo-500/20 text-indigo-400'
              },
              {
                title: 'New Policy',
                description: 'Create security policy',
                icon: (
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                ),
                color: 'bg-green-500/20 text-green-400'
              },
              {
                title: 'Generate Session Key',
                description: 'Create session key',
                icon: (
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2-2a2 2 0 01-2 2M5 12a2 2 0 012-2h10a2 2 0 012 2 0 01-2 2 7 2-6-6 1a1 0 00-1 1z" />
                  </svg>
                ),
                color: 'bg-amber-500/20 text-amber-400'
              },
              {
                title: 'View Audit Log',
                description: 'Browse payment history',
                icon: (
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                color: 'bg-purple-500/20 text-purple-400'
              }
            ].map((action, index) => (
              <button 
                key={index}
                className="text-left p-3 sm:p-4 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-all duration-300 border border-border-color hover:border-accent-primary/50 hover:shadow-lg hover:scale-105 flex flex-col"
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mb-2 sm:mb-3`}>
                  {action.icon}
                </div>
                <div className="font-semibold mb-1 text-sm">{action.title}</div>
                <div className="text-xs text-text-muted">{action.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}