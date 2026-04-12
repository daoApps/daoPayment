import * as fs from 'fs';
import * as path from 'path';

interface Budget {
  walletAddress: string;
  dailySpent: number;
  dailyLimit: number;
  weeklySpent: number;
  weeklyLimit: number;
  monthlySpent: number;
  monthlyLimit: number;
  yearlySpent: number;
  yearlyLimit: number;
  lastResetDate: number;
  lastWeekResetDate: number;
  lastMonthResetDate: number;
  lastYearResetDate: number;
  createdAt: number;
  updatedAt: number;
  alerts: {
    daily: number; // 百分比，例如 80 表示达到 80% 时警报
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

interface BudgetHistory {
  walletAddress: string;
  timestamp: number;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  balanceAfter: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

class BudgetManager {
  private budgets: Map<string, Budget> = new Map();
  private budgetHistory: Map<string, BudgetHistory[]> = new Map(); // 按钱包地址存储历史记录
  private storagePath: string;
  private historyPath: string;

  constructor(storagePath: string = './budgets') {
    this.storagePath = storagePath;
    this.historyPath = path.join(storagePath, 'history');
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    if (!fs.existsSync(this.historyPath)) {
      fs.mkdirSync(this.historyPath, { recursive: true });
    }
    this.loadBudgets();
    this.loadBudgetHistory();
    this.resetDailyBudgets();
    this.resetWeeklyBudgets();
    this.resetMonthlyBudgets();
    this.resetYearlyBudgets();
  }

  private loadBudgetHistory(): void {
    const files = fs.readdirSync(this.historyPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const historyPath = path.join(this.historyPath, file);
        try {
          const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
          const walletAddress = path.basename(file, '.json');
          this.budgetHistory.set(walletAddress, history);
        } catch (error) {
          console.error(`Error loading budget history from ${file}:`, error);
        }
      }
    }
  }

  private saveBudgetHistory(walletAddress: string): void {
    const history = this.budgetHistory.get(walletAddress) || [];
    const historyPath = path.join(this.historyPath, `${walletAddress}.json`);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }

  private addToBudgetHistory(
    walletAddress: string,
    amount: number,
    type: 'debit' | 'credit',
    description: string
  ): void {
    const budget = this.budgets.get(walletAddress);
    if (!budget) return;

    const history: BudgetHistory = {
      walletAddress,
      timestamp: Date.now(),
      amount,
      type,
      description,
      balanceAfter: {
        daily: budget.dailySpent,
        weekly: budget.weeklySpent,
        monthly: budget.monthlySpent,
        yearly: budget.yearlySpent,
      },
    };

    const historyList = this.budgetHistory.get(walletAddress) || [];
    historyList.push(history);
    // 限制历史记录数量，只保留最近1000条
    if (historyList.length > 1000) {
      historyList.splice(0, historyList.length - 1000);
    }
    this.budgetHistory.set(walletAddress, historyList);
    this.saveBudgetHistory(walletAddress);
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
    const budgetPath = path.join(
      this.storagePath,
      `${budget.walletAddress}.json`
    );
    fs.writeFileSync(budgetPath, JSON.stringify(budget, null, 2));
  }

  private resetDailyBudgets(): void {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    for (const [_address, budget] of this.budgets.entries()) {
      if (budget.lastResetDate < today) {
        budget.dailySpent = 0;
        budget.lastResetDate = today;
        this.saveBudget(budget);
      }
    }
  }

  private resetWeeklyBudgets(): void {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    ).getTime();

    for (const [_address, budget] of this.budgets.entries()) {
      if (budget.lastWeekResetDate < weekStart) {
        budget.weeklySpent = 0;
        budget.lastWeekResetDate = weekStart;
        this.saveBudget(budget);
      }
    }
  }

  private resetMonthlyBudgets(): void {
    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    for (const [_address, budget] of this.budgets.entries()) {
      if (budget.lastMonthResetDate < monthStart) {
        budget.monthlySpent = 0;
        budget.lastMonthResetDate = monthStart;
        this.saveBudget(budget);
      }
    }
  }

  private resetYearlyBudgets(): void {
    const now = new Date();
    const yearStart = new Date(
      now.getFullYear(),
      0,
      1
    ).getTime();

    for (const [_address, budget] of this.budgets.entries()) {
      if (budget.lastYearResetDate < yearStart) {
        budget.yearlySpent = 0;
        budget.lastYearResetDate = yearStart;
        this.saveBudget(budget);
      }
    }
  }

  setBudget(
    walletAddress: string,
    dailyLimit: number,
    weeklyLimit: number,
    monthlyLimit: number = weeklyLimit * 4,
    yearlyLimit: number = monthlyLimit * 12,
    alerts: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    } = {
      daily: 80,
      weekly: 80,
      monthly: 80,
      yearly: 80,
    }
  ): void {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    ).getTime();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();
    const yearStart = new Date(
      now.getFullYear(),
      0,
      1
    ).getTime();

