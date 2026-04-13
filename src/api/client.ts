import { Wallet, Policy, AuditRecord } from '../types';
import toast from 'react-hot-toast';

const BASE_URL = '/api';

class ApiClient {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = 'An unexpected error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        toast.error(errorMessage, {
          style: {
            background: '#131313',
            color: '#f0f0f0',
            border: '1px solid #ff0055',
            borderRadius: '0px',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.875rem'
          },
          icon: '⚠️'
        });
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Network Error: Unable to connect to the backend server.', {
          style: {
            background: '#131313',
            color: '#f0f0f0',
            border: '1px solid #ff0055',
            borderRadius: '0px',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.875rem'
          }
        });
      }
      throw error;
    }
  }

  // Wallet methods
  async getWallets(): Promise<Wallet[]> {
    return this.fetchApi<Wallet[]>('/wallets');
  }

  async createWallet(data: Partial<Wallet>): Promise<Wallet> {
    return this.fetchApi<Wallet>('/wallets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Policy methods
  async getPolicies(): Promise<Policy[]> {
    return this.fetchApi<Policy[]>('/policies');
  }

  async createPolicy(data: Partial<Policy>): Promise<Policy> {
    return this.fetchApi<Policy>('/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Audit methods
  async getAuditRecords(): Promise<AuditRecord[]> {
    return this.fetchApi<AuditRecord[]>('/audit-records');
  }

  // Payment methods
  async executePayment(data: {
    recipient: string;
    amount: string;
    token?: string;
    policyId?: string;
    description?: string;
  }): Promise<{ txHash: string; status: string }> {
    return this.fetchApi<{ txHash: string; status: string }>('/payments/execute/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
