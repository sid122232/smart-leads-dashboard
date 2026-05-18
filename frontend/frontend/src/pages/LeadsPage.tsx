import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadForm } from '@/components/leads/LeadForm';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Lead, LeadFilters } from '@/types';

const defaultFilters: LeadFilters = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

export const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    document.title = 'Leads — SmartLeads';
  }, []);

  const { data, isLoading, isError } = useLeads(filters);
  const deleteMutation = useDeleteLead();

  const leads = data?.data ?? [];
  const pagination = data?.pagination;

  const handleFilterChange = (partial: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete "${lead.name}"? This cannot be undone.`)) return;
    await deleteMutation.mutateAsync(lead._id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const hasActiveFilters = !!(filters.status || filters.source || filters.search);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Leads</h1>
          {pagination && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {pagination.total} total lead{pagination.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button
          leftIcon={<Plus className="size-4" />}
          onClick={() => setIsFormOpen(true)}
        >
          Log lead
        </Button>
      </div>

      {/* Filters bar */}
      <div className="mb-4">
        <LeadFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Content */}
      <div className="rounded-xl border border-gray-100 bg-white dark:border-white/10 dark:bg-zinc-900-2">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={8} />
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load leads"
            description="Something went wrong fetching your leads. Please try again."
            action={{ label: 'Retry', onClick: () => setFilters({ ...filters }) }}
          />
        ) : leads.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No leads match your filters' : 'No leads yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first lead using the button above.'
            }
            action={
              hasActiveFilters
                ? { label: 'Clear filters', onClick: () => setFilters(defaultFilters) }
                : { label: 'Log your first lead', onClick: () => setIsFormOpen(true) }
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <LeadTable leads={leads} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 p-4 sm:hidden">
              {leads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <Pagination
                meta={pagination}
                onPageChange={(page) => handleFilterChange({ page })}
              />
            )}
          </>
        )}
      </div>

      {/* Create / Edit modal */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingLead={editingLead}
      />
    </div>
  );
};