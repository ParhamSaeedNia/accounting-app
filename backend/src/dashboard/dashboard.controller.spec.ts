import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TransactionFilterDto } from '../transactions/dto/request/transaction-filter.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockDashboardService = {
    getDashboard: jest.fn(),
    getTeacherSalaryBreakdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
      const filters: TransactionFilterDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const mockDashboardData = {
        activeSessionPackages: 5,
        activeSubscriptionPackages: 3,
        totalIncome: 10000,
        totalExpenses: 2000,
        grossProfit: 8000,
        totalTeacherSalaries: 3000,
        netProfit: 5000,
        totalTax: 1000,
        expensesByCategory: { infrastructure: 1000, marketing: 1000 },
        incomeByCategory: { subscription: 10000 },
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31'),
      };

      mockDashboardService.getDashboard.mockResolvedValue(mockDashboardData);

      const result = await controller.getDashboard(filters);

      expect(result).toEqual(mockDashboardData);
      expect(service.getDashboard).toHaveBeenCalledWith(filters);
      expect(service.getDashboard).toHaveBeenCalledTimes(1);
    });

    it('should handle empty filters', async () => {
      const filters = {};
      const mockDashboardData = {
        activeSessionPackages: 0,
        activeSubscriptionPackages: 0,
        totalIncome: 0,
        totalExpenses: 0,
        grossProfit: 0,
        totalTeacherSalaries: 0,
        netProfit: 0,
        totalTax: 0,
        expensesByCategory: {},
        incomeByCategory: {},
        periodStart: new Date(),
        periodEnd: new Date(),
      };

      mockDashboardService.getDashboard.mockResolvedValue(mockDashboardData);

      const result = await controller.getDashboard(filters);

      expect(result).toEqual(mockDashboardData);
      expect(service.getDashboard).toHaveBeenCalledWith(filters);
    });
  });

  describe('getTeacherSalaryBreakdown', () => {
    it('should return teacher salary breakdown with date range', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockBreakdown = [
        {
          teacherId: 'teacher1',
          teacherName: 'John Doe',
          totalHours: 10,
          totalPay: 500,
        },
        {
          teacherId: 'teacher2',
          teacherName: 'Jane Smith',
          totalHours: 8,
          totalPay: 400,
        },
      ];

      mockDashboardService.getTeacherSalaryBreakdown.mockResolvedValue(
        mockBreakdown,
      );

      const result = await controller.getTeacherSalaryBreakdown(
        startDate,
        endDate,
      );

      expect(result).toEqual(mockBreakdown);
      expect(service.getTeacherSalaryBreakdown).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
    });

    it('should use default dates when not provided', async () => {
      const now = new Date();
      const expectedStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const expectedEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      const mockBreakdown = [];

      mockDashboardService.getTeacherSalaryBreakdown.mockResolvedValue(
        mockBreakdown,
      );

      await controller.getTeacherSalaryBreakdown(undefined, undefined);

      expect(service.getTeacherSalaryBreakdown).toHaveBeenCalledWith(
        expectedStart,
        expectedEnd,
      );
    });
  });
});
