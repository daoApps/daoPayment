'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import { useI18nStore } from '@/src/i18n/store';

export function ConnectButton() {
  const { t } = useI18nStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.getWallets(),
  });

  const address = wallets?.[0]?.address;

  const handleConnect = () => {
    setIsConnected(true);
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected || address) {
    const displayAddress = address || '0x0000000000000000000000000000000000000000';
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-accent-success"></div>
          <span className="font-mono">{formatAddress(displayAddress)}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 glass-panel p-2 min-w-[180px] z-50">
            <button
              onClick={() => {
                setIsConnected(false);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-danger"
            >
              {t('btnDisconnect')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={handleConnect} className="btn-primary" disabled={isLoading}>
      {isLoading ? t('btnConnecting') : t('btnConnect')}
    </button>
  );
}
