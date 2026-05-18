import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService } from '@/services/lead.service';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { PageLoader } from '@/components/ui/Loading';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLead(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (lead) document.title = `${lead.name} — SmartLeads`;
    else document.title = 'Lead detail — SmartLeads';
  }, [lead]);

  if (isLoading) return <PageLoader />;

  if (isError || !lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Lead not found</p>
        <p className="mt-1 text-sm text-gray-500">
          This lead may have been deleted or you don't have access.
        </p>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="size-4" />}
          onClick={() => navigate('/leads')}
          className="mt-4"
        >
          Back to leads
        </Button>
      </div>
    );
  }

  return <LeadDetail lead={lead} />;
};