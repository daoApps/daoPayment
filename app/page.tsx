'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import { ConnectButton } from '@/components/ConnectButton';
import { PolicyManager } from '@/components/PolicyManager';
import { WalletManager } from '@/components/WalletManager';
import { AuditList } from '@/components/AuditList';
import { MonadLogo } from '@/components/MonadLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18nStore } from '@/src/i18n/store';

type Tab = 'wallets' | 'policies' | 'audit';

export default function Home() {
  const { t } = useI18nStore();
  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.getWallets(),
  });

  // Decide if user is "connected" based on backend wallets
  const isConnected = wallets && wallets.length > 0;
  const [activeTab, setActiveTab] = useState<Tab>('wallets');

  const tabs = [
    { id: 'wallets', label: t('tabWallets') },
    { id: 'policies', label: t('tabPolicies') },
    { id: 'audit', label: t('tabAudit') },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 grid-dao-pattern pointer-events-none z-[-1]" />

      <header className="sticky top-0 z-50 border-b border-border-color/50 bg-bg-secondary/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="p-3 rounded-2xl bg-bg-tertiary border border-border-color shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <MonadLogo />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="gradient-text">{t('appName')}</span>
                </h1>
                <p className="text-text-muted text-xs uppercase tracking-widest font-bold mt-1">
                  {t('tagline')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col relative z-10">
        {!isConnected ? (
          <div className="flex flex-col lg:flex-row items-center justify-between flex-grow gap-12 lg:gap-24 py-10">
            {/* Left Column - Bold Typography */}
            <div className="flex-1 text-left relative z-10 w-full">
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-primary/20 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="reveal mb-8 inline-flex p-4 rounded-3xl bg-bg-tertiary border border-border-color shadow-2xl animate-float">
                <MonadLogo size={48} />
              </div>
              
              <h2 className="reveal-1 text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tighter whitespace-pre-line">
                {t('heroTitle1')} <br />
                <span className="gradient-text drop-shadow-2xl">{t('heroTitle2')}</span>
              </h2>
              
              <p className="reveal-2 text-text-secondary text-xl md:text-2xl mb-12 max-w-xl leading-relaxed">
                {t('heroDesc')}
              </p>
              
              <div className="reveal-3 inline-block relative">
                <div className="neon-trace rounded-xl inline-block hover:scale-105 transition-transform duration-300">
                  <ConnectButton />
                </div>
              </div>
            </div>
            
            {/* Right Column - Asymmetric Cards */}
            <div className="flex-1 w-full relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-secondary/10 blur-[120px] rounded-full pointer-events-none z-0" />
              
              <div className="relative z-10 flex flex-col gap-6 w-full max-w-lg mx-auto lg:ml-auto lg:mr-0">
                <div className="reveal-3 glass-card p-6 lg:-ml-12 border-l-4 border-l-accent-primary">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center text-2xl">🔐</div>
                    <h3 className="font-bold text-xl leading-tight">{t('feature1Title')}</h3>
                  </div>
                  <p className="text-text-muted text-base leading-relaxed">{t('feature1Desc')}</p>
                </div>
                
                <div className="reveal-4 glass-card p-6 lg:ml-12 border-l-4 border-l-accent-secondary">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 text-accent-secondary flex items-center justify-center text-2xl">⚡</div>
                    <h3 className="font-bold text-xl leading-tight">{t('feature2Title')}</h3>
                  </div>
                  <p className="text-text-muted text-base leading-relaxed">{t('feature2Desc')}</p>
                </div>
                
                <div className="reveal-5 glass-card p-6 lg:ml-0 border-l-4 border-l-accent-success">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent-success/10 text-accent-success flex items-center justify-center text-2xl">📋</div>
                    <h3 className="font-bold text-xl leading-tight">{t('feature3Title')}</h3>
                  </div>
                  <p className="text-text-muted text-base leading-relaxed">{t('feature3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto p-1 bg-bg-tertiary/50 rounded-2xl border border-border-color/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 font-bold text-sm tracking-wide uppercase
                      ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/25'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 px-4 py-2 bg-bg-tertiary/30 rounded-xl border border-border-color/50">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <div className="absolute w-full h-full rounded-full bg-accent-success animate-ping opacity-75"></div>
                  <div className="relative w-2 h-2 rounded-full bg-accent-success"></div>
                </div>
                <span className="font-mono text-sm text-text-secondary">{t('networkStatus')}</span>
              </div>
            </div>

            <div className="min-h-[500px]">
              {activeTab === 'wallets' && <WalletManager />}
              {activeTab === 'policies' && <PolicyManager />}
              {activeTab === 'audit' && <AuditList />}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border-color/50 bg-bg-secondary/30 backdrop-blur-md mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-muted text-sm font-medium tracking-wide">
              {t('appName')} &copy; {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <span>{t('poweredBy')}</span>
              <span className="px-3 py-1 bg-accent-primary/10 text-accent-secondary rounded-full font-bold uppercase tracking-wider border border-accent-primary/20">Monad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
