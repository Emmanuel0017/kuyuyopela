import { create } from 'zustand';

interface ToastState {
  message: string | null;
  kind: 'success' | 'error' | 'info';
  show: (message: string, kind?: 'success' | 'error' | 'info') => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  kind: 'info',
  show: (message, kind = 'success') => {
    set({ message, kind });
    setTimeout(() => set({ message: null }), 2800);
  },
  hide: () => set({ message: null }),
}));

export const useToast = () => useToastStore((s) => s.show);