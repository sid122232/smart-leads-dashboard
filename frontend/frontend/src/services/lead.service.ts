import { apiClient } from './apiClient';
import {
  ApiResponse,
  Lead,
  PaginatedData,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '@/types';

const buildParams = (filters: LeadFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sort) params.sort = filters.sort;
  return params;
};

export const leadService = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedData<Lead>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Lead>>>('/leads', {
      params: buildParams(filters),
    });
    return data.data!;
  },

  getLead: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data.data!;
  },

  createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    return data.data!;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data.data!;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  exportCsv: async (filters: Omit<LeadFilters, 'page' | 'limit'>): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>('/leads/export', {
      params: buildParams(filters as LeadFilters),
      responseType: 'blob',
    });
    return data;
  },
};