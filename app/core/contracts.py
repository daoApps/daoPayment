from web3 import Web3
from typing import List, Dict, Any, Union
import json
import os

AGENTIC_PAYMENT_POLICY_ABI = [
  {
    "name": "setPolicy",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "policyId", "type": "bytes32" },
      { "name": "maxDailySpend", "type": "uint256" },
      { "name": "requireApprovalAbove", "type": "uint256" },
      { "name": "allowedRecipients", "type": "address[]" },
      { "name": "allowedTokens", "type": "address[]" },
      { "name": "allowedCategories", "type": "string[]" },
      { "name": "blockedMethods", "type": "string[]" }
    ],
    "outputs": []
  },
  {
    "name": "getPolicy",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "policyId", "type": "bytes32" }],
    "outputs": [
      { "name": "maxDailySpend", "type": "uint256" },
      { "name": "requireApprovalAbove", "type": "uint256" },
      { "name": "allowedRecipients", "type": "address[]" },
      { "name": "allowedTokens", "type": "address[]" },
      { "name": "allowedCategories", "type": "string[]" },
      { "name": "blockedMethods", "type": "string[]" },
      { "name": "enabled", "type": "bool" }
    ]
  },
  {
    "name": "getBudget",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "wallet", "type": "address" }],
    "outputs": [
      { "name": "dailyLimit", "type": "uint256" },
      { "name": "weeklyLimit", "type": "uint256" },
      { "name": "spentToday", "type": "uint256" },
      { "name": "spentThisWeek", "type": "uint256" }
    ]
  },
  {
    "name": "setBudget",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "wallet", "type": "address" },
      { "name": "dailyLimit", "type": "uint256" },
      { "name": "weeklyLimit", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "name": "recordSpend",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "wallet", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "name": "createWhitelist",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "id", "type": "bytes32" }],
    "outputs": []
  },
  {
    "name": "addRecipients",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "whitelistId", "type": "bytes32" },
      { "name": "recipients", "type": "address[]" }
    ],
    "outputs": []
  },
  {
    "name": "removeRecipient",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "whitelistId", "type": "bytes32" },
      { "name": "recipient", "type": "address" }
    ],
    "outputs": []
  },
  {
    "name": "isRecipientAllowed",
    "type": "function",
    "stateMutability": "view",
    "inputs": [
      { "name": "whitelistId", "type": "bytes32" },
      { "name": "recipient", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "name": "getWhitelistRecipients",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "whitelistId", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "address[]" }]
  },
  {
    "name": "disableWhitelist",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "whitelistId", "type": "bytes32" }],
    "outputs": []
  },
  {
    "name": "getAllPolicies",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32[]" }]
  },
  {
    "name": "getAllWhitelists",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32[]" }]
  }
]

class AgenticPaymentPolicyContract:
    def __init__(self, rpc_url: str, contract_address: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.contract_address = self.w3.to_checksum_address(contract_address)
        self.contract = self.w3.eth.contract(
            address=self.contract_address,
            abi=AGENTIC_PAYMENT_POLICY_ABI
        )

    def is_recipient_allowed(self, whitelist_id: bytes, recipient: str) -> bool:
        """
        Check if a recipient is allowed in the whitelist.
        """
        checksum_recipient = self.w3.to_checksum_address(recipient)
        try:
            return self.contract.functions.isRecipientAllowed(
                whitelist_id, checksum_recipient
            ).call()
        except Exception as e:
            print(f"Failed to check whitelist on-chain: {e}")
            return False

    def get_whitelist_recipients(self, whitelist_id: bytes) -> List[str]:
        """
        Get all recipients in a whitelist.
        """
        try:
            return self.contract.functions.getWhitelistRecipients(whitelist_id).call()
        except Exception as e:
            print(f"Failed to get whitelist recipients from chain: {e}")
            return []

    def get_budget(self, wallet: str) -> Dict[str, int]:
        """
        Get the budget for a wallet.
        """
        checksum_wallet = self.w3.to_checksum_address(wallet)
        try:
            result = self.contract.functions.getBudget(checksum_wallet).call()
            return {
                "dailyLimit": result[0],
                "weeklyLimit": result[1],
                "spentToday": result[2],
                "spentThisWeek": result[3]
            }
        except Exception as e:
            print(f"Failed to get budget: {e}")
            return {}

    def get_policy(self, policy_id: bytes) -> Dict[str, Any]:
        """
        Get a specific policy.
        """
        try:
            result = self.contract.functions.getPolicy(policy_id).call()
            return {
                "maxDailySpend": result[0],
                "requireApprovalAbove": result[1],
                "allowedRecipients": result[2],
                "allowedTokens": result[3],
                "allowedCategories": result[4],
                "blockedMethods": result[5],
                "enabled": result[6]
            }
        except Exception as e:
            print(f"Failed to get policy: {e}")
            return {}
