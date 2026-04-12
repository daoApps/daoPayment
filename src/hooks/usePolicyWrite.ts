import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Abi } from 'viem';
import { useState } from 'react';

const POLICY_ABI: Abi = [
  {
    name: 'setPolicy',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'policyId', type: 'bytes32' },
      { name: 'maxDailySpend', type: 'uint256' },
      { name: 'requireApprovalAbove', type: 'uint256' },
      { name: 'allowedRecipients', type: 'address[]' },
      { name: 'allowedTokens', type: 'address[]' },
      { name: 'allowedCategories', type: 'string[]' },
      { name: 'blockedMethods', type: 'string[]' },
    ],
    outputs: [],
  },
] as const;

export interface SetPolicyParams {
  policyId: `0x${string}`;
  maxDailySpend: bigint;
  requireApprovalAbove: bigint;
  allowedRecipients: `0x${string}`[];
  allowedTokens: `0x${string}`[];
  allowedCategories: string[];
  blockedMethods: string[];
}

export function usePolicyWrite(contractAddress: `0x${string}`) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const [txStatus, setTxStatus] = useState<
    'idle' | 'pending' | 'confirming' | 'success' | 'failed'
  >('idle');

  const setPolicy = async (params: SetPolicyParams) => {
    setTxStatus('pending');
    try {
      writeContract({
        address: contractAddress,
        abi: POLICY_ABI,
        functionName: 'setPolicy',
        args: [
          params.policyId,
          params.maxDailySpend,
          params.requireApprovalAbove,
          params.allowedRecipients,
          params.allowedTokens,
          params.allowedCategories,
          params.blockedMethods,
        ],
      });
    } catch (err) {
      setTxStatus('failed');
      throw err;
    }
  };

  // Update status based on confirmation
  const status = isPending
    ? 'pending'
    : isConfirming
      ? 'confirming'
      : isConfirmed
        ? 'success'
        : error
          ? 'failed'
          : txStatus;

  return {
    setPolicy,
    hash,
    error,
    status,
    isPending: isPending || isConfirming,
    isConfirmed,
  };
}

export default usePolicyWrite;
