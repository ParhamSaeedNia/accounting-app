import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  packagesApi,
  teachersApi,
  sessionsApi,
  transactionsApi,
  dashboardApi,
} from './index';
import { api } from './client';

vi.mock('./client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
    }
  },
}));

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('dashboardApi', () => {
    it('getDashboard calls correct endpoint', async () => {
      await dashboardApi.getDashboard();
      expect(api.get).toHaveBeenCalledWith('/dashboard');
    });

    it('getDashboard passes date filters', async () => {
      await dashboardApi.getDashboard({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2024-01-01'),
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('endDate=2024-01-31'),
      );
    });

    it('getTeacherSalaries calls correct endpoint', async () => {
      await dashboardApi.getTeacherSalaries();
      expect(api.get).toHaveBeenCalledWith('/dashboard/teacher-salaries');
    });
  });

  describe('packagesApi', () => {
    it('getAll calls correct endpoint', async () => {
      await packagesApi.getAll();
      expect(api.get).toHaveBeenCalledWith('/packages');
    });

    it('getOne calls correct endpoint', async () => {
      await packagesApi.getOne('123');
      expect(api.get).toHaveBeenCalledWith('/packages/123');
    });

    it('create sends POST with data', async () => {
      const data = { packageName: 'Test', price: 100, expenses: {} };
      await packagesApi.create(data);
      expect(api.post).toHaveBeenCalledWith('/packages', data);
    });

    it('update sends PUT with data', async () => {
      const data = { packageName: 'Updated' };
      await packagesApi.update('123', data);
      expect(api.put).toHaveBeenCalledWith('/packages/123', data);
    });

    it('delete calls correct endpoint', async () => {
      await packagesApi.delete('123');
      expect(api.delete).toHaveBeenCalledWith('/packages/123');
    });

    it('calculateProfit calls correct endpoint', async () => {
      await packagesApi.calculateProfit('123');
      expect(api.get).toHaveBeenCalledWith('/packages/123/calculate');
    });
  });

  describe('teachersApi', () => {
    it('getAll calls correct endpoint', async () => {
      await teachersApi.getAll();
      expect(api.get).toHaveBeenCalledWith('/teachers');
    });

    it('getActive calls correct endpoint', async () => {
      await teachersApi.getActive();
      expect(api.get).toHaveBeenCalledWith('/teachers/active');
    });

    it('activate calls correct endpoint', async () => {
      await teachersApi.activate('123');
      expect(api.patch).toHaveBeenCalledWith('/teachers/123/activate');
    });

    it('deactivate calls correct endpoint', async () => {
      await teachersApi.deactivate('123');
      expect(api.patch).toHaveBeenCalledWith('/teachers/123/deactivate');
    });
  });

  describe('sessionsApi', () => {
    it('getAll calls correct endpoint', async () => {
      await sessionsApi.getAll();
      expect(api.get).toHaveBeenCalledWith('/sessions');
    });

    it('getConfirmed calls correct endpoint', async () => {
      await sessionsApi.getConfirmed();
      expect(api.get).toHaveBeenCalledWith('/sessions/confirmed');
    });

    it('getByTeacher calls correct endpoint', async () => {
      await sessionsApi.getByTeacher('t1');
      expect(api.get).toHaveBeenCalledWith('/sessions/by-teacher/t1');
    });

    it('getByPackage calls correct endpoint', async () => {
      await sessionsApi.getByPackage('p1');
      expect(api.get).toHaveBeenCalledWith('/sessions/by-package/p1');
    });

    it('getByDateRange calls correct endpoint', async () => {
      await sessionsApi.getByDateRange('2024-01-01', '2024-01-31');
      expect(api.get).toHaveBeenCalledWith(
        '/sessions/by-date-range?startDate=2024-01-01&endDate=2024-01-31',
      );
    });

    it('confirm calls correct endpoint', async () => {
      await sessionsApi.confirm('s1');
      expect(api.patch).toHaveBeenCalledWith('/sessions/s1/confirm');
    });

    it('unconfirm calls correct endpoint', async () => {
      await sessionsApi.unconfirm('s1');
      expect(api.patch).toHaveBeenCalledWith('/sessions/s1/unconfirm');
    });
  });

  describe('transactionsApi', () => {
    it('getAll calls correct endpoint without filters', async () => {
      await transactionsApi.getAll();
      expect(api.get).toHaveBeenCalledWith('/transactions');
    });

    it('getAll passes filters as query params', async () => {
      await transactionsApi.getAll({ type: 'income', search: 'payment' });
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('type=income'),
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('search=payment'),
      );
    });

    it('getSummary calls correct endpoint', async () => {
      await transactionsApi.getSummary();
      expect(api.get).toHaveBeenCalledWith('/transactions/summary');
    });

    it('exclude calls correct endpoint', async () => {
      await transactionsApi.exclude('t1');
      expect(api.patch).toHaveBeenCalledWith('/transactions/t1/exclude');
    });

    it('activate calls correct endpoint', async () => {
      await transactionsApi.activate('t1');
      expect(api.patch).toHaveBeenCalledWith('/transactions/t1/activate');
    });
  });
});
