import * as fs from 'fs';
import * as path from 'path';

interface Budget {
  walletAddress: string;
  dailySpent: number;
  dailyLimit: number;
  weeklySpent: number;
  weeklyLimit: number;
  lastResetDate: number;
  lastWeekResetDate: number;
}

class BudgetManager {
  private budgets: Map<string, Budget> = new Map();
  private storagePath: string;

  constructor(storagePath: string = './budgets') {
    this.storagePath = storagePath;
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    this.loadBudgets();
    this.resetDailyBudgets();
    this.resetWeeklyBudgets();
  }

  private loadBudgets(): void {
    const files = fs.readdirSync(this.storagePath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const budgetPath = path.join(this.storagePath, file);
        try {
          const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
          this.budgets.set(budget.walletAddress, budget);
        } catch (error) {
          console.error(`Error loading budget from ${file}:`, error);
        }
      }
    }
  }

  private saveBudget(budget: Budget): void {
    const budgetPath = path.join(this.storagePath, `${budget.walletAddress}.json`);
    fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));
  }

  private resetDailyBudgets(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    for (const [address, budget] of this.budgets.entries()) {
      if (budget.lastResetDate < today) {
        budget.dailySpent = 0;
        budget.lastResetDate = today;
        this.saveBudget(budget);
      }
    }
  }

  private resetWeeklyBudgets(): void {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();

    for (const [address, budget] of this.budgets.entries()) {
      if (budget.lastWeekResetDate < weekStart) {
        budget.weeklySpent = 0;
        budget.lastWeekResetDate = weekStart;
        this.saveBudget(budget);
      }
    }
  }

  setBudget(
    walletAddress: string,
    dailyLimit: number,
    weeklyLimit: number
  ): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();

    const budget: Budget = {
      walletAddress,
      dailySpent: 0,
      dailyLimit,
      weeklySpent: 0,
      weeklyLimit,
      lastResetDate: today,
      lastWeekResetDate: weekStart
    };

    this.budgets.set(walletAddress, budget);
    this.saveBudget(budget);
  }

  checkBudget(walletAddress: string, amount: number): {
    allowed: boolean;
    reason?: string;
  } {
    let budget = this.budgets.get(walletAddress);
    if (!budget) {
      // Try to load from file if not in memory
      const budgetPath = path.join(this.storagePath, `${walletAddress}.json`);
      if (fs.existsSync(budgetPath)) {
        try {
          const loadedBudget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
          this.budgets.set(walletAddress, loadedBudget);
          budget = loadedBudget;
        } catch (error) {
          console.error(`Error loading budget from ${budgetPath}:`, error);
          return { allowed: false, reason: 'Budget not set' };
        }
      } else {
        return { allowed: false, reason: 'Budget not set' };
      }
    }

    this.resetDailyBudgets();
    this.resetWeeklyBudgets();

    if (budget!.dailySpent + amount > budget!.dailyLimit) {
      return { 
        allowed: false, 
        reason: `Daily budget exceeded. Spent: ${budget!.dailySpent}, Limit: ${budget!.dailyLimit}` 
      };
    }

    if (budget!.weeklySpent + amount > budget!.weeklyLimit) {
      return { 
        allowed: false, 
        reason: `Weekly budget exceeded. Spent: ${budget!.weeklySpent}, Limit: ${budget!.weeklyLimit}` 
      };
    }

    return { allowed: true };
  }

  updateSpent(walletAddress: string, amount: number): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      budget.dailySpent += amount;
      budget.weeklySpent += amount;
      this.saveBudget(budget);
    }
  }

  getBudget(walletAddress: string): Budget | undefined {
    return this.budgets.get(walletAddress);
  }

  resetBudget(walletAddress: string): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();

      budget.dailySpent = 0;
      budget.weeklySpent = 0;
      budget.lastResetDate = today;
      budget.lastWeekResetDate = weekStart;

      this.saveBudget(budget);
    }
  }
}

export default BudgetManager;