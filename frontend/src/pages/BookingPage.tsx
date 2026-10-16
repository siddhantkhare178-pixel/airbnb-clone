import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Loader2, CheckCircle2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { adminService } from '../services/adminService';
import type { BookingDto, GuestDto, HotelDto } from '../types';
import { ErrorState } from '../components/ui/States';

const BookingPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = Number(searchParams.get('roomId'));
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const roomsCount = Number(searchParams.get('roomsCount')) || 1;
  const roomType = searchParams.get('roomType') || '';
  const price = Number(searchParams.get('price')) || 0;

  const [step, setStep] = useState<'init' | 'guests' | 'payment'>('init');
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [guests, setGuests] = useState<GuestDto[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotel info and guest list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guestList] = await Promise.all([
          userService.getGuests(),
        ]);
        setGuests(guestList);
        // Try to fetch hotel name via admin endpoint (may fail if not admin)
        try {
          const h = await adminService.getHotelById(Number(hotelId));
          setHotel(h);
        } catch {
          // Not admin, that's fine - we'll show hotel ID
        }
      } catch {
        // Guest fetch failed - proceed anyway
      }
    };
    fetchData();
  }, [hotelId]);

  // Step 1: Initialize booking
  const handleInitBooking = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.initBooking({
        hotelId: Number(hotelId),
        roomId,
        checkInDate: startDate,
        checkOutDate: endDate,
        roomsCount,
      });
      setBooking(result);
      setStep('guests');
      toast.success('Booking initialized!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add guests
  const handleAddGuests = async () => {
    if (!booking || loading) return;
    if (selectedGuestIds.length === 0) {
      toast.error('Please select at least one guest');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.addGuests(booking.id, selectedGuestIds);
      setBooking(result);
      setStep('payment');
      toast.success('Guests added!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guests');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Initiate payment (redirect to Stripe)
  const handlePayment = async () => {
    if (!booking || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.initiatePayment(booking.id);
      if (result.sessionUrl) {
        window.location.href = result.sessionUrl;
      } else {
        setError('No payment URL received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const toggleGuest = (guestId: number) => {
    setSelectedGuestIds((prev) =>
      prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]
    );
  };

  return (
    <div className="page-container py-8 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-8">
        {[
          { key: 'init', label: 'Confirm' },
          { key: 'guests', label: 'Guests' },
          { key: 'payment', label: 'Payment' },
        ].map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === s.key
                  ? 'bg-coral-500 text-white'
                  : ['init', 'guests', 'payment'].indexOf(step) > i
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {['init', 'guests', 'payment'].indexOf(step) > i ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{s.label}</span>
            </div>
            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-3" />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={() => setError(null)} />
        </div>
      )}

      {/* Booking Summary Card */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-coral-400" />
            <div>
              <p className="text-gray-500">Hotel</p>
              <p className="font-medium text-gray-900">{hotel?.name || `Hotel #${hotelId}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-coral-400" />
            <div>
              <p className="text-gray-500">Dates</p>
              <p className="font-medium text-gray-900">{startDate} → {endDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-coral-400" />
            <div>
              <p className="text-gray-500">Room</p>
              <p className="font-medium text-gray-900">{roomType} × {roomsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-coral-400 font-bold text-center">₹</div>
            <div>
              <p className="text-gray-500">Price (per night)</p>
              <p className="font-medium text-gray-900">₹{price.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {booking && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Booking ID</span>
              <span className="font-mono text-sm text-gray-700">#{booking.id}</span>
            </div>
            {booking.amount && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">₹{Number(booking.amount).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 1: Confirm & Initialize */}
      {step === 'init' && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Confirm your booking details</h3>
          <p className="text-sm text-gray-500 mb-6">
            Review the details above and click confirm to reserve your room. You'll be able to add guests and pay in the next steps.
          </p>
          <button onClick={handleInitBooking} disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Reserve'}
          </button>
        </div>
      )}

      {/* Step 2: Add Guests */}
      {step === 'guests' && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Select Guests</h3>
          <p className="text-sm text-gray-500 mb-4">
            Choose the guests for this booking from your saved guests list.
          </p>

          {guests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm mb-3">You haven't added any guests yet.</p>
              <button
                onClick={() => navigate('/guests')}
                className="btn-secondary text-sm"
              >
                Add Guests First
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {guests.map((guest) => (
                  <label
                    key={guest.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedGuestIds.includes(guest.id!)
                        ? 'border-coral-300 bg-coral-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGuestIds.includes(guest.id!)}
                      onChange={() => toggleGuest(guest.id!)}
                      className="w-4 h-4 text-coral-500 rounded focus:ring-coral-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                      <p className="text-xs text-gray-500">{guest.gender} • {guest.dateOfBirth}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={handleAddGuests} disabled={loading || selectedGuestIds.length === 0} className="btn-primary w-full">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Add ${selectedGuestIds.length} Guest${selectedGuestIds.length !== 1 ? 's' : ''}`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 'payment' && (
        <div className="card p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Proceed to Payment</h3>
          <p className="text-sm text-gray-500 mb-6">
            You'll be redirected to Stripe's secure checkout to complete your payment.
          </p>
          <button onClick={handlePayment} disabled={loading} className="btn-primary w-full">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to Stripe...</>
            ) : (
              'Pay with Stripe'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
