import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BarChart3, X } from 'lucide-react';
import { packagesApi } from '../api';
import type { Package, ProfitCalculation } from '../types';
import Card, { CardHeader } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { PageLoading } from '../components/ui/Loading';
import { useToast } from '../hooks/useToast';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

interface ExpenseRow {
  key: string;
  value: number;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [profitModalOpen, setProfitModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [profitData, setProfitData] = useState<ProfitCalculation | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [expenses, setExpenses] = useState<ExpenseRow[]>([{ key: '', value: 0 }]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packagesApi.getAll();
      setPackages(data);
    } catch (error) {
      showToast('Failed to load packages', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPackageName(pkg.packageName);
      setPrice(pkg.price.toString());
      setExpenses(
        Object.entries(pkg.expenses).map(([key, value]) => ({ key, value }))
      );
      if (Object.keys(pkg.expenses).length === 0) {
        setExpenses([{ key: '', value: 0 }]);
      }
    } else {
      setEditingPackage(null);
      setPackageName('');
      setPrice('');
      setExpenses([{ key: '', value: 0 }]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPackage(null);
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { key: '', value: 0 }]);
  };

  const removeExpenseRow = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpenseRow = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...expenses];
    if (field === 'key') {
      updated[index].key = value;
    } else {
      updated[index].value = parseFloat(value) || 0;
    }
    setExpenses(updated);
  };

  const handleSave = async () => {
    if (!packageName || !price) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const expensesObj: Record<string, number> = {};
    expenses.forEach((e) => {
      if (e.key.trim()) {
        expensesObj[e.key.trim()] = e.value;
      }
    });

    const data = {
      packageName,
      price: parseFloat(price),
      expenses: expensesObj,
    };

    try {
      setSaving(true);
      if (editingPackage) {
        await packagesApi.update(editingPackage._id, data);
        showToast('Package updated successfully');
      } else {
        await packagesApi.create(data as Package);
        showToast('Package created successfully');
      }
      closeModal();
      loadPackages();
    } catch (error) {
      showToast('Failed to save package', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await packagesApi.delete(id);
      showToast('Package deleted successfully');
      loadPackages();
    } catch (error) {
      showToast('Failed to delete package', 'error');
      console.error(error);
    }
  };

  const viewProfit = async (id: string) => {
    try {
      const data = await packagesApi.calculateProfit(id);
      setProfitData(data);
      setProfitModalOpen(true);
    } catch (error) {
      showToast('Failed to calculate profit', 'error');
      console.error(error);
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Packages</h1>
          <p className="text-dark-400 mt-1">Manage your service packages</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader title="All Packages" subtitle={`${packages.length} packages`} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Expenses</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length > 0 ? (
              packages.map((pkg) => {
                const totalExpenses = Object.values(pkg.expenses).reduce((a, b) => a + b, 0);
                const profit = pkg.price - totalExpenses;
                
                return (
                  <TableRow key={pkg._id}>
                    <TableCell className="font-medium text-white">{pkg.packageName}</TableCell>
                    <TableCell className="font-mono">{formatMoney(pkg.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(pkg.expenses).slice(0, 2).map(([key, value]) => (
                          <span key={key} className="text-xs bg-dark-700 px-2 py-1 rounded">
                            {key}: {formatMoney(value)}
                          </span>
                        ))}
                        {Object.keys(pkg.expenses).length > 2 && (
                          <span className="text-xs text-dark-500">
                            +{Object.keys(pkg.expenses).length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatMoney(profit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewProfit(pkg._id)}
                          className="p-2 text-dark-400 hover:text-indigo-400 hover:bg-dark-700 rounded-lg transition-colors"
                          title="View Profit Analysis"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(pkg)}
                          className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableEmpty message="No packages yet. Create your first package!" colSpan={5} />
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingPackage ? 'Edit Package' : 'Add Package'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingPackage ? 'Update' : 'Create'} Package
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Package Name"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="e.g., Premium Package"
          />
          <Input
            label="Price ($)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1000"
          />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">Expenses</label>
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    placeholder="Category (e.g., infrastructure)"
                    value={expense.key}
                    onChange={(e) => updateExpenseRow(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={expense.value || ''}
                    onChange={(e) => updateExpenseRow(index, 'value', e.target.value)}
                    className="w-32"
                  />
                  {expenses.length > 1 && (
                    <button
                      onClick={() => removeExpenseRow(index)}
                      className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addExpenseRow}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Add Expense Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Profit Modal */}
      <Modal
        isOpen={profitModalOpen}
        onClose={() => setProfitModalOpen(false)}
        title="Profit Analysis"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setProfitModalOpen(false)}>Close</Button>
        }
      >
        {profitData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">{profitData.packageName}</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-dark-800 rounded-xl">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Price</p>
                <p className="text-xl font-mono text-emerald-400">{formatMoney(profitData.price)}</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Total Expenses</p>
                <p className="text-xl font-mono text-rose-400">{formatMoney(profitData.totalExpenses)}</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl">
                <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Profit</p>
                <p className={`text-xl font-mono ${profitData.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatMoney(profitData.profit)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-dark-300 mb-3">Expense Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(profitData.expenses).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <span className="text-dark-300 capitalize">{category}</span>
                    <span className="font-mono text-rose-400">{formatMoney(amount)}</span>
                  </div>
                ))}
                {Object.keys(profitData.expenses).length === 0 && (
                  <p className="text-center text-dark-500 py-4">No expenses</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

