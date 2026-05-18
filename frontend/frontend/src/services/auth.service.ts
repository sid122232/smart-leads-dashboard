import { apiClient } from './apiClient';
import { ApiResponse, AuthResponse, User } from '@/types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', input);
    return data.data!;
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', input);
    return data.data!;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },
};