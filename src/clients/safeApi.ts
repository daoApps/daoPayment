const SAFE_API_BASE = 'https://safe-transaction-testnet.safe.global/api/v1';

export interface SafePendingTransaction {
  safeTxHash: string;
  to: string;
  value: string;
  data: string;
  operation: number;
  gasToken: string;
  safeTx: {
    nonce: number;
    confirmations: { owner: string }[];
  };
  confirmationsRequired: number;
  submissionDate: string;
}

export interface SafePendingTransactionsResponse {
  count: number;
  results: SafePendingTransaction[];
}

export class SafeApiClient {
  private safeAddress: string;
  private baseUrl: string;

  constructor(safeAddress: string, network: 'mainnet' | 'testnet' = 'testnet') {
    this.safeAddress = safeAddress;
    this.baseUrl =
      network === 'mainnet'
        ? 'https://safe-transaction-mainnet.safe.global/api/v1'
        : SAFE_API_BASE;
  }

  async getPendingTransactions(): Promise<SafePendingTransactionsResponse> {
    const url = `${this.baseUrl}/safes/${this.safeAddress}/multisig-transactions/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pending transactions: ${response.statusText}`
      );
    }
    return response.json();
  }

  async confirmTransaction(
    safeTxHash: string,
    signature: string
  ): Promise<void> {
    const url = `${this.baseUrl}/multisig-transactions/${safeTxHash}/confirmations/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature }),
    });
    if (!response.ok) {
      throw new Error(`Failed to confirm transaction: ${response.statusText}`);
    }
  }

  async rejectTransaction(safeTxHash: string): Promise<void> {
    const url = `${this.baseUrl}/multisig-transactions/${safeTxHash}/`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to reject transaction: ${response.statusText}`);
    }
  }
}

export default SafeApiClient;
