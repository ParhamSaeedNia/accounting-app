import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Play, Pause } from 'lucide-react';
import { teachersApi } from '../api';
import type { Teacher } from '../types';
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

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isActive, setIsActive] = useState('true');

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await teachersApi.getAll();
      setTeachers(data);
    } catch (error) {
      showToast('Failed to load teachers', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setName(teacher.name);
      setEmail(teacher.email);
      setHourlyRate(teacher.hourlyRate.toString());
      setIsActive(teacher.isActive ? 'true' : 'false');
    } else {
      setEditingTeacher(null);
      setName('');
      setEmail('');
      setHourlyRate('');
      setIsActive('true');
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTeacher(null);
  };

  const handleSave = async () => {
    if (!name || !email || !hourlyRate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const data = {
      name,
      email,
      hourlyRate: parseFloat(hourlyRate),
      isActive: isActive === 'true',
    };

    try {
      setSaving(true);
      if (editingTeacher) {
        await teachersApi.update(editingTeacher._id, data);
        showToast('Teacher updated successfully');
      } else {
        await teachersApi.create(data as Teacher);
        showToast('Teacher created successfully');
      }
      closeModal();
      loadTeachers();
    } catch (error) {
      showToast('Failed to save teacher', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      await teachersApi.delete(id);
      showToast('Teacher deleted successfully');
      loadTeachers();
    } catch (error) {
      showToast('Failed to delete teacher', 'error');
      console.error(error);
    }
  };

  const toggleStatus = async (teacher: Teacher) => {
    try {
      if (teacher.isActive) {
        await teachersApi.deactivate(teacher._id);
        showToast('Teacher deactivated');
      } else {
        await teachersApi.activate(teacher._id);
        showToast('Teacher activated');
      }
      loadTeachers();
    } catch (error) {
      showToast('Failed to update status', 'error');
      console.error(error);
    }
  };

  if (loading) return <PageLoading />;

  const activeCount = teachers.filter(t => t.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Teachers</h1>
          <p className="text-dark-400 mt-1 text-sm sm:text-base">Manage your teaching staff</p>
        </div>
        <Button onClick={() => openModal()} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span className="ml-2">Add Teacher</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
          <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Total Teachers</p>
          <p className="text-2xl font-bold text-white">{teachers.length}</p>
        </div>
        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
          <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl">
          <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Inactive</p>
          <p className="text-2xl font-bold text-dark-400">{teachers.length - activeCount}</p>
        </div>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader title="All Teachers" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hourly Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell className="font-medium text-white">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell className="font-mono">{formatMoney(teacher.hourlyRate)}/hr</TableCell>
                  <TableCell>
                    <Badge variant={teacher.isActive ? 'success' : 'default'}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(teacher)}
                        className={`p-2 rounded-lg transition-colors ${
                          teacher.isActive 
                            ? 'text-dark-400 hover:text-amber-400 hover:bg-dark-700' 
                            : 'text-dark-400 hover:text-emerald-400 hover:bg-dark-700'
                        }`}
                        title={teacher.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {teacher.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(teacher)}
                        className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
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
              <TableEmpty message="No teachers yet. Add your first teacher!" colSpan={5} />
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingTeacher ? 'Update' : 'Create'} Teacher
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
          <Input
            label="Hourly Rate ($)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="50"
          />
          <Select
            label="Status"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

