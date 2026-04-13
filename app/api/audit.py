from fastapi import APIRouter
from app.core.audit import AuditManager
import os

router = APIRouter()

# Use a default path or configure it from settings
audit_manager = AuditManager(storage_path='./audit-records')

@router.get("/audit-records")
@router.get("/audit-records/")
async def get_audit_records(
    agent_id: str = None, 
    wallet_address: str = None, 
    status: str = None, 
    start_time: int = None, 
    end_time: int = None
):
    records = audit_manager.list_records(
        agent_id=agent_id,
        wallet_address=wallet_address,
        status=status,
        start_time=start_time,
        end_time=end_time
    )
    
    return [
        {
            "id": r.id,
            "timestamp": r.timestamp,
            "action": r.category,
            "amount": str(r.amount),
            "recipient": r.recipient,
            "status": "success" if r.status == "completed" else r.status,
            "txHash": r.tx_hash,
            "policyId": r.policy_hit[0] if r.policy_hit else None,
            "details": r.model_dump()
        }
        for r in records
    ]
