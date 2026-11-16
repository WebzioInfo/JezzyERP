"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import {
  FileText,
  Download,
  Loader2,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  FileCheck2,
  Plus
} from "lucide-react";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { InvoiceListActions } from "@/features/billing/components/InvoiceListActions";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";
import { Button } from "@/ui/core/Button";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/index";

export interface InvoiceRowItem {
  id: string;
  sequenceNumber?: number | null;
  invoiceNo: string;
  date: Date | string;
  grandTotal: number | { toNumber?: () => number };
  status: string;
  ewayBill?: string | null;
  ewayBillUrl?: string | null;
  client: { id: string; name: string };
}

interface InvoiceTableProps {
  invoices: InvoiceRowItem[];
  statusFilter?: string;
  searchQuery?: string;
}

export function InvoiceTable({ invoices, statusFilter = "", searchQuery = "" }: InvoiceTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const allIds = useMemo(() => invoices.map((inv) => inv.id), [invoices]);
  const isAllSelected = invoices.length > 0 && selectedIds.size === invoices.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < invoices.length;

  // Set indeterminate state on select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  // Clear selections when invoices list changes completely (e.g. searching/filtering)
  useEffect(() => {
    setSelectedIds((prev) => {
      const validIds = new Set<string>();
      prev.forEach((id) => {
        if (allIds.includes(id)) validIds.add(id);
      });
      return validIds;
    });
  }, [allIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const toggleSelectRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
      const selectedArray = Array.from(selectedIds);
      const res = await fetch("/api/invoices/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceIds: selectedArray,
          format: "ORIGINAL"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download bulk invoices");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const disposition = res.headers.get("Content-Disposition");
      let filename = `JEZZY_Bulk_Invoices_${new Date().toISOString().split("T")[0]}.zip`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      success(`Successfully exported ${selectedArray.length} invoice${selectedArray.length > 1 ? "s" : ""} as ZIP.`);
    } catch (err: any) {
      console.error("[BULK_DOWNLOAD_ERROR]", err);
      error(err.message || "Failed to download bulk invoices. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center p-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
          <FileText className="w-5 h-5" />
        </div>
        <p className="font-semibold text-slate-900 text-sm">No invoices found</p>
        <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm">
          {searchQuery || statusFilter
            ? "Adjust your search filters or status tab to find matching records."
            : "Create your first invoice to start billing."}
        </p>
        <Link href="/invoices/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            New Invoice
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ── Floating Selection Action Bar ── */}
      {selectedIds.size > 0 && (
        <div className="sticky top-2 z-30 mx-3 mb-3 p-2.5 sm:px-4 bg-slate-900 text-white rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-white">{selectedIds.size}</span>
              <span className="text-slate-300 ml-1">
                of {invoices.length} invoice{selectedIds.size > 1 ? "s" : ""} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAllSelected && (
              <button
                type="button"
                onClick={() => setSelectedIds(new Set(allIds))}
                className="text-xs text-slate-300 hover:text-white underline cursor-pointer px-2 py-1"
              >
                Select all ({invoices.length})
              </button>
            )}

            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkDownload}
              disabled={isDownloading}
              className="bg-white text-slate-900 hover:bg-slate-100 border-none font-medium text-xs shadow-xs"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Generating ZIP...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download ZIP ({selectedIds.size})
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Invoices Data Table ── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center px-3">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all invoices on this page"
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 cursor-pointer accent-slate-900"
                />
              </div>
            </TableHead>
            <TableHead className="w-16">Seq #</TableHead>
            <TableHead className="w-44">Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => {
            const isSelected = selectedIds.has(inv.id);
            const rawAmount = typeof inv.grandTotal === "object" && inv.grandTotal && "toNumber" in inv.grandTotal
              ? inv.grandTotal.toNumber?.() ?? 0
              : Number(inv.grandTotal || 0);

            const hasEwayBill = Boolean(inv.ewayBill || inv.ewayBillUrl);

            return (
              <TableRow
                key={inv.id}
                className={cn(
                  "group transition-colors cursor-default",
                  isSelected ? "bg-slate-50/90 font-medium" : "hover:bg-slate-50/60"
                )}
              >
                {/* Selection Checkbox */}
                <TableCell className="text-center px-3">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(inv.id)}
                      aria-label={`Select invoice ${inv.invoiceNo}`}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 cursor-pointer accent-slate-900"
                    />
                  </div>
                </TableCell>

                {/* Sequence Number */}
                <TableCell className="font-mono text-slate-500 text-xs">
                  {String(inv.sequenceNumber || 1).padStart(2, "0")}
                </TableCell>

                {/* Invoice Number + E-Way Bill Badge */}
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="hover:underline hover:text-slate-700"
                    >
                      {inv.invoiceNo}
                    </Link>
                    {hasEwayBill && (
                      <span
                        title={inv.ewayBill ? `E-Way Bill: ${inv.ewayBill}` : "E-Way Bill attached"}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        <FileCheck2 className="w-2.5 h-2.5" />
                        EWB
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Client Link */}
                <TableCell>
                  <Link
                    href={`/clients/${inv.client.id}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {inv.client.name}
                  </Link>
                </TableCell>

                {/* Date */}
                <TableCell className="hidden sm:table-cell text-slate-500 text-xs">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }).format(new Date(inv.date))}
                </TableCell>

                {/* Grand Total Amount */}
                <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(rawAmount)}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="text-center">
                  <StatusBadge status={inv.status} />
                </TableCell>

                {/* Actions Menu */}
                <TableCell className="text-right">
                  <InvoiceListActions
                    invoiceId={inv.id}
                    isTrashed={statusFilter === "TRASH"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
