"use client";

import React from "react";
import { Plus, Trash2, Package, Tag, Hash, BadgePercent } from "lucide-react";
import { Product } from "@/features/inventory/types";
import { Button } from "@/ui/core/Button";
import { Input } from "@/ui/core/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { formatCurrency, cn } from "@/utils";
import { InvoiceItem } from "@/hooks/useBillingEngine";
import { CalculatedItem } from "@/utils/financials";

// Combine the raw item with its calculated totals for the UI
type DisplayItem = InvoiceItem & CalculatedItem;

interface LineItemsTableProps {
    items: DisplayItem[];
    products: Product[];
    handleAddItem: () => void;
    updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
    removeItem: (index: number) => void;
    handleProductSelect: (index: number, productId: string) => void;
}

const LineItemRow = React.memo(({
    item, index, products, updateItem, removeItem, handleProductSelect
}: {
    item: DisplayItem;
    index: number;
    products: Product[];
    updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
    removeItem: (index: number) => void;
    handleProductSelect: (index: number, productId: string) => void;
}) => {
    const [localQty, setLocalQty] = React.useState(item.qty.toString());

    // Sync local state when item.qty changes from parent (e.g. initial load or bulk updates)
    React.useEffect(() => {
        if (Number(localQty) !== item.qty) {
            setLocalQty(item.qty.toString());
        }
    }, [item.qty]);

    return (
        <div className="group relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-start p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all duration-200">
            {/* Index Badge */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold items-center justify-center border-4 border-slate-50 z-10 group-hover:scale-110 transition-transform hidden lg:flex">
                {index + 1}
            </div>

            {/* Product & Description */}
            <div className="col-span-1 lg:col-span-4 space-y-3">
                <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                        className="flex w-full rounded-xl border-0 bg-slate-100/50 pl-10 pr-4 py-2.5 text-sm shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none font-bold"
                        onChange={e => handleProductSelect(index, e.target.value)}
                        value={item.productId || ""}
                    >
                        <option value="">-- Load from Catalog --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.description} (₹{Number(p.sellingRate || 0).toLocaleString()})
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    placeholder="Custom description or item name"
                    value={item.description}
                    onChange={e => updateItem(index, "description", e.target.value)}
                    className="h-10 text-sm italic"
                    icon={<Tag size={14} />}
                />
                {/* Product Detail/Notes hint */}
                {products.map(p => p as any).find(p => p.id === item.productId)?.notes && (
                    <p className="text-[10px] text-slate-400 italic px-1 line-clamp-1">
                        Note: {(products as any).find((p: any) => p.id === item.productId)?.notes}
                    </p>
                )}
            </div>

            {/* HSN */}
            <div className="col-span-2">
                <Input
                    label="HSN"
                    placeholder="99XX"
                    value={item.hsn}
                    onChange={e => updateItem(index, "hsn", e.target.value)}
                    className="h-10 text-xs  font-mono uppercase text-center"
                    icon={<Hash size={12} />}
                />
            </div>

            <div className="col-span-1">
                <div className="space-y-1">
                    <Input
                        label={`Qty (${item.unit || 'NOS'})`}
                        type="text"
                        inputMode="decimal"
                        value={localQty}
                        onChange={e => {
                            const val = e.target.value;
                            // Allow typing numbers and decimals
                            if (/^\d*\.?\d*$/.test(val)) {
                                setLocalQty(val);
                                const num = parseFloat(val);
                                if (!isNaN(num)) {
                                    updateItem(index, "qty", num);
                                }
                            }
                        }}
                        className="text-center h-10 font-black"
                    />
                </div>
            </div>

            {/* Rate */}
            <div className="col-span-2">
                <Input
                    label="Unit Rate (₹)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={e => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                    className="text-right h-10 font-black text-slate-900"
                />
            </div>

            {/* Tax */}
            <div className="col-span-1">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">GST %</label>
                    <select
                        className="flex h-10 w-full rounded-xl border-0 bg-slate-50 px-2 py-1 text-xs font-bold shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none text-center"
                        value={item.taxPercent}
                        onChange={e => updateItem(index, "taxPercent", parseFloat(e.target.value) || 0)}
                    >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                    </select>
                </div>
            </div>

            {/* Package Details */}
            <div className="col-span-1">
                <Input
                    label="No. of Pkgs"
                    type="number"
                    min="0"
                    value={item.pkgCount || 0}
                    onChange={e => updateItem(index, "pkgCount", parseInt(e.target.value) || 0)}
                    className="text-center h-10 font-bold"
                />
            </div>
            <div className="col-span-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 truncate">Kind of Pkg</label>
               <select
                    className="flex h-10 w-full rounded-xl border-0 bg-slate-50 px-1 py-1 text-[10px] font-bold shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 focus:outline-none hover:ring-slate-300 appearance-none text-center uppercase"
                    value={item.pkgType || "BOX"}
                    onChange={e => updateItem(index, "pkgType", e.target.value)}
                >
                    <option value="BOX">BOX</option>
                    <option value="BAG">BAG</option>
                    <option value="PKT">PKT</option>
                    <option value="DRM">DRM</option>
                    <option value="PCS">PCS</option>
                    <option value="NOS">NOS</option>
                    <option value="ROLL">ROLL</option>
                    <option value="BDL">BDL</option>
                </select>
            </div>

            {/* Line Total */}
            <div className="col-span-2 flex flex-col items-end justify-center pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Line Amount</span>
                <div className="flex items-center gap-4">
                    <div className="font-black text-lg text-slate-900 tabular-nums">
                        {formatCurrency(item.totalAmount)}
                    </div>
                    <button
                        onClick={() => removeItem(index)}
                        className="text-slate-300 hover:text-danger-500 transition-colors p-2 hover:bg-danger-50 rounded-xl"
                        title="Remove item"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
});

LineItemRow.displayName = 'LineItemRow';

export function LineItemsTable({ items, products, handleAddItem, updateItem, removeItem, handleProductSelect }: LineItemsTableProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Line Items</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Define products and service charges</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-2 border-primary-100 text-primary-600 hover:bg-primary-50">
                    <Plus className="w-4 h-4" /> Add Row
                </Button>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <LineItemRow
                        key={index}
                        item={item}
                        index={index}
                        products={products}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        handleProductSelect={handleProductSelect}
                    />
                ))}

                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4">
                            <Plus className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">No items added yet</p>
                        <p className="text-xs mt-1">Add products from your catalog to begin calculation</p>
                        <Button variant="primary" onClick={handleAddItem} className="mt-8 gap-2">
                            <Plus size={18} /> Start Adding Items
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
