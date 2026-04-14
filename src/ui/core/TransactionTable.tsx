"use client";

import React from "react";
import { Plus, Trash2, Package, Tag, Hash } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { FormField } from "@/ui/core/FormField";
import { formatCurrency, cn } from "@/utils/index";
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
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-start p-6 bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 mb-4"
        >
            {/* Index Badge */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-black items-center justify-center border-4 border-slate-50 z-10 group-hover:scale-110 transition-transform hidden lg:flex shadow-lg">
                {index + 1}
            </div>

            {/* Product & Description */}
            <div className="col-span-1 lg:col-span-4 space-y-4">
                <div className="relative group/select">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">Source Item</label>
                    <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within/select:text-primary-500 transition-colors" />
                        <select
                            className="flex w-full rounded-2xl border-0 bg-slate-100/50 pl-11 pr-4 py-3 text-sm shadow-inner ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none hover:ring-slate-300 appearance-none font-bold"
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
                                        pkgType: prod.pkgType || "BOX"
                                    });
                                }
                            }}
                        >
                            <option value="">-- Manual Entry / Load Catalog --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.description} (₹{Number(p.sellingRate || p.purchaseRate).toLocaleString()})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <FormField
                    placeholder="Custom description or service name"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    icon={<Tag size={14} />}
                />
            </div>

            {/* HSN */}
            <div className="col-span-1 lg:col-span-2">
                <FormField
                    label="HSN Code"
                    placeholder="99XX"
                    value={item.hsn}
                    onChange={(e) => updateItem(item.id, { hsn: e.target.value })}
                    icon={<Hash size={14} />}
                    className="font-mono text-center uppercase"
                />
            </div>

            {/* Qty & Unit */}
            <div className="col-span-1 lg:col-span-1">
                <FormField
                    label={`Qty (${item.unit || 'UN'})`}
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                    className="text-center font-black"
                />
            </div>

            {/* Rate */}
            <div className="col-span-1 lg:col-span-2">
                <FormField
                    label="Unit Rate (₹)"
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                    className="text-right font-black"
                />
            </div>

            {/* GST */}
            <div className="col-span-1 lg:col-span-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2 px-1">GST %</label>
                <select
                    className="flex h-12 w-full rounded-2xl border-0 bg-slate-100/50 px-4 py-2 text-xs font-black shadow-inner ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:outline-none hover:ring-slate-300 appearance-none text-center"
                    value={item.taxPercent}
                    onChange={(e) => updateItem(item.id, { taxPercent: Number(e.target.value) })}
                >
                    {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
            </div>

            {/* Total */}
            <div className="col-span-1 lg:col-span-2 flex flex-col items-end justify-center pt-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Line Total</label>
                <div className="flex items-center gap-4">
                    <div className="text-xl font-black text-slate-900 tabular-nums italic">
                        {formatCurrency(item.totalAmount || 0)}
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex border-0 items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group/trash"
                    >
                        <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                    </button>
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
