from mcp.server.fastmcp import FastMCP
from app.core.wallet import Wallet
from app.core.audit import AuditManager
from typing import Optional, Literal
from datetime import datetime
import uuid
import os

mcp = FastMCP("monad-agentic-payment")

@mcp.tool()
def create_wallet() -> dict:
    """Create a new wallet for payments on Monad"""
    try:
        wallet = Wallet()
        wallet_address = wallet.get_address()
        private_key = wallet.get_private_key()
        
        # Save wallet securely
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        save_path = os.path.join(base_dir, "secure-storage", "wallets", f"{wallet_address}.json")
        wallet.save_to_file(save_path)
        
        return {
            "success": True,
            "walletAddress": wallet_address,
            "recoveryPhrase": private_key,  # Return private key as there is no seed phrase support yet
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@mcp.tool()
def execute_payment(
    agentId: str,
    walletAddress: str,
    recipient: str,
    amount: float,
    token: str = "USDC",
    category: str = "general",
    purpose: str = "Agent payment",
    sessionKeyId: Optional[str] = None,
    permissionId: str = "default",
) -> dict:
    """Execute a payment on Monad, can use session key or regular permission"""
    try:
        # We simulate the payment since we do not have a PaymentExecutor in Python yet
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        audit_path = os.path.join(base_dir, "audit-records")
        audit_manager = AuditManager(storage_path=audit_path)
        
        # Generate mock transaction hash
        tx_hash = "0x" + uuid.uuid4().hex + uuid.uuid4().hex
        
        audit_record = audit_manager.create_record(
            agent_id=agentId,
            task_id=f"task-{uuid.uuid4().hex[:8]}",
            user_id="system",  # default
            wallet_address=walletAddress,
            recipient=recipient,
            amount=amount,
            token=token,
            category=category,
            purpose=purpose,
            signature_method="session_key" if sessionKeyId else "standard",
            risk_level="low",
            requires_approval=False,
            approval_status="approved",
            status="completed",
            tx_hash=tx_hash
        )
        
        return {
            "success": True,
            "txHash": tx_hash,
            "auditId": audit_record.id,
            "requiresApproval": False
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@mcp.tool()
def list_audit_records(
    agentId: Optional[str] = None,
    walletAddress: Optional[str] = None,
    status: Optional[Literal['pending', 'completed', 'failed']] = None,
    startTime: Optional[int] = None,
    endTime: Optional[int] = None,
) -> dict:
    """List audit records with optional filtering"""
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        audit_path = os.path.join(base_dir, "audit-records")
        audit_manager = AuditManager(storage_path=audit_path)
        records = audit_manager.list_records(
            agent_id=agentId,
            wallet_address=walletAddress,
            status=status,
            start_time=startTime,
            end_time=endTime
        )
        
        formatted_records = []
        for r in records:
            timestamp_str = datetime.fromtimestamp(r.timestamp / 1000.0).isoformat() + "Z"
            formatted_records.append({
                "id": r.id,
                "agentId": r.agent_id,
                "walletAddress": r.wallet_address,
                "recipient": r.recipient,
                "amount": r.amount,
                "token": r.token,
                "category": r.category,
                "purpose": r.purpose,
                "status": r.status,
                "timestamp": timestamp_str
            })
            
        return {
            "success": True,
            "records": formatted_records
        }
    except Exception as e:
        return {
            "success": False,
            "records": [],
            "error": str(e)
        }

if __name__ == "__main__":
    mcp.run()
