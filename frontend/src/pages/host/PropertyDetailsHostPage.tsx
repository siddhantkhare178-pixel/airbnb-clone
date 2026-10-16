import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Pencil,
  ToggleRight,
  Loader2,
  DoorOpen,
  CalendarDays,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Compass,
  AlertCircle,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { HotelDto, RoomDto } from '../../types';
import { ErrorState } from '../../components/ui/States';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

const PropertyDetailsHostPage: React.FC = () => {
  const { hotelId, id } = useParams<{ hotelId?: string; id?: string }>();
  const effectiveId = Number(hotelId || id);
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!effectiveId) return;
    setLoading(true);
    setError(null);
    try {
      const [hotelData, roomsData] = await Promise.all([
        adminService.getHotelById(effectiveId),
        adminService.getAllRooms(effectiveId),
      ]);
      setHotel(hotelData);
      setRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [effectiveId]);

  const handleActivate = async () => {
    if (!effectiveId) return;
    setActivating(true);
    try {
      await adminService.activateHotel(effectiveId);
      toast.success('Property activated! 365-day inventory generated.');
      fetchDetails();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Activation failed');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-8 space-y-6">
        <div className="h-8 w-40 skeleton rounded-lg" />
        <div className="h-64 skeleton rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error || 'Property not found'} onRetry={fetchDetails} />
      </div>
    );
  }

  return (
    <div className="page-container py-8 animate-fade-in space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/host/properties')}
          className="btn-ghost text-sm mb-4 inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Properties
        </button>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="section-title">{hotel.name}</h1>
              <span className={hotel.active ? 'badge-success' : 'badge-warning'}>
                {hotel.active ? 'Active & Bookable' : 'Draft / Inactive'}
              </span>
            </div>
            <p className="section-subtitle flex items-center gap-1 text-gray-500">
              <MapPin className="w-4 h-4 text-coral-500" /> {hotel.city}
              {hotel.contactInfo?.address && ` • ${hotel.contactInfo.address}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!hotel.active && (
              <button
                onClick={handleActivate}
                disabled={activating}
                className="btn-primary text-sm"
              >
                {activating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ToggleRight className="w-4 h-4" />
                )}
                Activate Property
              </button>
            )}
            <Link
              to={`/host/properties/${effectiveId}/edit`}
              className="btn-secondary text-sm"
            >
              <Pencil className="w-4 h-4" /> Edit Details
            </Link>
          </div>
        </div>
      </div>

      {/* Activation Status Alert */}
      {!hotel.active && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">This property is currently inactive</p>
              <p className="text-xs text-amber-700">
                Guests cannot find or book this property in search. Once you have defined your room types, click "Activate Property" to provision a full year of live inventory.
              </p>
            </div>
          </div>
          <button
            onClick={handleActivate}
            disabled={activating}
            className="btn-primary text-xs !py-2 shrink-0"
          >
            {activating ? 'Activating...' : 'Activate Now'}
          </button>
        </div>
      )}

      {/* Management Hub Quick Navigation */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={`/host/properties/${effectiveId}/rooms`}
            className="card p-5 hover:border-coral-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Room Types</h3>
              <span className="badge-neutral text-xs font-mono">{rooms.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Configure base prices, room types, capacities, and limits.</p>
          </Link>

          <Link
            to={`/host/properties/${effectiveId}/inventory`}
            className="card p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Inventory & Surge</h3>
              <span className="text-xs text-emerald-600 font-medium">365 Days</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Manage surge multipliers, seasonal rates, and blackout dates.</p>
          </Link>

          <Link
            to={`/host/properties/${effectiveId}/bookings`}
            className="card p-5 hover:border-sky-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Guest Bookings</h3>
              <span className="text-xs text-sky-600 font-medium">Live Bookings</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">View all guest reservations, dates, and payment states.</p>
          </Link>

          <Link
            to={`/host/properties/${effectiveId}/reports`}
            className="card p-5 hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Revenue Reports</h3>
              <span className="text-xs text-amber-600 font-medium">Analytics</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Review verified gross revenue, booking volumes, and metrics.</p>
          </Link>
        </div>
      </div>

      {/* Property Overview & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Photo Gallery</h2>
          {hotel.photos && hotel.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`${hotel.name} ${i + 1}`}
                  className="rounded-xl h-48 w-full object-cover border border-gray-100 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMG;
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center bg-gray-50">
              <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">No photos added yet</p>
              <Link to={`/host/properties/${effectiveId}/edit`} className="btn-secondary text-xs">
                Add Photos
              </Link>
            </div>
          )}

          {/* Amenities */}
          <div className="card p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
            {hotel.amenities && hotel.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, i) => (
                  <span key={i} className="badge-neutral text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No amenities specified.</p>
            )}
          </div>
        </div>

        {/* Sidebar Info & Contact */}
        <div className="space-y-6">
          <div className="card p-6 border border-gray-100 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Property Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span>{hotel.contactInfo?.address || 'No address provided'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{hotel.contactInfo?.phoneNumber || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{hotel.contactInfo?.email || 'No email provided'}</span>
              </div>
              {hotel.contactInfo?.location && (
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Compass className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{hotel.contactInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Configured Rooms</h3>
              <Link
                to={`/host/properties/${effectiveId}/rooms`}
                className="text-xs font-semibold text-coral-600 hover:text-coral-700"
              >
                Manage
              </Link>
            </div>
            {rooms.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500">
                <p className="mb-2">No rooms added yet.</p>
                <Link to={`/host/properties/${effectiveId}/rooms`} className="btn-secondary text-xs">
                  <Plus className="w-3.5 h-3.5" /> Add First Room
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {rooms.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{r.type}</p>
                      <p className="text-gray-500">{r.capacity} guests • {r.totalCount} units</p>
                    </div>
                    <span className="font-bold text-gray-900">${r.basePrice}/night</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsHostPage;
