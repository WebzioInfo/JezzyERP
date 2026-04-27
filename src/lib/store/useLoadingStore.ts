import { create } from 'zustand';

interface LoadingStore {
  // Global app loading (e.g. route transitions)
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Scoped loading for specific actions (e.g. 'saving-invoice', 'uploading-file')
  scopedLoaders: Record<string, boolean>;
  startLoading: (scope: string) => void;
  stopLoading: (scope: string) => void;
  isLoading: (scope: string) => boolean;

  // Network activity counter
  activeRequests: number;
  incrementRequests: () => void;
  decrementRequests: () => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  isGlobalLoading: false,
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  scopedLoaders: {},
  startLoading: (scope) => 
    set((state) => ({ 
      scopedLoaders: { ...state.scopedLoaders, [scope]: true } 
    })),
  stopLoading: (scope) => 
    set((state) => ({ 
      scopedLoaders: { ...state.scopedLoaders, [scope]: false } 
    })),
  isLoading: (scope) => !!get().scopedLoaders[scope],

  activeRequests: 0,
  incrementRequests: () => set((state) => ({ activeRequests: state.activeRequests + 1 })),
  decrementRequests: () => set((state) => ({ activeRequests: Math.max(0, state.activeRequests - 1) })),
}));
