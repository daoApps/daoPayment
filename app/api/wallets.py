from fastapi import APIRouter, HTTPException
import os
import json
from app.core.wallet import Wallet

router = APIRouter(prefix="/wallets", tags=["wallets"])

WALLET_DIR = "secure-storage/wallets"

@router.get("", response_model=list)
@router.get("/", response_model=list)
async def get_wallets():
    wallets = []
    if os.path.exists(WALLET_DIR):
        for filename in os.listdir(WALLET_DIR):
            if filename.endswith(".json"):
                file_path = os.path.join(WALLET_DIR, filename)
                try:
                    wallet = Wallet.load_from_file(file_path)
                    # Fetching real-time balance from the Monad Testnet via web3.py inside the wallet class
                    balance = wallet.get_balance(rpc_url="https://testnet-rpc.monad.xyz")
                    wallets.append({
                        "address": wallet.get_address(),
                        "balance": str(balance),
                        "isDeployed": balance > 0  # Treat as deployed if it has some balance
                    })
                except Exception as e:
                    print(f"Error loading wallet {filename}: {e}")
    return wallets

@router.post("")
@router.post("/")
async def create_wallet():
    try:
        wallet = Wallet()
        file_path = os.path.join(WALLET_DIR, f"{wallet.get_address()}.json")
        wallet.save_to_file(file_path)
        return {
            "address": wallet.get_address(),
            "balance": "0",
            "isDeployed": False
        }
    except Exception as e:
        print(f"Error creating wallet: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create wallet: {str(e)}")
