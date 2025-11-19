import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { TransactionFilterDto } from './dto/request/transaction-filter.dto';
import { TransactionType } from './transactions.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findWithFilters: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    exclude: jest.fn(),
    activate: jest.fn(),
    remove: jest.fn(),
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        name: 'Student Payment',
        amount: 1000,
        type: TransactionType.INCOME,
        tags: ['student-payment'],
        transactionDate: '2024-01-15T10:00:00Z',
        taxRate: 0.1,
      };

      const mockTransaction = {
        _id: 'transaction1',
        ...createTransactionDto,
        taxAmount: 100,
        netAmount: 900,
        status: 'active',
      };

      mockTransactionsService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(createTransactionDto);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return transactions with filters', async () => {
      const filters: TransactionFilterDto = {
        type: TransactionType.INCOME,
        tags: ['student-payment'],
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockTransactions = [
        {
          _id: 'transaction1',
          name: 'Student Payment',
          type: 'income',
          amount: 1000,
        },
      ];

      mockTransactionsService.findWithFilters.mockResolvedValue(
        mockTransactions,
      );

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionsService.findWithFilters).toHaveBeenCalledWith(
        filters,
      );
    });
  });

  describe('getSummary', () => {
    it('should return transaction summary', async () => {
      const filters: TransactionFilterDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockSummary = {
        totalIncome: 5000,
        totalExpenses: 2000,
        totalTax: 500,
        grossProfit: 3000,
        expensesByCategory: { infrastructure: 2000 },
        incomeByCategory: { subscription: 5000 },
      };

      mockTransactionsService.getSummary.mockResolvedValue(mockSummary);

      const result = await controller.getSummary(filters);

      expect(result).toEqual(mockSummary);
      expect(mockTransactionsService.getSummary).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        name: 'Student Payment',
        amount: 1000,
        type: 'income',
      };

      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = 'transaction1';
      const updateTransactionDto: CreateTransactionDto = {
        name: 'Updated Payment',
        amount: 1200,
        type: TransactionType.INCOME,
        transactionDate: '2024-01-15T10:00:00Z',
        taxRate: 0.1,
      };

      const mockUpdatedTransaction = {
        _id: id,
        ...updateTransactionDto,
        taxAmount: 120,
        netAmount: 1080,
      };

      mockTransactionsService.update.mockResolvedValue(mockUpdatedTransaction);

      const result = await controller.update(id, updateTransactionDto);

      expect(result).toEqual(mockUpdatedTransaction);
      expect(mockTransactionsService.update).toHaveBeenCalledWith(
        id,
        updateTransactionDto,
      );
    });
  });

  describe('exclude', () => {
    it('should exclude a transaction', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        name: 'Student Payment',
        status: 'excluded',
      };

      mockTransactionsService.exclude.mockResolvedValue(mockTransaction);

      const result = await controller.exclude(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.exclude).toHaveBeenCalledWith(id);
    });
  });

  describe('activate', () => {
    it('should activate a transaction', async () => {
      const id = 'transaction1';
      const mockTransaction = {
        _id: id,
        name: 'Student Payment',
        status: 'active',
      };

      mockTransactionsService.activate.mockResolvedValue(mockTransaction);

      const result = await controller.activate(id);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionsService.activate).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const id = 'transaction1';
      mockTransactionsService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockTransactionsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
