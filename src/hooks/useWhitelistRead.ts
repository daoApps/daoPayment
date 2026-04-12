import { useReadContract } from 'wagmi';
import { Abi } from 'viem';

const WHITELIST_ABI: Abi = [
  {
    name: 'getWhitelist',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'whitelistId', type: 'bytes32' }],
    outputs: [
      { name: 'recipients', type: 'address[]' },
      { name: 'tokens', type: 'address[]' },
      { name: 'categories', type: 'string[]' },
      { name: 'methods', type: 'string[]' },
      { name: 'enabled', type: 'bool' },
    ],
  },
  {
    name: 'isRecipientAllowed',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'whitelistId', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
    ],
    outputs: [{ name: 'allowed', type: 'bool' }],
  },
] as const;

export interface UseWhitelistReadParams {
  contractAddress: `0x${string}`;
  whitelistId: `0x${string}`;
}

export function useWhitelistRead({
  contractAddress,
  whitelistId,
}: UseWhitelistReadParams) {
  const { data, isError, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: WHITELIST_ABI,
    functionName: 'getWhitelist',
    args: [whitelistId],
    query: {
      staleTime: 10000,
    },
  });

  return {
    data: data
      ? {
          recipients: (
            data as unknown as [
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
              boolean,
            ]
          )[0],
          tokens: (
            data as unknown as [
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
              boolean,
            ]
          )[1],
          categories: (
            data as unknown as [
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
              boolean,
            ]
          )[2],
          methods: (
            data as unknown as [
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
              boolean,
            ]
          )[3],
          enabled: (
            data as unknown as [
              `0x${string}`[],
              `0x${string}`[],
              string[],
              string[],
              boolean,
            ]
          )[4],
        }
      : undefined,
    isError,
    isLoading,
    error,
  };
}

export function useIsRecipientAllowed({
  contractAddress,
  whitelistId,
  recipient,
}: {
  contractAddress: `0x${string}`;
  whitelistId: `0x${string}`;
  recipient: `0x${string}`;
}) {
  const { data, isError, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: WHITELIST_ABI,
    functionName: 'isRecipientAllowed',
    args: [whitelistId, recipient],
    query: {
      staleTime: 5000,
    },
  });

  return {
    allowed: data as boolean,
    isError,
    isLoading,
    error,
  };
}

export default useWhitelistRead;
