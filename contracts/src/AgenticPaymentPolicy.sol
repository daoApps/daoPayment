// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgenticPaymentPolicy
 * @dev Smart contract for storing agent payment policies on-chain with whitelist support
 */
contract AgenticPaymentPolicy is Ownable {
    struct Policy {
        bytes32 id;
        uint256 maxDailySpend;
        uint256 requireApprovalAbove;
        address[] allowedRecipients;
        address[] allowedTokens;
        string[] allowedCategories;
        string[] blockedMethods;
        bool enabled;
    }

    struct Budget {
        uint256 dailyLimit;
        uint256 weeklyLimit;
        uint256 spentToday;
        uint256 spentThisWeek;
        uint256 lastUpdateTimestamp;
        uint256 lastDailyResetTimestamp;
    }

    struct Whitelist {
        bytes32 id;
        mapping(address => bool) recipients;
        mapping(address => bool) tokens;
        mapping(string => bool) categories;
        mapping(string => bool) methods;
        address[] recipientList;
        bool enabled;
    }

    mapping(bytes32 => Policy) public policies;
    mapping(address => Budget) public budgets;
    mapping(bytes32 => Whitelist) public whitelists;
    bytes32[] public policyList;
    bytes32[] public whitelistList;

    event PolicyCreated(bytes32 indexed id);
    event PolicyUpdated(bytes32 indexed id);
    event PolicyDisabled(bytes32 indexed id);
    event BudgetUpdated(address indexed wallet);
    event WhitelistCreated(bytes32 indexed id);
    event WhitelistUpdated(bytes32 indexed id);
    event WhitelistDisabled(bytes32 indexed id);
    event RecipientAdded(bytes32 indexed whitelistId, address recipient);
    event RecipientRemoved(bytes32 indexed whitelistId, address recipient);

    constructor() Ownable() {}

    /**
     * @dev Set a complete policy
     */
    function setPolicy(
        bytes32 policyId,
        uint256 maxDailySpend,
        uint256 requireApprovalAbove,
        address[] calldata allowedRecipients,
        address[] calldata allowedTokens,
        string[] calldata allowedCategories,
        string[] calldata blockedMethods
    ) external onlyOwner {
        Policy storage policy = policies[policyId];
        policy.id = policyId;
        policy.maxDailySpend = maxDailySpend;
        policy.requireApprovalAbove = requireApprovalAbove;
        policy.allowedRecipients = allowedRecipients;
        policy.allowedTokens = allowedTokens;
        policy.allowedCategories = allowedCategories;
        policy.blockedMethods = blockedMethods;
        policy.enabled = true;

        if (policyList.length == 0 || !policies[policyId].enabled) {
            policyList.push(policyId);
        }

        emit PolicyCreated(policyId);
    }

    /**
     * @dev Disable a policy
     */
    function disablePolicy(bytes32 policyId) external onlyOwner {
        policies[policyId].enabled = false;
        emit PolicyDisabled(policyId);
    }

    /**
     * @dev Get policy details
     */
    function getPolicy(bytes32 policyId) external view returns (
        uint256 maxDailySpend,
        uint256 requireApprovalAbove,
        address[] memory allowedRecipients,
        address[] memory allowedTokens,
        string[] memory allowedCategories,
        string[] memory blockedMethods,
        bool enabled
    ) {
        Policy storage policy = policies[policyId];
        return (
            policy.maxDailySpend,
            policy.requireApprovalAbove,
            policy.allowedRecipients,
            policy.allowedTokens,
            policy.allowedCategories,
            policy.blockedMethods,
            policy.enabled
        );
    }

    /**
     * @dev Set budget for a wallet
     */
    function setBudget(
        address wallet,
        uint256 dailyLimit,
        uint256 weeklyLimit
    ) external onlyOwner {
        Budget storage budget = budgets[wallet];
        budget.dailyLimit = dailyLimit;
        budget.weeklyLimit = weeklyLimit;
        budget.spentToday = 0;
        budget.spentThisWeek = 0;
        budget.lastUpdateTimestamp = block.timestamp;
        budget.lastDailyResetTimestamp = block.timestamp;
        emit BudgetUpdated(wallet);
    }

    /**
     * @dev Get budget details
     */
    function getBudget(address wallet) external view returns (
        uint256 dailyLimit,
        uint256 weeklyLimit,
        uint256 spentToday,
        uint256 spentThisWeek
    ) {
        Budget storage budget = budgets[wallet];
        return (
            budget.dailyLimit,
            budget.weeklyLimit,
            budget.spentToday,
            budget.spentThisWeek
        );
    }

    /**
     * @dev Record a spend (called after payment)
     */
    function recordSpend(address wallet, uint256 amount) external onlyOwner {
        Budget storage budget = budgets[wallet];
        if (block.timestamp >= budget.lastDailyResetTimestamp + 86400) {
            budget.spentToday = 0;
            budget.lastDailyResetTimestamp = block.timestamp;
        }
        unchecked {
            budget.spentToday += amount;
            budget.spentThisWeek += amount;
        }
        budget.lastUpdateTimestamp = block.timestamp;
    }

    /**
     * @dev Reset daily spending (should be called once per day)
     */
    function resetDailySpend(address wallet) external onlyOwner {
        budgets[wallet].spentToday = 0;
        budgets[wallet].lastDailyResetTimestamp = block.timestamp;
        emit BudgetUpdated(wallet);
    }

    /**
     * @dev Create a new whitelist
     */
    function createWhitelist(bytes32 id) external onlyOwner {
        Whitelist storage wl = whitelists[id];
        wl.id = id;
        wl.enabled = true;
        whitelistList.push(id);
        emit WhitelistCreated(id);
    }

    /**
     * @dev Add recipients to whitelist
     */
    function addRecipients(bytes32 whitelistId, address[] calldata recipients) external onlyOwner {
        Whitelist storage wl = whitelists[whitelistId];
        for (uint256 i = 0; i < recipients.length; i++) {
            if (!wl.recipients[recipients[i]]) {
                wl.recipientList.push(recipients[i]);
            }
            wl.recipients[recipients[i]] = true;
            emit RecipientAdded(whitelistId, recipients[i]);
        }
        emit WhitelistUpdated(whitelistId);
    }

    /**
     * @dev Remove recipient from whitelist
     */
    function removeRecipient(bytes32 whitelistId, address recipient) external onlyOwner {
        Whitelist storage wl = whitelists[whitelistId];
        wl.recipients[recipient] = false;
        // Note: We keep it in recipientList for historical tracking
        emit RecipientRemoved(whitelistId, recipient);
        emit WhitelistUpdated(whitelistId);
    }

    /**
     * @dev Check if recipient is whitelisted
     */
    function isRecipientAllowed(bytes32 whitelistId, address recipient) public view returns (bool) {
        return whitelists[whitelistId].enabled && whitelists[whitelistId].recipients[recipient];
    }

    /**
     * @dev Check if token is whitelisted
     */
    function isTokenAllowed(bytes32 whitelistId, address token) public view returns (bool) {
        return whitelists[whitelistId].enabled && whitelists[whitelistId].tokens[token];
    }

    /**
     * @dev Check if category is whitelisted
     */
    function isCategoryAllowed(bytes32 whitelistId, string calldata category) public view returns (bool) {
        return whitelists[whitelistId].enabled && whitelists[whitelistId].categories[category];
    }

    /**
     * @dev Disable a whitelist
     */
    function disableWhitelist(bytes32 whitelistId) external onlyOwner {
        whitelists[whitelistId].enabled = false;
        emit WhitelistDisabled(whitelistId);
    }

    /**
     * @dev Get all recipient addresses in a whitelist
     */
    function getWhitelistRecipients(bytes32 whitelistId) external view returns (address[] memory) {
        return whitelists[whitelistId].recipientList;
    }

    /**
     * @dev Get all policy IDs
     */
    function getAllPolicies() external view returns (bytes32[] memory) {
        return policyList;
    }

    /**
     * @dev Get all whitelist IDs
     */
    function getAllWhitelists() external view returns (bytes32[] memory) {
        return whitelistList;
    }

    /**
     * @dev Count policies
     */
    function policyCount() external view returns (uint256) {
        return policyList.length;
    }

    /**
     * @dev Count whitelists
     */
    function whitelistCount() external view returns (uint256) {
        return whitelistList.length;
    }
}
