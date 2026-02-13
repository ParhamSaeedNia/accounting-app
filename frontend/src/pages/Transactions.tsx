import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Ban, CheckCircle, Search } from 'lucide-react';
import { transactionsApi } from '../api';
import type { Transaction, TransactionFilters } from '../types';
import Card, { CardHeader } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { PageLoading } from '../components/ui/Loading';
import { useToast } from '../hooks/useToast';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const filters: TransactionFilters = {};
      if (filterType) filters.type = filterType as 'income' | 'expense';
      if (filterStatus) filters.status = filterStatus as 'active' | 'excluded';
      if (search) filters.search = search;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const data = await transactionsApi.getAll(filters);
      setTransactions(data);
    } catch (error) {
      showToast('Failed to load transactions', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, search, startDate, endDate, showToast]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setName(transaction.name);
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setTransactionDate(new Date(transaction.transactionDate).toISOString().slice(0, 16));
      setTaxRate(transaction.taxRate ? (transaction.taxRate * 100).toString() : '');
      setTags(transaction.tags?.join(', ') || '');
      setNotes(transaction.notes || '');
    } else {
      setEditingTransaction(null);
      setName('');
      setType('income');
      setAmount('');
      setTransactionDate('');
      setTaxRate('');
      setTags('');
      setNotes('');
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSave = async () => {
    if (!name || !amount || !transactionDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const data = {
      name,
      type,
      amount: parseFloat(amount),
      transactionDate: new Date(transactionDate).toISOString(),
      taxRate: taxRate ? parseFloat(taxRate) / 100 : 0,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      notes: notes || undefined,
      status: 'active' as const,
    };

    try {
      setSaving(true);
      if (editingTransaction) {
        await transactionsApi.update(editingTransaction._id, data);
        showToast('Transaction updated successfully');
      } else {
        await transactionsApi.create(data as Transaction);
        showToast('Transaction created successfully');
      }
      closeModal();
      loadTransactions();
    } catch (error) {
      showToast('Failed to save transaction', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await transactionsApi.delete(id);
      showToast('Transaction deleted successfully');
      loadTransactions();
    } catch (error) {
      showToast('Failed to delete transaction', 'error');
      console.error(error);
    }
  };

  const toggleStatus = async (transaction: Transaction) => {
    try {
      if (transaction.status === 'active') {
        await transactionsApi.exclude(transaction._id);
        showToast('Transaction excluded');
      } else {
        await transactionsApi.activate(transaction._id);
        showToast('Transaction activated');
      }
      loadTransactions();
    } catch (error) {
      showToast('Failed to update status', 'error');
      console.error(error);
    }
  };

  if (loading && transactions.length === 0) return <PageLoading />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-dark-400 mt-1 text-sm sm:text-base">Track income and expenses</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span className="ml-2">Add Transaction</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors w-full sm:w-64"
          />
        </div>
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={[
            { value: '', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
          className="w-full sm:w-36"
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'excluded', label: 'Excluded' },
          ]}
          className="w-full sm:w-36"
        />
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 sm:w-40"
          />
          <span className="text-dark-500 text-sm">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 sm:w-40"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader title="Transactions" subtitle={`${transactions.length} transactions`} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-mono text-sm">
                    {format(new Date(transaction.transactionDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{transaction.name}</p>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transaction.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-dark-700 px-2 py-0.5 rounded text-dark-400">
                              {tag}
                            </span>
                          ))}
                          {transaction.tags.length > 2 && (
                            <span className="text-xs text-dark-500">+{transaction.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'income' : 'expense'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{formatMoney(transaction.amount)}</TableCell>
                  <TableCell className="font-mono text-dark-400">{formatMoney(transaction.taxAmount)}</TableCell>
                  <TableCell className={`font-mono ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatMoney(transaction.netAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'active' ? 'success' : 'default'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(transaction)}
                        className={`p-2 rounded-lg transition-colors ${
                          transaction.status === 'active' 
                            ? 'text-dark-400 hover:text-amber-400 hover:bg-dark-700' 
                            : 'text-dark-400 hover:text-emerald-400 hover:bg-dark-700'
                        }`}
                        title={transaction.status === 'active' ? 'Exclude' : 'Activate'}
                      >
                        {transaction.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(transaction)}
                        className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="p-2 text-dark-400 hover:text-rose-400 hover:bg-dark-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmpty message="No transactions found" colSpan={8} />
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingTransaction ? 'Update' : 'Create'} Transaction
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Transaction name"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              options={[
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
            />
            <Input
              label="Amount ($)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date & Time"
              type="datetime-local"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="10"
              step="0.1"
            />
          </div>
          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="student-payment, premium"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Transaction notes..."
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-h-[100px] resize-y"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

