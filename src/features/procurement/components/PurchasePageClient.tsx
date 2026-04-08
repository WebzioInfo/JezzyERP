"use client";

import React, { useState } from "react";
import { PurchaseEngine } from "./PurchaseEngine";
import { PurchaseUpload } from "./PurchaseUpload";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/ui/core/Button";

interface PurchasePageClientProps {
    vendors: any[];
    products: any[];
}

export function PurchasePageClient({ vendors, products }: PurchasePageClientProps) {
    const [mode, setMode] = useState<"upload" | "form">("upload");
    const [extractedData, setExtractedData] = useState<any>(null);

    const handleExtract = (data: any) => {
        // Attempt to find matching vendor by GST
        const matchingVendor = data.vendorGst 
            ? vendors.find(v => v.gst?.toUpperCase() === data.vendorGst.toUpperCase())
            : null;

        // Map extracted items to the format usePurchaseEngine expects
        const mappedItems = data.items.map((item: any) => {
            // Find product from master catalog if mapped
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId || "",
                description: item.description,
                qty: item.qty,
                rate: product ? Number(product.purchaseRate) : item.rate, // Use catalog rate if available
                sellingRate: product ? Number(product.sellingRate) : item.rate * 1.1, // Auto-margin if resell
                taxPercent: product ? Number(product.gstRate) : 18,
                hsn: item.hsn || product?.hsn
            };
        });

        const extracted = {
            vendorId: matchingVendor?.id || "",
            invoiceNo: data.invoiceNo,
            date: data.date,
            lineItems: mappedItems
        };

        if (data.mode === 'resell') {
            // Store and redirect to Sales Invoice
            sessionStorage.setItem("jezzy_resell_pack", JSON.stringify(extracted));
            window.location.href = "/invoices/new?source=resell";
            return;
        }

        setExtractedData(extracted);
        setMode("form");
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase">
                        Procure <span className="text-primary-600">Inventory</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic uppercase tracking-tighter">
                        {mode === "upload" 
                            ? "Use AI Intelligence to extract supply chain data from your bills." 
                            : "Fine-tune and commit the extracted inward supply record."}
                    </p>
                </div>

                <div className="flex gap-4">
                    {mode === "form" && (
                        <Button 
                            variant="ghost" 
                            onClick={() => setMode("upload")}
                            className="h-14 truncate px-6 rounded-2xl font-black uppercase italic tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Restart AI Sync
                        </Button>
                    )}
                    {mode === "upload" && (
                        <Button 
                            variant="ghost" 
                            onClick={() => setMode("form")}
                            className="h-14 truncate px-8 rounded-2xl font-black uppercase italic tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                        >
                            <Sparkles size={16} className="text-primary-500" />
                            Manual Entry
                        </Button>
                    )}
                </div>
            </div>

            {mode === "upload" ? (
                <PurchaseUpload products={products} onExtract={handleExtract} />
            ) : (
                <PurchaseEngine 
                    vendors={vendors} 
                    products={products} 
                    initialData={extractedData} 
                />
            )}
        </div>
    );
}
