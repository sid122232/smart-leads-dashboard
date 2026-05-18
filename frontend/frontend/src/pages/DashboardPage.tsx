import { useEffect } from 'react';
import { Users, CheckCircle, XCircle, Phone } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { TableSkeleton } from '@/components/ui/Loading';
import { Lead } from '@/types';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = 'Dashboard — SmartLeads';
  }, []);

  // Fetch all leads for stats (high limit, no filters)
  const { data, isLoading } = useLeads({ limit: 100, page: 1 });
  const leads: Lead[] = data?.data ?? [];

  const total = data?.pagination.total ?? 0;
  const qualified = leads.filter((l) => l.status === 'Qualified').length;
  const contacted = leads.filter((l) => l.status === 'Contacted').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {greeting}, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your leads
        </p>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total leads"
            value={total}
            icon={Users}
            iconColor="text-brand-600"
            iconBg="bg-brand-50 dark:bg-brand-900/20"
          />
          <StatsCard
            title="Qualified"
            value={qualified}
            icon={CheckCircle}
            iconColor="text-green-600"
            iconBg="bg-green-50 dark:bg-green-900/20"
          />
          <StatsCard
            title="Contacted"
            value={contacted}
            icon={Phone}
            iconColor="text-yellow-600"
            iconBg="bg-yellow-50 dark:bg-yellow-900/20"
          />
          <StatsCard
            title="Lost"
            value={lost}
            icon={XCircle}
            iconColor="text-red-500"
            iconBg="bg-red-50 dark:bg-red-900/20"
          />
        </div>
      )}

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isLoading ? (
          <>
            <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
            <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          </>
        ) : (
          <>
            <StatusChart leads={leads} />

            {/* Recent leads summary */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900-2">
              <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent leads
              </h3>
              {leads.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No leads yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead._id} className="flex items-center gap-3 text-sm">
                      <div className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                          {lead.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">{lead.email}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-gray-400">{lead.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};