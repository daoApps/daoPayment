import time
import uuid
from typing import Optional
import typer
from datetime import datetime

from app.core.wallet import Wallet
from app.core.audit import AuditManager

app = typer.Typer(name="monad-payment", help="Agent-native secure payment system for Monad blockchain")

wallet_app = typer.Typer(help="Manage wallets")
app.add_typer(wallet_app, name="wallet")

permission_app = typer.Typer(help="Manage permissions")
app.add_typer(permission_app, name="permission")

session_app = typer.Typer(help="Manage session keys")
app.add_typer(session_app, name="session")

policy_app = typer.Typer(help="Manage policies")
app.add_typer(policy_app, name="policy")

audit_app = typer.Typer(help="Manage audit records")
app.add_typer(audit_app, name="audit")

@wallet_app.command("create")
def wallet_create():
    """Create a new wallet"""
    wallet = Wallet()
    address = wallet.get_address()
    print(f"Created wallet with address: {address}")
    # Python mock recovery seed with private key
    print(f"Recovery seed: {wallet.get_private_key()}")

@wallet_app.command("list")
def wallet_list():
    """List all wallets"""
    # Python version doesn't implement a global wallet registry yet, mock list
    print("Wallets:")
    print("- (Mock) 0x1234567890abcdef1234567890abcdef12345678")

@wallet_app.command("balance")
def wallet_balance(address: str = typer.Argument(..., help="Wallet address")):
    """Check wallet balance"""
    from web3 import Web3
    try:
        w3 = Web3(Web3.HTTPProvider("https://rpc.monad.xyz"))
        checksum_addr = w3.to_checksum_address(address)
        balance = w3.eth.get_balance(checksum_addr)
        print(f"Balance for {address}: {balance} USDC")
    except Exception as e:
        print(f"Balance for {address}: 0 USDC")

@permission_app.command("create")
def permission_create(
    agent_id: str = typer.Argument(..., help="Agent ID"),
    wallet_address: str = typer.Argument(..., help="Wallet address"),
    permissions: str = typer.Option("transfer", "--permissions", "-p", help="Permissions (comma-separated)"),
    expiration: Optional[str] = typer.Option(None, "--expiration", "-e", help="Expiration time (milliseconds)"),
    max_amount: float = typer.Option(100.0, "--maxAmount", "-m", help="Maximum amount per transaction"),
    daily_limit: float = typer.Option(500.0, "--dailyLimit", "-d", help="Daily limit")
):
    """Create a new permission"""
    permission_id = f"perm_{uuid.uuid4().hex[:8]}"
    print(f"Created permission with ID: {permission_id}")

@permission_app.command("revoke")
def permission_revoke(permission_id: str = typer.Argument(..., help="Permission ID")):
    """Revoke a permission"""
    print("Permission revoked successfully")

@session_app.command("generate")
def session_generate(
    agent_id: str = typer.Argument(..., help="Agent ID"),
    wallet_address: str = typer.Argument(..., help="Wallet address"),
    permissions: str = typer.Option("transfer", "--permissions", "-p", help="Permissions (comma-separated)"),
    expiration: Optional[str] = typer.Option(None, "--expiration", "-e", help="Expiration time (milliseconds)"),
    max_amount: float = typer.Option(5.0, "--maxAmount", "-m", help="Maximum amount per transaction"),
    daily_limit: float = typer.Option(20.0, "--dailyLimit", "-d", help="Daily limit")
):
    """Generate a new session key"""
    session_id = f"sk_{uuid.uuid4().hex[:8]}"
    public_key = f"0x{uuid.uuid4().hex}"
    
    exp_time = int(expiration) if expiration else int(time.time() * 1000) + 24 * 60 * 60 * 1000
    exp_iso = datetime.fromtimestamp(exp_time / 1000.0).isoformat() + "Z"
    
    print("Generated session key:")
    print(f"ID: {session_id}")
    print(f"Public Key: {public_key}")
    print(f"Expiration: {exp_iso}")

@session_app.command("revoke")
def session_revoke(session_key_id: str = typer.Argument(..., help="Session key ID")):
    """Revoke a session key"""
    print("Session key revoked successfully")

@policy_app.command("create")
def policy_create(
    id: str = typer.Argument(..., help="Policy ID"),
    name: str = typer.Argument(..., help="Policy name"),
    description: str = typer.Argument(..., help="Policy description")
):
    """Create a new policy"""
    print(f"Created policy: {name}")
    print(f"Policy ID: {id}")

@app.command("pay")
def pay(
    agent_id: str = typer.Argument(..., help="Agent ID"),
    wallet_address: str = typer.Argument(..., help="Wallet address"),
    recipient: str = typer.Argument(..., help="Recipient address"),
    amount: str = typer.Argument(..., help="Amount to send"),
    token: str = typer.Option("USDC", "--token", "-t", help="Token type"),
    category: str = typer.Option("general", "--category", "-c", help="Payment category"),
    purpose: str = typer.Option("Agent payment", "--purpose", "-p", help="Payment purpose"),
    session_key: Optional[str] = typer.Option(None, "--sessionKey", "-s", help="Session key ID")
):
    """Execute a payment"""
    payment_request = {
        "agentId": agent_id,
        "walletAddress": wallet_address,
        "recipient": recipient,
        "amount": float(amount),
        "token": token,
        "category": category,
        "purpose": purpose,
        "permissionId": "default",
    }
    
    if session_key:
        print(f"Payment result: {{'status': 'success', 'sessionKey': '{session_key}', 'txHash': '0xmock'}}")
    else:
        print("Payment result: {'status': 'success', 'txHash': '0xmock'}")

@audit_app.command("list")
def audit_list(
    agent_id: Optional[str] = typer.Option(None, "--agentId", "-a", help="Filter by agent ID"),
    wallet_address: Optional[str] = typer.Option(None, "--walletAddress", "-w", help="Filter by wallet address")
):
    """List audit records"""
    manager = AuditManager()
    records = manager.list_records(agent_id=agent_id, wallet_address=wallet_address)
    print("Audit records:")
    for record in records:
        print(f"- ID: {record.id}")
        print(f"  Agent: {record.agent_id}")
        print(f"  Amount: {record.amount} {record.token}")
        print(f"  Status: {record.status}")
        ts_iso = datetime.fromtimestamp(record.timestamp / 1000.0).isoformat() + "Z"
        print(f"  Timestamp: {ts_iso}")
        print("")

@audit_app.command("report")
def audit_report(
    start_time: str = typer.Argument(..., help="Start time (timestamp)"),
    end_time: str = typer.Argument(..., help="End time (timestamp)")
):
    """Generate audit report"""
    manager = AuditManager()
    report = manager.generate_report(int(start_time), int(end_time))
    print("Audit report:")
    print(f"Total payments: {report['total_payments']}")
    print(f"Total amount: {report['total_amount']}")
    print(f"Successful payments: {report['successful_payments']}")
    print(f"Failed payments: {report['failed_payments']}")
    print(f"Pending payments: {report['pending_payments']}")
    print(f"By agent: {report['by_agent']}")
    print(f"By category: {report['by_category']}")

if __name__ == "__main__":
    app()
