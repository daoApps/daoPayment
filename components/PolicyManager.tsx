'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import { Policy } from '@/src/types';
import { useI18nStore } from '@/src/i18n/store';

export function PolicyManager() {
  const queryClient = useQueryClient();
  const { t } = useI18nStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    dailyLimit: '',
    weeklyLimit: '',
  });

  const { data: policies, isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: () => apiClient.getPolicies(),
  });

  const createMutation = useMutation({
    mutationFn: (newPolicyData: Partial<Policy>) => apiClient.createPolicy(newPolicyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      setNewPolicy({ name: '', dailyLimit: '', weeklyLimit: '' });
      setShowCreate(false);
    },
  });

  const isCreating = createMutation.isPending;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: newPolicy.name,
      maxDailySpend: newPolicy.dailyLimit, // Convert to string value directly as backend handles it
      requireApprovalAbove: newPolicy.dailyLimit,
      allowedRecipients: [],
      allowedTokens: [],
      allowedCategories: [],
      blockedMethods: [],
    });
  };

  return (
    <div className="bg-bg-secondary/70 backdrop-blur-xl border border-border-color rounded-none p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500 shadow-[0_0_30px_rgba(0,255,204,0.05)] relative">
      {/* Neon top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-50"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 reveal-1 reveal">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">{t('policyTitle')}</h2>
          <p className="text-text-muted mt-1 md:mt-2 max-w-xl font-mono text-xs md:text-sm">
            {t('policyDesc')}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`w-full sm:w-auto px-6 py-3 font-mono font-bold text-sm uppercase tracking-wider transition-all duration-300 border rounded-none flex items-center justify-center gap-2
            ${showCreate 
              ? 'border-accent-secondary text-accent-secondary hover:shadow-[0_0_15px_var(--color-accent-secondary)] bg-accent-secondary/10' 
              : 'border-accent-primary text-accent-primary hover:shadow-[0_0_15px_var(--color-accent-primary)] bg-accent-primary/10'
            }`}
        >
          <span className={`text-lg transition-transform duration-300 ${showCreate ? 'rotate-45' : ''}`}>+</span>
          {showCreate ? t('btnCancel') : t('btnNewPolicy')}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showCreate ? 'max-h-[800px] md:max-h-[600px] opacity-100 mb-8 md:mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="p-4 md:p-8 border-2 border-border-color bg-bg-primary/40 relative group">
          {/* Subtle neon glow for form container */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <form onSubmit={handleCreate} className="space-y-6 md:space-y-8 relative z-10">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 bg-accent-primary/10 border border-accent-primary text-accent-primary flex items-center justify-center rounded-none shadow-[0_0_10px_rgba(0,255,204,0.2)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-text-primary">{t('policyConfig')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-3">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1 block">{t('policyIdLabel')}</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b-2 border-border-color focus:border-accent-primary focus:ring-0 text-text-primary placeholder:text-text-muted/30 font-mono text-base md:text-lg py-2 transition-all duration-300 focus:shadow-[0_4px_15px_-5px_var(--color-accent-primary)] outline-none rounded-none"
                  placeholder={t('policyIdPlaceholder')}
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1 block">{t('dailyLimitLabel')}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-transparent border-0 border-b-2 border-border-color focus:border-accent-primary focus:ring-0 text-text-primary placeholder:text-text-muted/30 font-mono text-base md:text-lg py-2 pl-8 transition-all duration-300 focus:shadow-[0_4px_15px_-5px_var(--color-accent-primary)] outline-none rounded-none"
                    placeholder="100.00"
                    value={newPolicy.dailyLimit}
                    onChange={(e) => setNewPolicy({ ...newPolicy, dailyLimit: e.target.value })}
                    required
                  />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-accent-primary font-mono font-bold">M</span>
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1 block">{t('weeklyCapLabel')}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-transparent border-0 border-b-2 border-border-color focus:border-accent-primary focus:ring-0 text-text-primary placeholder:text-text-muted/30 font-mono text-base md:text-lg py-2 pl-8 transition-all duration-300 focus:shadow-[0_4px_15px_-5px_var(--color-accent-primary)] outline-none rounded-none"
                    placeholder="500.00"
                    value={newPolicy.weeklyLimit}
                    onChange={(e) => setNewPolicy({ ...newPolicy, weeklyLimit: e.target.value })}
                    required
                  />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-accent-primary font-mono font-bold">M</span>
                </div>
              </div>
              
              <div className="md:col-span-1 flex items-end mt-4 md:mt-0">
                <button
                  type="submit"
                  className="w-full py-3 bg-accent-primary/10 border-2 border-accent-primary text-accent-primary font-mono font-bold uppercase tracking-wider hover:bg-accent-primary hover:text-bg-primary hover:shadow-[0_0_20px_var(--color-accent-primary)] transition-all duration-300 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCreating}
                >
                  {isCreating ? t('btnEnforcing') : t('btnDeployPolicy')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-text-muted reveal-2 reveal">
          <div className="w-12 h-12 border-2 border-accent-primary border-t-transparent rounded-none animate-spin mx-auto mb-4 shadow-[0_0_15px_var(--color-accent-primary)]"></div>
          <p className="font-mono text-sm uppercase tracking-widest animate-pulse">{t('fetchingPolicy')}</p>
        </div>
      ) : policies && policies.length > 0 ? (
        <div className="flex flex-row gap-6 overflow-x-auto pb-8 snap-x pt-4 scrollbar-thin scrollbar-thumb-accent-primary/50 scrollbar-track-bg-primary">
          {policies.map((policy, i) => (
            <div 
              key={policy.id} 
              className="shrink-0 w-[360px] snap-center bg-bg-tertiary border border-border-color rounded-none hover:border-accent-primary transition-all duration-500 group relative opacity-0 animate-[revealItem_0.8s_cubic-bezier(0.4,0,0.2,1)_forwards] flex flex-col"
              style={{ animationDelay: `${(i + 2) * 150}ms` }}
            >
              {/* Neon border effect on hover */}
              <div className="absolute inset-0 border border-accent-primary opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all duration-500 pointer-events-none z-10"></div>
              
              <div className="p-6 flex-1 flex flex-col relative z-20 bg-bg-tertiary">
                <div className="flex items-center justify-between mb-6">
                  {policy.isActive ? (
                    <span className="px-2 py-1 bg-accent-success/10 border border-accent-success/30 text-accent-success text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 rounded-none shadow-[0_0_10px_rgba(0,255,102,0.1)]">
                      <span className="w-1.5 h-1.5 bg-accent-success animate-pulse shadow-[0_0_5px_var(--color-accent-success)]"></span>
                      {t('statusActive')}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-text-muted/10 border border-text-muted/30 text-text-secondary text-[10px] font-mono uppercase tracking-widest rounded-none">
                      {t('statusInactive')}
                    </span>
                  )}
                  <span className="text-text-muted font-mono text-[10px] tracking-widest">
                    ID: {policy.id.slice(0, 8)}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight uppercase mb-6 truncate" title={policy.name}>
                  {policy.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-bg-primary/50 border border-border-color/50 p-3 rounded-none group-hover:border-accent-primary/30 transition-colors">
                    <div className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="text-accent-primary opacity-70">///</span> {t('limit')}
                    </div>
                    <div className="text-xl font-mono font-semibold text-text-primary group-hover:text-accent-primary transition-colors group-hover:shadow-accent-primary">
                      {policy.maxDailySpend} <span className="text-xs text-text-muted">MON</span>
                    </div>
                  </div>
                  
                  <div className="bg-bg-primary/50 border border-border-color/50 p-3 rounded-none group-hover:border-accent-primary/30 transition-colors">
                    <div className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="text-accent-primary opacity-70">///</span> {t('approvalReq')}
                    </div>
                    <div className="text-xl font-mono font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {policy.requireApprovalAbove} <span className="text-xs text-text-muted">MON</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom decorative bar */}
              <div className="h-1 w-full bg-border-color group-hover:bg-accent-primary transition-colors duration-500 relative z-20 group-hover:shadow-[0_0_10px_var(--color-accent-primary)]"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-border-color bg-bg-tertiary/30 rounded-none reveal-2 reveal relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div className="w-16 h-16 border border-text-muted/30 bg-bg-primary flex items-center justify-center text-2xl mx-auto mb-6 rounded-none rotate-45 group-hover:border-accent-primary/50 group-hover:shadow-[0_0_20px_rgba(0,255,204,0.1)] transition-all duration-500">
            <span className="-rotate-45 block opacity-50 group-hover:opacity-100 group-hover:text-accent-primary transition-all duration-500">◈</span>
          </div>
          <h3 className="text-lg font-mono font-bold uppercase tracking-widest mb-2 text-text-primary">{t('noPolicies')}</h3>
          <p className="text-text-muted text-sm font-mono max-w-sm mx-auto mb-8">
            {t('noPoliciesDesc')}
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 border border-border-color text-text-primary font-mono text-sm uppercase tracking-widest hover:border-accent-primary hover:text-accent-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.2)] transition-all duration-300 bg-bg-primary/50 rounded-none"
          >
            {t('btnInitPolicy')}
          </button>
        </div>
      )}
    </div>
  );
}
