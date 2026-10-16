import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, X, Save, DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { RoomDto } from '../../types';
import { ErrorState, EmptyState } from '../../components/ui/States';
import { TableSkeleton } from '../../components/ui/Skeletons';
import Modal from '../../components/ui/Modal';

const RoomManagementPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const hid = Number(hotelId);

  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [formType, setFormType] = useState('');
  const [formBasePrice, setFormBasePrice] = useState('');
  const [formTotalCount, setFormTotalCount] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formPhotos, setFormPhotos] = useState<string[]>(['']);
  const [formAmenities, setFormAmenities] = useState<string[]>(['']);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllRooms(hid);
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, [hotelId]);

  const openAdd = () => {
    setEditingRoom(null);
    setFormType(''); setFormBasePrice(''); setFormTotalCount('1'); setFormCapacity('2');
    setFormPhotos(['']); setFormAmenities(['']);
    setShowForm(true);
  };

  const openEdit = (room: RoomDto) => {
    setEditingRoom(room);
    setFormType(room.type);
    setFormBasePrice(room.basePrice.toString());
    setFormTotalCount(room.totalCount.toString());
    setFormCapacity(room.capacity.toString());
    setFormPhotos(room.photos && room.photos.length > 0 ? [...room.photos] : ['']);
    setFormAmenities(room.amenities && room.amenities.length > 0 ? [...room.amenities] : ['']);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;
    setFormLoading(true);
    const roomData: RoomDto = {
      type: formType,
      basePrice: Number(formBasePrice),
      totalCount: Number(formTotalCount),
      capacity: Number(formCapacity),
      photos: formPhotos.filter(Boolean),
      amenities: formAmenities.filter(Boolean),
    };
    try {
      if (editingRoom?.id) {
        await adminService.updateRoom(hid, editingRoom.id, roomData);
        toast.success('Room updated!');
      } else {
        await adminService.createRoom(hid, roomData);
        toast.success('Room created!');
      }
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save room');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    try {
      await adminService.deleteRoom(hid, deleteId);
      toast.success('Room deleted');
      setDeleteId(null);
      fetchRooms();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={3} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchRooms} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <button onClick={() => navigate('/host/properties')} className="btn-ghost text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Room Management</h1>
          <p className="section-subtitle">Hotel #{hotelId} • {rooms.length} room type{rooms.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Room</button>
      </div>

      {rooms.length === 0 ? (
        <EmptyState title="No rooms" message="Add rooms to this property." icon={<DoorOpen className="w-8 h-8 text-gray-400" />}
          action={<button onClick={openAdd} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Room</button>} />
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{room.type}</h3>
                <p className="text-sm text-gray-500">₹{room.basePrice.toLocaleString()} / night • {room.totalCount} rooms • {room.capacity} guests</p>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.amenities.map((a, i) => <span key={i} className="badge-neutral text-xs">{a}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/host/properties/${hotelId}/rooms/${room.id}/inventory`)} className="btn-ghost text-xs">Inventory</button>
                <button onClick={() => openEdit(room)} className="btn-ghost text-xs"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(room.id!)} className="btn-ghost text-xs text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingRoom ? 'Edit Room' : 'Add Room'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Room Type *</label><input type="text" value={formType} onChange={(e) => setFormType(e.target.value)} className="input-field" placeholder="e.g. Deluxe, Suite" required /></div>
            <div><label className="label">Base Price (₹) *</label><input type="number" value={formBasePrice} onChange={(e) => setFormBasePrice(e.target.value)} className="input-field" min="0" required /></div>
            <div><label className="label">Total Count *</label><input type="number" value={formTotalCount} onChange={(e) => setFormTotalCount(e.target.value)} className="input-field" min="1" required /></div>
            <div><label className="label">Capacity *</label><input type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} className="input-field" min="1" required /></div>
          </div>
          <div>
            <label className="label">Photo URLs</label>
            {formPhotos.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={p} onChange={(e) => { const a = [...formPhotos]; a[i] = e.target.value; setFormPhotos(a); }} className="input-field" placeholder="https://..." />
                {formPhotos.length > 1 && <button type="button" onClick={() => setFormPhotos(formPhotos.filter((_, j) => j !== i))} className="p-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setFormPhotos([...formPhotos, ''])} className="btn-ghost text-xs"><Plus className="w-3.5 h-3.5" /> Add</button>
          </div>
          <div>
            <label className="label">Amenities</label>
            {formAmenities.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={a} onChange={(e) => { const arr = [...formAmenities]; arr[i] = e.target.value; setFormAmenities(arr); }} className="input-field" placeholder="e.g. AC, TV" />
                {formAmenities.length > 1 && <button type="button" onClick={() => setFormAmenities(formAmenities.filter((_, j) => j !== i))} className="p-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
              </div>
            ))}
            <button type="button" onClick={() => setFormAmenities([...formAmenities, ''])} className="btn-ghost text-xs"><Plus className="w-3.5 h-3.5" /> Add</button>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={formLoading} className="btn-primary text-sm">
              {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {editingRoom ? 'Save' : 'Create'}</>}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Room">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this room?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">{deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default RoomManagementPage;
