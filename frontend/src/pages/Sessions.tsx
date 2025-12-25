import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { sessionsApi, teachersApi, packagesApi } from '../api';
import type { Session, Teacher, Package } from '../types';
import Card, { CardHeader } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { PageLoading } from '../components/ui/Loading';
import { useToast } from '../hooks/useToast';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Filters
  const [filterTeacher, setFilterTeacher] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form state
  const [teacherId, setTeacherId] = useState('');
  const [packageId, setPackageId] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [duration, setDuration] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, teachersData, packagesData] = await Promise.all([
        sessionsApi.getAll(),
        teachersApi.getAll(),
        packagesApi.getAll(),
      ]);
      setSessions(sessionsData);
      setTeachers(teachersData);
      setPackages(packagesData);
    } catch (error) {
      showToast('Failed to load data', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredSessions = async () => {
    try {
      setLoading(true);
      let data: Session[];

      if (filterTeacher) {
        data = await sessionsApi.getByTeacher(filterTeacher);
      } else if (startDate && endDate) {
        data = await sessionsApi.getByDateRange(startDate, endDate);
      } else if (filterStatus === 'confirmed') {
        data = await sessionsApi.getConfirmed();
      } else {
        data = await sessionsApi.getAll();
      }

      // Additional client-side filtering
      if (filterStatus === 'unconfirmed') {
        data = data.filter(s => !s.isConfirmed);
      } else if (filterStatus === 'confirmed' && filterTeacher) {
        data = data.filter(s => s.isConfirmed);
      }

      setSessions(data);
    } catch (error) {
      showToast('Failed to load sessions', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadFilteredSessions();
    }
  }, [filterTeacher, filterStatus, startDate, endDate]);

  const openModal = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setTeacherId(session.teacherId);
      setPackageId(session.packageId);
      setSessionDate(session.sessionDate ? new Date(session.sessionDate).toISOString().slice(0, 16) : '');
      setDuration(session.duration.toString());
      setTitle(session.title || '');
      setNotes(session.notes || '');
      setIsConfirmed(session.isConfirmed);
    } else {
      setEditingSession(null);
      setTeacherId('');
      setPackageId('');
      setSessionDate('');
      setDuration('');
      setTitle('');
      setNotes('');
      setIsConfirmed(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleSave = async () => {
    if (!teacherId || !packageId || !sessionDate || !duration) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const data = {
      teacherId,
      packageId,
      sessionDate: new Date(sessionDate).toISOString(),
      duration: parseFloat(duration),
      title: title || undefined,
      notes: notes || undefined,
      isConfirmed,
    };

    try {
      setSaving(true);
      if (editingSession) {
        await sessionsApi.update(editingSession._id, data);
        showToast('Session updated successfully');
      } else {
        await sessionsApi.create(data as Session);
        showToast('Session created successfully');
      }
      closeModal();
      loadFilteredSessions();
    } catch (error) {
      showToast('Failed to save session', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      await sessionsApi.delete(id);
      showToast('Session deleted successfully');
      loadFilteredSessions();
    } catch (error) {
      showToast('Failed to delete session', 'error');
      console.error(error);
    }
  };

  const toggleConfirm = async (session: Session) => {
    try {
      if (session.isConfirmed) {
        await sessionsApi.unconfirm(session._id);
        showToast('Session unconfirmed');
      } else {
        await sessionsApi.confirm(session._id);
        showToast('Session confirmed');
      }
      loadFilteredSessions();
    } catch (error) {
      showToast('Failed to update status', 'error');
      console.error(error);
    }
  };

  if (loading && teachers.length === 0) return <PageLoading />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
          <p className="text-dark-400 mt-1">Track teaching sessions</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4" />
          Add Session
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filterTeacher}
          onChange={(e) => setFilterTeacher(e.target.value)}
          options={[
            { value: '', label: 'All Teachers' },
            ...teachers.map(t => ({ value: t._id, label: t.name })),
          ]}
          className="w-48"
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'unconfirmed', label: 'Unconfirmed' },
          ]}
          className="w-40"
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-40"
        />
        <span className="text-dark-500">to</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader title="Sessions" subtitle={`${sessions.length} sessions`} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell className="font-mono text-sm">
                    {format(new Date(session.sessionDate), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {session.title || '-'}
                  </TableCell>
                  <TableCell>{session.teacher?.name || 'Unknown'}</TableCell>
                  <TableCell>{session.package?.packageName || 'Unknown'}</TableCell>
                  <TableCell>{session.duration} hrs</TableCell>
                  <TableCell>
                    <Badge variant={session.isConfirmed ? 'info' : 'default'}>
                      {session.isConfirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleConfirm(session)}
                        className={`p-2 rounded-lg transition-colors ${
                          session.isConfirmed 
                            ? 'text-dark-400 hover:text-rose-400 hover:bg-dark-700' 
                            : 'text-dark-400 hover:text-emerald-400 hover:bg-dark-700'
                        }`}
                        title={session.isConfirmed ? 'Unconfirm' : 'Confirm'}
                      >
                        {session.isConfirmed ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(session)}
                        className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(session._id)}
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
              <TableEmpty message="No sessions found" colSpan={7} />
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingSession ? 'Edit Session' : 'Add Session'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingSession ? 'Update' : 'Create'} Session
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Teacher"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              options={[
                { value: '', label: 'Select Teacher' },
                ...teachers.map(t => ({ value: t._id, label: t.name })),
              ]}
            />
            <Select
              label="Package"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              options={[
                { value: '', label: 'Select Package' },
                ...packages.map(p => ({ value: p._id, label: p.packageName })),
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Session Date & Time"
              type="datetime-local"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
            <Input
              label="Duration (hours)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="2"
              step="0.5"
            />
          </div>
          <Input
            label="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Session title"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes..."
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-h-[100px] resize-y"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-5 h-5 rounded border-dark-600 bg-dark-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <span className="text-dark-300">Mark as confirmed</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}

