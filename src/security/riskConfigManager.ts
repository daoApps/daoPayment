import { RiskAssessmentConfig, RiskRule } from '../types/riskConfig.js';

class RiskConfigManager {
  private config: RiskAssessmentConfig | null = null;
  private configPath: string;

  constructor(configPath: string = './config/riskConfig.json') {
    this.configPath = configPath;
  }

  async loadConfig(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const configData = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(configData) as RiskAssessmentConfig;
    } catch (error) {
      console.error('Failed to load risk config:', error);
      this.config = this.getDefaultConfig();
    }
  }

  getConfig(): RiskAssessmentConfig {
    if (!this.config) {
      throw new Error('Risk config not loaded');
    }
    return this.config;
  }

  async reloadConfig(): Promise<void> {
    await this.loadConfig();
  }

  private getDefaultConfig(): RiskAssessmentConfig {
    return {
      version: '1.0.0',
      rules: [
        {
          id: 'high_amount',
          name: 'High Amount Transaction',
          description: 'Detect transactions with high amount',
          enabled: true,
          weight: 30,
          conditions: [
            { type: 'amount', operator: 'gt', value: 10000 }
          ],
          alertMessage: 'High amount transaction detected'
        },
        {
          id: 'medium_amount',
          name: 'Medium Amount Transaction',
          description: 'Detect transactions with medium amount',
          enabled: true,
          weight: 15,
          conditions: [
            { type: 'amount', operator: 'gt', value: 1000 }
          ],
          alertMessage: 'Medium amount transaction detected'
        },
        {
          id: 'new_recipient',
          name: 'New Recipient',
          description: 'Detect transactions to new recipients',
          enabled: true,
          weight: 25,
          conditions: [
            { type: 'recipient', operator: 'eq', value: 'isNewRecipient' }
          ],
          alertMessage: 'Transaction to new recipient'
        },
        {
          id: 'off_hours',
          name: 'Off Hours Transaction',
          description: 'Detect transactions during off-hours',
          enabled: true,
          weight: 10,
          conditions: [
            { type: 'time', operator: 'in', value: 'offHours' }
          ],
          alertMessage: 'Transaction during off-hours'
        },
        {
          id: 'high_risk_method',
          name: 'High Risk Method',
          description: 'Detect high-risk methods',
          enabled: true,
          weight: 20,
          conditions: [
            { type: 'method', operator: 'in', value: ['approve', 'delegate'] }
          ],
          alertMessage: 'High-risk method detected'
        },
        {
          id: 'high_risk_category',
          name: 'High Risk Category',
          description: 'Detect high-risk category transactions',
          enabled: true,
          weight: 25,
          conditions: [
            { type: 'category', operator: 'eq', value: 'high_risk' }
          ],
          alertMessage: 'High-risk category transaction'
        }
      ],
      thresholds: {
        denyThreshold: 70,
        approvalThreshold: 40
      },
      timeRanges: {
        offHours: { start: 22, end: 6 }
      }
    };
  }
}

export default RiskConfigManager;
