"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { Loader2, FileWarning } from "lucide-react";
import { Button } from "@/ui/core/Button";

interface PDFPreviewProps {
    invoiceId: string;
}

export function PDFPreview({ invoiceId }: PDFPreviewProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let url: string | null = null;

        const loadPdf = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await apiClient.post("/api/invoices/download", { invoiceId }, {
                    responseType: 'blob'
                });
                url = URL.createObjectURL(res.data);
                setPdfUrl(url);
            } catch (err: any) {
                console.error("[PREVIEW_LOAD_ERROR]", err);
                setError("Failed to generate PDF preview.");
            } finally {
                setIsLoading(false);
            }
        };

        if (invoiceId) {
            loadPdf();
        }

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [invoiceId]);

    if (isLoading) {
        return (
            <div className="w-full aspect-[1/1.4] bg-slate-50 flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 animate-pulse">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Synchronizing Document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full aspect-[1/1.4] bg-red-50/50 flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-red-200">
                <div className="flex flex-col items-center gap-3">
                    <FileWarning className="w-10 h-10 text-red-500/50" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4 rounded-xl text-[10px] uppercase tracking-widest font-black">Retry Terminal</Button>
                </div>
            </div>
        );
    }

    if (!pdfUrl) return null;

    return (
        <div className="w-full aspect-[1/1.41] bg-white shadow-2xl ring-1 ring-slate-950/10 rounded-[2.5rem] overflow-hidden group relative">
            <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0 absolute inset-0 bg-slate-100"
                title="Invoice Document Preview"
            />
            
            {/* Design Overlays */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Exact Print Preview v4.0
                </div>
            </div>
        </div>
    );
}
