"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    maxWidth = "max-w-4xl",
    className
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-900/60 backdrop-blur-xl"
                    data-lenis-prevent
                >
                    {/* Centering Wrapper - Handles backdrop clicks */}
                    <div 
                        className="min-h-full w-full flex items-center justify-center p-4 md:p-10"
                        onClick={onClose}
                    >
                        {/* Modal Content - Stop propagation to prevent closing on internal clicks */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "relative w-full bg-white rounded-[2.5rem] shadow-2xl border border-white/20 animate-reveal",
                                maxWidth,
                                className
                            )}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 z-10 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-0">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
