"use client";

import React from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { formatCurrency } from "@/utils/financials";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { AnimatePresence, motion } from "framer-motion";

interface TransactionTableProps {
    products: any[];
}

const Row = React.memo(({ item, index, products }: { item: any; index: number; products: any[] }) => {
    const updateItem = useTransactionStore((state) => state.updateItem);
    const removeItem = useTransactionStore((state) => state.removeItem);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative bg-white border border-slate-200 rounded-xl transition-all shadow-xs mb-3 overflow-hidden"
        >
            {/* Header bar of the line item */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <span>Item #{index + 1}</span>
                </div>
                <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove item ${index + 1}`}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    {/* Catalog Selection & Custom Description */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block">Catalog Product</label>
                        <select
                            className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs shadow-xs focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 h-9"
                            value={item.productId || ""}
                            onChange={(e) => {
                                const prod = products.find(p => p.id === e.target.value);
                                if (prod) {
                                    updateItem(item.id, {
                                        productId: prod.id,
                                        description: prod.description,
                                        hsn: prod.hsn || "",
                                        rate: Number(prod.sellingRate || prod.purchaseRate || 0),
                                        taxPercent: Number(prod.gstRate || 18),
                                        unit: prod.unit ?? "",
                                        pkgType: prod.pkgType ?? "",
                                        qtyPerBox: Number(prod.qtyPerBox || 0)
                                    });
                                }
                            }}
                        >
                            <option value="">Select from catalog...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.description} [{formatCurrency(Number(p.sellingRate || p.purchaseRate || 0))}]
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Custom description or item notes..."
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            className="w-full text-xs text-slate-700 border-b border-slate-200 focus:border-slate-900 focus:outline-none py-1 bg-transparent placeholder:text-slate-400"
                        />
                    </div>

                    {/* HSN */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block">HSN / SAC</label>
                        <input
                            type="text"
                            value={item.hsn}
                            onChange={(e) => updateItem(item.id, { hsn: e.target.value })}
                            placeholder="HSN"
                            className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-mono uppercase text-center focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-1 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block text-center">Qty</label>
                        <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                            className="w-full h-9 px-2 rounded-lg border border-slate-300 bg-white text-xs text-center font-semibold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                    </div>

                    {/* Unit Rate */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block text-right">Rate (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                            className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-xs text-right font-semibold tabular-nums focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                    </div>

                    {/* GST % */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-1 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block text-center">GST %</label>
                        <select
                            className="w-full h-9 px-1 rounded-lg border border-slate-300 bg-white text-xs text-center font-medium focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            value={item.taxPercent}
                            onChange={(e) => updateItem(item.id, { taxPercent: Number(e.target.value) })}
                        >
                            {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}%</option>)}
                        </select>
                    </div>

                    {/* Pkgs */}
                    <div className="col-span-6 sm:col-span-3 lg:col-span-1 space-y-1.5">
                        <label className="text-xs font-medium text-slate-700 block text-center">Boxes</label>
                        <input
                            type="number"
                            min="0"
                            value={item.pkgCount || 0}
                            onChange={e => updateItem(item.id, { pkgCount: parseInt(e.target.value) || 0 })}
                            className="w-full h-9 px-1.5 rounded-lg border border-slate-300 bg-white text-xs text-center focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        />
                    </div>
                </div>

                {/* Sub-bar with line total and product specs */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        {item.unit && <span>Unit: <strong className="text-slate-700">{item.unit}</strong></span>}
                        {item.qtyPerBox > 0 && <span>Packing: <strong className="text-slate-700">{item.qtyPerBox} / box</strong></span>}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-slate-500 font-medium">Line Amount:</span>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {formatCurrency(item.totalAmount || 0)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

Row.displayName = "TransactionRow";

export function TransactionTable({ products }: TransactionTableProps) {
    const items = useTransactionStore((state) => state.items);
    const addItem = useTransactionStore((state) => state.addItem);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">Line Items & Products</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Specify products, rates, quantities, and tax specifications</p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={addItem}
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Item
                </Button>
            </div>

            <div className="min-h-[140px]">
                <AnimatePresence initial={false}>
                    {items.length > 0 ? (
                        <div className="flex flex-col">
                            {items.map((item, index) => (
                                <Row key={item.id} item={item} index={index} products={products} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs mb-3 text-slate-400">
                                <Package className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-slate-800">No items added yet</p>
                            <p className="text-xs text-slate-500 mt-0.5 mb-4">Click Add Item below to start adding products to this invoice.</p>
                            <Button variant="primary" size="sm" onClick={addItem}>
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add First Item
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
