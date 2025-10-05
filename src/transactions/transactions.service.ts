import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import {
  TransactionFilterDto,
  SortOrder,
} from './dto/request/transaction-filter.dto';
import { Transaction } from './transactions.entity';
import { TransactionResponseDto } from './dto/response/transaction-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // Calculate tax and net amounts
    const taxAmount =
      createTransactionDto.amount * (createTransactionDto.taxRate || 0);
    const netAmount = createTransactionDto.amount - taxAmount;

    const transactionData = {
      ...createTransactionDto,
      taxAmount,
      netAmount,
      transactionDate: new Date(createTransactionDto.transactionDate),
    };

    const newTransaction = new this.transactionModel(transactionData);
    return (await newTransaction.save()) as TransactionResponseDto;
  }

  async findAll(): Promise<TransactionResponseDto[]> {
    return (await this.transactionModel
      .find()
      .exec()) as TransactionResponseDto[];
  }

  async findWithFilters(
    filters: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    const query: Record<string, any> = {};

    // Type filter
    if (filters.type) {
      query.type = filters.type as 'income' | 'expense';
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status as 'active' | 'excluded';
    }

    // Date filters
    if (filters.startDate || filters.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (filters.startDate) {
        dateFilter.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.$lte = new Date(filters.endDate);
      }
      query.transactionDate = dateFilter;
    }

    // Month filter
    if (filters.month) {
      const [year, month] = filters.month.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(
        parseInt(year),
        parseInt(month),
        0,
        23,
        59,
        59,
        999,
      );
      query.transactionDate = { $gte: startDate, $lte: endDate };
    }

    // Year filter
    if (filters.year) {
      const year = parseInt(filters.year);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      query.transactionDate = { $gte: startDate, $lte: endDate };
    }

    // Search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    if (filters.sortBy) {
      sort[filters.sortBy] = filters.sortOrder === SortOrder.DESC ? -1 : 1;
    } else {
      sort.transactionDate = -1; // Default sort by date descending
    }

    // Pagination
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;

    return (await this.transactionModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()) as TransactionResponseDto[];
  }

  async findOne(id: string): Promise<TransactionResponseDto | null> {
    return (await this.transactionModel
      .findById(id)
      .exec()) as TransactionResponseDto | null;
  }

  async update(
    id: string,
    updateTransactionDto: Partial<CreateTransactionDto>,
  ): Promise<TransactionResponseDto | null> {
    // Recalculate tax and net amounts if amount or tax rate changed
    if (
      updateTransactionDto.amount !== undefined ||
      updateTransactionDto.taxRate !== undefined
    ) {
      const existing = await this.findOne(id);
      if (existing) {
        const amount = updateTransactionDto.amount ?? existing.amount;
        const taxRate = updateTransactionDto.taxRate ?? existing.taxRate;
        const taxAmount = amount * taxRate;
        const netAmount = amount - taxAmount;

        updateTransactionDto = {
          ...updateTransactionDto,
          taxAmount,
          netAmount,
        } as Partial<CreateTransactionDto> & {
          taxAmount: number;
          netAmount: number;
        };
      }
    }

    return (await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec()) as TransactionResponseDto | null;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Transaction not found');
    }
  }

  async exclude(id: string): Promise<TransactionResponseDto | null> {
    return (await this.transactionModel
      .findByIdAndUpdate(id, { status: 'excluded' }, { new: true })
      .exec()) as TransactionResponseDto | null;
  }

  async activate(id: string): Promise<TransactionResponseDto | null> {
    return (await this.transactionModel
      .findByIdAndUpdate(id, { status: 'active' }, { new: true })
      .exec()) as TransactionResponseDto | null;
  }

  async getSummary(filters?: Partial<TransactionFilterDto>): Promise<{
    totalIncome: number;
    totalExpenses: number;
    totalTax: number;
    grossProfit: number;
    expensesByCategory: Record<string, number>;
    incomeByCategory: Record<string, number>;
  }> {
    const query: Record<string, any> = { status: 'active' };

    // Apply same filters as findWithFilters but without pagination
    if (filters?.type) query.type = filters.type as 'income' | 'expense';
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters?.startDate || filters?.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (filters.startDate) {
        dateFilter.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.$lte = new Date(filters.endDate);
      }
      query.transactionDate = dateFilter;
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
}
