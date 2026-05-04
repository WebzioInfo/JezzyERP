"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When pathname changes, it means navigation completed
    setIsNavigating(false);
    setProgress(0);
  }, [pathname]);

  // We need to hook into link clicks to show the "pre-navigation" loading state
  // In Next.js App Router, this is tricky without a custom Link or patching router
  // A simpler way for "premium" feel is to watch for the window 'beforeunload' or similar
  // but for SPA navigation, we can use a global event listener on clicks
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && 
          anchor.href && 
          anchor.href.startsWith(window.location.origin) && 
          anchor.target !== "_blank" &&
          anchor.href !== window.location.href // Only if different page
      ) {
        setIsNavigating(true);
        // Start progress
        let interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 5;
          });
        }, 100);
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-slate-100 overflow-hidden"
        >
          <motion.div
            className="h-full bg-linear-to-r from-indigo-500 via-primary-600 to-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
