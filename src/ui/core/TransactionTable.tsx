"use client";

import React from "react";
import { Plus, Trash2, Package, Tag, Hash } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { FormField } from "@/ui/core/FormField";
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 mb-6 overflow-hidden"
        >
            {/* Index Badge */}
            <div className="absolute left-0 top-0 w-8 h-8 rounded-br-2xl bg-slate-900 text-white text-[10px] font-black flex items-center justify-center z-10 shadow-lg">
                {index + 1}
            </div>

            <div className="p-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                    {/* Product & Description */}
                    <div className="col-span-1 lg:col-span-4 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 block px-1">Item Details</label>
                        <select
                            className="flex w-full rounded-xl border-0 bg-slate-100/50 px-3 py-2.5 text-xs shadow-inner ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none appearance-none font-bold"
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
                                        unit: prod.unit || "NOS",
                                        pkgType: prod.pkgType || "BOX",
                                        qtyPerBox: Number(prod.qtyPerBox || 0)
                                    });
                                }
                            }}
                        >
                            <option value="">-- Catalog --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.description}</option>
                            ))}
                        </select>
                        <input
                            placeholder="Custom Description"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            className="w-full bg-transparent border-0 border-b border-slate-100 text-[11px] font-medium focus:ring-0 focus:border-primary-500 px-1 py-1"
                        />
                    </div>

                    {/* HSN */}
                    <div className="col-span-1 lg:col-span-1">
                        <FormField
                            label="HSN"
                            value={item.hsn}
                            onChange={(e) => updateItem(item.id, { hsn: e.target.value })}
                            className="font-mono text-center uppercase text-[10px] h-10"
                        />
                    </div>

                    {/* Qty */}
                    <div className="col-span-1 lg:col-span-2">
                        <FormField
                            label={`Quantity`}
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                            className="text-center font-black text-xs h-10 bg-primary-50/30 border-primary-100"
                        />
                    </div>

                    {/* Rate */}
                    <div className="col-span-1 lg:col-span-2">
                        <FormField
                            label="Unit Rate (₹)"
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                            className="text-right font-black text-xs h-10 bg-emerald-50/30 border-emerald-100"
                        />
                    </div>

                    {/* GST */}
                    <div className="col-span-1 lg:col-span-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1 text-center">GST %</label>
                        <select
                            className="flex h-10 w-full rounded-xl border-0 bg-slate-100/50 px-1 text-[10px] font-black shadow-inner ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500/20 text-center"
                            value={item.taxPercent}
                            onChange={(e) => updateItem(item.id, { taxPercent: Number(e.target.value) })}
                        >
                            {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}%</option>)}
                        </select>
                    </div>

                    {/* Pkgs */}
                    <div className="col-span-1 lg:col-span-1">
                        <FormField
                            label="Pkgs"
                            type="number"
                            value={item.pkgCount || 0}
                            onChange={e => updateItem(item.id, { pkgCount: parseInt(e.target.value) || 0 })}
                            className="text-center font-bold text-[10px] h-10"
                        />
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 lg:col-span-1 flex items-center justify-center">
                        <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Product Metadata (Non-editable clarification) */}
                {item.productId && (
                    <div className="mt-6 flex flex-wrap gap-4 items-center px-1 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SKU</span>
                            <span className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">
                                {products.find(p => p.id === item.productId)?.sku || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catalog Unit</span>
                            <span className="text-[11px] font-black text-slate-900 italic uppercase">
                                {products.find(p => p.id === item.productId)?.unit || item.unit}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Standard Packing</span>
                            <span className="text-[11px] font-black text-slate-900">
                                {products.find(p => p.id === item.productId)?.qtyPerBox || 0} {item.unit || 'NOS'} / {item.pkgType || 'BOX'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Total Bar */}
            <div className="bg-slate-900 px-8 py-3 flex justify-between items-center group-hover:bg-primary-950 transition-colors">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Calculated Sub-Val</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-none mb-1">Line Amount</span>
                        <div className="text-sm font-black text-white tabular-nums italic tracking-tight">
                            {formatCurrency(item.totalAmount || 0)}
                        </div>
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Supply Records</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Define goods, services and logistics</p>
                </div>
                <Button
                    variant="outline"
                    onClick={addItem}
                    className="h-12 px-6 rounded-2xl border-primary-100 text-primary-600 hover:bg-primary-50 font-black uppercase italic tracking-widest text-[11px] flex items-center gap-2 group shadow-lg shadow-primary-900/5"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    Append Listing
                </Button>
            </div>

            <div className="relative min-h-[200px]">
                <AnimatePresence initial={false}>
                    {items.length > 0 ? (
                        <div className="flex flex-col">
                            {items.map((item, index) => (
                                <Row key={item.id} item={item} index={index} products={products} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-primary-900/5 mb-6 animate-bounce duration-3000">
                                <Plus className="w-10 h-10 text-primary-200" />
                            </div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Inventory Ledger Vacant</p>
                            <Button variant="primary" onClick={addItem} className="mt-8 h-12 px-8">
                                Initialize Record
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}