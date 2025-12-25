import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../transactions/transactions.entity';
import { Session } from '../sessions/sessions.entity';
import { Teacher } from '../teachers/teachers.entity';
import { Package } from '../packages/packages.entity';
import { DashboardResponseDto } from './dto/response/dashboard-response.dto';
import { TransactionFilterDto } from '../transactions/dto/request/transaction-filter.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Package.name) private packageModel: Model<Package>,
  ) {}
  //---------------------------------------------
  async getDashboard(
    filters?: Partial<TransactionFilterDto>,
  ): Promise<DashboardResponseDto> {
    // Get date range for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Override with filter dates if provided
    const periodStart = filters?.startDate
      ? new Date(filters.startDate)
      : startOfMonth;
    const periodEnd = filters?.endDate ? new Date(filters.endDate) : endOfMonth;

    // Get active packages count
    const activeSessionPackages = await this.getActiveSessionPackages(
      periodStart,
      periodEnd,
    );
    const activeSubscriptionPackages = await this.getActiveSubscriptionPackages(
      periodStart,
      periodEnd,
    );

    // Get transaction summary
    const transactionSummary = await this.getTransactionSummary(
      periodStart,
      periodEnd,
      filters,
    );

    // Calculate teacher salaries
    const totalTeacherSalaries = await this.calculateTeacherSalaries(
      periodStart,
      periodEnd,
    );

    // Calculate net profit
    const netProfit = transactionSummary.grossProfit - totalTeacherSalaries;

    return {
      activeSessionPackages,
      activeSubscriptionPackages,
      totalIncome: transactionSummary.totalIncome,
      totalExpenses: transactionSummary.totalExpenses,
      grossProfit: transactionSummary.grossProfit,
      totalTeacherSalaries,
      netProfit,
      totalTax: transactionSummary.totalTax,
      expensesByCategory: transactionSummary.expensesByCategory,
      incomeByCategory: transactionSummary.incomeByCategory,
      periodStart,
      periodEnd,
    };
  }
  //---------------------------------------------
  private async getActiveSessionPackages(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // Count unique packages that have confirmed sessions in the period
    const uniquePackages = await this.sessionModel.distinct('packageId', {
      sessionDate: { $gte: startDate, $lte: endDate },
      isConfirmed: true,
    });
    return uniquePackages.length;
  }
  //---------------------------------------------
  private async getActiveSubscriptionPackages(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // This would typically involve checking subscription transactions
    // For now, we'll count income transactions tagged as 'subscription'
    const subscriptionTransactions = await this.transactionModel.countDocuments(
      {
        type: 'income',
        tags: { $in: ['subscription', 'subscription-package'] },
        transactionDate: { $gte: startDate, $lte: endDate },
        status: 'active',
      },
    );
    return subscriptionTransactions;
  }
  //---------------------------------------------
  private async getTransactionSummary(
    startDate: Date,
    endDate: Date,
    filters?: Partial<TransactionFilterDto>,
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    totalTax: number;
    grossProfit: number;
    expensesByCategory: Record<string, number>;
    incomeByCategory: Record<string, number>;
  }> {
    const query: Record<string, any> = {
      status: 'active',
      transactionDate: { $gte: startDate, $lte: endDate },
    };

    // Apply additional filters
    if (filters?.type) query.type = filters.type as 'income' | 'expense';
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    const transactions = await this.transactionModel.find(query).exec();

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalTax = 0;
    const expensesByCategory: Record<string, number> = {};
    const incomeByCategory: Record<string, number> = {};

    for (const transaction of transactions) {
      if (transaction.type === ('income' as any)) {
        totalIncome += transaction.netAmount;
        totalTax += transaction.taxAmount;

        // Group by tags for income categories
        transaction.tags.forEach((tag) => {
          incomeByCategory[tag] =
            (incomeByCategory[tag] || 0) + transaction.netAmount;
        });
      } else {
        totalExpenses += transaction.amount;

        // Group by tags for expense categories
        transaction.tags.forEach((tag) => {
          expensesByCategory[tag] =
            (expensesByCategory[tag] || 0) + transaction.amount;
        });
      }
    }

    return {
      totalIncome,
      totalExpenses,
      totalTax,
      grossProfit: totalIncome - totalExpenses,
      expensesByCategory,
      incomeByCategory,
    };
  }
  //---------------------------------------------
  private async calculateTeacherSalaries(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // Get all confirmed sessions in the period
    const sessions = await this.sessionModel
      .find({
        sessionDate: { $gte: startDate, $lte: endDate },
        isConfirmed: true,
      })
      .populate('teacherId')
      .exec();

    let totalSalaries = 0;

    for (const session of sessions) {
      if (
        session.teacherId &&
        typeof session.teacherId === 'object' &&
        'hourlyRate' in session.teacherId
      ) {
        const teacher = session.teacherId as { hourlyRate: number };
        const sessionPay = teacher.hourlyRate * session.duration;
        totalSalaries += sessionPay;
      }
    }

    return totalSalaries;
  }
  //---------------------------------------------
  async getTeacherSalaryBreakdown(
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      teacherId: string;
      teacherName: string;
      totalHours: number;
      totalPay: number;
    }>
  > {
    const sessions = await this.sessionModel
      .find({
        sessionDate: { $gte: startDate, $lte: endDate },
        isConfirmed: true,
      })
      .populate('teacherId')
      .exec();

    const teacherBreakdown: Record<
      string,
      {
        teacherId: string;
        teacherName: string;
        totalHours: number;
        totalPay: number;
      }
    > = {};

    for (const session of sessions) {
      if (
        session.teacherId &&
        typeof session.teacherId === 'object' &&
        'hourlyRate' in session.teacherId
      ) {
        const teacher = session.teacherId as unknown as {
          _id: { toString(): string };
          name: string;
          hourlyRate: number;
        };
        const teacherId = teacher._id.toString();

        if (!teacherBreakdown[teacherId]) {
          teacherBreakdown[teacherId] = {
            teacherId,
            teacherName: teacher.name,
            totalHours: 0,
            totalPay: 0,
          };
        }

        teacherBreakdown[teacherId].totalHours += session.duration;
        teacherBreakdown[teacherId].totalPay +=
          teacher.hourlyRate * session.duration;
      }
    }

    return Object.values(teacherBreakdown);
  }
}
