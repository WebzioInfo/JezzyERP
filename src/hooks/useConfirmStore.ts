import { create } from 'zustand';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmStore {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  setResult: (result: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  options: null,
  resolve: null,
  confirm: (options) => {
    return new Promise((resolve) => {
      set({ isOpen: true, options, resolve });
    });
  },
  setResult: (result) => {
    set((state) => {
      if (state.resolve) state.resolve(result);
      return { isOpen: false, options: null, resolve: null };
    });
  },
}));
