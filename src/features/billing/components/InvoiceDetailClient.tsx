"use client";

import React, { useState } from "react";
import { InvoiceActions, StatusBadge } from "@/features/billing/components";
import InvoicePreview from "@/features/billing/components/InvoicePreview";
import { formatCurrency } from "@/utils/financials";
import { cn } from "@/utils";

interface InvoiceDetailClientProps {
    invoice: any;
}

function StatSmall({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
    return (
        <div className={cn(
            "p-4 rounded-3xl border border-slate-100 shadow-sm",
            highlight ? "bg-red-50 ring-1 ring-red-200" : "bg-white"
        )}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 whitespace-nowrap">{label}</p>
            <p className={cn(
                "text-sm font-black italic",
                highlight ? "text-red-700" : "text-slate-900"
            )}>{value}</p>
        </div>
    );
}

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {

    const grandTotal = Number(invoice.grandTotal || 0);
    const totalPaid = invoice.allocations?.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0) || 0;
    const balanceDue = grandTotal - totalPaid;


    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-full">
                <InvoiceActions 
                    invoiceId={invoice.id} 
                    status={invoice.status} 
                />
            </div>

            {/* ── PDF Document Preview ── */}
            <div className="card border-0 shadow-2xl ring-1 ring-slate-900/5 p-0 overflow-hidden rounded-4xl bg-slate-100/50">
                <InvoicePreview invoice={invoice} />
            </div>

            {/* ── Quick Stats Footer ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatSmall label="Status" value={<StatusBadge status={invoice.status} />} />
                <StatSmall label="Total Amount" value={formatCurrency(grandTotal)} />
                <StatSmall label="Amount Paid" value={formatCurrency(totalPaid)} />
                <StatSmall label="Balance Due" value={formatCurrency(balanceDue)} highlight={balanceDue > 0} />
            </div>
        </div>
    );
}
