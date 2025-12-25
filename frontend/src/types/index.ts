export interface Package {
  _id: string;
  packageName: string;
  price: number;
  expenses: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  hourlyRate: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  _id: string;
  teacherId: string;
  packageId: string;
  sessionDate: string;
  duration: number;
  title?: string;
  notes?: string;
  isConfirmed: boolean;
  teacher?: Teacher;
  package?: Package;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'active' | 'excluded';

export interface Transaction {
  _id: string;
  name: string;
  amount: number;
  type: TransactionType;
  tags: string[];
  notes?: string;
  status: TransactionStatus;
  transactionDate: string;
  taxRate: number;
  taxAmount: number;
  netAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardData {
  activeSessionPackages: number;
  activeSubscriptionPackages: number;
  totalIncome: number;
  totalExpenses: number;
  grossProfit: number;
  totalTeacherSalaries: number;
  netProfit: number;
  totalTax: number;
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  periodStart: string;
  periodEnd: string;
}

export interface TeacherSalary {
  teacherId: string;
  teacherName: string;
  totalHours: number;
  totalPay: number;
}

export interface ProfitCalculation {
  packageName: string;
  price: number;
  expenses: Record<string, number>;
  totalExpenses: number;
  profit: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}
