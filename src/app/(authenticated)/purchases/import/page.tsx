"use client";

import React, { useState } from "react";
import { 
  FileUp, Receipt, ArrowRightLeft, CheckCircle2, 
  Trash2, Plus, ArrowRight, Loader2, Info, AlertTriangle 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { useRouter } from "next/navigation";

// Mock Data from the image attached by the user for Demo
const MOCK_EXTRACTION = [
  {
    description: "27mm Alaska K Blue Caps",
    hsn: "39235010",
    qty: 80000,
    unit: "Nos",
    rate: 0.35,
    taxPercent: 18,
    pkgCount: 10,
    pkgType: "BOX (8000/BX)",
  },
  {
    description: "27MM ALASKA WHITE CAPS",
    hsn: "39235010",
    qty: 80000,
    unit: "Nos",
    rate: 0.35,
    taxPercent: 18,
    pkgCount: 10,
    pkgType: "BOX (8000/BX)",
  },
   {
    description: "26mm Alaska SN White caps (DOME)",
    hsn: "39235010",
    qty: 10000,
    unit: "Nos",
    rate: 0.35,
    taxPercent: 18,
    pkgCount: 1,
    pkgType: "BOX (1000/BX)",
  }
];

export default function PurchaseImportPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const [vendorData, setVendorData] = useState({
    name: "ESSAR INDUSTRIES (MOCKED)",
    gstin: "32AAAAA0000A1Z1",
    date: new Date().toISOString().split("T")[0],
    purchaseNo: "EXT-8871"
  });
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    // Simulated AI Processing Time
    setTimeout(() => {
      setExtractedData(MOCK_EXTRACTION);
      setIsExtracting(false);
    }, 2500);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    if (!extractedData) return;
    const newData = [...extractedData];
    newData[index] = { ...newData[index], [field]: value };
    setExtractedData(newData);
  };

  const calculateTotal = (item: any) => {
    const taxable = item.qty * item.rate;
    const tax = (taxable * item.taxPercent) / 100;
    return taxable + tax;
  };

  const handleSaveAsPurchase = async () => {
    // Simulated Save
    setTimeout(() => {
        router.push("/purchases");
    }, 1000);
  };

  const handleConvertToSales = () => {
    // Store in session storage to pass to Billing Page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("resell_data", JSON.stringify({
        vendor: vendorData,
        items: extractedData
      }));
      router.push("/invoices/new?mode=resell");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase flex items-center gap-3">
             <ArrowRightLeft className="w-8 h-8 text-indigo-600" />
             AI Resell Workflow
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Upload Purchase Bill → Review → Sell</p>
        </div>
      </div>

      {!extractedData ? (
        <Card className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/50 transition-all group overflow-hidden">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             {isExtracting ? (
               <div className="space-y-6 animate-pulse">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
                    <div className="absolute inset-0 bg-indigo-200/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic uppercase">AI is analyzing your bill...</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-2">OCR Extraction in progress (Line Items, Taxes, Totals)</p>
                  </div>
               </div>
             ) : (
               <div className="space-y-8 max-w-md">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                    <FileUp size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase">Drop your Purchase Bill</h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-2 px-8">PDF or Image (JPG, PNG). Our AI will automatically extract everything for you.</p>
                  </div>
                  <div className="relative pt-4">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                    />
                    <Button size="lg" className="w-full bg-slate-900 hover:bg-black font-black uppercase italic tracking-widest gap-3">
                      Select Documents
                      <ArrowRight size={20} />
                    </Button>
                  </div>
               </div>
             )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Review Section */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="border-0 shadow-2xl bg-white ring-1 ring-slate-200">
                    <CardHeader className="bg-slate-900 border-b border-white/5 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Receipt className="text-indigo-400 w-5 h-5" />
                                <CardTitle className="text-white text-lg m-0 italic">Review Extracted Data</CardTitle>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="text-white/50 hover:text-white"
                              onClick={() => setExtractedData(null)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                        <th className="px-4 py-3 text-left">Description</th>
                                        <th className="px-4 py-3 text-center">HSN</th>
                                        <th className="px-4 py-3 text-center">Qty/Unit</th>
                                        <th className="px-4 py-3 text-right">Rate</th>
                                        <th className="px-4 py-3 text-center">No. Pkgs</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {extractedData.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <input 
                                                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                                                  value={item.description}
                                                  onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                                                />
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{item.pkgType}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    className="w-16 bg-slate-50 text-center font-mono text-[10px] py-1 rounded"
                                                    value={item.hsn}
                                                    onChange={(e) => handleUpdateItem(idx, "hsn", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <input 
                                                        className="w-12 text-center font-black"
                                                        value={item.qty}
                                                        onChange={(e) => handleUpdateItem(idx, "qty", Number(e.target.value))}
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-400">{item.unit}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input 
                                                    className="w-16 text-right font-black"
                                                    value={item.rate}
                                                    onChange={(e) => handleUpdateItem(idx, "rate", Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    className="w-10 text-center bg-indigo-50 text-indigo-700 font-black rounded"
                                                    value={item.pkgCount}
                                                    onChange={(e) => handleUpdateItem(idx, "pkgCount", Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-black text-slate-900">
                                                ₹{calculateTotal(item).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                     <Card className="bg-emerald-50/50 border-emerald-100 border-l-4 border-l-emerald-500">
                        <CardContent className="p-4 flex items-start gap-3">
                            <Info className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-900 uppercase italic">Intelligence Note</h4>
                                <p className="text-[10px] font-bold text-emerald-700/80 leading-relaxed uppercase tracking-tighter">
                                    HSN and Unit codes have been mapped to your existing inventory.
                                </p>
                            </div>
                        </CardContent>
                     </Card>

                      <Card className="bg-indigo-50/50 border-indigo-100 border-l-4 border-l-indigo-500">
                        <CardContent className="p-4 flex items-start gap-3">
                            <ArrowRightLeft className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-[10px] font-black text-indigo-900 uppercase italic">Resell Strategy</h4>
                                <p className="text-[10px] font-bold text-indigo-700/80 leading-relaxed uppercase tracking-tighter">
                                    Convert this entry directly to a sales invoice to skip manual billing.
                                </p>
                            </div>
                        </CardContent>
                     </Card>
                </div>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
                <Card className="border-0 shadow-2xl bg-indigo-700 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 p-8 opacity-20 transform translate-x-1/3 -translate-y-1/3 rotate-12">
                        <ArrowRightLeft size={160} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-white italic tracking-tighter flex items-center gap-2">
                             Summary
                        </CardTitle>
                        <CardDescription className="text-indigo-200">Values extracted from your bill</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-200">
                                <span>Taxable Value</span>
                                <span>₹{extractedData.reduce((acc, i) => acc + (i.qty * i.rate), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-200">
                                <span>Total Tax (18%)</span>
                                <span>₹{extractedData.reduce((acc, i) => acc + (i.qty * i.rate * 0.18), 0).toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase text-indigo-100">Grand Total</span>
                                <span className="text-3xl font-black italic">₹{extractedData.reduce((acc, i) => acc + calculateTotal(i), 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6">
                            <Button 
                               onClick={handleSaveAsPurchase}
                               className="w-full bg-white text-indigo-700 hover:bg-slate-100 font-black uppercase italic tracking-widest py-6"
                            >
                                <Plus size={18} />
                                Only Stock as Purchase
                            </Button>
                            
                            <Button 
                                onClick={handleConvertToSales}
                                className="w-full bg-indigo-950 text-white hover:bg-black font-black uppercase italic tracking-widest py-8 border-2 border-indigo-400/30 group"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2">
                                        <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                        RESELL IMMEDIATELY
                                    </div>
                                    <span className="text-[8px] opacity-60 mt-1">SAVES PURCHASE + OPENS INVOICE</span>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="bg-amber-50 border-amber-200 border-l-4 border-l-amber-500">
                    <CardContent className="p-4 flex items-start gap-4">
                        <AlertTriangle className="text-amber-600 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="text-xs font-black text-amber-900 uppercase italic">Confirm Details</h4>
                            <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-tighter mt-1">
                                Please ensure the IGST/CGST split matches your supplier's bill before committing to stock.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
