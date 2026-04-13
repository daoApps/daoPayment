import pytest
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError
import json
from app.protocols.x402 import X402Client, X402ClientConfig, PaymentRequirement, X402Response

class MockHTTPError(HTTPError):
    def __init__(self, code, headers):
        super().__init__("url", code, "msg", headers, None)

def test_fetch_success():
    manager = MagicMock()
    config = X402ClientConfig("0xwallet", "agent-1", manager)
    client = X402Client(config)

    with patch("urllib.request.urlopen") as mock_urlopen:
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.read.return_value = b'{"success": true}'
        mock_response.headers = {"Content-Type": "application/json"}
        
        # Support context manager
        mock_urlopen.return_value.__enter__.return_value = mock_response
        
        response = client.fetch("http://example.com")
        
        assert response.ok is True
        assert response.status == 200
        assert response.body == {"success": True}
        assert response.paymentRequirement is None

def test_fetch_payment_required_no_retry():
    manager = MagicMock()
    config = X402ClientConfig("0xwallet", "agent-1", manager, retryWithPayment=False)
    client = X402Client(config)

    with patch("urllib.request.urlopen") as mock_urlopen:
        headers = {
            "Payment-Required": json.dumps({
                "network": "monad",
                "currency": "MON",
                "amount": 0.1,
                "recipient": "0xrecipient"
            })
        }
        mock_urlopen.side_effect = MockHTTPError(402, headers)
        
        response = client.fetch("http://example.com")
        
        assert response.ok is False
        assert response.status == 402
        assert response.paymentRequirement is not None
        assert response.paymentRequirement.amount == 0.1
        assert response.paymentRequirement.recipient == "0xrecipient"
        assert response.paymentRequirement.currency == "MON"

def test_fetch_payment_required_with_retry():
    manager = MagicMock()
    manager.execute_payment_with_session_key.return_value = {
        "success": True,
        "txHash": "0xtxhash123"
    }
    
    config = X402ClientConfig("0xwallet", "agent-1", manager, retryWithPayment=True)
    client = X402Client(config)

    with patch("urllib.request.urlopen") as mock_urlopen:
        headers = {
            "Payment-Required": json.dumps({
                "network": "monad",
                "currency": "MON",
                "amount": 0.1,
                "recipient": "0xrecipient"
            })
        }
        
        # First call fails with 402
        mock_error = MockHTTPError(402, headers)
        
        # Second call succeeds
        mock_success = MagicMock()
        mock_success.status = 200
        mock_success.read.return_value = b'{"data": "secret"}'
        mock_success.headers = {"Content-Type": "application/json"}
        
        # Setup side effect
        mock_urlopen.side_effect = [
            mock_error,
            MagicMock(__enter__=MagicMock(return_value=mock_success))
        ]
        
        response = client.fetch("http://example.com")
        
        assert response.ok is True
        assert response.status == 200
        assert response.body == {"data": "secret"}
        
        # Check if manager was called to pay
        manager.execute_payment_with_session_key.assert_called_once()
        args, kwargs = manager.execute_payment_with_session_key.call_args
        assert args[1] == "0xwallet"
        assert args[2]["amount"] == 0.1
        assert args[2]["recipient"] == "0xrecipient"
        
        # Check if second request has the header
        assert mock_urlopen.call_count == 2
