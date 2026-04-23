"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useConfirmStore } from '@/hooks/useConfirmStore';
import { Button } from './Button';
import { cn } from '@/utils';

export function ConfirmDialog() {
  const { isOpen, options, setResult } = useConfirmStore();

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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setResult(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                type === 'danger' && "bg-red-50 text-red-500",
                type === 'warning' && "bg-amber-50 text-amber-500",
                type === 'info' && "bg-blue-50 text-blue-500"
              )}>
                {type === 'danger' && <AlertCircle className="w-6 h-6" />}
                {type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                {type === 'info' && <Info className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{title}</h3>
            </div>
            
            <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-tight italic opacity-80">
              {message}
            </p>

            <div className="flex items-center gap-3 mt-10">
              <Button
                variant="ghost"
                onClick={() => setResult(false)}
                className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                {cancelText}
              </Button>
              <Button
                variant={type === 'danger' ? 'danger' : 'primary'}
                onClick={() => setResult(true)}
                className={cn(
                    "flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl",
                    type === 'danger' && "shadow-red-500/20",
                    type === 'warning' && "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 border-none"
                )}
              >
                {confirmText}
              </Button>
            </div>
          </div>
          
          <button 
            onClick={() => setResult(false)}
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
