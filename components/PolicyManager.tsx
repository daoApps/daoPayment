'use client';

import { useState } from 'react';
import usePolicyRead from '@/src/hooks/usePolicyRead';
import usePolicyWrite from '@/src/hooks/usePolicyWrite';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x0000000000000000000000000000000000000000';
const DEFAULT_POLICY_ID =
  '0x000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

interface Policy {
  id: string;
  name: string;
  dailyLimit: number;
  weeklyLimit: number;
  isActive: boolean;
  createdAt: number;
}

export function PolicyManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    dailyLimit: '',
    weeklyLimit: '',
  });

  const { data, isLoading } = usePolicyRead({
    contractAddress: CONTRACT_ADDRESS,
    policyId: DEFAULT_POLICY_ID,
  });

  const { setPolicy, status, isPending } = usePolicyWrite(CONTRACT_ADDRESS);

  const policies = data
    ? [
        {
          id: 'default',
          name: 'Default Policy',
          dailyLimit: data.maxDailySpend
            ? Number(data.maxDailySpend) / 1e18
            : 0,
          weeklyLimit: 0,
          isActive: true,
          createdAt: Date.now(),
        },
      ]
    : [];

  const isCreating = isPending;

  const createPolicy = async (params: {
    name: string;
    dailyLimit: number;
    weeklyLimit: number;
  }) => {
    await setPolicy({
      policyId: DEFAULT_POLICY_ID,
      maxDailySpend: parseEther(params.dailyLimit.toString()),
      requireApprovalAbove: parseEther(params.dailyLimit.toString()),
      allowedRecipients: [],
      allowedTokens: [],
      allowedCategories: [],
      blockedMethods: [],
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPolicy({
      name: newPolicy.name,
      dailyLimit: parseFloat(newPolicy.dailyLimit),
      weeklyLimit: parseFloat(newPolicy.weeklyLimit),
    });
    setNewPolicy({ name: '', dailyLimit: '', weeklyLimit: '' });
    setShowCreate(false);
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Payment Policies</h2>
          <p className="text-text-muted mt-1">
            Configure security policies for automated payments
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-primary"
        >
          {showCreate ? 'Cancel' : '+ New Policy'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-8 glass-card p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Policy Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Treasury Operations"
                value={newPolicy.name}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Daily Limit (MON)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="100"
                  value={newPolicy.dailyLimit}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, dailyLimit: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Weekly Limit (MON)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="500"
                  value={newPolicy.weeklyLimit}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, weeklyLimit: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-text-muted">
          Loading policies...
        </div>
      ) : policies && policies.length > 0 ? (
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{policy.name}</h3>
                    {policy.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <div className="text-text-muted text-xs mb-1">
                        Daily Limit
                      </div>
                      <div className="text-xl font-semibold">
                        {policy.dailyLimit} MON
                      </div>
                    </div>
                    <div>
                      <div className="text-text-muted text-xs mb-1">
                        Weekly Limit
                      </div>
                      <div className="text-xl font-semibold">
                        {policy.weeklyLimit} MON
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary">Manage</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-text-muted">📝</div>
          <p className="text-text-muted">No policies created yet</p>
          <p className="text-text-muted text-sm mt-1">
            Create your first payment policy to get started
          </p>
        </div>
      )}
    </div>
  );
}
