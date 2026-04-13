import json
import os
from web3 import Web3
from eth_account import Account

class Wallet:
    def __init__(self, private_key: str = None):
        if private_key:
            if not private_key.startswith('0x'):
                private_key = '0x' + private_key
            self.account = Account.from_key(private_key)
        else:
            self.account = Account.create()
            
    def get_address(self) -> str:
        return self.account.address

    def get_private_key(self) -> str:
        return self.account.key.hex()

    def get_balance(self, rpc_url: str = "https://testnet-rpc.monad.xyz") -> int:
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            balance = w3.eth.get_balance(self.account.address)
            return balance
        except Exception as e:
            print(f"Error getting balance: {e}")
            return 0

    def save_to_file(self, file_path: str) -> None:
        wallet_data = {
            "privateKey": self.get_private_key(),
            "address": self.get_address()
        }
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(wallet_data, f, indent=2)

    @classmethod
    def load_from_file(cls, file_path: str) -> 'Wallet':
        if not os.path.exists(file_path):
            raise FileNotFoundError("Wallet file not found")
            
        with open(file_path, 'r', encoding='utf-8') as f:
            wallet_data = json.load(f)
            
        private_key = wallet_data.get("privateKey")
        if not private_key:
            raise ValueError("Invalid wallet file: missing privateKey")
            
        return cls(private_key)
