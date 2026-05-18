import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Calendar, User, Globe } from 'lucide-react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LeadForm } from './LeadForm';
import { useDeleteLead } from '@/hooks/useLeads';
import { formatDateTime, getInitials } from '@/utils';
import { useAuthStore } from '@/store/authStore';

interface LeadDetailProps {
  lead: Lead;
}

export const LeadDetail = ({ lead }: LeadDetailProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const deleteMutation = useDeleteLead();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${lead.name}"? This action cannot be undone.`)) return;
    await deleteMutation.mutateAsync(lead._id);
    navigate('/leads');
  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft className="size-4" />
          Back to leads
        </button>

        {/* Header card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-white/10 dark:bg-zinc-900-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                {getInitials(lead.name)}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{lead.name}</h1>
                <p className="text-sm text-gray-500">{lead.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Pencil className="size-3.5" />}
                onClick={() => setIsEditOpen(true)}
              >
                Edit
              </Button>
              {isAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Trash2 className="size-3.5" />}
                  onClick={handleDelete}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-white/5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="mt-3 rounded-xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900-2">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
            Details
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-500">Created</span>
              <span className="ml-auto text-gray-900 dark:text-gray-100">
                {formatDateTime(lead.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-500">Last updated</span>
              <span className="ml-auto text-gray-900 dark:text-gray-100">
                {formatDateTime(lead.updatedAt)}
              </span>
            </div>

            {lead.createdBy && (
              <div className="flex items-center gap-3 text-sm">
                <User className="size-4 flex-shrink-0 text-gray-400" />
                <span className="text-gray-500">Created by</span>
                <span className="ml-auto text-gray-900 dark:text-gray-100">
                  {lead.createdBy.name}
                </span>
              </div>
            )}

            {lead.assignedTo && (
              <div className="flex items-center gap-3 text-sm">
                <User className="size-4 flex-shrink-0 text-gray-400" />
                <span className="text-gray-500">Assigned to</span>
                <span className="ml-auto text-gray-900 dark:text-gray-100">
                  {lead.assignedTo.name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <Globe className="size-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-500">Source</span>
              <span className="ml-auto">
                <SourceBadge source={lead.source} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <LeadForm isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} editingLead={lead} />
    </>
  );
};