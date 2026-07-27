import type { ReactNode, ElementType } from 'react';
import { cn } from '../lib/cn';
import { useReveal } from '../lib/useReveal';

type Variant = 'up' | 'left' | 'right' | 'zoom' | 'stagger';

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  as?: ElementType;
}

export function Reveal({ children, variant = 'up', className, as: Tag = 'div' }: Props) {
  const { ref, inView } = useReveal();
  const base =
    variant === 'left'  ? 'reveal-left'  :
    variant === 'right' ? 'reveal-right' :
    variant === 'zoom'  ? 'reveal-zoom'  :
    variant === 'stagger' ? 'reveal-stagger' :
    'reveal';

  return (
    <Tag ref={ref} className={cn(base, inView && 'in', className)}>
      {children}
    </Tag>
  );
}