import { useReadContract } from 'wagmi';
import { Abi } from 'viem';

const BUDGET_ABI: Abi = [
  {
    name: 'getBudget',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'walletAddress', type: 'address' }],
    outputs: [
      { name: 'dailyLimit', type: 'uint256' },
      { name: 'weeklyLimit', type: 'uint256' },
      { name: 'spentToday', type: 'uint256' },
      { name: 'spentThisWeek', type: 'uint256' },
    ],
  },
] as const;

export interface UseBudgetReadParams {
  contractAddress: `0x${string}`;
  walletAddress: `0x${string}`;
}

export function useBudgetRead({
  contractAddress,
  walletAddress,
}: UseBudgetReadParams) {
  const { data, isError, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: BUDGET_ABI,
    functionName: 'getBudget',
    args: [walletAddress],
    query: {
      staleTime: 5000,
    },
  });

  return {
    data: data
      ? {
          dailyLimit: (data as unknown as [bigint, bigint, bigint, bigint])[0],
          weeklyLimit: (data as unknown as [bigint, bigint, bigint, bigint])[1],
          spentToday: (data as unknown as [bigint, bigint, bigint, bigint])[2],
          spentThisWeek: (
            data as unknown as [bigint, bigint, bigint, bigint]
          )[3],
          remainingDaily:
            (data as unknown as [bigint, bigint, bigint, bigint])[0] -
            (data as unknown as [bigint, bigint, bigint, bigint])[2],
          remainingWeekly:
            (data as unknown as [bigint, bigint, bigint, bigint])[1] -
            (data as unknown as [bigint, bigint, bigint, bigint])[3],
        }
      : undefined,
    isError,
    isLoading,
    error,
  };
}

export default useBudgetRead;
