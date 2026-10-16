import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import type { GuestDto } from '../types';
import { Gender } from '../types';
import { ErrorState, EmptyState } from '../components/ui/States';
import { TableSkeleton } from '../components/ui/Skeletons';
import Modal from '../components/ui/Modal';

const GuestsPage: React.FC = () => {
  const [guests, setGuests] = useState<GuestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestDto | null>(null);
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<Gender>(Gender.MALE);
  const [formDob, setFormDob] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getGuests();
      setGuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuests(); }, []);

  const openAdd = () => {
    setEditingGuest(null);
    setFormName('');
    setFormGender(Gender.MALE);
    setFormDob('');
    setShowForm(true);
  };

  const openEdit = (guest: GuestDto) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormGender(guest.gender);
    setFormDob(guest.dateOfBirth);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;
    setFormLoading(true);
    try {
      if (editingGuest?.id) {
        await userService.updateGuest(editingGuest.id, {
          id: editingGuest.id,
          name: formName,
          gender: formGender,
          dateOfBirth: formDob,
        });
        toast.success('Guest updated!');
      } else {
        await userService.addGuest({
          name: formName,
          gender: formGender,
          dateOfBirth: formDob,
        });
        toast.success('Guest added!');
      }
      setShowForm(false);
      fetchGuests();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save guest');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    try {
      await userService.deleteGuest(deleteId);
      toast.success('Guest removed');
      setDeleteId(null);
      fetchGuests();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={3} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchGuests} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Guests</h1>
          <p className="section-subtitle">{guests.length} guest{guests.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Guest
        </button>
      </div>

      {guests.length === 0 ? (
        <EmptyState
          title="No guests saved"
          message="Add guests to quickly select them when booking."
          icon={<Users className="w-8 h-8 text-gray-400" />}
          action={<button onClick={openAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Guest</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map((guest) => (
            <div key={guest.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{guest.gender}</p>
                  <p className="text-sm text-gray-500">{guest.dateOfBirth}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(guest)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Edit guest">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(guest.id!)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete guest">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Guest Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingGuest ? 'Edit Guest' : 'Add Guest'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="label">Gender</label>
            <select value={formGender} onChange={(e) => setFormGender(e.target.value as Gender)} className="input-field">
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>
          <div>
            <label className="label">Date of Birth</label>
            <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)} className="input-field" required />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={formLoading} className="btn-primary text-sm">
              {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingGuest ? 'Save Changes' : 'Add Guest'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Remove Guest">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this guest?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Keep</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GuestsPage;
