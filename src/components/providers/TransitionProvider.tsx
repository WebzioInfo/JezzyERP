"use client";

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
            smoothWheel: true,
            // Disable syncTouch to prevent touchpad scrolling conflicts
            syncTouch: false,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait">
                <m.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {children}
                </m.div>
            </AnimatePresence>
        </LazyMotion>
    );
}
