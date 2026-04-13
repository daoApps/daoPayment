import os
import shutil
import pytest
from app.core.wallet import Wallet
from app.core.audit import AuditManager
from app.security.policy import PolicyManager

def test_wallet_creation_and_save(tmp_path):
    wallet = Wallet()
    assert wallet.get_address().startswith("0x")
    
    file_path = tmp_path / "wallet.json"
    wallet.save_to_file(str(file_path))
    
    loaded_wallet = Wallet.load_from_file(str(file_path))
    assert loaded_wallet.get_address() == wallet.get_address()

def test_audit_manager(tmp_path):
    audit_dir = tmp_path / "audit-records"
    manager = AuditManager(storage_path=str(audit_dir))
    
    record = manager.create_record(
        agent_id="agent1",
        task_id="task1",
        user_id="user1",
        wallet_address="0x123",
        recipient="0x456",
        amount=100.0,
        token="USDC",
        category="payment",
        purpose="test payment",
        signature_method="eth_sign",
        risk_level="low",
        requires_approval=False,
        approval_status="approved",
        status="completed"
    )
    
    assert record.agent_id == "agent1"
    assert record.id.startswith("audit-")
    
    fetched = manager.get_record(record.id)
    assert fetched is not None
    assert fetched.amount == 100.0
    
    report = manager.generate_report(start_time=0, end_time=9999999999999)
    assert report["total_payments"] == 1
    assert report["successful_payments"] == 1

def test_policy_manager():
    manager = PolicyManager()
    
    manager.create_policy(
        policy_id="default",
        max_single_amount=1000.0,
        daily_limit=5000.0,
        weekly_limit=20000.0,
        require_human_approval_above=500.0,
        blocked_categories=["gambling"]
    )
    
    # Test valid below approval
    res1 = manager.validate_transaction(
        policy_id="default",
        amount=100.0,
        recipient="0x123",
        token="USDC",
        method="transfer",
        category="payment"
    )
    assert res1.allowed is True
    assert res1.requires_human_approval is False
    
    # Test valid requires approval
    res2 = manager.validate_transaction(
        policy_id="default",
        amount=600.0,
        recipient="0x123",
        token="USDC",
        method="transfer",
        category="payment"
    )
    assert res2.allowed is True
    assert res2.requires_human_approval is True
    
    # Test exceed max amount
    res3 = manager.validate_transaction(
        policy_id="default",
        amount=1500.0,
        recipient="0x123",
        token="USDC",
        method="transfer",
        category="payment"
    )
    assert res3.allowed is False
    assert res3.requires_human_approval is False
    assert "exceeds maximum" in res3.reason
    
    # Test blocked category
    res4 = manager.validate_transaction(
        policy_id="default",
        amount=100.0,
        recipient="0x123",
        token="USDC",
        method="transfer",
        category="gambling"
    )
    assert res4.allowed is False
    assert res4.reason == "Category is blocked"
