import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DashboardService } from './dashboard.service';
import { Transaction } from '../transactions/transactions.entity';
import { Session } from '../sessions/sessions.entity';
import { Teacher } from '../teachers/teachers.entity';
import { Package } from '../packages/packages.entity';
import { TransactionFilterDto } from '../transactions/dto/request/transaction-filter.dto';

describe('DashboardService', () => {
  let service: DashboardService;
  let transactionModel: Model<Transaction>;
  let sessionModel: Model<Session>;
  let teacherModel: Model<Teacher>;
  let packageModel: Model<Package>;

  const mockTransactionModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  const mockSessionModel = {
    distinct: jest.fn(),
    find: jest.fn(),
  };

  const mockTeacherModel = {};

  const mockPackageModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
        {
          provide: getModelToken(Session.name),
          useValue: mockSessionModel,
        },
        {
          provide: getModelToken(Teacher.name),
          useValue: mockTeacherModel,
        },
        {
          provide: getModelToken(Package.name),
          useValue: mockPackageModel,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    transactionModel = module.get<Model<Transaction>>(
      getModelToken(Transaction.name),
    );
    sessionModel = module.get<Model<Session>>(getModelToken(Session.name));
    teacherModel = module.get<Model<Teacher>>(getModelToken(Teacher.name));
    packageModel = module.get<Model<Package>>(getModelToken(Package.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard summary with all metrics', async () => {
      const filters: Partial<TransactionFilterDto> = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      // Mock active session packages
      mockSessionModel.distinct.mockResolvedValue(['pkg1', 'pkg2', 'pkg3']);

      // Mock active subscription packages
      mockTransactionModel.countDocuments.mockResolvedValueOnce(2);

      // Mock transactions
      const mockTransactions = [
        {
          type: 'income',
          netAmount: 5000,
          taxAmount: 500,
          amount: 5500,
          tags: ['subscription'],
        },
        {
          type: 'income',
          netAmount: 3000,
          taxAmount: 300,
          amount: 3300,
          tags: ['session'],
        },
        {
          type: 'expense',
          amount: 2000,
          tags: ['infrastructure'],
        },
      ];

      mockTransactionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransactions),
      });

      // Mock teacher salaries calculation
      const mockSessions = [
        {
          teacherId: { hourlyRate: 50, _id: { toString: () => 'teacher1' } },
          duration: 2,
        },
        {
          teacherId: { hourlyRate: 60, _id: { toString: () => 'teacher2' } },
          duration: 3,
        },
      ];

      mockSessionModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockSessions),
        }),
      });

      const result = await service.getDashboard(filters);

      expect(result).toHaveProperty('activeSessionPackages', 3);
      expect(result).toHaveProperty('activeSubscriptionPackages', 2);
      expect(result).toHaveProperty('totalIncome', 8000);
      expect(result).toHaveProperty('totalExpenses', 2000);
      expect(result).toHaveProperty('grossProfit', 6000);
      expect(result).toHaveProperty('totalTeacherSalaries', 280); // 50*2 + 60*3
      expect(result).toHaveProperty('netProfit', 5720);
      expect(result).toHaveProperty('totalTax', 800);
    });

    it('should use default month dates when filters are not provided', async () => {
      mockSessionModel.distinct.mockResolvedValue([]);
      mockTransactionModel.countDocuments.mockResolvedValue(0);
      mockTransactionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      mockSessionModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.getDashboard();

      expect(result).toBeDefined();
      expect(result.periodStart).toBeInstanceOf(Date);
      expect(result.periodEnd).toBeInstanceOf(Date);
    });
  });

  describe('getTeacherSalaryBreakdown', () => {
    it('should return teacher salary breakdown', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockSessions = [
        {
          teacherId: {
            _id: { toString: () => 'teacher1' },
            name: 'John Doe',
            hourlyRate: 50,
          },
          duration: 5,
        },
        {
          teacherId: {
            _id: { toString: () => 'teacher1' },
            name: 'John Doe',
            hourlyRate: 50,
          },
          duration: 3,
        },
        {
          teacherId: {
            _id: { toString: () => 'teacher2' },
            name: 'Jane Smith',
            hourlyRate: 60,
          },
          duration: 4,
        },
      ];

      mockSessionModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockSessions),
        }),
      });

      const result = await service.getTeacherSalaryBreakdown(
        startDate,
        endDate,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        teacherId: 'teacher1',
        teacherName: 'John Doe',
        totalHours: 8,
        totalPay: 400,
      });
      expect(result[1]).toMatchObject({
        teacherId: 'teacher2',
        teacherName: 'Jane Smith',
        totalHours: 4,
        totalPay: 240,
      });
    });

    it('should return empty array when no sessions found', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      mockSessionModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.getTeacherSalaryBreakdown(
        startDate,
        endDate,
      );

      expect(result).toEqual([]);
    });
  });
});
