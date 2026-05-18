import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getInitials } from '@/utils';
import { useAuthStore } from '@/store/authStore';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadCard = ({ lead, onEdit, onDelete }: LeadCardProps) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-zinc-900-2">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
          {getInitials(lead.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate dark:text-gray-100">{lead.name}</p>
          <p className="text-xs text-gray-400 truncate">{lead.email}</p>
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(lead.createdAt)}</p>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={lead.status} />
        <SourceBadge source={lead.source} />
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1.5 border-t border-gray-50 pt-3 dark:border-white/5">
        <Link to={`/leads/${lead._id}`} className="flex-1">
          <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="size-3.5" />} className="w-full">
            View
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Pencil className="size-3.5" />}
          onClick={() => onEdit(lead)}
          className="flex-1"
        >
          Edit
        </Button>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="size-3.5" />}
            onClick={() => onDelete(lead)}
            className="flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};