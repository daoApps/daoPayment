import { useReadContract } from 'wagmi';
import { Abi } from 'viem';

const POLICY_ABI: Abi = [
  {
    name: 'getPolicy',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'policyId', type: 'bytes32' }],
    outputs: [
      { name: 'maxDailySpend', type: 'uint256' },
      { name: 'requireApprovalAbove', type: 'uint256' },
      { name: 'allowedRecipients', type: 'address[]' },
      { name: 'allowedTokens', type: 'address[]' },
      { name: 'allowedCategories', type: 'string[]' },
      { name: 'blockedMethods', type: 'string[]' },
    ],
  },
] as const;

export interface UsePolicyReadParams {
  contractAddress: `0x${string}`;
  policyId: `0x${string}`;
}

export function usePolicyRead({
  contractAddress,
  policyId,
}: UsePolicyReadParams) {
  const { data, isError, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: POLICY_ABI,
    functionName: 'getPolicy',
    args: [policyId],
    query: {
      staleTime: 10000, // 10 seconds cache
    },
  });

  return {
    data: data
      ? {
          maxDailySpend: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[0],
          requireApprovalAbove: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[1],
          allowedRecipients: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[2],
          allowedTokens: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[3],
          allowedCategories: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[4],
          blockedMethods: (
            data as unknown as [
              bigint,
              bigint,
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
            ]
          )[5],
        }
      : undefined,
    isError,
    isLoading,
    error,
  };
}

export default usePolicyRead;
