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
        <div className="glass shadow-2xl rounded-[2.5rem] overflow-hidden border-0">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest italic">Timestamp</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest italic">Resource / SKU</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest italic text-center">Protocol</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest italic text-right">Delta</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest italic text-right">Balance</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest italic text-right pr-8">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => {
                        const change = Number(log.quantityChange);
                        const isPositive = change > 0;
                        
                        return (
                            <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell className="py-6 px-8">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 italic tracking-tighter">
                                            {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            Log ID: {log.id.slice(-6)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
                                            {log.product.description}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                            {log.product.sku || "N/A"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border",
                                            log.type === 'ADD' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            log.type === 'REMOVE' ? "bg-rose-50 text-rose-700 border-rose-100" :
                                            "bg-amber-50 text-amber-700 border-amber-100"
                                        )}>
                                            {log.type === 'ADD' && <ArrowUpRight size={10} />}
                                            {log.type === 'REMOVE' && <ArrowDownRight size={10} />}
                                            {log.type === 'MANUAL' && <RefreshCw size={10} />}
                                            {log.type}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={cn(
                                        "text-sm font-black italic tabular-nums",
                                        isPositive ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        {isPositive ? "+" : ""}{change}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-black text-slate-900 tabular-nums italic">
                                            {Number(log.quantityAfter)}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest opacity-60">
                                            Prev: {Number(log.quantityBefore)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
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
                <div className="py-20 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No activity logs recorded yet.</p>
                </div>
            )}
        </div>
    );
}
