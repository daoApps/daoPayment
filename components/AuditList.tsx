'use client';

import { useState } from 'react';

interface AuditRecord {
  id: string;
  timestamp: number;
  action: 'transfer' | 'approve' | 'revoke' | 'create_policy';
  amount: number;
  recipient: string;
  status: 'success' | 'failed' | 'pending';
  txHash?: string;
}

const mockAuditRecords: AuditRecord[] = [
  {
    id: '1',
    timestamp: Date.now() - 1000 * 60 * 30,
    action: 'transfer',
    amount: 1.5,
    recipient: '0x1234...5678',
    status: 'success',
    txHash: '0xabc...123',
  },
  {
    id: '2',
    timestamp: Date.now() - 1000 * 60 * 120,
    action: 'transfer',
    amount: 5.0,
    recipient: '0x8765...4321',
    status: 'success',
    txHash: '0xdef...456',
  },
  {
    id: '3',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    action: 'create_policy',
    amount: 0,
    recipient: '',
    status: 'success',
  },
];

export function AuditList() {
  const [records] = useState<AuditRecord[]>(mockAuditRecords);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: AuditRecord['status']) => {
    switch (status) {
      case 'success':
        return <span className="badge badge-success">Success</span>;
      case 'failed':
        return <span className="badge badge-danger">Failed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  const getActionLabel = (action: AuditRecord['action']) => {
    switch (action) {
      case 'transfer':
        return 'Transfer';
      case 'approve':
        return 'Approve';
      case 'revoke':
        return 'Revoke';
      case 'create_policy':
        return 'Create Policy';
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Audit Trail</h2>
        <p className="text-text-muted mt-1">
          Complete history of all payment operations
        </p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-text-muted">📜</div>
          <p className="text-text-muted">No audit records yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left py-3 px-2 text-text-muted font-medium text-sm">
                  Time
                </th>
                <th className="text-left py-3 px-2 text-text-muted font-medium text-sm">
                  Action
                </th>
                <th className="text-left py-3 px-2 text-text-muted font-medium text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-2 text-text-muted font-medium text-sm">
                  Recipient
                </th>
                <th className="text-left py-3 px-2 text-text-muted font-medium text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border-color last:border-0 hover:bg-bg-tertiary/30 transition-colors"
                >
                  <td className="py-4 px-2 text-sm text-text-secondary">
                    {formatTime(record.timestamp)}
                  </td>
                  <td className="py-4 px-2">
                    <span className="badge badge-primary">
                      {getActionLabel(record.action)}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-medium">
                    {record.amount > 0 ? `${record.amount} MON` : '-'}
                  </td>
                  <td className="py-4 px-2">
                    {record.recipient ? (
                      <code className="font-mono text-sm text-text-secondary px-2 py-1 rounded bg-bg-tertiary">
                        {record.recipient}
                      </code>
                    ) : (
                      <span className="text-text-muted">-</span>
                    )}
                  </td>
                  <td className="py-4 px-2">{getStatusBadge(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button className="btn-secondary">Export CSV</button>
        </div>
      )}
    </div>
  );
}
