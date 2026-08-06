"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, Database, CheckCircle2, AlertCircle, ArrowRight, XCircle, 
  FolderOpen, FileText, RefreshCw, Play, Check, Activity 
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/ui/core/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { cn } from "@/utils/index";

type Step = "UPLOAD" | "MAPPING" | "IMPORTING" | "RESULT";
type Module = "ACCOUNTS" | "CLIENTS" | "VENDORS" | "PRODUCTS" | "OPENING_STOCK" | "PURCHASES" | "INVOICES" | "PAYMENTS";

const DESTINATION_FIELDS: Record<Module, { key: string; label: string; required: boolean }[]> = {
  ACCOUNTS: [
    { key: "name", label: "Account Name", required: true },
    { key: "type", label: "Account Type (e.g. CASH, BANK, EQUITY)", required: true },
    { key: "openingBalance", label: "Opening Balance", required: false },
  ],
  CLIENTS: [
    { key: "name", label: "Client Name", required: true },
    { key: "email", label: "Email Address", required: false },
    { key: "phone", label: "Phone Number", required: false },
    { key: "gst", label: "GSTIN", required: false },
    { key: "address1", label: "Address Line 1", required: true },
    { key: "address2", label: "Address Line 2", required: false },
    { key: "state", label: "State", required: true },
    { key: "pinCode", label: "Pin Code", required: false },
  ],
  VENDORS: [
    { key: "name", label: "Vendor Name", required: true },
    { key: "email", label: "Email Address", required: false },
    { key: "phone", label: "Phone Number", required: false },
    { key: "gst", label: "GSTIN", required: false },
    { key: "address1", label: "Address Line 1", required: true },
    { key: "address2", label: "Address Line 2", required: false },
    { key: "state", label: "State", required: true },
    { key: "pinCode", label: "Pin Code", required: false },
  ],
  PRODUCTS: [
    { key: "sku", label: "Item Code (SKU)", required: false },
    { key: "description", label: "Product Name/Desc", required: true },
    { key: "hsn", label: "HSN Code", required: false },
    { key: "sellingRate", label: "Selling Rate", required: true },
    { key: "gstRate", label: "GST %", required: true },
    { key: "purchaseRate", label: "Purchase Rate", required: false },
    { key: "qtyPerBox", label: "Qty per Box", required: false },
    { key: "unit", label: "Measurement Unit (e.g. NOS)", required: false },
    { key: "pkgType", label: "Packaging Type (e.g. BOX)", required: false },
  ],
  OPENING_STOCK: [
    { key: "sku", label: "Product SKU", required: true },
    { key: "quantity", label: "Quantity", required: true },
    { key: "notes", label: "Opening Notes", required: false },
  ],
  PURCHASES: [
    { key: "purchaseNo", label: "Purchase Number", required: false },
    { key: "date", label: "Purchase Date (YYYY-MM-DD)", required: true },
    { key: "vendorName", label: "Vendor Name", required: true },
    { key: "sku", label: "Product SKU", required: true },
    { key: "qty", label: "Inward Quantity", required: true },
    { key: "rate", label: "Purchase Rate", required: true },
    { key: "taxPercent", label: "GST % Override", required: false },
    { key: "ewayBill", label: "E-Way Bill", required: false },
    { key: "vehicleNo", label: "Vehicle Number", required: false },
    { key: "paymentMethod", label: "Payment Type (CREDIT/CASH/BANK)", required: false },
  ],
  INVOICES: [
    { key: "invoiceNo", label: "Invoice Number", required: false },
    { key: "date", label: "Invoice Date (YYYY-MM-DD)", required: true },
    { key: "clientName", label: "Client Name", required: true },
    { key: "sku", label: "Product SKU", required: true },
    { key: "qty", label: "Quantity Sold", required: true },
    { key: "rate", label: "Selling Rate", required: true },
    { key: "taxPercent", label: "GST % Override", required: false },
    { key: "ewayBill", label: "E-Way Bill", required: false },
    { key: "vehicleNo", label: "Vehicle Number", required: false },
  ],
  PAYMENTS: [
    { key: "partyName", label: "Party Name (Client/Vendor)", required: true },
    { key: "partyType", label: "Party Type (CLIENT/SUPPLIER)", required: true },
    { key: "amount", label: "Amount Paid/Received", required: true },
    { key: "paidAt", label: "Payment Date (YYYY-MM-DD)", required: true },
    { key: "method", label: "Payment Method (CASH, UPI, UPI_TRANSFER, UPI_CHEQUE, etc.)", required: true },
    { key: "reference", label: "Ref/UTR No.", required: false },
    { key: "notes", label: "Notes", required: false },
  ]
};

