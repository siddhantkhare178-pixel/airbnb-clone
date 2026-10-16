import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { BookingDto } from '../../types';
import BookingStatusBadge from '../../components/ui/BookingStatusBadge';
import { ErrorState, EmptyState } from '../../components/ui/States';
import { TableSkeleton } from '../../components/ui/Skeletons';

const HotelBookingsPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getHotelBookings(Number(hotelId));
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [hotelId]);

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={5} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchBookings} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <button onClick={() => navigate('/host/properties')} className="btn-ghost text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h1 className="section-title mb-2">Hotel Bookings</h1>
      <p className="section-subtitle mb-6">Hotel #{hotelId} • {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" message="Bookings for this hotel will appear here." icon={<CalendarDays className="w-8 h-8 text-gray-400" />} />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-400">#{booking.id}</span>
                  <BookingStatusBadge status={booking.bookingStatus} />
                </div>
                <p className="text-sm text-gray-600 mt-1">{booking.checkInDate} → {booking.checkOutDate} • {booking.roomsCount} room{booking.roomsCount > 1 ? 's' : ''}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">₹{Number(booking.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelBookingsPage;
