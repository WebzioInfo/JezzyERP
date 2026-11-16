"use client";

import React from "react";
import { InvoiceActions, StatusBadge } from "@/features/billing/components";
import InvoicePreview from "@/features/billing/components/InvoicePreview";
import { formatCurrency } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import { cn } from "@/utils";

interface InvoiceDetailClientProps {
    invoice: any;
}

function StatSmall({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
    return (
        <Card className={cn(
            highlight && "border-red-200 bg-red-50/30"
        )}>
            <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium mb-1 truncate">{label}</p>
                <div className={cn(
                    "text-base font-bold tabular-nums truncate",
                    highlight ? "text-red-700" : "text-slate-900"
                )}>{value}</div>
            </CardContent>
        </Card>
    );
}

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
    const grandTotal = Number(invoice.grandTotal || 0);
    const totalPaid = invoice.allocations?.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0) || 0;
    const balanceDue = grandTotal - totalPaid;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="w-full">
                <InvoiceActions 
                    invoiceId={invoice.id} 
                    status={invoice.status} 
                />
            </div>

            {/* ── Document Preview ── */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100/50 shadow-xs">
                <InvoicePreview invoice={invoice} />
            </div>

            {/* ── Quick Stats Footer ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatSmall label="Status" value={<StatusBadge status={invoice.status} />} />
                <StatSmall label="Total Amount" value={formatCurrency(grandTotal)} />
                <StatSmall label="Amount Paid" value={formatCurrency(totalPaid)} />
                <StatSmall label="Balance Due" value={formatCurrency(balanceDue)} highlight={balanceDue > 0} />
            </div>
        </div>
    );
}
