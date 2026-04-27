"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Modal } from "@/ui/core/Modal";
import { StockAdjustmentForm } from "@/features/inventory/components/StockAdjustmentForm";

export function InventoryClient({ products }: { products: any[] }) {
    const [isAdjusting, setIsAdjusting] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsAdjusting(true)}
                className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 italic"
            >
                <PlusCircle className="w-5 h-5" />
                <span>Manual Override</span>
            </button>

            <Modal
                isOpen={isAdjusting}
                onClose={() => setIsAdjusting(false)}
                maxWidth="max-w-xl"
            >
                <StockAdjustmentForm 
                    products={products} 
                    onSuccess={() => setIsAdjusting(false)} 
                />
            </Modal>
        </>
    );
}
