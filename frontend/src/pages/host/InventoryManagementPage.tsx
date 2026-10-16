import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { InventoryDto } from '../../types';
import { ErrorState, EmptyState } from '../../components/ui/States';
import { TableSkeleton } from '../../components/ui/Skeletons';
import Modal from '../../components/ui/Modal';

const InventoryManagementPage: React.FC = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<InventoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [updateStartDate, setUpdateStartDate] = useState('');
  const [updateEndDate, setUpdateEndDate] = useState('');
  const [updateSurgeFactor, setUpdateSurgeFactor] = useState('1.0');
  const [updateClosed, setUpdateClosed] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getInventory(Number(roomId));
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, [roomId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      await adminService.updateInventory(Number(roomId), {
        startDate: updateStartDate,
        endDate: updateEndDate,
        surgeFactor: Number(updateSurgeFactor),
        closed: updateClosed,
      });
      toast.success('Inventory updated!');
      setShowUpdate(false);
      fetchInventory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update inventory');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={6} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchInventory} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <button onClick={() => navigate(`/host/properties/${hotelId}/rooms`)} className="btn-ghost text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back to Rooms</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Inventory</h1>
          <p className="section-subtitle">Room #{roomId} • {inventory.length} entries</p>
        </div>
        <button onClick={() => setShowUpdate(true)} className="btn-primary text-sm"><Save className="w-4 h-4" /> Update Inventory</button>
      </div>

      {inventory.length === 0 ? (
        <EmptyState title="No inventory data" message="Inventory will be populated when rooms are activated." icon={<CalendarDays className="w-8 h-8 text-gray-400" />} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Booked</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Reserved</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Price (₹)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Surge</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{inv.date}</td>
                  <td className="py-3 px-4 text-center">{inv.totalCount}</td>
                  <td className="py-3 px-4 text-center">{inv.bookedCount}</td>
                  <td className="py-3 px-4 text-center">{inv.reservedCount}</td>
                  <td className="py-3 px-4 text-right font-medium">₹{Number(inv.price).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">{Number(inv.surgeFactor).toFixed(1)}x</td>
                  <td className="py-3 px-4 text-center">
                    <span className={inv.closed ? 'badge-danger' : 'badge-success'}>{inv.closed ? 'Closed' : 'Open'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      <Modal isOpen={showUpdate} onClose={() => setShowUpdate(false)} title="Update Inventory">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Start Date</label><input type="date" value={updateStartDate} onChange={(e) => setUpdateStartDate(e.target.value)} className="input-field" required /></div>
            <div><label className="label">End Date</label><input type="date" value={updateEndDate} onChange={(e) => setUpdateEndDate(e.target.value)} className="input-field" required /></div>
          </div>
          <div><label className="label">Surge Factor</label><input type="number" value={updateSurgeFactor} onChange={(e) => setUpdateSurgeFactor(e.target.value)} className="input-field" step="0.1" min="0.1" required /></div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="inv-closed" checked={updateClosed} onChange={(e) => setUpdateClosed(e.target.checked)} className="w-4 h-4 text-coral-500 rounded" />
            <label htmlFor="inv-closed" className="text-sm text-gray-700">Mark as closed</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowUpdate(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={updating} className="btn-primary text-sm">{updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
