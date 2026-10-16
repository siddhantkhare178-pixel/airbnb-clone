import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Save,
  AlertCircle,
  DoorOpen,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { HotelDto, RoomDto, UpdateInventoryRequest } from '../../types';
import { ErrorState, EmptyState } from '../../components/ui/States';
import Modal from '../../components/ui/Modal';
import { format, addDays } from 'date-fns';

const HotelInventoryPage: React.FC = () => {
  const { hotelId, id } = useParams<{ hotelId?: string; id?: string }>();
  const effectiveHotelId = Number(hotelId || id);
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update modal state
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  const [surgeFactor, setSurgeFactor] = useState<number>(1.0);
  const [closed, setClosed] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchRoomsAndHotel = async () => {
    if (!effectiveHotelId) return;
    setLoading(true);
    setError(null);
    try {
      const [hotelData, roomsData] = await Promise.all([
        adminService.getHotelById(effectiveHotelId),
        adminService.getAllRooms(effectiveHotelId),
      ]);
      setHotel(hotelData);
      setRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndHotel();
  }, [effectiveHotelId]);

  const openUpdateModal = (room: RoomDto) => {
    setSelectedRoom(room);
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
    setSurgeFactor(1.0);
    setClosed(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom?.id || saving) return;
    setSaving(true);
    try {
      const req: UpdateInventoryRequest = {
        startDate,
        endDate,
        surgeFactor: Number(surgeFactor),
        closed,
      };
      await adminService.updateInventory(selectedRoom.id, req);
      toast.success(`Inventory updated for ${selectedRoom.type}!`);
      setSelectedRoom(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update inventory');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-8 space-y-4">
        <div className="h-8 w-40 skeleton rounded-lg" />
        <div className="h-48 skeleton rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error || 'Hotel not found'} onRetry={fetchRoomsAndHotel} />
      </div>
    );
  }

  return (
    <div className="page-container py-8 animate-fade-in space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(`/host/properties/${effectiveHotelId}`)}
          className="btn-ghost text-sm mb-4 inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Property Hub
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="section-title">Property Inventory & Pricing</h1>
            <p className="section-subtitle">
              Manage availability, blackout dates, and surge factor multipliers for {hotel.name}
            </p>
          </div>
          <Link
            to={`/host/properties/${effectiveHotelId}/rooms`}
            className="btn-secondary text-sm"
          >
            <DoorOpen className="w-4 h-4" /> Manage Room Types
          </Link>
        </div>
      </div>

      {!hotel.active && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm text-amber-800">
            <strong>Note:</strong> This property is currently inactive. When you activate the property, the backend engine initializes 365 daily inventory records for each room type.
          </p>
        </div>
      )}

      {rooms.length === 0 ? (
        <EmptyState
          title="No rooms configured yet"
          message="You need to add at least one room before managing inventory."
          icon={<DoorOpen className="w-10 h-10 text-gray-400" />}
          action={
            <Link to={`/host/properties/${effectiveHotelId}/rooms`} className="btn-primary text-sm">
              Add Rooms
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="card p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center shrink-0">
                  <DoorOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{room.type}</h3>
                    <span className="badge-neutral text-xs">Capacity: {room.capacity}</span>
                    <span className="badge-neutral text-xs">{room.totalCount} Units</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Base Rate: <strong className="text-gray-900 font-semibold">${room.basePrice}</strong> / night
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => openUpdateModal(room)}
                  className="btn-primary text-xs !py-2.5"
                >
                  <Sliders className="w-3.5 h-3.5" /> Quick Surge & Availability
                </button>
                <Link
                  to={`/host/properties/${effectiveHotelId}/rooms/${room.id}/inventory`}
                  className="btn-secondary text-xs !py-2.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Full Calendar Table
                  <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Inventory Modal */}
      <Modal
        isOpen={selectedRoom !== null}
        onClose={() => setSelectedRoom(null)}
        title={`Adjust Inventory — ${selectedRoom?.type || ''}`}
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input-field text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                className="input-field text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label !mb-0">Surge Factor</label>
              <span className="text-xs font-bold text-coral-600 font-mono">{surgeFactor}x</span>
            </div>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="10.0"
              className="input-field text-sm"
              value={surgeFactor}
              onChange={(e) => setSurgeFactor(parseFloat(e.target.value) || 1.0)}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              1.0 = Normal base rate. 1.5 = 50% price surge.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <input
              type="checkbox"
              id="closed-toggle"
              checked={closed}
              onChange={(e) => setClosed(e.target.checked)}
              className="w-4 h-4 rounded text-coral-600 focus:ring-coral-500 border-gray-300"
            />
            <label htmlFor="closed-toggle" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
              Close room inventory for selected dates (Block bookings)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HotelInventoryPage;
