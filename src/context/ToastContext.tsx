"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  const success = (msg: string) => toast(msg, 'success');
  const error = (msg: string) => toast(msg, 'error');
  const info = (msg: string) => toast(msg, 'info');

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              flex items-start gap-3 p-4 rounded-2xl shadow-2xl border-2 pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-300 min-w-[320px] max-w-md
              ${t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : ''}
              ${t.type === 'error' ? 'bg-danger-50 border-danger-100 text-danger-900' : ''}
              ${t.type === 'info' ? 'bg-primary-50 border-primary-100 text-primary-900' : ''}
            `}
          >
            <div className={`shrink-0 mt-0.5 ${t.type === 'success' ? 'text-emerald-500' : t.type === 'error' ? 'text-danger-500' : 'text-primary-500'}`}>
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {t.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-0.5">{t.type}</p>
              <p className="text-sm font-bold leading-tight">{t.message}</p>
            </div>

            <button 
              onClick={() => removeToast(t.id)} 
              className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 opacity-40" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
