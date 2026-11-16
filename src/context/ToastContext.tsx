"use client";

import React, { createContext, useContext, useCallback } from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useCallback((message: string, type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        sonnerToast.success(message);
        break;
      case 'error':
        sonnerToast.error(message);
        break;
      default:
        sonnerToast.info(message);
        break;
    }
  }, []);

  const success = useCallback((msg: string) => sonnerToast.success(msg), []);
  const error = useCallback((msg: string) => sonnerToast.error(msg), []);
  const info = useCallback((msg: string) => sonnerToast.info(msg), []);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton
        theme="light"
        toastOptions={{
          style: {
            borderRadius: '0.5rem',
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
          },
          className: "font-sans font-medium",
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
