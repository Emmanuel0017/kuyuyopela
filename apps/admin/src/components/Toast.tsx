import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

export function ToastHost() {
  const { message, kind } = useToastStore();
  if (!message) return null;
  const Icon = kind === 'error' ? AlertCircle : kind === 'success' ? CheckCircle2 : Info;
  return (
    <div className="toast-host">
      <div className={`toast ${kind === 'error' ? 'error' : ''}`}>
        <Icon size={18} />
        <span>{message}</span>
      </div>
    </div>
  );
}