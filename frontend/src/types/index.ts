// ============================================================
// Backend API Types - Mirrors the Spring Boot DTOs exactly
// ============================================================

// ---- Enums ----
export const BookingStatus = {
  RESERVED: 'RESERVED',
  GUESTS_ADDED: 'GUESTS_ADDED',
  PAYMENTS_PENDING: 'PAYMENTS_PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const Role = {
  GUEST: 'GUEST',
  HOTEL_MANAGER: 'HOTEL_MANAGER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// ---- Embedded / Shared ----
export interface HotelContactInfo {
  address?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
}

// ---- Auth ----
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export type MarketplaceMode = 'guest' | 'host';

// ---- User ----
export interface UserDto {
  id: number;
  email: string;
  name: string;
  gender?: Gender;
  dateOfBirth?: string; // ISO date string
  roles?: Role[];
}

export interface ProfileUpdateRequest {
  name?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

// ---- Guest ----
export interface GuestDto {
  id?: number;
  name: string;
  gender: Gender;
  dateOfBirth: string;
}

// ---- Hotel ----
export interface HotelDto {
  id?: number;
  name: string;
  city: string;
  photos?: string[];
  amenities?: string[];
  contactInfo?: HotelContactInfo;
  active?: boolean;
}

// ---- Hotel Search ----
export interface HotelSearchRequest {
  city: string;
  startDate: string;
  endDate: string;
  roomsCount: number;
  page?: number;
  size?: number;
}

export interface HotelPriceResponseDto {
  id: number;
  name: string;
  city: string;
  photos?: string[];
  amenities?: string[];
  contactInfo?: HotelContactInfo;
  price: number;
}

// ---- Hotel Info ----
export interface HotelInfoRequestDto {
  startDate: string;
  endDate: string;
  roomsCount: number;
}

export interface RoomPriceResponseDto {
  id: number;
  type: string;
  photos?: string[];
  amenities?: string[];
  price: number;
}

export interface HotelInfoDto {
  hotel: HotelDto;
  rooms: RoomPriceResponseDto[];
}

// ---- Room ----
export interface RoomDto {
  id?: number;
  type: string;
  basePrice: number;
  photos?: string[];
  amenities?: string[];
  totalCount: number;
  capacity: number;
}

// ---- Booking ----
export interface BookingRequest {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  roomsCount: number;
}

export interface BookingDto {
  id: number;
  roomsCount: number;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt: string;
  bookingStatus: BookingStatus;
  guests?: GuestDto[];
  amount: number;
}

export interface BookingPaymentInitResponse {
  sessionUrl: string;
}

export interface BookingStatusResponse {
  bookingStatus: BookingStatus;
}

// ---- Inventory ----
export interface InventoryDto {
  id: number;
  date: string;
  bookedCount: number;
  reservedCount: number;
  totalCount: number;
  surgeFactor: number;
  price: number;
  closed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateInventoryRequest {
  startDate: string;
  endDate: string;
  surgeFactor: number;
  closed: boolean;
}

// ---- Reports ----
export interface HotelReportDto {
  bookingCount: number;
  totalRevenue: number;
  avgRevenue: number;
}

// ---- API Response Wrapper ----
// The backend wraps ALL successful responses in this format
export interface ApiResponse<T> {
  timeStamp: string;
  data: T;
  error: ApiError | null;
}

export interface ApiError {
  status: string;
  message: string;
  subErrors?: string[];
}

// ---- Pagination (Spring Data Page) ----
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}
