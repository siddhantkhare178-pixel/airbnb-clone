import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { BookingStatus } from '../types';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [status, setStatus] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const res = await bookingService.getBookingStatus(Number(bookingId));
        setStatus(res.bookingStatus);
      } catch {
        // Can't verify status
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [bookingId]);

  return (
    <div className="page-container py-16 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-coral-500" />
            <p className="text-gray-500">Verifying your payment...</p>
          </div>
        ) : status === BookingStatus.CONFIRMED ? (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-2">Your payment was successful and your booking is confirmed.</p>
            {bookingId && <p className="text-sm text-gray-400 mb-8">Booking ID: #{bookingId}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
              <Link to="/" className="btn-secondary">Explore More</Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Processing</h1>
            <p className="text-gray-500 mb-2">
              Your payment is being verified. This may take a moment.
              {status && <><br />Current status: <strong>{status}</strong></>}
            </p>
            {bookingId && <p className="text-sm text-gray-400 mb-8">Booking ID: #{bookingId}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
              <Link to="/" className="btn-secondary">Go Home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
