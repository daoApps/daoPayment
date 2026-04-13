import pytest
from app.mcp.server import create_wallet, execute_payment, list_audit_records

def test_create_wallet():
    result = create_wallet()
    assert result["success"] is True
    assert "walletAddress" in result
    assert "recoveryPhrase" in result

def test_execute_payment():
    wallet_address = "0x1234567890123456789012345678901234567890"
    result = execute_payment(
        agentId="agent-1",
        walletAddress=wallet_address,
        recipient="0x0987654321098765432109876543210987654321",
        amount=10.5
    )
    assert result["success"] is True
    assert "txHash" in result
    assert "auditId" in result

def test_list_audit_records():
    result = list_audit_records(agentId="agent-1")
    assert result["success"] is True
    assert isinstance(result["records"], list)
    # the list might have the record we just created
    assert len(result["records"]) > 0
    assert result["records"][0]["agentId"] == "agent-1"