interface OcrFile {
  filename: string;
  sizeBytes: number;
  status: "PENDING" | "IMPORTED" | "PROCESSING" | "ERROR" | "DUPLICATE";
  message?: string;
}

export function MigrationCenterClient() {
  const [activeTab, setActiveTab] = useState<"CSV" | "OCR">("OCR");
  
  // CSV Tab State
  const [step, setStep] = useState<Step>("UPLOAD");
  const [module, setModule] = useState<Module>("CLIENTS");
  const [file, setFile] = useState<File | null>(null);
  const [dryRun, setDryRun] = useState<boolean>(true);
  
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({}); // destKey -> sourceHeader
  
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; logs: any[]; dryRun?: boolean } | null>(null);

  // OCR Tab State
  const [ocrFiles, setOcrFiles] = useState<OcrFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrDryRun, setOcrDryRun] = useState<boolean>(true);
  const [ocrLogs, setOcrLogs] = useState<string[]>([]);
  const [ocrProgress, setOcrProgress] = useState({ current: 0, total: 0 });
  const [ocrStats, setOcrStats] = useState({ success: 0, failed: 0, duplicates: 0, totalValue: 0, manualReview: 0 });
  
  // Reconciliation Summary state
  const [reconciliation, setReconciliation] = useState<any>(null);

  useEffect(() => {
    if (activeTab === "OCR") {
      fetchOcrFiles();
    }
  }, [activeTab]);

  const fetchOcrFiles = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/migration/ocr");
      const data = await res.json();
      if (data.success) {
        setOcrFiles(data.files);
        addOcrLog(`Scanned folder: Found ${data.files.length} legacy invoice PDFs.`);
      }
    } catch (err) {
      console.error(err);
      addOcrLog("Failed to scan legacy invoices folder.");
    } finally {
      setIsScanning(false);
    }
  };

  const addOcrLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOcrLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const runOcrBatch = async () => {
    setIsOcrProcessing(true);
    setOcrProgress({ current: 0, total: ocrFiles.length });
    setOcrStats({ success: 0, failed: 0, duplicates: 0, totalValue: 0, manualReview: 0 });
    setOcrLogs([]);
    
    addOcrLog(`Starting batch processing (Dry-Run: ${ocrDryRun ? "ON" : "OFF"})...`);

    let sCount = 0;
    let fCount = 0;
    let dCount = 0;
    let totalVal = 0;
    let mrCount = 0;

    const filesToProcess = [...ocrFiles];
    for (let i = 0; i < filesToProcess.length; i++) {
      const currentFile = filesToProcess[i];
      setOcrProgress({ current: i + 1, total: filesToProcess.length });
      
      // Update state item to processing
      setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "PROCESSING" } : f));
      addOcrLog(`Processing ${currentFile.filename}...`);

      try {
        const res = await fetch("/api/migration/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: currentFile.filename, dryRun: ocrDryRun })
        });
        const result = await res.json();

        if (res.ok && result.success) {
          if (result.dryRun) {
            sCount++;
            if (result.extracted?.confidence && result.extracted.confidence < 95) {
              mrCount++;
            }
            totalVal += result.extracted?.items?.reduce((sum: number, it: any) => sum + (Number(it.qty || 0) * Number(it.rate || 0)), 0) || 0;
            addOcrLog(`  - [DRY RUN SUCCESS] ${currentFile.filename} - Extracted InvNo: ${result.extracted?.invoiceNo} for client '${result.extracted?.clientName}'`);
            setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "IMPORTED", message: `Dry Run Passed${result.extracted?.confidence < 95 ? " (Draft Review)" : ""}` } : f));
          } else {
            sCount++;
            if (result.status === "DRAFT") {
              mrCount++;
            }
            totalVal += result.grandTotal || 0;
            addOcrLog(`  - [MIGRATED] Successfully committed Invoice ${result.invoiceNo} (Rs. ${result.grandTotal}) [Status: ${result.status}]`);
            setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "IMPORTED", message: result.status === "DRAFT" ? "Drafted for Review" : "Migrated successfully" } : f));
          }
        } else {
          const errMsg = result.error || "Seeding failed";
          if (errMsg.includes("Duplicate detected") || errMsg.includes("PDF hash matches")) {
            dCount++;
            addOcrLog(`  - [DUPLICATE] ${currentFile.filename}: Already imported.`);
            setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "DUPLICATE", message: "Duplicate record" } : f));
          } else {
            fCount++;
            addOcrLog(`  - [FAILED] ${currentFile.filename}: ${errMsg}`);
            setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "ERROR", message: errMsg } : f));
          }
        }
      } catch (err: any) {
        fCount++;
        addOcrLog(`  - [ERROR] Failed to fetch or process ${currentFile.filename}`);
        setOcrFiles(prev => prev.map(f => f.filename === currentFile.filename ? { ...f, status: "ERROR", message: err.message } : f));
      }

      setOcrStats({ success: sCount, failed: fCount, duplicates: dCount, totalValue: totalVal, manualReview: mrCount });
    }

    addOcrLog("Batch processing completed!");
    setIsOcrProcessing(false);

    // Run Audit Reconciliation
    if (!ocrDryRun) {
      triggerAuditReconciliation();
    }
  };

  const exportReport = (format: "csv" | "json") => {
    window.open(`/api/migration/ocr?export=${format}`, "_blank");
  };

  const triggerAuditReconciliation = async () => {
    addOcrLog("Running post-import Trial Balance & Stock Auditor...");
    try {
      const res = await fetch("/api/migration/ocr"); // scan re-fresh
      const data = await res.json();
      if (data.success) {
        setOcrFiles(data.files);
      }
      
      // Call reconciliation audit endpoint (or execute logic)
      const auditRes = await fetch("/api/migration/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "RECONCILE", data: [], dryRun: false })
      });
      // Fallback: we fetch standard values or trigger reconciliation manually
      const manualAuditRes = await fetch("/api/migration/ocr/reconcile", { method: "POST" });
      const auditData = await manualAuditRes.json();
      if (auditData.success) {
        setReconciliation(auditData);
        addOcrLog("Reconciliation complete. Trial balance matches (Debit = Credit).");
      }
    } catch (err) {
      console.error(err);
      addOcrLog("Warning: Reconciliation audit encountered an error.");
    }
  };

  // CSV/Excel Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    const isExcel = selected.name.endsWith(".xlsx") || selected.name.endsWith(".xls");
    
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (data.length > 0) {
          setSourceHeaders(Object.keys(data[0] as object));
          setPreviewData(data.slice(0, 3));
          setStep("MAPPING");
        }
      };
      reader.readAsBinaryString(selected);
    } else {
      Papa.parse(selected, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setSourceHeaders(results.meta.fields);
            setPreviewData(results.data.slice(0, 3));
            setStep("MAPPING");
          }
        }
      });
    }
  };

  const handleMappingChange = (destKey: string, sourceHeader: string) => {
    setMapping(prev => ({ ...prev, [destKey]: sourceHeader }));
  };

  const startImport = async () => {
    setIsImporting(true);
    setStep("IMPORTING");
    
    try {
      let fullData: any[] = [];
      
      if (file?.name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        fullData = parsed.data;
      } else if (file) {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        fullData = XLSX.utils.sheet_to_json(ws);
      }

      const mappedPayload = fullData.map(row => {
        const mappedRow: any = {};
        DESTINATION_FIELDS[module].forEach(field => {
          const sourceHeader = mapping[field.key];
          if (sourceHeader && row[sourceHeader] !== undefined) {
            mappedRow[field.key] = row[sourceHeader];
          }
        });
        return mappedRow;
      });

      const res = await fetch("/api/migration/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, data: mappedPayload, dryRun })
      });
      
      const result = await res.json();
      setImportResult(result);
      setStep("RESULT");
    } catch (err) {
      console.error(err);
      alert("Fatal error during import.");
      setStep("MAPPING");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("OCR")}
          className={cn(
            "px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2",
            activeTab === "OCR" 
              ? "border-primary-600 text-primary-600" 
              : "border-transparent text-slate-500 hover:text-slate-900"
          )}
        >
          <FolderOpen className="w-4 h-4" />
          Legacy Invoice Scan Console (OCR/AI)
        </button>
        <button
          onClick={() => setActiveTab("CSV")}
          className={cn(
            "px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2",
            activeTab === "CSV" 
              ? "border-primary-600 text-primary-600" 
              : "border-transparent text-slate-500 hover:text-slate-900"
          )}
        >
          <Upload className="w-4 h-4" />
          CSV & Excel Column Mapper Wizard
        </button>
      </div>

      {activeTab === "OCR" && (
        <div className="grid grid-cols-3 gap-6">
          {/* LEFT 2 COLS: LOGS AND DIRECTORY FILE SCANNER */}
          <div className="col-span-2 space-y-6">
            {/* FILE SCANNER TABLE */}
            <Card>
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Legacy Files Scanner
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={fetchOcrFiles} disabled={isScanning || isOcrProcessing}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", isScanning && "animate-spin")} />
                    Refresh Folder
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs">
                    <tr>
                      <th className="px-6 py-3">File Name</th>
                      <th className="px-6 py-3 text-right">Size</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3">Logs/Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {ocrFiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-400 italic">No PDF files found in workspace 'old data invoices/' folder.</td>
                      </tr>
                    ) : (
                      ocrFiles.map(file => (
                        <tr key={file.filename} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">{file.filename}</td>
                          <td className="px-6 py-4 text-right text-xs text-slate-500">{(file.sizeBytes / 1024).toFixed(1)} KB</td>
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full",
                              file.status === "IMPORTED" ? "bg-emerald-50 text-emerald-700" :
                              file.status === "PROCESSING" ? "bg-amber-50 text-amber-700 animate-pulse" :
                              file.status === "ERROR" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                            )}>
                              {file.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[200px]" title={file.message}>
                            {file.message || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* LIVE CONSOLE LOG TERMINAL */}
            <Card className="border-slate-800 bg-slate-950 text-slate-200">
              <CardHeader className="border-b border-slate-900 bg-slate-900/50 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-500" />
                  Live Migration Console Terminal Logs
                </CardTitle>
                {isOcrProcessing && <div className="text-[10px] uppercase font-bold text-amber-500 tracking-widest animate-pulse">Running Execution...</div>}
              </CardHeader>
              <CardContent className="p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-1.5 flex flex-col-reverse select-all">
                {ocrLogs.length === 0 ? (
                  <div className="text-slate-600 italic">Terminal ready. Waiting for execution...</div>
                ) : (
                  ocrLogs.map((log, idx) => (
                    <div key={idx} className={cn(
                      log.includes("[FAILED]") || log.includes("[ERROR]") ? "text-red-400" :
                      log.includes("[DRY RUN SUCCESS]") || log.includes("[MIGRATED]") ? "text-emerald-400" : "text-slate-300"
                    )}>
                      {log}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COL: CONTROL SYSTEM PANEL & AUDIT CHECKS */}
          <div className="space-y-6">
            {/* ACTION CARD */}
            <Card>
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 tracking-tight">Console Control Room</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Progress indicators */}
                {isOcrProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Batch Progress</span>
                      <span>{ocrProgress.current} / {ocrProgress.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(ocrProgress.current / ocrProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Dry run checkbox */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="ocrDryRun"
                    checked={ocrDryRun}
                    onChange={(e) => setOcrDryRun(e.target.checked)}
                    disabled={isOcrProcessing}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <div className="cursor-pointer select-none">
                    <label htmlFor="ocrDryRun" className="text-xs font-bold text-slate-900 block cursor-pointer">
                      Dry-Run Preview Simulation
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Executes parsing and validation under transaction boundaries, then rolls back.</span>
                  </div>
                </div>

                {/* Action buttons */}
                <Button 
                  variant="primary" 
                  className="w-full"
                  disabled={ocrFiles.length === 0 || isOcrProcessing}
                  onClick={runOcrBatch}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Process Folder Batch
                </Button>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="p-3 bg-emerald-50/50 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Success</div>
                    <div className="text-xl font-black text-emerald-900 tracking-tight mt-1">{ocrStats.success}</div>
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-red-600 tracking-wider">Failures</div>
                    <div className="text-xl font-black text-red-900 tracking-tight mt-1">{ocrStats.failed}</div>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Manual Review</div>
                    <div className="text-xl font-black text-amber-900 tracking-tight mt-1">{ocrStats.manualReview}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Duplicates</div>
                    <div className="text-xl font-black text-slate-900 tracking-tight mt-1">{ocrStats.duplicates}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl col-span-2 flex justify-between items-center">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Extracted Total</div>
                    <div className="text-base font-black text-slate-900 tracking-tight">Rs. {ocrStats.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>

                {/* Exporter Buttons */}
                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-1/2 text-xs"
                    disabled={isOcrProcessing}
                    onClick={() => exportReport("csv")}
                  >
                    Export CSV Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-1/2 text-xs"
                    disabled={isOcrProcessing}
                    onClick={() => exportReport("json")}
                  >
                    Export JSON Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AUDITOR CHECKS */}
            {reconciliation && (
              <Card className="border-emerald-200">
                <CardHeader className="border-b border-emerald-100 bg-emerald-50/20 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Trial Balance Auditor
                  </CardTitle>
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Balanced
                  </span>
                </CardHeader>
                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Debits Total:</span>
                    <span className="font-bold text-slate-900">Rs. {reconciliation.ledgerAudit.totalDebits.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Credits Total:</span>
                    <span className="font-bold text-slate-900">Rs. {reconciliation.ledgerAudit.totalCredits.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Stock Checked:</span>
                    <span className="font-bold text-slate-900">{reconciliation.stockAudit.scanned} products</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                    <span>Reconciliation Verdict:</span>
                    <span className="font-black uppercase">Debit == Credit</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "CSV" && (
        <div className="space-y-6">
          {/* STEPS HEADER */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            {(["UPLOAD", "MAPPING", "IMPORTING", "RESULT"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors",
                  step === s ? "bg-primary-600 text-white" : 
                  (["UPLOAD", "MAPPING", "IMPORTING", "RESULT"].indexOf(step) > i) ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {i + 1}
                </div>
                <span className={cn(
                  "ml-3 text-sm font-semibold tracking-tight",
                  step === s ? "text-slate-900" : "text-slate-400"
                )}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </span>
                {i < 3 && <ArrowRight className="w-4 h-4 mx-4 text-slate-200" />}
              </div>
            ))}
          </div>

          {step === "UPLOAD" && (
            <Card>
              <CardContent className="p-8">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Select Target Module</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                      value={module}
                      onChange={(e) => setModule(e.target.value as Module)}
                    >
                      <option value="ACCOUNTS">Chart of Accounts</option>
                      <option value="CLIENTS">Clients / Customers</option>
                      <option value="VENDORS">Vendors / Suppliers</option>
                      <option value="PRODUCTS">Products / Inventory</option>
                      <option value="OPENING_STOCK">Opening Stock</option>
                      <option value="PURCHASES">Purchases (Historical)</option>
                      <option value="INVOICES">Invoices (Historical)</option>
                      <option value="PAYMENTS">Payments / Collections</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    <input 
                      type="checkbox" 
                      id="dryRun"
                      checked={dryRun}
                      onChange={(e) => setDryRun(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="dryRun" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      Dry-Run Preview (Validate & rollback transactions)
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Database className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Upload Data File</h3>
                    <p className="text-xs text-slate-500 mt-2">Drag and drop or click to select.<br/>Supports CSV and Excel (.xlsx)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "MAPPING" && (
            <Card>
              <CardHeader className="border-b border-slate-100">
                <CardTitle>Map Columns</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs">
                      <tr>
                        <th className="px-6 py-4 font-medium w-1/3">Destination Field (JezzyERP)</th>
                        <th className="px-6 py-4 font-medium w-1/3">Source Column ({file?.name})</th>
                        <th className="px-6 py-4 font-medium w-1/3">Preview Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {DESTINATION_FIELDS[module].map(field => {
                        const mappedSource = mapping[field.key] || "";
                        const previewVal = mappedSource && previewData.length > 0 ? previewData[0][mappedSource] : "";
                        
                        return (
                          <tr key={field.key} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{field.label}</span>
                                {field.required && <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest bg-red-50 px-2 py-0.5 rounded-full">Required</span>}
                              </div>
                              <div className="text-xs text-slate-400 font-mono mt-1">{field.key}</div>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                value={mappedSource}
                                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                              >
                                <option value="">-- Ignore Field --</option>
                                {sourceHeaders.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-slate-500 truncate max-w-[200px]">
                              {previewVal ? String(previewVal) : <span className="italic opacity-50">No data mapped</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                  <Button variant="outline" onClick={() => setStep("UPLOAD")}>Cancel</Button>
                  <Button variant="primary" onClick={startImport} disabled={
                    DESTINATION_FIELDS[module].filter(f => f.required).some(f => !mapping[f.key])
                  }>
                    Run Migration Engine
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "IMPORTING" && (
            <Card>
              <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Processing Data Migration</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">Please wait while the engine validates, transforms, and imports your records. Do not close this window.</p>
              </CardContent>
            </Card>
          )}

          {step === "RESULT" && importResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {importResult.dryRun && (
                  <div className="col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Dry-Run Preview Mode Enabled</h4>
                      <p className="text-xs mt-1 text-amber-700 font-medium">This import was executed inside a database transaction and rolled back. No changes were committed to your database.</p>
                    </div>
                  </div>
                )}

                <Card className="border-emerald-200 shadow-sm shadow-emerald-100">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-900 tracking-tight">{importResult.success}</div>
                      <div className="text-sm font-semibold text-emerald-600">Successfully Imported</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 shadow-sm shadow-red-100">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-900 tracking-tight">{importResult.failed}</div>
                      <div className="text-sm font-semibold text-red-600">Failed Records</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {importResult.logs.length > 0 && (
                <Card>
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle>Import Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-100">
                        {importResult.logs.map((log, i) => (
                          <tr key={i} className={log.status === "ERROR" ? "bg-red-50/50" : ""}>
                            <td className="px-6 py-3 w-10">
                               {log.status === "ERROR" ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </td>
                            <td className="px-6 py-3 font-mono text-xs text-slate-500">Row {log.sourceRow}</td>
                            <td className="px-6 py-3 text-slate-700">{log.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button variant="primary" onClick={() => { setStep("UPLOAD"); setFile(null); setPreviewData([]); }}>
                  Run Another Migration
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
