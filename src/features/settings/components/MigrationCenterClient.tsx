"use client";

import React, { useState } from "react";
import { Upload, Database, CheckCircle2, AlertCircle, ArrowRight, XCircle } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/ui/core/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
import { cn } from "@/utils/index";

type Step = "UPLOAD" | "MAPPING" | "IMPORTING" | "RESULT";
type Module = "CLIENTS" | "PRODUCTS" | "INVOICES";

const DESTINATION_FIELDS: Record<Module, { key: string; label: string; required: boolean }[]> = {
  CLIENTS: [
    { key: "name", label: "Client Name", required: true },
    { key: "email", label: "Email Address", required: false },
    { key: "phone", label: "Phone Number", required: false },
    { key: "gst", label: "GSTIN", required: false },
    { key: "address1", label: "Address Line 1", required: true },
    { key: "state", label: "State", required: true },
    { key: "pinCode", label: "Pin Code", required: false },
  ],
  PRODUCTS: [
    { key: "sku", label: "Item Code (SKU)", required: false },
    { key: "description", label: "Product Name/Desc", required: true },
    { key: "hsn", label: "HSN Code", required: false },
    { key: "sellingRate", label: "Selling Rate", required: true },
    { key: "gstRate", label: "GST %", required: true },
  ],
  INVOICES: [
    { key: "invoiceNo", label: "Invoice Number", required: true },
    { key: "date", label: "Invoice Date", required: true },
    { key: "clientName", label: "Client Name", required: true },
    { key: "subTotal", label: "Sub Total", required: true },
    { key: "taxTotal", label: "Tax Amount", required: true },
    { key: "grandTotal", label: "Grand Total", required: true },
  ]
};

export function MigrationCenterClient() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [module, setModule] = useState<Module>("CLIENTS");
  const [file, setFile] = useState<File | null>(null);
  
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({}); // destKey -> sourceHeader
  
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; logs: any[] } | null>(null);

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
      // Re-parse full file if needed, or parse here. For now we parse full again.
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

      // Map data
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

      // Call API
      const res = await fetch("/api/migration/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, data: mappedPayload })
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
                  <option value="CLIENTS">Clients / Customers</option>
                  <option value="PRODUCTS">Products / Inventory</option>
                  <option value="INVOICES">Invoices (Historical)</option>
                </select>
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
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
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
  );
}
