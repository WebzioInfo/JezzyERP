"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Download, FileText, Calendar, Filter, 
  Loader2, CheckCircle2, AlertCircle, Printer, Zap 
} from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card } from "@/ui/core/Card";
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
  const [preview, setPreview] = useState<{ count: number; estimatedSize: string } | null>(null);
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
      
      success("Export completed! Your ZIP file is ready.");
      onClose();
    } catch (err) {
      error("Failed to generate bulk export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <Card className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border-0 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">Bulk Invoice Export</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Export multiple records into a secure ZIP archive</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Filters */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Date Range</label>
                <select 
                  value={range} 
                  onChange={(e) => setRange(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                >
                  {RANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              {range === "custom" && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Client Filter</label>
                <select 
                  value={clientId} 
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                >
                  <option value="">All Clients</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">GST Type</label>
                  <select 
                    value={gstType} 
                    onChange={(e) => setGstType(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="CGST_SGST">B2B (CGST/SGST)</option>
                    <option value="IGST">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Format & Preview */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 italic">Select Output Protocol</label>
                <div className="grid grid-cols-1 gap-3">
                  {FORMAT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = format === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormat(opt.value)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                          isActive 
                            ? "bg-primary-50/50 border-primary-500 shadow-lg shadow-primary-500/10" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          isActive ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        )}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className={cn("text-xs font-black uppercase tracking-widest", isActive ? "text-primary-900" : "text-slate-700")}>{opt.label}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Stats */}
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Pre-Export Audit</p>
                    {isLoadingPreview ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500 mt-2" />
                    ) : (
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-black italic">{preview?.count || 0}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Documents</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Est. Size</p>
                    <p className="text-sm font-black italic mt-1">{preview?.estimatedSize || "0.00 MB"}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-3 py-1.5 rounded-full w-fit">
                  <CheckCircle2 size={10} />
                  Ready for Synchronized Compression
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={onClose}
              disabled={isExporting}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              Cancel Protocol
            </button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || !preview || preview.count === 0}
              size="lg"
              className="h-14 px-10 italic rounded-2xl shadow-xl shadow-primary-500/20 group relative overflow-hidden"
            >
              {isExporting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Archive...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  Initiate ZIP Download
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
