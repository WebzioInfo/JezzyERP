import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  expandedSections: string[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSection: (label: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      expandedSections: ["Overview", "Billing", "Management"], // Default expanded
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleSection: (label) => set((state) => ({
        expandedSections: state.expandedSections.includes(label)
          ? state.expandedSections.filter(l => l !== label)
          : [...state.expandedSections, label]
      })),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ 
        sidebarCollapsed: state.sidebarCollapsed,
        expandedSections: state.expandedSections 
      }),
    }
  )
);
