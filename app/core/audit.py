import json
import os
import time
import uuid
from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field

class AuditRecord(BaseModel):
    id: str = Field(default_factory=lambda: f"audit-{int(time.time() * 1000)}-{uuid.uuid4().hex[:9]}")
    agent_id: str
    task_id: str
    user_id: str
    wallet_address: str
    recipient: str
    amount: float
    token: str
    category: str
    purpose: str
    policy_hit: List[str] = Field(default_factory=list)
    signature_method: str
    risk_level: Literal['low', 'medium', 'high']
    requires_approval: bool
    approval_status: Literal['pending', 'approved', 'rejected']
    tx_hash: Optional[str] = None
    status: Literal['pending', 'completed', 'failed']
    error: Optional[str] = None
    timestamp: int = Field(default_factory=lambda: int(time.time() * 1000))
    completed_at: Optional[int] = None

class AuditManager:
    def __init__(self, storage_path: str = './audit-records'):
        self.storage_path = storage_path
        self.records: List[AuditRecord] = []
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path, exist_ok=True)
        self.load_records()

    def load_records(self) -> None:
        for filename in os.listdir(self.storage_path):
            if filename.endswith('.json'):
                record_path = os.path.join(self.storage_path, filename)
                try:
                    with open(record_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        self.records.append(AuditRecord(**data))
                except Exception as e:
                    print(f"Error loading audit record from {filename}: {e}")

    def save_record(self, record: AuditRecord) -> None:
        record_path = os.path.join(self.storage_path, f"{record.id}.json")
        with open(record_path, 'w', encoding='utf-8') as f:
            f.write(record.model_dump_json(indent=2))

    def create_record(self, **record_data) -> AuditRecord:
        new_record = AuditRecord(**record_data)
        self.records.append(new_record)
        self.save_record(new_record)
        return new_record

    def update_record(self, record_id: str, updates: Dict) -> Optional[AuditRecord]:
        for i, record in enumerate(self.records):
            if record.id == record_id:
                updated_data = record.model_dump()
                updated_data.update(updates)
                new_record = AuditRecord(**updated_data)
                self.records[i] = new_record
                self.save_record(new_record)
                return new_record
        return None

    def get_record(self, record_id: str) -> Optional[AuditRecord]:
        for record in self.records:
            if record.id == record_id:
                return record
        return None

    def list_records(self, agent_id: str = None, wallet_address: str = None, 
                    status: str = None, start_time: int = None, end_time: int = None) -> List[AuditRecord]:
        filtered = self.records.copy()
        
        if agent_id:
            filtered = [r for r in filtered if r.agent_id == agent_id]
        if wallet_address:
            filtered = [r for r in filtered if r.wallet_address == wallet_address]
        if status:
            filtered = [r for r in filtered if r.status == status]
        if start_time is not None:
            filtered = [r for r in filtered if r.timestamp >= start_time]
        if end_time is not None:
            filtered = [r for r in filtered if r.timestamp <= end_time]
            
        filtered.sort(key=lambda x: x.timestamp, reverse=True)
        return filtered

    def delete_record(self, record_id: str) -> bool:
        for i, record in enumerate(self.records):
            if record.id == record_id:
                record_path = os.path.join(self.storage_path, f"{record_id}.json")
                if os.path.exists(record_path):
                    os.remove(record_path)
                self.records.pop(i)
                return True
        return False

    def generate_report(self, start_time: int, end_time: int) -> Dict:
        records = self.list_records(start_time=start_time, end_time=end_time)
        
        report = {
            "total_payments": len(records),
            "total_amount": 0.0,
            "successful_payments": 0,
            "failed_payments": 0,
            "pending_payments": 0,
            "by_agent": {},
            "by_category": {}
        }
        
        for record in records:
            report["total_amount"] += record.amount
            
            if record.status == 'completed':
                report["successful_payments"] += 1
            elif record.status == 'failed':
                report["failed_payments"] += 1
            else:
                report["pending_payments"] += 1
                
            report["by_agent"][record.agent_id] = report["by_agent"].get(record.agent_id, 0) + 1
            report["by_category"][record.category] = report["by_category"].get(record.category, 0) + 1
            
        return report
