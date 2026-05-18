import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getInitials } from '@/utils';
import { useAuthStore } from '@/store/authStore';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-white/10">
            {['Lead', 'Status', 'Source', 'Added', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.03]"
            >
              {/* Lead name + email */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</p>
                    <p className="text-xs text-gray-400">{lead.email}</p>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>

              {/* Source */}
              <td className="px-4 py-3">
                <SourceBadge source={lead.source} />
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-xs text-gray-400">
                {formatDate(lead.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link to={`/leads/${lead._id}`}>
                    <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="size-3.5" />}>
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil className="size-3.5" />}
                    onClick={() => onEdit(lead)}
                  >
                    Edit
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="size-3.5 text-red-400" />}
                      onClick={() => onDelete(lead)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};