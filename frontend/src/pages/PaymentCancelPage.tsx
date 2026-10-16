import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="page-container py-16 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-2">
          Your payment was cancelled or interrupted. No charges have been made.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-400 mb-8">
            Booking ID: #{bookingId} — You may retry payment from your bookings page.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
          <Link to="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
