import api from './api';
import type {
  HotelSearchRequest,
  HotelPriceResponseDto,
  HotelInfoDto,
  HotelInfoRequestDto,
  Page,
} from '../types';

export const hotelService = {
  /**
   * Search hotels. Note: The backend uses @RequestBody on a GET endpoint,
   * so we send the search params as request body data via GET.
   * Axios supports this with the `data` config option.
   */
  searchHotels: async (params: HotelSearchRequest): Promise<Page<HotelPriceResponseDto>> => {
    const response = await api.request<Page<HotelPriceResponseDto>>({
      method: 'GET',
      url: '/hotels/search',
      data: params,
    });
    return response.data;
  },

  /**
   * Get hotel info with room prices.
   * Backend uses @RequestBody on a GET endpoint.
   */
  getHotelInfo: async (hotelId: number, params: HotelInfoRequestDto): Promise<HotelInfoDto> => {
    const response = await api.request<HotelInfoDto>({
      method: 'GET',
      url: `/hotels/${hotelId}/info`,
      data: params,
    });
    return response.data;
  },
};
