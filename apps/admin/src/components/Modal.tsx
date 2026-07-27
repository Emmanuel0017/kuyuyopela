import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: Props) {
  if (!open) return null;
  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className={cn('modal-box relative', className)} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}