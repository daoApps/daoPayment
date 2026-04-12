'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from '@wagmi/connectors';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-accent-success"></div>
          <span className="font-mono">{formatAddress(address)}</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 glass-panel p-2 min-w-[180px] z-50">
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-danger"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={handleConnect} className="btn-primary">
      Connect Wallet
    </button>
  );
}
