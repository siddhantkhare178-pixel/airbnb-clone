import React, { useEffect, useState } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import type { BookingDto } from '../types';
import { BookingStatus } from '../types';
import BookingStatusBadge from '../components/ui/BookingStatusBadge';
import { ErrorState, EmptyState } from '../components/ui/States';
import { TableSkeleton } from '../components/ui/Skeletons';
import Modal from '../components/ui/Modal';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancelId || cancelling) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelId);
      toast.success('Booking cancelled');
      setCancelId(null);
      fetchBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="page-container py-8"><TableSkeleton rows={4} /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchBookings} /></div>;

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-subtitle">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Your bookings will appear here after you book a hotel."
          icon={<CalendarDays className="w-8 h-8 text-gray-400" />}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-400">#{booking.id}</span>
                    <BookingStatusBadge status={booking.bookingStatus} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {booking.checkInDate} → {booking.checkOutDate}
                    </span>
                    <span>{booking.roomsCount} room{booking.roomsCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{Number(booking.amount).toLocaleString()}</p>
                  </div>
                  {(booking.bookingStatus === BookingStatus.RESERVED ||
                    booking.bookingStatus === BookingStatus.GUESTS_ADDED ||
                    booking.bookingStatus === BookingStatus.PAYMENTS_PENDING) && (
                    <button
                      onClick={() => setCancelId(booking.id)}
                      className="btn-danger text-sm !py-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              {booking.guests && booking.guests.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Guests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(booking.guests).map((g, i) => (
                      <span key={i} className="badge-neutral text-xs">{g.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelId !== null} onClose={() => setCancelId(null)} title="Cancel Booking">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to cancel booking <strong>#{cancelId}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setCancelId(null)} className="btn-secondary text-sm">Keep Booking</button>
          <button onClick={handleCancel} disabled={cancelling} className="btn-danger text-sm">
            {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
