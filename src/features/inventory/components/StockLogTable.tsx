"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/ui/core/Table";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/utils";
import { StockLogActions } from "./StockLogActions";

interface StockLog {
    id: string;
    productId: string;
    type: string;
    quantityBefore: any;
    quantityChange: any;
    quantityAfter: any;
    referenceId: string | null;
    notes: string | null;
    createdAt: string;
    product: {
        description: string;
        sku: string | null;
    };
}

export function StockLogTable({ logs }: { logs: StockLog[] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-36">Timestamp</TableHead>
                        <TableHead>Product / SKU</TableHead>
                        <TableHead className="text-center w-28">Type</TableHead>
                        <TableHead className="text-right w-24">Change</TableHead>
                        <TableHead className="text-right w-28">New Balance</TableHead>
                        <TableHead className="text-right w-24">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => {
                        const change = Number(log.quantityChange);
                        const isPositive = change > 0;
                        
                        return (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium text-slate-600 text-xs">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-semibold">
                                            {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            ID: #{log.id.slice(-6)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-slate-900 truncate max-w-[200px]">
                                            {log.product.description}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            {log.product.sku || "N/A"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                            log.type === 'ADD' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            log.type === 'REMOVE' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                            "bg-amber-50 text-amber-700 border-amber-200"
                                        )}>
                                            {log.type === 'ADD' && <ArrowUpRight size={10} />}
                                            {log.type === 'REMOVE' && <ArrowDownRight size={10} />}
                                            {log.type === 'MANUAL' && <RefreshCw size={10} />}
                                            {log.type}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold tabular-nums text-sm">
                                    <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
                                        {isPositive ? "+" : ""}{change}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-xs font-medium text-slate-900">
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-slate-900">
                                            {Number(log.quantityAfter)}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Was: {Number(log.quantityBefore)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <StockLogActions 
                                        logId={log.id} 
                                        currentQuantity={Number(log.quantityChange)} 
                                        currentNotes={log.notes} 
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            
            {logs.length === 0 && (
                <div className="py-16 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-slate-400 font-medium text-xs">No activity logs recorded yet.</p>
                </div>
            )}
        </div>
    );
}