    const budget: Budget = {
      walletAddress,
      dailySpent: 0,
      dailyLimit,
      weeklySpent: 0,
      weeklyLimit,
      monthlySpent: 0,
      monthlyLimit,
      yearlySpent: 0,
      yearlyLimit,
      lastResetDate: today,
      lastWeekResetDate: weekStart,
      lastMonthResetDate: monthStart,
      lastYearResetDate: yearStart,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      alerts,
    };

    this.budgets.set(walletAddress, budget);
    this.saveBudget(budget);
  }

  // 更新预算限制
  updateBudgetLimits(
    walletAddress: string,
    limits: Partial<{
      dailyLimit: number;
      weeklyLimit: number;
      monthlyLimit: number;
      yearlyLimit: number;
      alerts: {
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
      };
    }>
  ): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      Object.assign(budget, limits);
      budget.updatedAt = Date.now();
      this.saveBudget(budget);
    }
  }

  checkBudget(
    walletAddress: string,
    amount: number
  ): {
    allowed: boolean;
    reason?: string;
    alerts?: string[];
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
    this.resetMonthlyBudgets();
    this.resetYearlyBudgets();

    const alerts: string[] = [];

    if (budget!.dailySpent + amount > budget!.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily budget exceeded. Spent: ${budget!.dailySpent}, Limit: ${budget!.dailyLimit}`,
      };
    }

    if (budget!.weeklySpent + amount > budget!.weeklyLimit) {
      return {
        allowed: false,
        reason: `Weekly budget exceeded. Spent: ${budget!.weeklySpent}, Limit: ${budget!.weeklyLimit}`,
      };
    }

    if (budget!.monthlySpent + amount > budget!.monthlyLimit) {
      return {
        allowed: false,
        reason: `Monthly budget exceeded. Spent: ${budget!.monthlySpent}, Limit: ${budget!.monthlyLimit}`,
      };
    }

    if (budget!.yearlySpent + amount > budget!.yearlyLimit) {
      return {
        allowed: false,
        reason: `Yearly budget exceeded. Spent: ${budget!.yearlySpent}, Limit: ${budget!.yearlyLimit}`,
      };
    }

    // 检查预算警报
    const dailyPercentage = ((budget!.dailySpent + amount) / budget!.dailyLimit) * 100;
    const weeklyPercentage = ((budget!.weeklySpent + amount) / budget!.weeklyLimit) * 100;
    const monthlyPercentage = ((budget!.monthlySpent + amount) / budget!.monthlyLimit) * 100;
    const yearlyPercentage = ((budget!.yearlySpent + amount) / budget!.yearlyLimit) * 100;

    if (dailyPercentage >= budget!.alerts.daily) {
      alerts.push(`Daily budget alert: ${Math.round(dailyPercentage)}% of limit reached`);
    }

    if (weeklyPercentage >= budget!.alerts.weekly) {
      alerts.push(`Weekly budget alert: ${Math.round(weeklyPercentage)}% of limit reached`);
    }

    if (monthlyPercentage >= budget!.alerts.monthly) {
      alerts.push(`Monthly budget alert: ${Math.round(monthlyPercentage)}% of limit reached`);
    }

    if (yearlyPercentage >= budget!.alerts.yearly) {
      alerts.push(`Yearly budget alert: ${Math.round(yearlyPercentage)}% of limit reached`);
    }

    return { 
      allowed: true,
      alerts: alerts.length > 0 ? alerts : undefined
    };
  }

  updateSpent(walletAddress: string, amount: number, description: string = 'Payment'): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      budget.dailySpent += amount;
      budget.weeklySpent += amount;
      budget.monthlySpent += amount;
      budget.yearlySpent += amount;
      budget.updatedAt = Date.now();
      this.saveBudget(budget);
      // 添加到历史记录
      this.addToBudgetHistory(walletAddress, amount, 'debit', description);
    }
  }

  // 增加预算（用于退款等场景）
  addToBudget(walletAddress: string, amount: number, description: string = 'Refund'): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      budget.dailySpent = Math.max(0, budget.dailySpent - amount);
      budget.weeklySpent = Math.max(0, budget.weeklySpent - amount);
      budget.monthlySpent = Math.max(0, budget.monthlySpent - amount);
      budget.yearlySpent = Math.max(0, budget.yearlySpent - amount);
      budget.updatedAt = Date.now();
      this.saveBudget(budget);
      // 添加到历史记录
      this.addToBudgetHistory(walletAddress, amount, 'credit', description);
    }
  }

  // 获取预算历史记录
  getBudgetHistory(walletAddress: string, limit: number = 100): BudgetHistory[] {
    const history = this.budgetHistory.get(walletAddress) || [];
    return history.slice(-limit).reverse(); // 按时间倒序返回
  }

  // 获取预算分析
  getBudgetAnalysis(walletAddress: string): {
    daily: { spent: number; limit: number; percentage: number };
    weekly: { spent: number; limit: number; percentage: number };
    monthly: { spent: number; limit: number; percentage: number };
    yearly: { spent: number; limit: number; percentage: number };
  } {
    const budget = this.budgets.get(walletAddress);
    if (!budget) {
      return {
        daily: { spent: 0, limit: 0, percentage: 0 },
        weekly: { spent: 0, limit: 0, percentage: 0 },
        monthly: { spent: 0, limit: 0, percentage: 0 },
        yearly: { spent: 0, limit: 0, percentage: 0 },
      };
    }

    return {
      daily: {
        spent: budget.dailySpent,
        limit: budget.dailyLimit,
        percentage: budget.dailyLimit > 0 ? (budget.dailySpent / budget.dailyLimit) * 100 : 0,
      },
      weekly: {
        spent: budget.weeklySpent,
        limit: budget.weeklyLimit,
        percentage: budget.weeklyLimit > 0 ? (budget.weeklySpent / budget.weeklyLimit) * 100 : 0,
      },
      monthly: {
        spent: budget.monthlySpent,
        limit: budget.monthlyLimit,
        percentage: budget.monthlyLimit > 0 ? (budget.monthlySpent / budget.monthlyLimit) * 100 : 0,
      },
      yearly: {
        spent: budget.yearlySpent,
        limit: budget.yearlyLimit,
        percentage: budget.yearlyLimit > 0 ? (budget.yearlySpent / budget.yearlyLimit) * 100 : 0,
      },
    };
  }

  // 重置所有预算
  resetAllBudgets(walletAddress: string): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      ).getTime();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getTime();
      const yearStart = new Date(
        now.getFullYear(),
        0,
        1
      ).getTime();

      budget.dailySpent = 0;
      budget.weeklySpent = 0;
      budget.monthlySpent = 0;
      budget.yearlySpent = 0;
      budget.lastResetDate = today;
      budget.lastWeekResetDate = weekStart;
      budget.lastMonthResetDate = monthStart;
      budget.lastYearResetDate = yearStart;
      budget.updatedAt = Date.now();

      this.saveBudget(budget);
    }
  }

  getBudget(walletAddress: string): Budget | undefined {
    return this.budgets.get(walletAddress);
  }

  resetBudget(walletAddress: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all' = 'all'): void {
    const budget = this.budgets.get(walletAddress);
    if (budget) {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      ).getTime();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).getTime();
      const yearStart = new Date(
        now.getFullYear(),
        0,
        1
      ).getTime();

      if (period === 'daily' || period === 'all') {
        budget.dailySpent = 0;
        budget.lastResetDate = today;
      }

      if (period === 'weekly' || period === 'all') {
        budget.weeklySpent = 0;
        budget.lastWeekResetDate = weekStart;
      }

      if (period === 'monthly' || period === 'all') {
        budget.monthlySpent = 0;
        budget.lastMonthResetDate = monthStart;
      }

      if (period === 'yearly' || period === 'all') {
        budget.yearlySpent = 0;
        budget.lastYearResetDate = yearStart;
      }

      budget.updatedAt = Date.now();
      this.saveBudget(budget);
    }
  }
}

export default BudgetManager;
