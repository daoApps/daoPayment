'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { AgenticPaymentPolicyAbi } from '../src/abis/AgenticPaymentPolicy';

const PREDEFINED_SERVICES = [
  { name: 'OpenAI', address: '0x...', category: 'api' },
  { name: 'Anthropic', address: '0x...', category: 'api' },
  { name: 'AWS', address: '0x...', category: 'cloud' },
  { name: 'Google Cloud', address: '0x...', category: 'cloud' },
  { name: 'Stripe', address: '0x...', category: 'payment' },
  { name: 'PayPal', address: '0x...', category: 'payment' },
];

interface WhitelistManagerProps {
  contractAddress: `0x${string}`;
  whitelistId: `0x${string}`;
  onSaved?: () => void;
}

export default function WhitelistManagerComponent({
  contractAddress,
  whitelistId,
  onSaved,
}: WhitelistManagerProps) {
  const [newAddress, setNewAddress] = useState('');
  const [category, setCategory] = useState('api');
  const [recipients, setRecipients] = useState<string[]>([]);
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const addPredefined = (service: (typeof PREDEFINED_SERVICES)[0]) => {
    if (!recipients.includes(service.address)) {
      setRecipients([...recipients, service.address]);
    }
  };

  const addCustomAddress = () => {
    if (
      newAddress &&
      newAddress.startsWith('0x') &&
      newAddress.length === 42 &&
      !recipients.includes(newAddress)
    ) {
      setRecipients([...recipients, newAddress]);
      setNewAddress('');
    }
  };

  const removeAddress = (address: string) => {
    setRecipients(recipients.filter((r) => r !== address));
  };

  const saveToChain = () => {
    if (recipients.length === 0) {
      window.alert('No recipients to add');
      return;
    }

    writeContract(
      {
        address: contractAddress,
        abi: AgenticPaymentPolicyAbi,
        functionName: 'addRecipients',
        args: [whitelistId, recipients as `0x${string}`[]],
      },
      {
        onSuccess: () => {
          onSaved?.();
        },
      }
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Whitelist Management</h3>
      <p className="text-sm text-gray-600">
        Add addresses that your AI Agent is allowed to pay. Only whitelisted
        recipients will be allowed to receive payments.
      </p>

      <div className="space-y-2">
        <h4 className="font-medium">Predefined Services</h4>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_SERVICES.map((service) => (
            <button
              key={service.name}
              onClick={() => addPredefined(service)}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
            >
              + {service.name} ({service.category})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Add Custom Address</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="api">API</option>
            <option value="cloud">Cloud</option>
            <option value="storage">Storage</option>
            <option value="compute">Compute</option>
            <option value="payment">Payment</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={addCustomAddress}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            disabled={!newAddress || !newAddress.startsWith('0x')}
          >
            Add
          </button>
        </div>
      </div>

      {recipients.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            Whitelisted Recipients ({recipients.length})
          </h4>
          <div className="space-y-1">
            {recipients.map((address) => (
              <div
                key={address}
                className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded"
              >
                <span className="font-mono text-sm">
                  {address.slice(0, 10)}...{address.slice(-4)}
                </span>
                <button
                  onClick={() => removeAddress(address)}
                  className="px-2 py-1 text-red-500 hover:bg-red-100 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={saveToChain}
          disabled={isPending || recipients.length === 0}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save to Chain'}
        </button>

        {isSuccess && (
          <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
            ✓ Whitelist saved successfully on-chain
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
            ✗ Error: {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
