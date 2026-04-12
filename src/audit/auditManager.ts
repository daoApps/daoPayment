import AuditRecord from './auditRecord.js';
import * as fs from 'fs';
import * as path from 'path';

class AuditManager {
  private storagePath: string;
  private records: AuditRecord[] = [];

  constructor(storagePath: string = './audit-records') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadRecords();
  }

  private loadRecords(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const recordPath = path.join(this.storagePath, file);
        try {
          const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
          this.records.push(record);
        } catch (error) {
          console.error(`Error loading audit record from ${file}:`, error);
        }
      }
    }
  }

  private saveRecord(record: AuditRecord): void {
    const recordPath = path.join(this.storagePath, `${record.id}.json`);
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2));
  }

  createRecord(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const newRecord: AuditRecord = {
      ...record,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    this.records.push(newRecord);
    this.saveRecord(newRecord);
    return newRecord;
  }

  updateRecord(
    id: string,
    updates: Partial<AuditRecord>
  ): AuditRecord | undefined {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) {
      return undefined;
    }
    this.records[index] = { ...this.records[index], ...updates };
    this.saveRecord(this.records[index]);
    return this.records[index];
  }

  getRecord(id: string): AuditRecord | undefined {
    return this.records.find((record) => record.id === id);
  }

  listRecords(filters?: {
    agentId?: string;
    walletAddress?: string;
    status?: 'pending' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
  }): AuditRecord[] {
    let filteredRecords = [...this.records];

    if (filters) {
      if (filters.agentId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.agentId === filters.agentId
        );
      }
      if (filters.walletAddress) {
        filteredRecords = filteredRecords.filter(
          (record) => record.walletAddress === filters.walletAddress
        );
      }
      if (filters.status) {
        filteredRecords = filteredRecords.filter(
          (record) => record.status === filters.status
        );
      }
      if (filters.startTime !== undefined) {
        filteredRecords = filteredRecords.filter(
          (record) => record.timestamp >= filters.startTime!
        );
      }
      if (filters.endTime !== undefined) {
        filteredRecords = filteredRecords.filter(
          (record) => record.timestamp <= filters.endTime!
        );
      }
    }

    return filteredRecords.sort((a, b) => b.timestamp - a.timestamp);
  }

  deleteRecord(id: string): boolean {
    const index = this.records.findIndex((record) => record.id === id);
    if (index === -1) {
      return false;
    }
    const recordPath = path.join(this.storagePath, `${id}.json`);
    if (fs.existsSync(recordPath)) {
      fs.unlinkSync(recordPath);
    }
    this.records.splice(index, 1);
    return true;
  }

  generateReport(
    startTime: number,
    endTime: number
  ): {
    totalPayments: number;
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    byAgent: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const records = this.listRecords({ startTime, endTime });
    const report = {
      totalPayments: records.length,
      totalAmount: 0,
      successfulPayments: 0,
      failedPayments: 0,
      pendingPayments: 0,
      byAgent: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    for (const record of records) {
      report.totalAmount += record.amount;

      if (record.status === 'completed') {
        report.successfulPayments++;
      } else if (record.status === 'failed') {
        report.failedPayments++;
      } else {
        report.pendingPayments++;
      }

      // 按 Agent 统计
      if (!report.byAgent[record.agentId]) {
        report.byAgent[record.agentId] = 0;
      }
      report.byAgent[record.agentId]++;

      // 按类别统计
      if (!report.byCategory[record.category]) {
        report.byCategory[record.category] = 0;
      }
      report.byCategory[record.category]++;
    }

    return report;
  }
}

export default AuditManager;
