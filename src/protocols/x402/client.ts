import MainManager from '../../core/mainManager.js';

export interface PaymentRequirement {
  network: string;
  currency: string;
  amount: number;
  recipient: string;
  instructionUrl?: string;
}

export interface X402Response {
  ok: boolean;
  status: number;
  paymentRequirement?: PaymentRequirement;
  body?: any;
  headers?: Headers;
}

export interface X402ClientConfig {
  walletAddress: string;
  agentId: string;
  sessionKeyId?: string;
  manager: MainManager;
  retryWithPayment: boolean;
}

export class X402Client {
  private config: X402ClientConfig;

  constructor(config: X402ClientConfig) {
    this.config = config;
  }

  async fetch(url: string, options: RequestInit = {}): Promise<X402Response> {
    const response = await fetch(url, options);

    if (response.status !== 402) {
      return {
        ok: response.ok,
        status: response.status,
        body: await this.parseResponse(response),
        headers: response.headers,
      };
    }

    const paymentRequirement = this.parsePaymentRequirement(response);
    if (!paymentRequirement) {
      return {
        ok: false,
        status: response.status,
      };
    }

    if (!this.config.retryWithPayment) {
      return {
        ok: false,
        status: 402,
        paymentRequirement,
      };
    }

    return this.autoPayAndRetry(url, options, paymentRequirement);
  }

  private parsePaymentRequirement(
    response: Response
  ): PaymentRequirement | null {
    const paymentRequiredHeader = response.headers.get('Payment-Required');
    if (!paymentRequiredHeader) {
      return null;
    }

    try {
      return JSON.parse(paymentRequiredHeader);
    } catch (_e) {
      const parts = paymentRequiredHeader.split(' ');
      if (parts.length >= 4) {
        return {
          network: parts[0],
          currency: parts[1],
          amount: parseFloat(parts[2]),
          recipient: parts[3],
        };
      }
      return null;
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  private async autoPayAndRetry(
    url: string,
    options: RequestInit,
    requirement: PaymentRequirement
  ): Promise<X402Response> {
    const { walletAddress, agentId, sessionKeyId, manager } = this.config;

    try {
      const paymentResult = await manager.executePaymentWithSessionKey(
        sessionKeyId || '',
        walletAddress as `0x${string}`,
        {
          agentId,
          walletAddress: walletAddress as `0x${string}`,
          recipient: requirement.recipient as `0x${string}`,
          amount: requirement.amount,
          token: requirement.currency,
          category: 'api',
          purpose: `x402 payment for ${url}`,
          permissionId: 'default',
        }
      );

      if (!paymentResult.success || !paymentResult.txHash) {
        return {
          ok: false,
          status: 402,
          paymentRequirement: requirement,
        };
      }

      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Payment-Receipt': JSON.stringify({
            txHash: paymentResult.txHash,
            amount: requirement.amount,
            currency: requirement.currency,
          }),
        },
      };

      const retryResponse = await fetch(url, newOptions);
      return {
        ok: retryResponse.ok,
        status: retryResponse.status,
        body: await this.parseResponse(retryResponse),
        headers: retryResponse.headers,
      };
    } catch (error) {
      console.error('Auto payment failed:', error);
      return {
        ok: false,
        status: 402,
        paymentRequirement: requirement,
      };
    }
  }

  static isPaymentRequired(response: X402Response): boolean {
    return response.status === 402 && !!response.paymentRequirement;
  }
}

export default X402Client;
