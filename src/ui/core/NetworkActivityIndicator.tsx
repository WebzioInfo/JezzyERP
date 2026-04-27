"use client";

import { useLoadingStore } from "@/lib/store/useLoadingStore";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

export function NetworkActivityIndicator() {
  const activeRequests = useLoadingStore((state) => state.activeRequests);

  return (
    <AnimatePresence>
      {activeRequests > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
        >
          <div className="relative">
            <Globe className="w-4 h-4 text-primary-400 animate-pulse" />
            <div className="absolute inset-0 bg-primary-400/20 blur-md rounded-full animate-ping" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
            Network Syncing ({activeRequests})
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
