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
  '0x0000000000000000000000000000000000000000000000000000000000000001';
const DEFAULT_WALLET: `0x${string}` =
  '0x0000000000000000000000000000000000000000';
const DEFAULT_WHITELIST_ID: `0x${string}` =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

export default function DashboardPage() {
  const [_selectedWallet, _setSelectedWallet] =
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Monad Agentic Payment Dashboard</h1>

      {/* Policy Card */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Current Policy</h2>
        {policyLoading && <p>Loading policy...</p>}
        {policyError && (
          <p className="text-red-500">
            Error loading policy: {policyError.message}
          </p>
        )}
        {policy && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Max Daily Spend:</span>
              <span className="font-medium">
                {Number(policy.maxDailySpend) / 1e6} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Require Approval Above:</span>
              <span className="font-medium">
                {Number(policy.requireApprovalAbove) / 1e6} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Allowed Recipients:</span>
              <span className="font-medium">
                {policy.allowedRecipients.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Allowed Tokens:</span>
              <span className="font-medium">{policy.allowedTokens.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Budget Card */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Budget Status</h2>
        {budgetLoading && <p>Loading budget...</p>}
        {budgetError && (
          <p className="text-red-500">
            Error loading budget: {budgetError.message}
          </p>
        )}
        {budget && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Limit:</span>
              <span className="font-medium">
                {Number(budget.dailyLimit) / 1e6} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Spent Today:</span>
              <span className="font-medium">
                {Number(budget.spentToday) / 1e6} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Today:</span>
              <span className="font-medium">
                {Number(budget.remainingDaily) / 1e6} USDC
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(Number(budget.spentToday) / Number(budget.dailyLimit)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Whitelist Management */}
      {CONTRACT_ADDRESS && (
        <WhitelistManagerComponent
          contractAddress={CONTRACT_ADDRESS}
          whitelistId={DEFAULT_WHITELIST_ID}
        />
      )}

      {/* Pending Transactions */}
      {SAFE_ADDRESS && (
        <PendingTransactionsList safeAddress={SAFE_ADDRESS} network="testnet" />
      )}
    </div>
  );
}
