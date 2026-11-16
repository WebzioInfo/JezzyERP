"use client";

import React, { useEffect, useState, useCallback } from 'react';
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
    maxWidth = "max-w-2xl",
    className
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-900/50 backdrop-blur-sm"
                    data-lenis-prevent
                    role="dialog"
                    aria-modal="true"
                    aria-label={title || "Dialog"}
                >
                    {/* Centering Wrapper */}
                    <div 
                        className="min-h-full w-full flex items-center justify-center p-4 sm:p-6"
                        onClick={onClose}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "relative w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden",
                                maxWidth,
                                className
                            )}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                aria-label="Close modal"
                                className="absolute top-4 right-4 z-20 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>

                            {title && (
                                <div className="px-6 py-4 border-b border-slate-100 pr-12">
                                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                                </div>
                            )}

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
