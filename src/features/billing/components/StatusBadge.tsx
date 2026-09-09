"use client";

import { memo } from "react";

type StatusType =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "PARTIAL"
  | "ACCEPTED"
  | "REJECTED"
  | "CONVERTED";

interface StatusBadgeProps {
  status: string | StatusType;
  className?: string;
}

const statusMap: Record<string, { label: string; class: string }> = {
  // Common / Invoice Statuses
  DRAFT: { label: "Draft", class: "bg-slate-100 text-slate-700 border-slate-200" },
  SENT: { label: "Sent", class: "bg-blue-50 text-blue-700 border-blue-200" },
  PAID: { label: "Paid", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  OVERDUE: { label: "Overdue", class: "bg-rose-50 text-rose-700 border-rose-200" },
  PARTIAL: { label: "Partial", class: "bg-amber-50 text-amber-700 border-amber-200" },

  // Quotation Specific Statuses
  ACCEPTED: { label: "Accepted", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", class: "bg-rose-50 text-rose-700 border-rose-200" },
  CONVERTED: { label: "Invoiced", class: "bg-slate-100 text-slate-800 border-slate-300" },
};

export const StatusBadge = memo(function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const upper = (status || "").toUpperCase();
  const s = statusMap[upper] || { label: status, class: "bg-slate-100 text-slate-700 border-slate-200" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${s.class} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {s.label}
    </span>
  );
});
