import { Lead, LeadStatus } from '@/types';
import { LEAD_STATUSES, getStatusColor } from '@/utils';

interface StatusChartProps {
  leads: Lead[];
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#22c55e',
  Lost: '#ef4444',
};

export const StatusChart = ({ leads }: StatusChartProps) => {
  const total = leads.length;

  const counts = LEAD_STATUSES.reduce<Record<LeadStatus, number>>(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status).length;
      return acc;
    },
    { New: 0, Contacted: 0, Qualified: 0, Lost: 0 }
  );

  if (total === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-gray-100 bg-white dark:border-white/10 dark:bg-zinc-900-2">
        <p className="text-sm text-gray-400">No lead data yet</p>
      </div>
    );
  }

  // Build donut segments
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = LEAD_STATUSES.map((status) => {
    const pct = counts[status] / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const segment = { status, count: counts[status], pct, dash, gap, offset };
    offset += dash;
    return segment;
  }).filter((s) => s.count > 0);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900-2">
      <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">Leads by status</h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="currentColor"
              className="text-gray-100 dark:text-white/5" strokeWidth="18" />
            {segments.map((seg) => (
              <circle
                key={seg.status}
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={STATUS_COLORS[seg.status]}
                strokeWidth="18"
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={-(seg.offset - circumference / 4)}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{total}</span>
            <span className="text-xs text-gray-400">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {LEAD_STATUSES.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="size-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{status}</span>
              <span className="ml-auto text-xs font-medium text-gray-900 dark:text-gray-100">
                {counts[status]}
              </span>
              <span className="text-xs text-gray-400">
                ({total > 0 ? Math.round((counts[status] / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};