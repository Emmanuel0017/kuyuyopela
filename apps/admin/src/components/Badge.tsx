import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface Props {
  status: string;
  children?: ReactNode;
}

const VARIANT: Record<string, string> = {
  PENDING:     'badge-pending',
  PROCESSING:  'badge-processing',
  SHIPPED:     'badge-shipped',
  DELIVERED:   'badge-delivered',
  CANCELLED:   'badge-cancelled',
  APPROVED:    'badge-approved',
  REJECTED:    'badge-rejected',
};

export function Badge({ status, children }: Props) {
  const variant = VARIANT[status?.toUpperCase()] ?? 'badge-default';
  return <span className={cn('badge', variant)}>{children ?? status}</span>;
}