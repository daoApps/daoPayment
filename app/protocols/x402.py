import json
import urllib.request
from urllib.error import HTTPError
from typing import Optional, Dict, Any, Union

class PaymentRequirement:
    def __init__(self, network: str, currency: str, amount: float, recipient: str, instructionUrl: Optional[str] = None):
        self.network = network
        self.currency = currency
        self.amount = amount
        self.recipient = recipient
        self.instructionUrl = instructionUrl

class X402Response:
    def __init__(self, ok: bool, status: int, paymentRequirement: Optional[PaymentRequirement] = None, body: Any = None, headers: Any = None):
        self.ok = ok
        self.status = status
        self.paymentRequirement = paymentRequirement
        self.body = body
        self.headers = headers

class X402ClientConfig:
    def __init__(self, walletAddress: str, agentId: str, manager: Any, retryWithPayment: bool = True, sessionKeyId: Optional[str] = None):
        self.walletAddress = walletAddress
        self.agentId = agentId
        self.manager = manager
        self.retryWithPayment = retryWithPayment
        self.sessionKeyId = sessionKeyId

class X402Client:
    def __init__(self, config: X402ClientConfig):
        self.config = config

    def fetch(self, url: str, options: Optional[Dict[str, Any]] = None) -> X402Response:
        if options is None:
            options = {}
            
        method = options.get("method", "GET")
        headers = options.get("headers", {})
        data = options.get("body")
        
        if isinstance(data, dict):
            data = json.dumps(data).encode("utf-8")
            if "Content-Type" not in headers:
                headers["Content-Type"] = "application/json"
        elif isinstance(data, str):
            data = data.encode("utf-8")
            
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req) as response:
                return X402Response(
                    ok=True,
                    status=response.status,
                    body=self._parse_response(response),
                    headers=response.headers
                )
        except HTTPError as e:
            if e.code != 402:
                return X402Response(
                    ok=False,
                    status=e.code,
                    body=self._parse_response(e),
                    headers=e.headers
                )
            
            payment_requirement = self._parse_payment_requirement(e)
            if not payment_requirement:
                return X402Response(
                    ok=False,
                    status=e.code
                )
                
            if not self.config.retryWithPayment:
                return X402Response(
                    ok=False,
                    status=402,
                    paymentRequirement=payment_requirement
                )
                
            return self._auto_pay_and_retry(url, options, payment_requirement)

    def _parse_payment_requirement(self, response: HTTPError) -> Optional[PaymentRequirement]:
        header = response.headers.get("Payment-Required")
        if not header:
            return None
            
        try:
            data = json.loads(header)
            return PaymentRequirement(
                network=data.get("network", ""),
                currency=data.get("currency", ""),
                amount=float(data.get("amount", 0)),
                recipient=data.get("recipient", ""),
                instructionUrl=data.get("instructionUrl")
            )
        except json.JSONDecodeError:
            parts = header.split(" ")
            if len(parts) >= 4:
                return PaymentRequirement(
                    network=parts[0],
                    currency=parts[1],
                    amount=float(parts[2]),
                    recipient=parts[3]
                )
            return None

    def _parse_response(self, response) -> Any:
        body = response.read()
        content_type = response.headers.get("Content-Type", "")
        if "application/json" in content_type:
            try:
                return json.loads(body.decode("utf-8"))
            except json.JSONDecodeError:
                pass
        return body.decode("utf-8", errors="ignore")

    def _auto_pay_and_retry(self, url: str, options: Dict[str, Any], requirement: PaymentRequirement) -> X402Response:
        try:
            payment_result = self.config.manager.execute_payment_with_session_key(
                self.config.sessionKeyId or "",
                self.config.walletAddress,
                {
                    "agentId": self.config.agentId,
                    "walletAddress": self.config.walletAddress,
                    "recipient": requirement.recipient,
                    "amount": requirement.amount,
                    "token": requirement.currency,
                    "category": "api",
                    "purpose": f"x402 payment for {url}",
                    "permissionId": "default"
                }
            )
            
            if not payment_result.get("success") or not payment_result.get("txHash"):
                return X402Response(
                    ok=False,
                    status=402,
                    paymentRequirement=requirement
                )
                
            new_options = options.copy()
            new_headers = options.get("headers", {}).copy()
            new_headers["Payment-Receipt"] = json.dumps({
                "txHash": payment_result.get("txHash"),
                "amount": requirement.amount,
                "currency": requirement.currency
            })
            new_options["headers"] = new_headers
            
            return self.fetch(url, new_options)
            
        except Exception as e:
            print(f"Auto payment failed: {e}")
            return X402Response(
                ok=False,
                status=402,
                paymentRequirement=requirement
            )

    @staticmethod
    def is_payment_required(response: X402Response) -> bool:
        return response.status == 402 and response.paymentRequirement is not None
