import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Receipt,
  Calculator,
  X,
} from 'lucide-react';
import { dashboardApi } from '../api';
import type { DashboardData, TeacherSalary } from '../types';
import StatCard from '../components/ui/StatCard';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PageLoading } from '../components/ui/Loading';
import { useToast } from '../hooks/useToast';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [salaries, setSalaries] = useState<TeacherSalary[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showToast } = useToast();

  const hasFilters = startDate || endDate;

  const loadData = useCallback(
    async (filters?: { startDate?: string; endDate?: string }) => {
      try {
        setLoading(true);
        const [dashboardData, salariesData] = await Promise.all([
          dashboardApi.getDashboard(filters),
          dashboardApi.getTeacherSalaries(filters),
        ]);
        setDashboard(dashboardData);
        setSalaries(salariesData);
      } catch (error) {
        showToast('Failed to load dashboard data', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  // Load all data on initial mount (no filters)
  useEffect(() => {
    loadData();
  }, [loadData]);

  const applyFilters = () => {
    loadData({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    loadData(); // Load without filters
  };

  if (loading && !dashboard) return <PageLoading />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1 text-sm sm:text-base">Financial overview and key metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-40"
              placeholder="Start date"
            />
            <span className="text-dark-500 hidden sm:inline">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-40"
              placeholder="End date"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={applyFilters} disabled={loading} className="flex-1 sm:flex-none">
              Apply
            </Button>
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} disabled={loading} className="px-3">
                <X className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Total Income"
          value={formatMoney(dashboard?.totalIncome || 0)}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          variant="income"
        />
        <StatCard
          label="Total Expenses"
          value={formatMoney(dashboard?.totalExpenses || 0)}
          icon={<TrendingDown className="w-5 h-5 text-rose-400" />}
          variant="expense"
        />
        <StatCard
          label="Gross Profit"
          value={formatMoney(dashboard?.grossProfit || 0)}
          icon={<DollarSign className="w-5 h-5 text-indigo-400" />}
          variant={(dashboard?.grossProfit || 0) >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          label="Net Profit"
          value={formatMoney(dashboard?.netProfit || 0)}
          icon={<Calculator className="w-5 h-5 text-purple-400" />}
          variant={(dashboard?.netProfit || 0) >= 0 ? 'income' : 'expense'}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Teacher Salaries"
          value={formatMoney(dashboard?.totalTeacherSalaries || 0)}
          icon={<Users className="w-5 h-5 text-blue-400" />}
          variant="expense"
        />
        <StatCard
          label="Total Tax"
          value={formatMoney(dashboard?.totalTax || 0)}
          icon={<Receipt className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          label="Session Packages"
          value={dashboard?.activeSessionPackages || 0}
          icon={<Package className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          label="Subscription Packages"
          value={dashboard?.activeSubscriptionPackages || 0}
          icon={<Package className="w-5 h-5 text-pink-400" />}
        />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income by Category */}
        <Card>
          <CardHeader title="Income by Category" />
          <CardContent>
            {Object.keys(dashboard?.incomeByCategory || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(dashboard?.incomeByCategory || {}).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <span className="text-dark-300 capitalize">{category}</span>
                    <span className="font-mono text-emerald-400">{formatMoney(amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-dark-500 py-8">No income data</p>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader title="Expenses by Category" />
          <CardContent>
            {Object.keys(dashboard?.expensesByCategory || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(dashboard?.expensesByCategory || {}).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <span className="text-dark-300 capitalize">{category}</span>
                    <span className="font-mono text-rose-400">{formatMoney(amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-dark-500 py-8">No expense data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Teacher Salaries */}
      <Card>
        <CardHeader
          title="Teacher Salary Breakdown"
          subtitle={
            hasFilters && dashboard?.periodStart && dashboard?.periodEnd
              ? `${format(new Date(dashboard.periodStart), 'MMM d, yyyy')} - ${format(new Date(dashboard.periodEnd), 'MMM d, yyyy')}`
              : 'All Time'
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead className="text-right">Total Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.length > 0 ? (
              salaries.map((salary) => (
                <TableRow key={salary.teacherId}>
                  <TableCell className="font-medium text-white">{salary.teacherName}</TableCell>
                  <TableCell>{salary.totalHours} hrs</TableCell>
                  <TableCell className="text-right font-mono text-emerald-400">
                    {formatMoney(salary.totalPay)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmpty message="No salary data for this period" colSpan={3} />
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

