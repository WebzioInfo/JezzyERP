"use client";

import { useState, useEffect } from "react";
import { formatCurrency, fmtDate } from "@/utils/financials";
import { Download, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { Skeleton } from "@/ui/core/Skeleton";

interface LedgerEntry {
    id: string;
    date: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    description: string;
    referenceType: string;
}

export function ClientLedger({ clientId, clientName }: { clientId: string, clientName: string }) {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function fetchLedger() {
            try {
                const res = await fetch(`/api/ledger?clientId=${clientId}`);
                const data = await res.json();
                setEntries(data.entries);
                
                // Calculate Balance
                const bal = data.entries.reduce((acc: number, curr: any) => {
                    const amt = Number(curr.amount);
                    return curr.type === 'CREDIT' ? acc + amt : acc - amt;
                }, 0);
                setBalance(bal);
            } catch (err) {
                console.error("Failed to fetch ledger", err);
            } finally {
                setLoading(false);
            }
        }
        fetchLedger();
    }, [clientId]);

    const handleDownload = () => {
        window.open(`/api/reports/ledger?clientId=${clientId}`, '_blank');
    };

    if (loading) return <Skeleton className="h-[400px] w-full rounded-3xl" />;

    return (
        <Card className="overflow-hidden border-0 shadow-2xl shadow-slate-200/50 bg-white/50 backdrop-blur-xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600">
                        <History className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Statement of Account</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{clientName}</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-slate-200"
                    onClick={handleDownload}
                >
                    <Download className="w-3.5 h-3.5" />
                    Export PDF
                </Button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`p-4 rounded-2xl ${balance >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} border`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                        <h4 className={`text-2xl font-black ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(balance))}
                        </h4>
                        <p className="text-[10px] font-bold opacity-60">
                            {balance >= 0 ? 'ADVANCE CREDIT' : 'TOTAL OUTSTANDING'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Debit</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 text-xs font-medium text-slate-600">
                                        {fmtDate(entry.date)}
                                    </td>
                                    <td className="py-4">
                                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                                            {entry.description || entry.referenceType}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Ref: {entry.referenceType}
                                        </p>
                                    </td>
                                    <td className="py-4 text-right">
                                        {entry.type === 'DEBIT' ? (
                                            <div className="inline-flex items-center gap-1 text-red-600 font-bold text-sm">
                                                <ArrowUpRight className="w-3 h-3" />
                                                {formatCurrency(entry.amount)}
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td className="py-4 text-right">
                                        {entry.type === 'CREDIT' ? (
                                            <div className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                                <ArrowDownLeft className="w-3 h-3" />
                                                {formatCurrency(entry.amount)}
                                            </div>
                                        ) : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
}
