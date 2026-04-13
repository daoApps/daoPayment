'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import { Wallet } from '@/src/types';
import { useI18nStore } from '@/src/i18n/store';

export function WalletManager() {
  const queryClient = useQueryClient();
  const { t } = useI18nStore();

  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.getWallets(),
  });

  const createWalletMutation = useMutation({
    mutationFn: () => apiClient.createWallet({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  return (
    <div className="glass-panel rounded-none border-border-color/50 p-8 reveal">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 reveal-1">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight uppercase">{t('walletTitle')}</h2>
          <p className="text-text-muted mt-2 max-w-xl font-mono text-sm">
            {t('walletDesc')}
          </p>
        </div>
        <button
          onClick={() => createWalletMutation.mutate()}
          disabled={createWalletMutation.isPending}
          className="btn-primary group flex items-center gap-2 rounded-none neon-trace uppercase tracking-wider font-mono text-sm"
        >
          <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
          {createWalletMutation.isPending ? t('btnGenerating') : t('btnNewWallet')}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-text-muted glass-card rounded-none border-dashed border-2 border-border-color neon-trace reveal-2">
          <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="font-mono text-sm uppercase tracking-widest text-accent-primary animate-pulse">{t('syncing')}</p>
        </div>
      ) : !wallets || wallets.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-none border-dashed border-2 border-border-color neon-trace reveal-2">
          <div className="w-20 h-20 bg-bg-tertiary flex items-center justify-center text-4xl mx-auto mb-6 shadow-[inset_0_0_20px_rgba(0,255,204,0.1)] border border-accent-secondary/30 rounded-none">
            <span className="text-accent-secondary drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]">👛</span>
          </div>
          <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{t('noWallets')}</h3>
          <p className="text-text-muted max-w-sm mx-auto mb-6 font-mono text-xs">
            {t('noWalletsDesc')}
          </p>
          <button
            onClick={() => createWalletMutation.mutate()}
            disabled={createWalletMutation.isPending}
            className="btn-secondary rounded-none uppercase font-mono text-xs tracking-wider neon-trace border-accent-primary/50 hover:text-accent-primary hover:border-accent-primary"
          >
            {t('btnInitWallet')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {wallets.map((wallet: Wallet, i: number) => {
            const revealClass = `reveal-${(i % 5) + 1}`;
            return (
              <div 
                key={wallet.address} 
                className={`glass-card rounded-none group neon-trace reveal ${revealClass}`}
              >
                <div className="p-6 border-b border-border-color/50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(0,255,204,0.2)] border border-accent-primary/30 rounded-none group-hover:scale-110 transition-transform duration-500">
                        🤖
                      </div>
                      <div>
                        <div className="font-bold tracking-widest mb-0.5 text-[10px] uppercase text-text-secondary">{t('agentIdentity')}</div>
                        <div className="font-mono text-accent-primary bg-bg-primary px-2 py-0.5 rounded-none text-sm border border-accent-primary/30 shadow-[0_0_10px_rgba(0,255,204,0.1)]">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-2.5 bg-bg-primary/50 hover:bg-accent-primary/20 hover:text-accent-secondary rounded-none transition-all duration-300 border border-border-color/50 group/btn"
                      title="Copy Address"
                      onClick={() => navigator.clipboard.writeText(wallet.address)}
                    >
                      <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`badge rounded-none border-opacity-50 font-mono text-[10px] ${wallet.isDeployed ? 'badge-success border-accent-success/50' : 'badge-warning border-accent-warning/50'}`}>
                      <span className="relative flex w-1.5 h-1.5 mr-2 inline-flex">
                        <span className={`absolute inline-flex h-full w-full opacity-75 ${wallet.isDeployed ? 'bg-accent-success animate-ping' : 'bg-accent-warning'}`}></span>
                        <span className={`relative inline-flex w-1.5 h-1.5 ${wallet.isDeployed ? 'bg-accent-success shadow-[0_0_5px_rgba(0,255,102,0.8)]' : 'bg-accent-warning shadow-[0_0_5px_rgba(255,204,0,0.8)]'}`}></span>
                      </span>
                      {wallet.isDeployed ? t('networkActive') : t('pendingInit')}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">NET: {t('networkStatus')}</span>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-b from-transparent to-bg-primary/30">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">{t('availBalance')}</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-mono tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                      {wallet.balance
                        ? (Number(wallet.balance) / 1e18).toFixed(4)
                        : '0.0000'
                      }
                    </div>
                    <div className="text-accent-secondary font-mono text-sm tracking-widest uppercase">MON</div>
                  </div>
                </div>
                
                {/* Decorative accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
