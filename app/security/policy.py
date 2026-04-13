from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ValidationResult(BaseModel):
    allowed: bool
    requires_human_approval: bool
    reason: Optional[str] = None

class SecurityPolicy(BaseModel):
    max_single_amount: float
    daily_limit: float
    weekly_limit: float
    require_human_approval_above: float
    allowed_recipients: List[str] = Field(default_factory=list)
    allowed_tokens: List[str] = Field(default_factory=list)
    allowed_methods: List[str] = Field(default_factory=list)
    blocked_categories: List[str] = Field(default_factory=list)
    allowed_categories: List[str] = Field(default_factory=list)

class PolicyManager:
    def __init__(self):
        self.policies: Dict[str, SecurityPolicy] = {}

    def create_policy(
        self,
        policy_id: str,
        max_single_amount: float,
        daily_limit: float,
        weekly_limit: float,
        require_human_approval_above: float,
        allowed_recipients: List[str] = None,
        allowed_tokens: List[str] = None,
        allowed_methods: List[str] = None,
        blocked_categories: List[str] = None,
        allowed_categories: List[str] = None
    ) -> None:
        policy = SecurityPolicy(
            max_single_amount=max_single_amount,
            daily_limit=daily_limit,
            weekly_limit=weekly_limit,
            require_human_approval_above=require_human_approval_above,
            allowed_recipients=allowed_recipients or [],
            allowed_tokens=allowed_tokens or [],
            allowed_methods=allowed_methods or [],
            blocked_categories=blocked_categories or [],
            allowed_categories=allowed_categories or []
        )
        self.policies[policy_id] = policy

    def get_policy(self, policy_id: str) -> Optional[SecurityPolicy]:
        return self.policies.get(policy_id)

    def update_policy(self, policy_id: str, updates: Dict[str, Any]) -> bool:
        if policy_id not in self.policies:
            return False
        
        policy = self.policies[policy_id]
        updated_data = policy.model_dump()
        updated_data.update(updates)
        self.policies[policy_id] = SecurityPolicy(**updated_data)
        return True

    def delete_policy(self, policy_id: str) -> bool:
        if policy_id in self.policies:
            del self.policies[policy_id]
            return True
        return False

    def list_policies(self) -> List[str]:
        return list(self.policies.keys())

    def validate_transaction(
        self,
        policy_id: str,
        amount: float,
        recipient: str,
        token: str,
        method: str,
        category: str
    ) -> ValidationResult:
        policy = self.policies.get(policy_id)
        if not policy:
            return ValidationResult(
                allowed=False,
                reason="Policy not found",
                requires_human_approval=False
            )

        if amount > policy.max_single_amount:
            return ValidationResult(
                allowed=False,
                reason=f"Amount exceeds maximum single amount of {policy.max_single_amount}",
                requires_human_approval=False
            )

        if amount > policy.require_human_approval_above:
            return ValidationResult(
                allowed=True,
                requires_human_approval=True
            )

        if policy.allowed_recipients and recipient not in policy.allowed_recipients:
            return ValidationResult(
                allowed=False,
                reason="Recipient not in allowed list",
                requires_human_approval=False
            )

        if policy.allowed_tokens and token not in policy.allowed_tokens:
            return ValidationResult(
                allowed=False,
                reason="Token not in allowed list",
                requires_human_approval=False
            )

        if policy.allowed_methods and method not in policy.allowed_methods:
            return ValidationResult(
                allowed=False,
                reason="Method not allowed",
                requires_human_approval=False
            )

        if category in policy.blocked_categories:
            return ValidationResult(
                allowed=False,
                reason="Category is blocked",
                requires_human_approval=False
            )

        if policy.allowed_categories and category not in policy.allowed_categories:
            return ValidationResult(
                allowed=False,
                reason="Category not in allowed list",
                requires_human_approval=False
            )

        return ValidationResult(
            allowed=True,
            requires_human_approval=False
        )
