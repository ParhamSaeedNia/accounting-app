import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './transactions.entity';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import {
  TransactionFilterDto,
  SortOrder,
  SortField,
} from './dto/request/transaction-filter.dto';
import { NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const buildTransactionDocument = (dto: Record<string, unknown>) => {
    const transactionDoc = {
      _id: 'transaction1',
      ...dto,
      save: jest.fn(),
    };

    transactionDoc.save.mockResolvedValue(transactionDoc);
    return transactionDoc;
  };

  const mockTransactionModel = Object.assign(jest.fn(), {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  });

  beforeEach(async () => {
    mockTransactionModel.mockImplementation((dto: Record<string, unknown>) =>
      buildTransactionDocument(dto),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and calculate tax and net amounts', async () => {
      const createTransactionDto: CreateTransactionDto = {
        name: 'Student Payment',
        amount: 1000,
        type: TransactionType.INCOME,
        tags: ['student-payment'],
        transactionDate: '2024-01-15T10:00:00Z',
        taxRate: 0.1,
      };

      const result = await service.create(createTransactionDto);

      expect(mockTransactionModel).toHaveBeenCalledWith(
        expect.objectContaining({
          taxAmount: 100,
          netAmount: 900,
          transactionDate: new Date(createTransactionDto.transactionDate),
        }),
      );

      const transactionInstance = mockTransactionModel.mock.results[0]
        ?.value as { save: jest.Mock };
      expect(transactionInstance.save).toHaveBeenCalled();
      expect(result.taxAmount).toBe(100);
      expect(result.netAmount).toBe(900);
    });

    it('should handle zero tax rate', async () => {
      const createTransactionDto: CreateTransactionDto = {
        name: 'Student Payment',
        amount: 1000,
        type: TransactionType.INCOME,
        transactionDate: '2024-01-15T10:00:00Z',
        taxRate: 0,
      };

      const result = await service.create(createTransactionDto);

      expect(mockTransactionModel).toHaveBeenCalledWith(
        expect.objectContaining({
          taxAmount: 0,
          netAmount: 1000,
        }),
      );

      const transactionInstance = mockTransactionModel.mock.results[0]
        ?.value as { save: jest.Mock };
      expect(transactionInstance.save).toHaveBeenCalled();
      expect(result.taxAmount).toBe(0);
      expect(result.netAmount).toBe(1000);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [
        {
          _id: 'transaction1',
          name: 'Student Payment',
          amount: 1000,
        },
      ];

      mockTransactionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransactions),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionModel.find).toHaveBeenCalled();
    });
  });

  describe('findWithFilters', () => {
    it('should filter by type', async () => {
      const filters: TransactionFilterDto = {
        type: TransactionType.INCOME,
      };

      const mockTransactions = [
        {
          _id: 'transaction1',
          type: 'income',
          amount: 1000,
        },
      ];

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockTransactions),
      });

      const result = await service.findWithFilters(filters);

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionModel.find).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'income' }),
      );
    });

    it('should filter by tags', async () => {
      const filters: TransactionFilterDto = {
        tags: ['student-payment', 'subscription'],
      };

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findWithFilters(filters);

      expect(mockTransactionModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: { $in: ['student-payment', 'subscription'] },
        }),
      );
    });

    it('should filter by date range', async () => {
      const filters: TransactionFilterDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findWithFilters(filters);

      expect(mockTransactionModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionDate: {
            $gte: new Date('2024-01-01'),
            $lte: new Date('2024-01-31'),
          },
        }),
      );
    });

    it('should filter by month', async () => {
      const filters: TransactionFilterDto = {
        month: '2024-01',
      };

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findWithFilters(filters);

      expect(mockTransactionModel.find).toHaveBeenCalled();
    });

    it('should filter by year', async () => {
      const filters: TransactionFilterDto = {
        year: '2024',
      };

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findWithFilters(filters);

      expect(mockTransactionModel.find).toHaveBeenCalled();
    });

    it('should search by name or notes', async () => {
      const filters: TransactionFilterDto = {
        search: 'payment',
      };

      mockTransactionModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findWithFilters(filters);

      expect(mockTransactionModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: [
            { name: { $regex: 'payment', $options: 'i' } },
            { notes: { $regex: 'payment', $options: 'i' } },
          ],
        }),
      );
    });

    it('should apply pagination', async () => {
      const filters: TransactionFilterDto = {
        page: 2,
        limit: 10,
      };

      const chainMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockTransactionModel.find.mockReturnValue(chainMock);

      await service.findWithFilters(filters);

      expect(chainMock.skip).toHaveBeenCalledWith(10);
      expect(chainMock.limit).toHaveBeenCalledWith(10);
    });

    it('should apply sorting', async () => {
      const filters: TransactionFilterDto = {
        sortBy: SortField.AMOUNT,
        sortOrder: SortOrder.DESC,
      };

      const chainMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockTransactionModel.find.mockReturnValue(chainMock);

      await service.findWithFilters(filters);

      expect(chainMock.sort).toHaveBeenCalledWith({ amount: -1 });
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        name: 'Student Payment',
        amount: 1000,
      };

      mockTransactionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransaction),
      });

      const result = await service.findOne(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a transaction and recalculate tax/net amounts', async () => {
      const id = 'transaction1';
      const updateTransactionDto: Partial<CreateTransactionDto> = {
        amount: 1200,
        taxRate: 0.15,
      };

      const existingTransaction = {
        _id: id,
        amount: 1000,
        taxRate: 0.1,
        taxAmount: 100,
        netAmount: 900,
      };

      const mockUpdatedTransaction = {
        _id: id,
        amount: 1200,
        taxRate: 0.15,
        taxAmount: 180,
        netAmount: 1020,
      };

      mockTransactionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingTransaction),
      });

      mockTransactionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedTransaction),
      });

      const result = await service.update(id, updateTransactionDto);

      expect(result).toBeDefined();
      expect(mockTransactionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          taxAmount: 180,
          netAmount: 1020,
        }),
        { new: true },
      );
    });

    it('should update without recalculating if amount and taxRate unchanged', async () => {
      const id = 'transaction1';
      const updateTransactionDto: Partial<CreateTransactionDto> = {
        name: 'Updated Name',
      };

      const mockUpdatedTransaction = {
        _id: id,
        name: 'Updated Name',
      };

      mockTransactionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedTransaction),
      });

      const result = await service.update(id, updateTransactionDto);

      expect(result).toEqual(mockUpdatedTransaction);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const id = 'transaction1';
      mockTransactionModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove(id);

      expect(mockTransactionModel.deleteOne).toHaveBeenCalledWith({ _id: id });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      const id = 'nonexistent';
      mockTransactionModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Transaction not found');
    });
  });

  describe('exclude', () => {
    it('should exclude a transaction', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        status: 'excluded',
      };

      mockTransactionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransaction),
      });

      const result = await service.exclude(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { status: 'excluded' },
        { new: true },
      );
    });
  });

  describe('activate', () => {
    it('should activate a transaction', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        status: 'active',
      };

      mockTransactionModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransaction),
      });

      const result = await service.activate(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { status: 'active' },
        { new: true },
      );
    });
  });

  describe('getSummary', () => {
    it('should return transaction summary', async () => {
      const filters: Partial<TransactionFilterDto> = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockTransactions = [
        {
          type: TransactionType.INCOME,
          netAmount: 5000,
          taxAmount: 500,
          tags: ['subscription'],
        },
        {
          type: TransactionType.INCOME,
          netAmount: 3000,
          taxAmount: 300,
          tags: ['session'],
        },
        {
          type: TransactionType.EXPENSE,
          amount: 2000,
          tags: ['infrastructure'],
        },
      ];

      mockTransactionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransactions),
      });

      const result = await service.getSummary(filters);

      expect(result).toEqual({
        totalIncome: 8000,
        totalExpenses: 2000,
        totalTax: 800,
        grossProfit: 6000,
        expensesByCategory: { infrastructure: 2000 },
        incomeByCategory: { subscription: 5000, session: 3000 },
      });
    });

    it('should return zero values when no transactions', async () => {
      mockTransactionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getSummary();

      expect(result).toEqual({
        totalIncome: 0,
        totalExpenses: 0,
        totalTax: 0,
        grossProfit: 0,
        expensesByCategory: {},
        incomeByCategory: {},
      });
    });
  });
});
