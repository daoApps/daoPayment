import pytest
from unittest.mock import MagicMock, patch
from app.core.contracts import AgenticPaymentPolicyContract

@pytest.fixture
def mock_w3():
    with patch('app.core.contracts.Web3') as mock_web3:
        mock_instance = MagicMock()
        mock_web3.return_value = mock_instance
        # Mock to_checksum_address to just return the same string for testing
        mock_instance.to_checksum_address.side_effect = lambda x: x
        yield mock_instance

def test_contract_initialization(mock_w3):
    rpc_url = "http://localhost:8545"
    address = "0x1234567890123456789012345678901234567890"
    
    contract = AgenticPaymentPolicyContract(rpc_url, address)
    
    mock_w3.eth.contract.assert_called_once()
    assert contract.contract_address == address

def test_is_recipient_allowed(mock_w3):
    contract = AgenticPaymentPolicyContract("http://localhost", "0x123")
    
    # Setup mock contract function
    mock_func = MagicMock()
    mock_func.call.return_value = True
    contract.contract.functions.isRecipientAllowed.return_value = mock_func
    
    whitelist_id = b"test_id"
    recipient = "0xabc"
    
    result = contract.is_recipient_allowed(whitelist_id, recipient)
    
    assert result is True
    contract.contract.functions.isRecipientAllowed.assert_called_once_with(whitelist_id, recipient)
    mock_func.call.assert_called_once()

def test_get_whitelist_recipients(mock_w3):
    contract = AgenticPaymentPolicyContract("http://localhost", "0x123")
    
    mock_func = MagicMock()
    mock_func.call.return_value = ["0xabc", "0xdef"]
    contract.contract.functions.getWhitelistRecipients.return_value = mock_func
    
    whitelist_id = b"test_id"
    
    result = contract.get_whitelist_recipients(whitelist_id)
    
    assert result == ["0xabc", "0xdef"]
    contract.contract.functions.getWhitelistRecipients.assert_called_once_with(whitelist_id)

def test_get_budget(mock_w3):
    contract = AgenticPaymentPolicyContract("http://localhost", "0x123")
    
    mock_func = MagicMock()
    mock_func.call.return_value = [1000, 5000, 100, 500]
    contract.contract.functions.getBudget.return_value = mock_func
    
    wallet = "0xabc"
    
    result = contract.get_budget(wallet)
    
    assert result == {
        "dailyLimit": 1000,
        "weeklyLimit": 5000,
        "spentToday": 100,
        "spentThisWeek": 500
    }
    contract.contract.functions.getBudget.assert_called_once_with(wallet)
