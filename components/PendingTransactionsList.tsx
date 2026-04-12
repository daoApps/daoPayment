'use client';

import { useState, useEffect } from 'react';
import { SafeApiClient, SafePendingTransaction } from '../src/clients/safeApi';

interface PendingTransactionsListProps {
  safeAddress: `0x${string}`;
  network?: 'mainnet' | 'testnet';
  onApproved?: () => void;
  onRejected?: () => void;
}

export default function PendingTransactionsList({
  safeAddress,
  network = 'testnet',
  onApproved,
  onRejected,
}: PendingTransactionsListProps) {
  const [transactions, setTransactions] = useState<SafePendingTransaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTxHash, setProcessingTxHash] = useState<string | null>(null);

  const client = new SafeApiClient(safeAddress, network);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getPendingTransactions();
      setTransactions(response.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [safeAddress, network]);

  const handleApprove = async (
    tx: SafePendingTransaction,
    signature: string
  ) => {
    try {
      setProcessingTxHash(tx.safeTxHash);
      await client.confirmTransaction(tx.safeTxHash, signature);
      await fetchTransactions();
      onApproved?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessingTxHash(null);
    }
  };

  const handleReject = async (tx: SafePendingTransaction) => {
    try {
      setProcessingTxHash(tx.safeTxHash);
      await client.rejectTransaction(tx.safeTxHash);
      await fetchTransactions();
      onRejected?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessingTxHash(null);
    }
  };

  const confirmationsCount = (tx: SafePendingTransaction) => {
    return tx.safeTx?.confirmations?.length || 0;
  };

  if (loading) {
    return <div className="p-4">Loading pending transactions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (transactions.length === 0) {
    return <div className="p-4 text-gray-500">No pending transactions</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Pending Transactions ({transactions.length})
      </h3>
      {transactions.map((tx) => (
        <div key={tx.safeTxHash} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">
                To:{' '}
                <span className="font-mono">
                  {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                </span>
              </p>
              <p className="text-sm text-gray-600">Value: {tx.value} wei</p>
              <p className="text-sm text-gray-600">
                Confirmations: {confirmationsCount(tx)} /{' '}
                {tx.confirmationsRequired}
              </p>
              <p className="text-sm text-gray-600">
                Submitted: {new Date(tx.submissionDate).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => handleApprove(tx, 'user-signature-here')}
              disabled={processingTxHash === tx.safeTxHash}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {processingTxHash === tx.safeTxHash ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={() => handleReject(tx)}
              disabled={processingTxHash === tx.safeTxHash}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              {processingTxHash === tx.safeTxHash ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
