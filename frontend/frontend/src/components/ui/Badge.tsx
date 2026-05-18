import { cn } from '@/utils';
import { LeadStatus, LeadSource } from '@/types';
import { getStatusColor, getSourceColor } from '@/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      getStatusColor(status),
      className
    )}
  >
    {status}
  </span>
);

export const SourceBadge = ({ source, className }: SourceBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      getSourceColor(source),
      className
    )}
  >
    {source}
  </span>
);