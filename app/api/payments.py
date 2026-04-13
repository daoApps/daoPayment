from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, List, Optional
import time
import uuid
from app.core.audit import AuditManager

router = APIRouter()
audit_manager = AuditManager(storage_path='./audit-records')

class ExecutePaymentRequest(BaseModel):
    recipient: str
    amount: float
    token: str = "MON"
    policyId: Optional[str] = None
    description: Optional[str] = None

class ExecutePaymentResponse(BaseModel):
    txHash: str
    recordId: str
    status: str

@router.post("/execute", response_model=ExecutePaymentResponse)
@router.post("/execute/", response_model=ExecutePaymentResponse)
async def execute_payment(request: ExecutePaymentRequest):
    # Simulate payment execution
    # In a real app, this would call a smart contract or payment gateway
    simulated_tx_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex}"
    
    try:
        # Create audit record matching the required AuditRecord model
        record_data = {
            "agent_id": "default-agent",
            "task_id": f"task-{int(time.time())}",
            "user_id": "system",
            "wallet_address": "0x0000000000000000000000000000000000000000",
            "recipient": request.recipient,
            "amount": request.amount,
            "token": request.token,
            "category": "payment",
            "purpose": request.description or "Simulated payment",
            "policy_hit": [request.policyId] if request.policyId else [],
            "signature_method": "single",
            "risk_level": "low",
            "requires_approval": False,
            "approval_status": "approved",
            "tx_hash": simulated_tx_hash,
            "status": "completed",
            "completed_at": int(time.time() * 1000)
        }
        
        record = audit_manager.create_record(**record_data)
        
        return ExecutePaymentResponse(
            txHash=simulated_tx_hash,
            recordId=record.id,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
