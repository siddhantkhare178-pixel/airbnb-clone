import api, { setAccessToken } from './api';
import type { SignUpRequest, LoginResponse, UserDto } from '../types';

export const authService = {
  signup: async (data: SignUpRequest): Promise<UserDto> => {
    const response = await api.post<UserDto>('/auth/signup', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    const loginData = response.data;
    setAccessToken(loginData.accessToken);
    return loginData;
  },

  refresh: async (): Promise<string> => {
    const response = await api.post<LoginResponse>('/auth/refresh');
    const newToken = response.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  },

  logout: () => {
    setAccessToken(null);
  },
};
