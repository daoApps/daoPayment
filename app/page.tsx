'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { PolicyManager } from '@/components/PolicyManager';
import { BudgetManager } from '@/components/BudgetManager';
import { AuditList } from '@/components/AuditList';
import { WhitelistManager } from '@/components/WhitelistManager';
import { MonadLogo } from '@/components/MonadLogo';

type Tab = 'policies' | 'budget' | 'whitelist' | 'audit';

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('policies');

  const tabs = [
    { id: 'policies', label: 'Policies', count: 0 },
    { id: 'budget', label: 'Budget', count: 0 },
    { id: 'whitelist', label: 'Whitelist', count: 0 },
    { id: 'audit', label: 'Audit Log', count: 0 },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border-color bg-bg-secondary/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-bg-tertiary border border-border-color">
                <MonadLogo />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="gradient-text">daoPayment</span>
                </h1>
                <p className="text-text-muted text-sm">
                  Agentic Payment on Monad
                </p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="glass-panel p-12 max-w-2xl w-full text-center">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                <MonadLogo size={48} />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Secure Agent-Native <br />
                <span className="gradient-text">Payments for DAOs</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
                daoPayment enables autonomous agents to process payments on
                Monad blockchain with configurable security policies, budget
                controls, and complete audit trails.
              </p>
              <ConnectButton />
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div className="glass-card p-4">
                  <div className="text-2xl mb-1">🔐</div>
                  <div className="text-text-secondary">Non-Custodial</div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-text-secondary">High Speed</div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-2xl mb-1">📋</div>
                  <div className="text-text-secondary">Full Audit</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-text-muted text-sm">
              Connected to{' '}
              <span className="text-accent-primary font-medium">
                Monad Testnet
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass-panel p-6">
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`px-5 py-3 rounded-lg whitespace-nowrap transition-all duration-200 font-medium
                      ${
                        activeTab === tab.id
                          ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
                          : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80 hover:text-text-primary'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'policies' && <PolicyManager />}
              {activeTab === 'budget' && <BudgetManager />}
              {activeTab === 'whitelist' && <WhitelistManager />}
              {activeTab === 'audit' && <AuditList />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <div className="text-text-muted text-sm mb-1">Network</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse-slow"></div>
                  <span className="font-medium">Monad Testnet</span>
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="text-text-muted text-sm mb-1">Chain ID</div>
                <div className="font-mono text-text-primary">10143</div>
              </div>
              <div className="glass-card p-6">
                <div className="text-text-muted text-sm mb-1">Status</div>
                <div className="badge badge-success inline-block">
                  Operational
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-border-color mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
          <div>daoPayment · Agentic Payment System for Monad DAOs</div>
          <div className="flex items-center gap-2">
            Built on
            <span className="text-accent-primary font-medium">Monad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
