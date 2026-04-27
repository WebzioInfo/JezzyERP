"use client";

import React, { useState } from "react";
import { manualStockAdjustmentAction } from "@/features/inventory/actions/stockActions";
import { LoadingButton } from "@/ui/core/LoadingButton";
import { Input } from "@/ui/core/Input";
import { useToast } from "@/context/ToastContext";
import { executeAction } from "@/lib/utils/actions";
import { useLoadingStore } from "@/lib/store/useLoadingStore";

interface StockAdjustmentFormProps {
    products: { id: string; description: string; sku: string | null }[];
    onSuccess: () => void;
}

export function StockAdjustmentForm({ products, onSuccess }: StockAdjustmentFormProps) {
    const { success, error } = useToast();
    const isLoading = useLoadingStore(state => state.isLoading);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        await executeAction(
            async () => manualStockAdjustmentAction(formData),
            {
                scope: 'stock-adjustment',
                loadingMessage: 'Adjusting inventory levels...',
                successMessage: 'Stock adjustment recorded.',
                onSuccess: (res) => {
                    if (res && 'success' in res) {
                        onSuccess();
                    }
                }
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-8 animate-reveal">
            <div>
                <h2 className="text-3xl font-black text-slate-900 font-display italic uppercase tracking-tight">Manual <span className="text-primary-600">Correction</span></h2>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Inventory Protocol Override</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select Product</label>
                    <select 
                        name="productId" 
                        required 
                        className="w-full h-14 bg-slate-50 border-0 rounded-2xl px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary-500/10 transition-all outline-hidden appearance-none"
                    >
                        <option value="">Select a product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.description} {p.sku ? `(${p.sku})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Quantity Change (+ or -)</label>
                    <Input 
                        name="quantityChange" 
                        type="number" 
                        step="0.001" 
                        required 
                        placeholder="e.g. 10 or -5"
                        className="h-14 rounded-2xl font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Adjustment Reason / Notes</label>
                    <textarea 
                        name="notes" 
                        rows={3}
                        placeholder="Why is this change being made?"
                        className="w-full bg-slate-50 border-0 rounded-2xl p-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary-500/10 transition-all outline-hidden resize-none"
                    />
                </div>
            </div>

            <LoadingButton 
                type="submit" 
                className="w-full h-16 rounded-2xl shadow-2xl"
                isLoading={isLoading('stock-adjustment')}
                loadingText="Synchronizing..."
            >
                Execute Adjustment
            </LoadingButton>
        </form>
    );
}
