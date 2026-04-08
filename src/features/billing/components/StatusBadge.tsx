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
  DRAFT: { label: "Draft", class: "badge-draft" },
  SENT: { label: "Sent", class: "badge-sent" },
  PAID: { label: "Paid", class: "badge-paid" },
  OVERDUE: { label: "Overdue", class: "badge-overdue" },
  PARTIAL: { label: "Partial", class: "badge-partial" },

  // Quotation Specific Statuses
  ACCEPTED: { label: "Accepted", class: "badge-accepted" },
  REJECTED: { label: "Rejected", class: "badge-rejected" },
  CONVERTED: { label: "Invoiced", class: "badge-converted" }, // Invoiced/Converted
};

export const StatusBadge = memo(function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const s = statusMap[status.toUpperCase()] || { label: status, class: "badge-draft" };

  return (
    <span className={`${s.class} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md cursor-default ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {s.label}
    </span>
  );
});
