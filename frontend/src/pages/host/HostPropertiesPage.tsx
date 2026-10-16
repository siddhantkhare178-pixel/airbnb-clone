import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, Building2, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { HotelDto } from '../../types';
import { ErrorState, EmptyState } from '../../components/ui/States';
import { TableSkeleton } from '../../components/ui/Skeletons';
import Modal from '../../components/ui/Modal';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';

const HostPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllHotels();
      setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    try {
      await adminService.deleteHotel(deleteId);
      toast.success('Property deleted');
      setDeleteId(null);
      fetchHotels();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleActivate = async (hotelId: number) => {
    setActivatingId(hotelId);
    try {
      await adminService.activateHotel(hotelId);
      toast.success('Hotel activated!');
      fetchHotels();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to activate');
    } finally {
      setActivatingId(null);
    }
  };

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={4} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchHotels} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Properties</h1>
          <p className="section-subtitle">{hotels.length} propert{hotels.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <Link to="/host/properties/new" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Property</Link>
      </div>

      {hotels.length === 0 ? (
        <EmptyState title="No properties" message="Start by adding your first property." icon={<Building2 className="w-8 h-8 text-gray-400" />}
          action={<Link to="/host/properties/new" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Property</Link>}
        />
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="card overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <img
                  src={hotel.photos?.[0] || FALLBACK_IMG}
                  alt={hotel.name}
                  className="w-full sm:w-48 h-36 sm:h-auto object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
                <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/host/properties/${hotel.id}`} className="font-semibold text-gray-900 text-lg hover:text-coral-600 transition-colors">
                        {hotel.name}
                      </Link>
                      <span className={hotel.active ? 'badge-success' : 'badge-warning'}>{hotel.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{hotel.city}</p>
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {hotel.amenities.slice(0, 4).map((a, i) => <span key={i} className="badge-neutral text-xs">{a}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/host/properties/${hotel.id}`} className="btn-primary text-xs !py-2">
                      Manage
                    </Link>
                    {!hotel.active && (
                      <button onClick={() => handleActivate(hotel.id!)} disabled={activatingId === hotel.id} className="btn-secondary text-xs !py-2">
                        {activatingId === hotel.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ToggleRight className="w-3.5 h-3.5" />} Activate
                      </button>
                    )}
                    <button onClick={() => navigate(`/host/properties/${hotel.id}/edit`)} className="btn-ghost text-xs">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <Link to={`/host/properties/${hotel.id}/rooms`} className="btn-ghost text-xs">Rooms</Link>
                    <Link to={`/host/properties/${hotel.id}/inventory`} className="btn-ghost text-xs">Inventory</Link>
                    <Link to={`/host/properties/${hotel.id}/bookings`} className="btn-ghost text-xs">Bookings</Link>
                    <Link to={`/host/properties/${hotel.id}/reports`} className="btn-ghost text-xs">Reports</Link>
                    <button onClick={() => setDeleteId(hotel.id!)} className="btn-ghost text-xs text-red-500 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Property">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HostPropertiesPage;
