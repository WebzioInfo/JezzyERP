"use client";

import React, { useState, useEffect } from "react";
import {
  Download, FileText, Zap,
  Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Modal } from "@/ui/core/Modal";
import { useToast } from "@/context/ToastContext";
import apiClient from "@/lib/apiClient";
import { cn } from "@/utils/index";

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Custom Range", value: "custom" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
];

const FORMAT_OPTIONS = [
  { label: "Standard PDF", value: "ORIGINAL", icon: FileText, desc: "A4 Professional Layout" },
  { label: "Thermal Print", value: "THERMAL", icon: Zap, desc: "80mm POS Optimized" },
];

export function BulkExportModal({ isOpen, onClose }: BulkExportModalProps) {
  const [range, setRange] = useState("last30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("");
  const [gstType, setGstType] = useState("");
  const [format, setFormat] = useState("ORIGINAL");

  const [clients, setClients] = useState<any[]>([]);
  const [preview, setPreview] = useState<{ 
    count: number; 
    estimatedSize: string; 
    invoices?: { id: string; invoiceNo: string; grandTotal: number | string; client?: { name: string } }[] 
  } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { success, error, info } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchPreview();
    }
  }, [range, startDate, endDate, clientId, status, gstType, isOpen]);

  const fetchClients = async () => {
    try {
      const res = await apiClient.get("/api/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const fetchPreview = async () => {
    setIsLoadingPreview(true);
    try {
      const params = new URLSearchParams({ range, clientId, status, gstType });
      if (range === "custom") {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }
      const res = await apiClient.get(`/api/invoices/export/preview?${params.toString()}`);
      setPreview(res.data);
    } catch (err) {
      console.error("Preview failed", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleExport = async () => {
    if (!preview || preview.count === 0) {
      error("No invoices found to export.");
      return;
    }

    setIsExporting(true);
    info(`Initiating export for ${preview.count} invoices...`);

    try {
      const res = await fetch("/api/invoices/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          range, startDate, endDate, clientId, status, gstType, format
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoices_Bulk_Export_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      success("Export completed. Your ZIP file has been downloaded.");
      onClose();
    } catch {
      error("Failed to generate bulk export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Invoice Export"
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Filters */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Date Range</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                {RANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {range === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Client Filter</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All Clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">GST Type</label>
                <select
                  value={gstType}
                  onChange={(e) => setGstType(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">All Types</option>
                  <option value="CGST_SGST">State (CGST/SGST)</option>
                  <option value="IGST">Inter-State (IGST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Format & Preview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 block">Document Format</label>
              <div className="grid grid-cols-1 gap-2.5">
                {FORMAT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = format === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormat(opt.value)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer",
                        isActive
                          ? "bg-slate-50 border-slate-900 ring-1 ring-slate-900"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center transition-colors shrink-0",
                        isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className={cn("text-xs font-semibold", isActive ? "text-slate-900" : "text-slate-700")}>{opt.label}</p>
                        <p className="text-[11px] text-slate-500">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Stats */}
            <div className="bg-slate-900 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Matching Documents</p>
                  {isLoadingPreview ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
                  ) : (
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold tabular-nums">{preview?.count || 0}</span>
                      <span className="text-xs text-slate-400">invoices</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Est. Archive Size</p>
                  <p className="text-sm font-semibold mt-1 tabular-nums">{preview?.estimatedSize || "0.00 MB"}</p>
                </div>
              </div>

              {!isLoadingPreview && preview?.invoices && preview.invoices.length > 0 && (
                <div className="mt-3 bg-slate-800/80 rounded-lg max-h-28 overflow-y-auto custom-scrollbar p-2.5">
                  <ul className="space-y-1.5">
                    {preview.invoices.map((inv) => (
                      <li key={inv.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium truncate w-1/3">{inv.invoiceNo}</span>
                        <span className="text-slate-400 truncate w-1/3 text-left text-[11px]">{inv.client?.name || "Unknown"}</span>
                        <span className="text-slate-300 font-semibold text-right w-1/3 tabular-nums">₹{Number(inv.grandTotal).toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                  {preview.count > preview.invoices.length && (
                    <p className="text-[11px] text-slate-400 mt-2 text-center">+ {preview.count - preview.invoices.length} more documents</p>
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Ready for export</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || !preview || preview.count === 0}
            loading={isExporting}
          >
            <Download className="w-4 h-4 mr-1.5" />
            {isExporting ? "Generating ZIP..." : "Download ZIP Archive"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
