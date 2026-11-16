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
import { Trash2, Loader2, Search, Package, Tag, Edit3, Plus, X } from "lucide-react";
import { Button } from "@/ui/core/Button";
import { Card, CardContent } from "@/ui/core/Card";
import { deleteProductAction } from "@/features/inventory/actions/productActions";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/utils/financials";
import { ProductForm } from "./ProductForm";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Modal } from "@/ui/core/Modal";

interface Product {
    id: string;
    description: string;
    sku: string | null;
    hsn: string | null;
    purchaseRate: any;
    sellingRate: any;
    gstRate: any;
    unit: string;
    notes?: string | null;
    currentStock: number;
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
        <TableRow className="group">
            <TableCell className="py-3.5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                        <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{product.description}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {product.sku && (
                                <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                    <Tag className="w-2.5 h-2.5 text-slate-400" /> {product.sku}
                                </span>
                            )}
                            <span className="text-[11px] text-slate-400">{product.unit || 'NOS'}</span>
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-slate-600">
                {product.hsn || "—"}
            </TableCell>
            <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                {formatCurrency(Number(product.sellingRate))}
            </TableCell>
            <TableCell className="text-right font-medium text-slate-600 text-xs tabular-nums">
                {formatCurrency(Number(product.purchaseRate))}
            </TableCell>
            <TableCell className="text-center font-medium text-xs">
                <span className={`inline-flex px-2 py-0.5 rounded-md font-semibold tabular-nums ${
                    product.currentStock <= 5 ? "bg-red-50 text-red-700 border border-red-200" : "bg-slate-100 text-slate-800"
                }`}>
                    {product.currentStock}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    {!showConfirm ? (
                        <>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onEdit(product)}
                                title="Edit product"
                                aria-label={`Edit ${product.description}`}
                                className="h-8 w-8 text-slate-400 hover:text-slate-700"
                            >
                                <Edit3 size={15} />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setShowConfirm(true)}
                                title="Delete product"
                                aria-label={`Delete ${product.description}`}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={15} />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 animate-in fade-in">
                            <span className="text-xs text-red-600 font-medium mr-1">Delete?</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setShowConfirm(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
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
                error("Failed to delete item.");
            }
        });
    };

    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                        <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 truncate">{product.description}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {product.sku && <span className="font-mono text-[11px] text-slate-600">{product.sku}</span>}
                            <span>{product.unit || 'NOS'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="h-8 w-8 text-slate-400 hover:text-slate-700">
                        <Edit3 size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowConfirm(true)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={15} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                    <span className="text-[11px] text-slate-400 block">Selling Rate</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(Number(product.sellingRate))}</span>
                </div>
                <div>
                    <span className="text-[11px] text-slate-400 block">Purchase</span>
                    <span className="font-medium text-slate-600 tabular-nums">{formatCurrency(Number(product.purchaseRate))}</span>
                </div>
                <div>
                    <span className="text-[11px] text-slate-400 block">In Stock</span>
                    <span className={`font-semibold tabular-nums ${product.currentStock <= 5 ? 'text-red-600' : 'text-slate-900'}`}>
                        {product.currentStock} {product.unit || 'NOS'}
                    </span>
                </div>
            </div>

            {showConfirm && (
                <div className="flex items-center justify-between gap-3 p-2.5 bg-red-50 rounded-lg border border-red-200 animate-in fade-in">
                    <span className="text-xs text-red-700 font-medium">Delete item?</span>
                    <div className="flex gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)} className="h-7 px-2 text-xs">Cancel</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} loading={isPending} className="h-7 px-2.5 text-xs">Delete</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export function ProductTable({ products }: ProductTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const filtered = products.filter(p =>
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hsn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Modal for adding/editing product */}
            <Modal
                isOpen={!!editingProduct || isAdding}
                onClose={() => {
                    setEditingProduct(null);
                    setIsAdding(false);
                }}
                title={editingProduct ? "Edit Product" : "Add Product"}
            >
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
            </Modal>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Products Master</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Catalog repository for billable items, standard rates, and HSN compliance codes</p>
                </div>

                <Button
                    onClick={() => setIsAdding(true)}
                    variant="primary"
                    size="md"
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add Item</span>
                </Button>
            </div>

            {/* Search Filter */}
            <Card>
                <CardContent className="p-3.5">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search catalog by SKU, description, or HSN code..."
                            className="w-full h-9 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Listing */}
            <ErrorBoundary name="Inventory Catalog">
                {filtered.length === 0 ? (
                    <Card className="py-16 text-center p-4">
                        <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                            <Package className="h-5 w-5" />
                        </div>
                        <h3 className="text-slate-900 font-semibold text-sm">No products found</h3>
                        <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm mx-auto">
                            {searchTerm ? "No products match your search query." : "Add your first product or service item to the catalog."}
                        </p>
                        <Button variant="primary" size="md" onClick={() => setIsAdding(true)}>
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add Product
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <Card className="hidden lg:block overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[38%]">Item Description</TableHead>
                                        <TableHead className="w-[14%]">HSN / SAC</TableHead>
                                        <TableHead className="w-[16%] text-right">Selling Rate</TableHead>
                                        <TableHead className="w-[16%] text-right">Purchase Rate</TableHead>
                                        <TableHead className="w-[8%] text-center">In Stock</TableHead>
                                        <TableHead className="w-[8%] text-right">Actions</TableHead>
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
                        </Card>

                        {/* Mobile Grid View */}
                        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
    );
}
