"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useConfirmStore } from '@/hooks/useConfirmStore';
import { Button } from './Button';
import { cn } from '@/utils';

export function ConfirmDialog() {
  const { isOpen, options, setResult } = useConfirmStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setResult(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setResult]);

  if (!isOpen || !options) return null;

  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning",
  } = options;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => setResult(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10"
        >
          <div className="p-6">
            <div className="flex items-start gap-3.5 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                type === 'danger' && "bg-red-50 text-red-600",
                type === 'warning' && "bg-amber-50 text-amber-600",
                type === 'info' && "bg-blue-50 text-blue-600"
              )}>
                {type === 'danger' && <AlertCircle className="w-5 h-5" />}
                {type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h3 id="confirm-dialog-title" className="text-base font-semibold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setResult(false)}
                className="min-w-20"
              >
                {cancelText}
              </Button>
              <Button
                variant={type === 'danger' ? 'danger' : 'primary'}
                size="md"
                onClick={() => setResult(true)}
                className="min-w-20"
              >
                {confirmText}
              </Button>
            </div>
          </div>
          
          <button 
            onClick={() => setResult(false)}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
