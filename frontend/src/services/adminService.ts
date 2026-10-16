import api from './api';
import type {
  HotelDto,
  BookingDto,
  HotelReportDto,
  RoomDto,
  InventoryDto,
  UpdateInventoryRequest,
} from '../types';

export const adminService = {
  // ---- Hotels ----
  createHotel: async (hotel: HotelDto): Promise<HotelDto> => {
    const response = await api.post<HotelDto>('/admin/hotels', hotel);
    return response.data;
  },

  getAllHotels: async (): Promise<HotelDto[]> => {
    const response = await api.get<HotelDto[]>('/admin/hotels');
    return response.data;
  },

  getHotelById: async (hotelId: number): Promise<HotelDto> => {
    const response = await api.get<HotelDto>(`/admin/hotels/${hotelId}`);
    return response.data;
  },

  updateHotel: async (hotelId: number, hotel: HotelDto): Promise<HotelDto> => {
    const response = await api.put<HotelDto>(`/admin/hotels/${hotelId}`, hotel);
    return response.data;
  },

  deleteHotel: async (hotelId: number): Promise<void> => {
    await api.delete(`/admin/hotels/${hotelId}`);
  },

  activateHotel: async (hotelId: number): Promise<void> => {
    await api.patch(`/admin/hotels/${hotelId}/activate`);
  },

  getHotelBookings: async (hotelId: number): Promise<BookingDto[]> => {
    const response = await api.get<BookingDto[]>(`/admin/hotels/${hotelId}/bookings`);
    return response.data;
  },

  getHotelReport: async (
    hotelId: number,
    startDate?: string,
    endDate?: string
  ): Promise<HotelReportDto> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<HotelReportDto>(
      `/admin/hotels/${hotelId}/reports?${params.toString()}`
    );
    return response.data;
  },

  // ---- Rooms ----
  createRoom: async (hotelId: number, room: RoomDto): Promise<RoomDto> => {
    const response = await api.post<RoomDto>(`/admin/hotels/${hotelId}/rooms`, room);
    return response.data;
  },

  getAllRooms: async (hotelId: number): Promise<RoomDto[]> => {
    const response = await api.get<RoomDto[]>(`/admin/hotels/${hotelId}/rooms`);
    return response.data;
  },

  getRoomById: async (hotelId: number, roomId: number): Promise<RoomDto> => {
    const response = await api.get<RoomDto>(`/admin/hotels/${hotelId}/rooms/${roomId}`);
    return response.data;
  },

  updateRoom: async (hotelId: number, roomId: number, room: RoomDto): Promise<RoomDto> => {
    const response = await api.put<RoomDto>(`/admin/hotels/${hotelId}/rooms/${roomId}`, room);
    return response.data;
  },

  deleteRoom: async (hotelId: number, roomId: number): Promise<void> => {
    await api.delete(`/admin/hotels/${hotelId}/rooms/${roomId}`);
  },

  // ---- Inventory ----
  getInventory: async (roomId: number): Promise<InventoryDto[]> => {
    const response = await api.get<InventoryDto[]>(`/admin/inventory/rooms/${roomId}`);
    return response.data;
  },

  updateInventory: async (roomId: number, data: UpdateInventoryRequest): Promise<void> => {
    await api.patch(`/admin/inventory/rooms/${roomId}`, data);
  },
};
