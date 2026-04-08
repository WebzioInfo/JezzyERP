"use client";

import React, { useState, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/ui/core/Table";
import { Trash2, Loader2, Search, Package, Tag, Landmark, AlertTriangle, ArchiveX, Edit3, IndianRupee, Layers, PlusCircle, X } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/ui/core/Card";
import { Input } from "@/ui/core/Input";
import { deleteProductAction } from "@/features/inventory/actions/productActions";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/financials";
import { ProductForm } from "./ProductForm";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface Product {
    id: string;
    description: string;
    sku: string | null;
    hsn: string | null;
    purchaseRate: any; // Prisma Decimal
    sellingRate: any; // Prisma Decimal
    gstRate: any; // Prisma Decimal
    unit: string;
    notes?: string | null;
}

interface ProductTableProps {
    products: Product[];
}

const ProductTableRow = ({ product, onEdit }: { product: Product, onEdit: (product: Product) => void }) => {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const { success, error } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteProductAction(product.id);
            if (res && 'success' in res) {
                success("Catalog item removed successfully.");
                setShowConfirm(false);
            } else if (res && 'error' in res) {
                error(res.error || "Failed to delete item.");
            }
        });
    };

    return (
        <TableRow className={`group animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both transition-all`}>
            <TableCell className="py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:shadow-md group-hover:scale-105 transition-all">
                        <Package className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight truncate">{product.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center px-2 py-0.5 bg-primary-50 rounded-lg text-[9px] font-black text-primary-600 tracking-widest uppercase italic">
                                {product.unit}
                            </span>
                            {product.sku && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-lg text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Tag className="w-3 h-3" /> {product.sku}
                                </span>
                            )}
                            {product.hsn && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-lg text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <Landmark className="w-3 h-3" /> {product.hsn}
                                </span>
                            )}
                            {product.notes && (
                                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" title="Has detailed specs" />
                            )}
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-black text-slate-700 italic tracking-tight">{formatCurrency(Number(product.sellingRate))}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Selling Price</span>
                    <span className="text-[10px] font-bold text-slate-400 opacity-60">Cost: {formatCurrency(Number(product.purchaseRate))}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start gap-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 italic shadow-sm">
                        {Number(product.gstRate)}% GST
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-right pr-8">
                <div className="flex items-center justify-end gap-2">
                    {!showConfirm ? (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(product)}
                                className="h-9 w-9 p-0 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl"
                            >
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirm(true)}
                                className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 rounded-lg text-[10px] font-black uppercase"
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                            >
                                No
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="h-8 px-4 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "YES"}
                            </Button>
                        </div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
};

const ProductMobileCard = ({ product, onEdit }: { product: Product, onEdit: (product: Product) => void }) => {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const { success, error } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteProductAction(product.id);
            if (res && 'success' in res) {
                success("Item removed successfully.");
                setShowConfirm(false);
            } else {
                error("Removal failed.");
            }
        });
    };

    return (
        <div className="clay-card p-6 space-y-6 animate-in fade-in zoom-in duration-500 fill-mode-both border-0">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <Package className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-900 uppercase tracking-tight leading-tight">{product.description}</h4>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-primary-50 text-primary-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-primary-100 tracking-widest uppercase italic">
                                {product.unit}
                            </span>
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100 tracking-widest uppercase italic">
                                {Number(product.gstRate)}% GST
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="h-10 w-10 rounded-2xl text-slate-400 bg-slate-50">
                        <Edit3 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowConfirm(true)} className="h-10 w-10 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-50">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Selling Price</span>
                    <span className="text-base font-black text-slate-900 italic tracking-tighter">{formatCurrency(Number(product.sellingRate))}</span>
                </div>
                {product.sku && (
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">SKU Identity</span>
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest truncate">{product.sku}</span>
                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="flex items-center justify-between gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 animate-reveal shadow-inner">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] italic">Purge record?</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} className="text-[10px] font-black text-slate-500">NO</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} loading={isPending} className="text-[10px] font-black px-6 rounded-xl shadow-lg shadow-red-500/20">YES</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export function ProductTable({ products }: ProductTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const filtered = products.filter(p =>
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hsn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Unified Modal Overlay */}
            {(editingProduct || isAdding) && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar animate-reveal">
                        <ProductForm
                            product={editingProduct || undefined}
                            onSuccess={() => {
                                setEditingProduct(null);
                                setIsAdding(false);
                            }}
                            onCancel={() => {
                                setEditingProduct(null);
                                setIsAdding(false);
                            }}
                        />
                    </div>
                </div>
            )}

            <Card className="border-0 shadow-none p-4 bg-transparent overflow-hidden rounded-3xl">
                <CardHeader className="flex flex-col lg:flex-row items-center justify-between gap-8 px-0 py-6">
                    <div className="text-center lg:text-left">
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-max">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                                placeholder="Search inventory..."
                                className="pl-14 h-16 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full md:w-max h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Add Item</span>
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ErrorBoundary name="Inventory Catalog">
                        {filtered.length === 0 ? (
                            <div className="py-32 text-center clay-card border-0 animate-in fade-in zoom-in duration-700 bg-white">
                                <div className="mx-auto w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-dashed border-slate-200 shadow-inner">
                                    <ArchiveX className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-black text-2xl font-display uppercase italic tracking-tighter">Catalog is empty</h3>
                                <p className="text-sm font-bold text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">
                                    No master inventory records match your criteria.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden lg:block clay-card overflow-hidden border-0 bg-white">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                            <TableRow>
                                                <TableHead className="w-[50%] px-8 text-[10px] font-black uppercase tracking-[0.25em] italic">Product Specifications</TableHead>
                                                <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-[0.25em] italic">Base Rate</TableHead>
                                                <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-[0.25em] italic">Tax Class</TableHead>
                                                <TableHead className="w-[20%] text-right px-8 text-[10px] font-black uppercase tracking-[0.25em] italic">Operations</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((product) => (
                                                <ProductTableRow
                                                    key={product.id}
                                                    product={product}
                                                    onEdit={setEditingProduct}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Grid View */}
                                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {filtered.map((product) => (
                                        <ProductMobileCard
                                            key={product.id}
                                            product={product}
                                            onEdit={setEditingProduct}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </ErrorBoundary>
                </CardContent>
            </Card>
        </div>
    );
}
