"use client";

import React from "react";
import { ShoppingCart, Plus, Truck } from "lucide-react";
import { Card } from "@/ui/core/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/ui/core/Table";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { PurchaseListActions } from "./PurchaseListActions";
import { Button } from "@/ui/core/Button";

interface PurchaseTableProps {
    purchases: any[];
    isTrashed?: boolean;
}

export function PurchaseTable({ purchases, isTrashed = false }: PurchaseTableProps) {
    if (purchases.length === 0) {
        return (
            <Card className="text-center py-16 p-4">
                <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                    <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-sm">No purchase bills found</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-5 max-w-sm mx-auto">
                    Record supplier purchase invoices to track stock intake and input tax credit claims.
                </p>
                <Link href="/purchases/new">
                    <Button variant="primary" size="md">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Log First Purchase
                    </Button>
                </Link>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-36">Purchase #</TableHead>
                        <TableHead>Vendor / Supplier</TableHead>
                        <TableHead className="hidden sm:table-cell">Bill Date</TableHead>
                        <TableHead className="text-right">Input GST</TableHead>
                        <TableHead className="text-right">Grand Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.map((purchase) => (
                        <TableRow key={purchase.id} className="group">
                            <TableCell className="font-medium text-slate-900">
                                <Link 
                                    href={`/purchases/${purchase.id}`}
                                    className="hover:underline hover:text-slate-700 flex items-center gap-1.5"
                                >
                                    <span>{purchase.purchaseNo}</span>
                                    {purchase.isFreightCollect && (
                                        <span title="Freight Collect">
                                            <Truck size={13} className="text-slate-400" />
                                        </span>
                                    )}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link 
                                    href={`/vendors/${purchase.vendor.id}`}
                                    className="font-medium text-slate-900 hover:underline"
                                >
                                    {purchase.vendor.name}
                                </Link>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-slate-500 text-xs">
                                {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(purchase.date))}
                            </TableCell>
                            <TableCell className="text-right font-medium text-emerald-700 text-xs tabular-nums">
                                {formatCurrency(purchase.taxTotal.toNumber())}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                                {formatCurrency(purchase.grandTotal.toNumber())}
                            </TableCell>
                            <TableCell className="text-right">
                                <PurchaseListActions
                                    purchaseId={purchase.id}
                                    isTrashed={isTrashed}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
