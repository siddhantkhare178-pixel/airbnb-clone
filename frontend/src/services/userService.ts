import api from './api';
import type {
  UserDto,
  ProfileUpdateRequest,
  BookingDto,
  GuestDto,
} from '../types';

export const userService = {
  getProfile: async (): Promise<UserDto> => {
    const response = await api.get<UserDto>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<void> => {
    await api.patch('/users/profile', data);
  },

  getMyBookings: async (): Promise<BookingDto[]> => {
    const response = await api.get<BookingDto[]>('/users/myBookings');
    return response.data;
  },

  getGuests: async (): Promise<GuestDto[]> => {
    const response = await api.get<GuestDto[]>('/users/guests');
    return response.data;
  },

  addGuest: async (guest: Omit<GuestDto, 'id'>): Promise<GuestDto> => {
    const response = await api.post<GuestDto>('/users/guests', guest);
    return response.data;
  },

  updateGuest: async (guestId: number, guest: GuestDto): Promise<void> => {
    await api.put(`/users/guests/${guestId}`, guest);
  },

  deleteGuest: async (guestId: number): Promise<void> => {
    await api.delete(`/users/guests/${guestId}`);
  },
};
