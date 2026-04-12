// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/AgenticPaymentPolicy.sol";

contract AgenticPaymentPolicyTest is Test {
    AgenticPaymentPolicy public policy;
    address public constant TEST_WALLET = address(0x1234);
    bytes32 public constant TEST_POLICY_ID = keccak256("test-policy");

    function setUp() public {
        policy = new AgenticPaymentPolicy();
    }

    function test_InitializationSetsCorrectResetTimestamp() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 0);
    }

    function test_NoAutomaticResetWithin24Hours() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 100 ether);

        vm.warp(block.timestamp + 43200);
        policy.recordSpend(TEST_WALLET, 200 ether);
        
        (,, spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 300 ether);
    }

    function test_AutomaticResetAfter24Hours() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        (,, uint256 spentTodayBefore,) = policy.getBudget(TEST_WALLET);
        assertEq(spentTodayBefore, 100 ether);

        vm.warp(block.timestamp + 86401);
        policy.recordSpend(TEST_WALLET, 150 ether);
        
        (,, uint256 spentTodayAfter,) = policy.getBudget(TEST_WALLET);
        assertEq(spentTodayAfter, 150 ether);
    }

    function test_AutomaticResetAtExact24Hours() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        vm.warp(block.timestamp + 86400);
        policy.recordSpend(TEST_WALLET, 150 ether);
        
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 150 ether);
    }

    function test_ManualResetUpdatesTimestamp() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 500 ether);
        
        vm.warp(block.timestamp + 3600);
        policy.resetDailySpend(TEST_WALLET);
        
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 0);

        vm.warp(block.timestamp + 43200);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        (,, spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 100 ether);
    }

    function test_ManualResetCompatibilityWithAutomaticReset() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 200 ether);
        
        policy.resetDailySpend(TEST_WALLET);
        
        vm.warp(block.timestamp + 86399);
        policy.recordSpend(TEST_WALLET, 300 ether);
        
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 300 ether);

        vm.warp(block.timestamp + 2);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        (,, spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 100 ether);
    }

    function test_TimeManipulationSafetyDoesNotResetEarly() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 100 ether);
        
        vm.warp(block.timestamp + 86399);
        policy.recordSpend(TEST_WALLET, 50 ether);
        
        (,, uint256 spentToday,) = policy.getBudget(TEST_WALLET);
        assertEq(spentToday, 150 ether);
    }

    function test_WeeklySpendNotAffectedByAutoReset() public {
        policy.setBudget(TEST_WALLET, 1000 ether, 7000 ether);
        policy.recordSpend(TEST_WALLET, 100 ether);
        policy.recordSpend(TEST_WALLET, 200 ether);
        
        vm.warp(block.timestamp + 86401);
        policy.recordSpend(TEST_WALLET, 150 ether);
        
        (uint256 dailyLimit, uint256 weeklyLimit, uint256 spentToday, uint256 spentThisWeek) = policy.getBudget(TEST_WALLET);
        assertEq(dailyLimit, 1000 ether);
        assertEq(weeklyLimit, 7000 ether);
        assertEq(spentToday, 150 ether);
        assertEq(spentThisWeek, 450 ether);
    }
}
