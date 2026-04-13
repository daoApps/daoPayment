'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';

interface WhitelistItem {
  address: string;
  category: string;
}

export function WhitelistManager() {
  const [showAdd, setShowAdd] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newCategory, setNewCategory] = useState('api');
  
  const { data: policies, isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: () => apiClient.getPolicies(),
  });

  const activePolicy = policies?.[0];

  const whitelist: WhitelistItem[] =
    activePolicy?.allowedRecipients?.map((addr) => ({
      address: addr,
      category: 'api', // Defaulting to api as we don't have categories in policy for each recipient yet
    })) || [];

  const addAddress = async (address: string, category: string) => {
    console.log('Add address', address, category);
    // Ideally this would call a mutation to update the policy's allowedRecipients
  };

  const isAdding = false;


  const PREDEFINED_SERVICES = [
    {
      name: 'OpenAI',
      address: '0x0000000000000000000000000000000000000000',
      category: 'api',
    },
    {
      name: 'Anthropic',
      address: '0x0000000000000000000000000000000000000001',
      category: 'api',
    },
    {
      name: 'AWS',
      address: '0x0000000000000000000000000000000000000002',
      category: 'cloud',
    },
    {
      name: 'Google Cloud',
      address: '0x0000000000000000000000000000000000000003',
      category: 'cloud',
    },
  ];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(newAddress, newCategory);
    setNewAddress('');
    setShowAdd(false);
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Whitelist</h2>
          <p className="text-text-muted mt-1">
            Approved recipients for automated payments
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          {showAdd ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-8 glass-card p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="label">Recipient Address</label>
              <input
                type="text"
                className="input"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="api">API Services</option>
                <option value="cloud">Cloud Infrastructure</option>
                <option value="storage">Storage</option>
                <option value="compute">Compute</option>
                <option value="payment">Payment Processing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-primary" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add to Whitelist'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <h4 className="text-text-secondary text-sm font-medium mb-3">
              Quick Add Popular Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_SERVICES.map((service) => (
                <button
                  key={service.name}
                  onClick={() => setNewAddress(service.address)}
                  className="px-3 py-1 rounded-full text-sm border border-border-color hover:border-accent-primary transition-colors text-text-secondary hover:text-text-primary"
                >
                  + {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-text-muted">
          Loading whitelist...
        </div>
      ) : !whitelist || whitelist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-text-muted">📝</div>
          <p className="text-text-muted">No addresses whitelisted yet</p>
          <p className="text-text-muted text-sm mt-1">
            Add addresses to allow automated payments to them
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whitelist.map((item) => (
            <div key={item.address} className="glass-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-sm text-text-primary mb-2">
                    {item.address.slice(0, 8)}...{item.address.slice(-6)}
                  </div>
                  <span className="badge badge-primary">{item.category}</span>
                </div>
                <button className="text-accent-danger hover:text-accent-danger/80 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
