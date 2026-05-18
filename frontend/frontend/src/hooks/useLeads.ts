import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadService } from '@/services/lead.service';
import { LeadFilters, CreateLeadPayload, UpdateLeadPayload } from '@/types';

export const LEADS_QUERY_KEY = 'leads';

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadService.getLeads(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadService.createLead(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead created successfully');
    },
    onError: () => {
      toast.error('Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      leadService.updateLead(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead updated successfully');
    },
    onError: () => {
      toast.error('Failed to update lead');
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      toast.success('Lead deleted');
    },
    onError: () => {
      toast.error('Failed to delete lead');
    },
  });
}

export function useExportLeads() {
  return useMutation({
    mutationFn: (filters: Omit<LeadFilters, 'page' | 'limit'>) =>
      leadService.exportCsv(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    },
    onError: () => {
      toast.error('Failed to export leads');
    },
  });
}