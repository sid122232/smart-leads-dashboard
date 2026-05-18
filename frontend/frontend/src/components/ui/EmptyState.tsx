import { Users } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
      {icon ?? <Users className="size-7" />}
    </div>
    <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {action && (
      <Button onClick={action.onClick} size="sm">
        {action.label}
      </Button>
    )}
  </div>
);