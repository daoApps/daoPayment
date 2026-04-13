'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/api/client';
import { AuditRecord } from '@/src/types';
import { useI18nStore } from '@/src/i18n/store';

export function AuditList() {
  const queryClient = useQueryClient();
  const { t } = useI18nStore();
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['audit-records'],
    queryFn: () => apiClient.getAuditRecords(),
  });

  const handleExecutePayment = async () => {
    setIsExecuting(true);
    try {
      await apiClient.executePayment({
        recipient: '0x1234567890123456789012345678901234567890',
        amount: '100',
        token: 'MON',
        policyId: 'default'
      });
      queryClient.invalidateQueries({ queryKey: ['audit-records'] });
    } catch (error) {
      console.error('Payment execution failed', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3 });
  };

  const getStatusDot = (status: AuditRecord['status'] | string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return (
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-emerald-400 text-[10px] uppercase tracking-widest font-mono">{t('statusSuccess')}</span>
          </div>
        );
      case 'failed':
      case 'denied':
        return (
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_2px_rgba(244,63,94,0.8)]"></span>
            </span>
            <span className="text-rose-400 text-[10px] uppercase tracking-widest font-mono">{t('statusDenied')}</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_2px_rgba(245,158,11,0.8)]"></span>
            </span>
            <span className="text-amber-400 text-[10px] uppercase tracking-widest font-mono">{t('statusPending')}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500 shadow-[0_0_8px_2px_rgba(100,116,139,0.8)]"></span>
            </span>
            <span className="text-slate-400 text-[10px] uppercase tracking-widest font-mono">{status}</span>
          </div>
        );
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'transfer':
      case 'general':
        return t('actionTransfer');
      case 'approve':
        return t('actionApprove');
      case 'revoke':
        return t('actionRevoke');
      case 'create_policy':
        return t('actionCreatePolicy');
      default:
        return action;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black/60 border border-slate-800/50 rounded-xl p-8 backdrop-blur-xl animate-in fade-in duration-700">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-emerald-500 rounded-full animate-[spin_1.5s_reverse_infinite]"></div>
            <div className="absolute inset-4 border-b-2 border-indigo-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          </div>
          <p className="font-mono text-cyan-500/70 text-xs tracking-[0.2em] uppercase animate-pulse">Establishing Secure Uplink...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c]/80 border border-slate-800/50 rounded-xl p-6 md:p-8 backdrop-blur-xl animate-in fade-in duration-700 shadow-2xl shadow-black/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-mono text-slate-200 tracking-wider flex items-center gap-3 uppercase">
            <span className="w-2 h-6 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></span>
            SYS.{t('auditTitle')}
          </h2>
          <p className="font-mono text-[10px] text-slate-500 mt-2 tracking-[0.15em] uppercase">
            {t('auditDesc')}
          </p>
        </div>
        <button
          onClick={handleExecutePayment}
          disabled={isExecuting}
          className="relative group overflow-hidden bg-slate-900 border border-cyan-900/50 hover:border-cyan-500/50 text-cyan-500 px-6 py-2.5 rounded-sm font-mono text-xs tracking-widest uppercase transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative flex items-center gap-2">
            {isExecuting ? (
              <>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>
                {t('btnSimulating')}
              </>
            ) : (
              <>
                <span className="text-cyan-400">►</span> {t('btnTriggerSim')}
              </>
            )}
          </span>
        </button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-slate-800/50 rounded-lg bg-black/20">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-mono text-slate-500 text-xs tracking-[0.2em] uppercase mb-6">{t('noLogsDesc')}</p>
          <button
            onClick={handleExecutePayment}
            disabled={isExecuting}
            className="text-cyan-500/70 hover:text-cyan-400 font-mono text-[10px] tracking-widest uppercase border-b border-cyan-900 hover:border-cyan-400 pb-1 transition-colors"
          >
            {t('btnTriggerSim')}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead>
              <tr className="border-b border-slate-800/80">
                <th className="py-3 px-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">{t('colTime')}</th>
                <th className="py-3 px-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">{t('colAction')}</th>
                <th className="py-3 px-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] text-right">{t('colAmount')}</th>
                <th className="py-3 px-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">{t('colRecipient')}</th>
                <th className="py-3 px-4 text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">{t('colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {records.map((record, index) => (
                <tr
                  key={record.id}
                  className="hover:bg-slate-800/20 transition-colors group animate-in slide-in-from-left-8 fade-in duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <td className="py-4 px-4 text-[11px] text-slate-400 font-mono tracking-wider">
                    {formatTime(record.timestamp)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-mono uppercase tracking-widest text-[10px]">
                      {getActionLabel(record.action)}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-right">
                    {record.amount ? (
                      <span className="text-slate-300 text-[11px] tracking-wider">
                        {record.amount} <span className="text-slate-600 text-[9px]">MON</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {record.recipient ? (
                      <span className="font-mono text-[11px] text-slate-400 tracking-wider">
                        <span className="text-slate-600">0x</span>{record.recipient.slice(2, 6)}<span className="text-slate-600">...</span>{record.recipient.slice(-4)}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusDot(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
          <div className="font-mono text-[9px] text-slate-600 tracking-[0.2em] uppercase">
            End of Log // {records.length} entries found
          </div>
          <button className="text-[10px] font-mono tracking-widest uppercase text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
            <svg className="w-3 h-3 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('exportLogs')}
          </button>
        </div>
      )}
    </div>
  );
}
