import { useState, useEffect } from 'react';
import { Search, Download, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useExportLeads } from '@/hooks/useLeads';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
}

export const LeadFiltersBar = ({ filters, onFilterChange }: LeadFiltersBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);
  const exportMutation = useExportLeads();

  // Sync debounced search value back to parent filters
  useEffect(() => {
    onFilterChange({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch]);

  const handleExport = () => {
    exportMutation.mutate({
      status: filters.status,
      source: filters.source,
      search: filters.search,
      sort: filters.sort,
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search by name or email…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          leftIcon={<Search className="size-4" />}
        />
      </div>

      {/* Status filter */}
      <div className="w-full sm:w-36">
        <Select
          value={filters.status ?? ''}
          onChange={(e) =>
            onFilterChange({
              status: (e.target.value as LeadStatus) || undefined,
              page: 1,
            })
          }
          placeholder="All statuses"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {/* Source filter */}
      <div className="w-full sm:w-36">
        <Select
          value={filters.source ?? ''}
          onChange={(e) =>
            onFilterChange({
              source: (e.target.value as LeadSource) || undefined,
              page: 1,
            })
          }
          placeholder="All sources"
        >
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {/* Sort */}
      <div className="w-full sm:w-32">
        <Select
          value={filters.sort ?? 'latest'}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as SortOrder, page: 1 })
          }
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </div>

      {/* Clear filters */}
      {(filters.status || filters.source || filters.search) && (
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setSearchInput('');
            onFilterChange({ status: undefined, source: undefined, search: undefined, page: 1 });
          }}
        >
          Clear
        </Button>
      )}

      {/* Export CSV */}
      <Button
        variant="secondary"
        size="md"
        leftIcon={<Download className="size-4" />}
        onClick={handleExport}
        isLoading={exportMutation.isPending}
      >
        Export
      </Button>
    </div>
  );
};