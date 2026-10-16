import React from 'react';
import { BookingStatus } from '../../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  [BookingStatus.RESERVED]: { label: 'Reserved', className: 'badge-info' },
  [BookingStatus.GUESTS_ADDED]: { label: 'Guests Added', className: 'badge-info' },
  [BookingStatus.PAYMENTS_PENDING]: { label: 'Payment Pending', className: 'badge-warning' },
  [BookingStatus.CONFIRMED]: { label: 'Confirmed', className: 'badge-success' },
  [BookingStatus.CANCELLED]: { label: 'Cancelled', className: 'badge-danger' },
  [BookingStatus.EXPIRED]: { label: 'Expired', className: 'badge-neutral' },
};

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'badge-neutral' };
  return <span className={config.className}>{config.label}</span>;
};

export default BookingStatusBadge;
