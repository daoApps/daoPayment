export interface RiskCondition {
  type: 'amount' | 'recipient' | 'time' | 'method' | 'category';
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'in' | 'not_in';
  value: any;
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  weight: number;
  conditions: RiskCondition[];
  alertMessage: string;
}

export interface RiskThreshold {
  denyThreshold: number;
  approvalThreshold: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface TimeRanges {
  offHours: TimeRange;
}

export interface RiskAssessmentConfig {
  version: string;
  rules: RiskRule[];
  thresholds: RiskThreshold;
  timeRanges: TimeRanges;
}
