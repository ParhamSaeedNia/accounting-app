import { api } from './client';
import type {
  Package,
  Teacher,
  Session,
  Transaction,
  DashboardData,
  TeacherSalary,
  ProfitCalculation,
  TransactionFilters,
} from '../types';

// Dashboard API
export const dashboardApi = {
  getDashboard: (filters?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const query = params.toString();
    return api.get<DashboardData>(`/dashboard${query ? `?${query}` : ''}`);
  },
  
  getTeacherSalaries: (filters?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const query = params.toString();
    return api.get<TeacherSalary[]>(`/dashboard/teacher-salaries${query ? `?${query}` : ''}`);
  },
};

// Packages API
export const packagesApi = {
  getAll: () => api.get<Package[]>('/packages'),
  getOne: (id: string) => api.get<Package>(`/packages/${id}`),
  create: (data: Omit<Package, '_id'>) => api.post<Package>('/packages', data),
  update: (id: string, data: Partial<Package>) => api.put<Package>(`/packages/${id}`, data),
  delete: (id: string) => api.delete<void>(`/packages/${id}`),
  calculateProfit: (id: string) => api.get<ProfitCalculation>(`/packages/${id}/calculate`),
};

// Teachers API
export const teachersApi = {
  getAll: () => api.get<Teacher[]>('/teachers'),
  getActive: () => api.get<Teacher[]>('/teachers/active'),
  getOne: (id: string) => api.get<Teacher>(`/teachers/${id}`),
  create: (data: Omit<Teacher, '_id'>) => api.post<Teacher>('/teachers', data),
  update: (id: string, data: Partial<Teacher>) => api.put<Teacher>(`/teachers/${id}`, data),
  delete: (id: string) => api.delete<void>(`/teachers/${id}`),
  activate: (id: string) => api.patch<Teacher>(`/teachers/${id}/activate`),
  deactivate: (id: string) => api.patch<Teacher>(`/teachers/${id}/deactivate`),
};

// Sessions API
export const sessionsApi = {
  getAll: () => api.get<Session[]>('/sessions'),
  getConfirmed: () => api.get<Session[]>('/sessions/confirmed'),
  getByTeacher: (teacherId: string) => api.get<Session[]>(`/sessions/by-teacher/${teacherId}`),
  getByPackage: (packageId: string) => api.get<Session[]>(`/sessions/by-package/${packageId}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get<Session[]>(`/sessions/by-date-range?startDate=${startDate}&endDate=${endDate}`),
  getOne: (id: string) => api.get<Session>(`/sessions/${id}`),
  create: (data: Omit<Session, '_id' | 'teacher' | 'package'>) => 
    api.post<Session>('/sessions', data),
  update: (id: string, data: Partial<Session>) => api.put<Session>(`/sessions/${id}`, data),
  delete: (id: string) => api.delete<void>(`/sessions/${id}`),
  confirm: (id: string) => api.patch<Session>(`/sessions/${id}/confirm`),
  unconfirm: (id: string) => api.patch<Session>(`/sessions/${id}/unconfirm`),
};

// Transactions API
export const transactionsApi = {
  getAll: (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const query = params.toString();
    return api.get<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
  },
  getSummary: (filters?: Partial<TransactionFilters>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get<{
      totalIncome: number;
      totalExpenses: number;
      totalTax: number;
      grossProfit: number;
      expensesByCategory: Record<string, number>;
      incomeByCategory: Record<string, number>;
    }>(`/transactions/summary${query ? `?${query}` : ''}`);
  },
  getOne: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: Omit<Transaction, '_id' | 'taxAmount' | 'netAmount'>) => 
    api.post<Transaction>('/transactions', data),
  update: (id: string, data: Partial<Transaction>) => 
    api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete<void>(`/transactions/${id}`),
  exclude: (id: string) => api.patch<Transaction>(`/transactions/${id}/exclude`),
  activate: (id: string) => api.patch<Transaction>(`/transactions/${id}/activate`),
};

