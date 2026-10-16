import api from './api';
import type {
  BookingRequest,
  BookingDto,
  BookingPaymentInitResponse,
  BookingStatusResponse,
} from '../types';

export const bookingService = {
  initBooking: async (data: BookingRequest): Promise<BookingDto> => {
    const response = await api.post<BookingDto>('/bookings/init', data);
    return response.data;
  },

  addGuests: async (bookingId: number, guestIds: number[]): Promise<BookingDto> => {
    const response = await api.post<BookingDto>(`/bookings/${bookingId}/addGuests`, guestIds);
    return response.data;
  },

  initiatePayment: async (bookingId: number): Promise<BookingPaymentInitResponse> => {
    const response = await api.post<BookingPaymentInitResponse>(`/bookings/${bookingId}/payments`);
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<void> => {
    await api.post(`/bookings/${bookingId}/cancel`);
  },

  getBookingStatus: async (bookingId: number): Promise<BookingStatusResponse> => {
    const response = await api.get<BookingStatusResponse>(`/bookings/${bookingId}/status`);
    return response.data;
  },
};
