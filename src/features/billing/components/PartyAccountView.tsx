"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
import { useToast } from "@/context/ToastContext";
import { 
    Building2, Mail, Phone, MapPin, ShieldCheck, TrendingUp, TrendingDown, 
    CreditCard, FileText, Calendar, Filter, Search, Download, Printer, 
    MessageSquare, ExternalLink, ChevronRight, CheckCircle2, Clock, 
    AlertTriangle, RefreshCw, Loader2, Edit3, Share2, Send
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { InvoiceShareModal } from "./InvoiceShareModal";
import { getPartyAccountOverviewAction } from "../actions/accountActions";
import apiClient from "@/lib/apiClient";

interface PartyAccountViewProps {
    partyId: string;
    partyType: 'CLIENT' | 'SUPPLIER';
    initialData?: any;
}

export function PartyAccountView({ partyId, partyType, initialData }: PartyAccountViewProps) {
    const isClient = partyType === 'CLIENT';
    const { success, error } = useToast();

    // Tab Navigation
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEDGER' | 'DOCUMENTS' | 'PAYMENTS' | 'OUTSTANDING' | 'STATEMENT'>('OVERVIEW');

    // Data state
    const [loading, setLoading] = useState(false);
    const [accountData, setAccountData] = useState<any>(initialData || null);

    // Filter states
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [txType, setTxType] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Statement PDF state
    const [isDownloadingStatement, setIsDownloadingStatement] = useState(false);

    // Share Modal State
    const [shareModalConfig, setShareModalConfig] = useState<{
        isOpen: boolean;
        documentType: 'INVOICE' | 'CLIENT_STATEMENT' | 'VENDOR_STATEMENT';
        invoiceId?: string;
        partyId?: string;
        actionType: 'SHARE' | 'FOLLOWUP';
        channel: 'WHATSAPP' | 'EMAIL';
    }>({
        isOpen: false,
        documentType: 'INVOICE',
        invoiceId: "",
        partyId: "",
        actionType: 'SHARE',
        channel: 'WHATSAPP'
    });

    useEffect(() => {
        loadData();
    }, [partyId, partyType, startDate, endDate, txType, searchQuery]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getPartyAccountOverviewAction(partyId, partyType, {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                transactionType: txType || undefined,
                search: searchQuery || undefined
            });

            if (res && 'success' in res && res.data) {
                setAccountData(res.data);
            } else if (res && 'error' in res) {
                error(res.error || "Failed to load account overview.");
            }
        } catch (err: any) {
            console.error("[ACCOUNT_LOAD_ERROR]", err);
            error(err.message || "Error loading account data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadStatement = async () => {
        setIsDownloadingStatement(true);
        try {
            const res = await apiClient.post("/api/statements/download", {
                partyId,
                partyType,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            }, {
                responseType: 'blob'
            });

            const disposition = (res.headers as any)["content-disposition"] || "";
            const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
            const fileName = fileNameMatch ? fileNameMatch[1] : `Statement_${summary?.name || 'Account'}.pdf`;

            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            success("Account Statement PDF downloaded successfully.");
        } catch (err: any) {
            console.error("[STATEMENT_DOWNLOAD_ERROR]", err);
            error("Failed to download Account Statement PDF.");
        } finally {
            setIsDownloadingStatement(false);
        }
    };

    const handlePrintStatement = async () => {
        setIsDownloadingStatement(true);
        try {
            const res = await apiClient.post("/api/statements/download", {
                partyId,
                partyType,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            }, { responseType: 'blob' });

            const url = URL.createObjectURL(res.data);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                }, 1000);
            };

            success("Opening print dialog for Account Statement...");
        } catch (err: any) {
            error("Failed to print statement.");
        } finally {
            setIsDownloadingStatement(false);
        }
    };

    if (!accountData && loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading complete financial account ledger...</p>
            </div>
        );
    }

    const summary = accountData?.summary;
    const ledger = accountData?.ledger || [];
    const documents = accountData?.documents || [];
    const payments = accountData?.payments || [];
    const outstanding = accountData?.outstanding || { totalOutstanding: 0, items: [] };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* ── TOP HEADER & ACTIONS BAR ── */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black italic uppercase tracking-tight">{summary?.name}</h1>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                {summary?.accountStatus}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-3">
                            <span>{summary?.partyType === 'CLIENT' ? 'Customer Account' : 'Supplier/Vendor Account'}</span>
                            {summary?.gstin && <span>• GST: {summary.gstin}</span>}
                            {summary?.phone && <span>• {summary.phone}</span>}
                        </p>
                    </div>
                </div>

                {/* Primary ERP Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link href={isClient ? `/clients/${partyId}/edit` : `/vendors/${partyId}/edit`}>
                        <button className="h-11 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-white/10">
                            <Edit3 className="w-4 h-4 text-indigo-400" />
                            Edit
                        </button>
                    </Link>

                    <button
                        onClick={() => setActiveTab('STATEMENT')}
                        className="h-11 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-white/10"
                    >
                        <Printer className="w-4 h-4 text-slate-300" />
                        Statement
                    </button>

                    <button
                        onClick={() => setShareModalConfig({
                            isOpen: true,
                            documentType: isClient ? 'CLIENT_STATEMENT' : 'VENDOR_STATEMENT',
                            partyId,
                            actionType: 'SHARE',
                            channel: 'EMAIL'
                        })}
                        className="h-11 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>

                    <button
                        onClick={() => setShareModalConfig({
                            isOpen: true,
                            documentType: isClient ? 'CLIENT_STATEMENT' : 'VENDOR_STATEMENT',
                            partyId,
                            actionType: 'SHARE',
                            channel: 'WHATSAPP'
                        })}
                        className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                    >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                    </button>
                </div>
            </div>

            {/* ── ACCOUNT SUMMARY STRIP ── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {isClient ? 'Current Outstanding' : 'Current Payable'}
                    </p>
                    <p className={`text-lg font-black italic ${summary?.currentBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatCurrency(Math.abs(summary?.currentBalance || 0))}
                    </p>
                </Card>

                <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {isClient ? 'Total Lifetime Sales' : 'Total Procurement'}
                    </p>
                    <p className="text-lg font-black italic text-slate-900">{formatCurrency(summary?.totalTurnover || 0)}</p>
                </Card>

                <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {isClient ? 'Payments Received' : 'Payments Made'}
                    </p>
                    <p className="text-lg font-black italic text-emerald-600">{formatCurrency(summary?.totalPaid || 0)}</p>
                </Card>

                <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Opening Balance</p>
                    <p className="text-lg font-black italic text-slate-800">{formatCurrency(summary?.openingBalance || 0)}</p>
                </Card>

                <Card className="border-0 shadow-lg ring-1 ring-slate-200 bg-white p-4 rounded-2xl col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total {isClient ? 'Invoices' : 'Orders'}</p>
                    <p className="text-lg font-black italic text-slate-900">{summary?.totalDocumentCount || 0}</p>
                </Card>
            </div>

            {/* ── TOP ERP NAVIGATION TAB BAR ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                    {[
                        { id: 'OVERVIEW', label: 'Overview', icon: Building2 },
                        { id: 'LEDGER', label: 'Ledger', icon: FileText, count: ledger.length },
                        { id: 'DOCUMENTS', label: isClient ? 'Invoices' : 'Purchases', icon: TrendingUp, count: documents.length },
                        { id: 'PAYMENTS', label: 'Payments', icon: CreditCard, count: payments.length },
                        { id: 'OUTSTANDING', label: 'Outstanding', icon: AlertTriangle, count: outstanding.items?.length, highlight: outstanding.totalOutstanding > 0 },
                        { id: 'STATEMENT', label: 'Statement', icon: Printer }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`h-10 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                                    isActive 
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${tab.highlight ? 'text-rose-400' : ''}`} />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <Button
                    onClick={loadData}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl hidden md:flex"
                    title="Refresh Account Data"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === 'OVERVIEW' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Profile Info */}
                        <Card className="border-0 shadow-lg ring-1 ring-slate-200 rounded-2xl bg-white p-6 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b pb-3">Contact & Address</h3>
                            {summary?.email && (
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Email Address</p>
                                    <p className="text-xs font-bold text-slate-800">{summary.email}</p>
                                </div>
                            )}
                            {summary?.phone && (
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Phone Number</p>
                                    <p className="text-xs font-bold text-slate-800">{summary.phone}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Address</p>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{summary?.address}</p>
                            </div>
                        </Card>

                        {/* Turnover Analytics Box */}
                        <Card className="border-0 shadow-xl ring-1 ring-slate-900/5 rounded-2xl p-6 bg-slate-900 text-white md:col-span-2 space-y-6">
                            <h3 className="text-base font-black italic uppercase tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
                                <TrendingUp className="w-5 h-5 text-primary-400" />
                                Turnover Breakdown & Financial Year Comparison
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current FY Turnover</p>
                                    <p className="text-xl font-black italic text-emerald-400">{formatCurrency(summary?.currentFyTurnover || 0)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Previous FY Turnover</p>
                                    <p className="text-xl font-black italic text-slate-200">{formatCurrency(summary?.previousFyTurnover || 0)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Month</p>
                                    <p className="text-xl font-black italic text-indigo-400">{formatCurrency(summary?.monthlyTurnover || 0)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* ── TAB 2: LEDGER (CHRONOLOGICAL RUNNING BALANCE) ── */}
            {activeTab === 'LEDGER' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Filters & Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">From Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">To Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Transaction Type</label>
                            <select
                                value={txType}
                                onChange={(e) => setTxType(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                            >
                                <option value="ALL">All Transactions</option>
                                <option value="INVOICE">Invoices</option>
                                <option value="PURCHASE">Purchases</option>
                                <option value="PAYMENT">Payments</option>
                                <option value="OPENING_BALANCE">Opening Balance</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Search Ref / Desc</label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ledger Table */}
                    <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                        <CardContent className="p-0">
                            {ledger.length === 0 ? (
                                <div className="py-16 text-center bg-slate-50/50">
                                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <h4 className="text-sm font-black uppercase text-slate-700">No transactions found for this account.</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Try resetting search or date filters.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4 text-left">Date</th>
                                                <th className="px-6 py-4 text-left">Type</th>
                                                <th className="px-6 py-4 text-left">Reference</th>
                                                <th className="px-6 py-4 text-left">Description</th>
                                                <th className="px-6 py-4 text-right">Debit (₹)</th>
                                                <th className="px-6 py-4 text-right">Credit (₹)</th>
                                                <th className="px-6 py-4 text-right">Balance (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-bold">
                                            {ledger.map((row: any) => (
                                                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                                                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(row.date))}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                            row.type === 'INVOICE' || row.type === 'PURCHASE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                            row.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {row.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-extrabold font-mono">
                                                        {row.reference}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                        {row.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-900 font-extrabold italic">
                                                        {row.debit > 0 ? formatCurrency(row.debit) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-emerald-600 font-extrabold italic">
                                                        {row.credit > 0 ? formatCurrency(row.credit) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-950 font-black italic">
                                                        {formatCurrency(Math.abs(row.runningBalance))} {row.runningBalance >= 0 ? 'Dr' : 'Cr'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── TAB 3: INVOICES / PURCHASES ── */}
            {activeTab === 'DOCUMENTS' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                        <CardContent className="p-0">
                            {documents.length === 0 ? (
                                <div className="py-16 text-center bg-slate-50/50">
                                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <h4 className="text-sm font-black uppercase text-slate-700">No {isClient ? 'invoices' : 'purchases'} found.</h4>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4 text-left">{isClient ? 'Invoice #' : 'Purchase #'}</th>
                                                <th className="px-6 py-4 text-left">Date</th>
                                                <th className="px-6 py-4 text-right">Grand Total</th>
                                                <th className="px-6 py-4 text-right">Paid</th>
                                                <th className="px-6 py-4 text-right">Balance Due</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-bold">
                                            {documents.map((doc: any) => (
                                                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-extrabold">
                                                        {doc.invoiceNo || doc.purchaseNo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(doc.date))}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-900 font-extrabold italic">
                                                        {formatCurrency(Number(doc.grandTotal))}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-emerald-600 font-extrabold italic">
                                                        {formatCurrency(doc.paidAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-rose-600 font-extrabold italic">
                                                        {formatCurrency(doc.balanceDue)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center">
                                                            <StatusBadge status={doc.status} />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link href={isClient ? `/invoices/${doc.id}` : `/purchases/${doc.id}`}>
                                                                <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 text-[10px] font-black uppercase transition-all flex items-center gap-1">
                                                                    View <ChevronRight className="w-3 h-3" />
                                                                </button>
                                                            </Link>
                                                            {isClient && (
                                                                <>
                                                                    <button
                                                                        onClick={() => setShareModalConfig({
                                                                            isOpen: true,
                                                                            documentType: 'INVOICE',
                                                                            invoiceId: doc.id,
                                                                            actionType: 'SHARE',
                                                                            channel: 'EMAIL'
                                                                        })}
                                                                        className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all flex items-center justify-center"
                                                                        title="Share via Email"
                                                                    >
                                                                        <Mail className="w-3.5 h-3.5" />
                                                                    </button>

                                                                    <button
                                                                        onClick={() => setShareModalConfig({
                                                                            isOpen: true,
                                                                            documentType: 'INVOICE',
                                                                            invoiceId: doc.id,
                                                                            actionType: 'SHARE',
                                                                            channel: 'WHATSAPP'
                                                                        })}
                                                                        className="h-8 w-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 transition-all flex items-center justify-center"
                                                                        title="Share via WhatsApp"
                                                                    >
                                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── TAB 4: PAYMENTS ── */}
            {activeTab === 'PAYMENTS' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                        <CardContent className="p-0">
                            {payments.length === 0 ? (
                                <div className="py-16 text-center bg-slate-50/50">
                                    <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <h4 className="text-sm font-black uppercase text-slate-700">No payment transactions found.</h4>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4 text-left">Date</th>
                                                <th className="px-6 py-4 text-left">Method</th>
                                                <th className="px-6 py-4 text-left">Reference / Notes</th>
                                                <th className="px-6 py-4 text-right">Amount (₹)</th>
                                                <th className="px-6 py-4 text-right">Allocated</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-bold">
                                            {payments.map((pay: any) => {
                                                const pAmt = Number(pay.amount || 0);
                                                const pAlloc = (pay.allocations || []).reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0);
                                                return (
                                                    <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                                                            {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(pay.paidAt))}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                                                                {pay.method}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                            {pay.reference || pay.notes || pay.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-emerald-600 font-extrabold italic text-sm">
                                                            {formatCurrency(pAmt)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-slate-700 font-bold italic">
                                                            {formatCurrency(pAlloc)}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link href={`/payments/${pay.id}/edit`}>
                                                                <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 text-[10px] font-black uppercase transition-all">
                                                                    Edit
                                                                </button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── TAB 5: OUTSTANDING & AGING ── */}
            {activeTab === 'OUTSTANDING' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-xl ring-1 ring-rose-500/10 bg-rose-50/50 p-6 rounded-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/80 mb-1">Total Outstanding Balance</p>
                            <h3 className="text-3xl font-black italic text-rose-950">{formatCurrency(outstanding.totalOutstanding)}</h3>
                        </Card>
                        <Card className="border-0 shadow-xl ring-1 ring-amber-500/10 bg-amber-50/50 p-6 rounded-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/80 mb-1">Overdue Amount</p>
                            <h3 className="text-3xl font-black italic text-amber-950">{formatCurrency(outstanding.totalOverdue)}</h3>
                        </Card>
                        <Card className="border-0 shadow-xl ring-1 ring-emerald-500/10 bg-emerald-50/50 p-6 rounded-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80 mb-1">Current Due (Not Overdue)</p>
                            <h3 className="text-3xl font-black italic text-emerald-950">{formatCurrency(outstanding.totalCurrentDue)}</h3>
                        </Card>
                    </div>

                    <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                        <CardContent className="p-0">
                            {outstanding.items?.length === 0 ? (
                                <div className="py-16 text-center bg-emerald-50/30">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <h4 className="text-sm font-black uppercase text-emerald-800">Account Fully Settled</h4>
                                    <p className="text-xs font-bold text-emerald-600 mt-1">There are no outstanding unpaid items for this account.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <th className="px-6 py-4 text-left">Document #</th>
                                                <th className="px-6 py-4 text-left">Date</th>
                                                <th className="px-6 py-4 text-left">Due Date</th>
                                                <th className="px-6 py-4 text-right">Grand Total</th>
                                                <th className="px-6 py-4 text-right">Paid</th>
                                                <th className="px-6 py-4 text-right">Balance Due</th>
                                                <th className="px-6 py-4 text-center">Days Overdue</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-bold">
                                            {outstanding.items?.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-extrabold">
                                                        {item.documentNo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.date))}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                                        {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.dueDate))}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-slate-900 font-extrabold italic">
                                                        {formatCurrency(item.grandTotal)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-emerald-600 font-extrabold italic">
                                                        {formatCurrency(item.paidAmount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-rose-600 font-extrabold italic text-sm">
                                                        {formatCurrency(item.balanceDue)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                                            item.daysOverdue === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            item.daysOverdue <= 30 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                            'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                            {item.daysOverdue === 0 ? 'Current' : `${item.daysOverdue} Days Overdue`}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={isClient ? `/invoices/${item.id}` : `/purchases/${item.id}`}>
                                                            <button className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 text-[10px] font-black uppercase transition-all">
                                                                View
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ── TAB 6: STATEMENT (OFFICIAL PDF & SHARING) ── */}
            {activeTab === 'STATEMENT' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Action Bar */}
                    <Card className="border-0 shadow-xl ring-1 ring-slate-900/5 bg-slate-900 text-white rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-black italic uppercase tracking-tight flex items-center gap-2">
                                    <Printer className="w-5 h-5 text-primary-400" />
                                    Certified Account Statement Document
                                </h3>
                                <p className="text-xs font-bold text-slate-400 mt-1">
                                    Generate, download, print, or share certified account statement with complete debit/credit breakdown.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                                <button
                                    onClick={handleDownloadStatement}
                                    disabled={isDownloadingStatement}
                                    className="h-10 px-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {isDownloadingStatement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    Download PDF
                                </button>

                                <button
                                    onClick={handlePrintStatement}
                                    disabled={isDownloadingStatement}
                                    className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Printer className="w-4 h-4 text-slate-300" />
                                    Print
                                </button>

                                <button
                                    onClick={() => setShareModalConfig({
                                        isOpen: true,
                                        documentType: isClient ? 'CLIENT_STATEMENT' : 'VENDOR_STATEMENT',
                                        partyId,
                                        actionType: 'SHARE',
                                        channel: 'EMAIL'
                                    })}
                                    className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
                                >
                                    <Mail className="w-4 h-4" />
                                    Email PDF
                                </button>

                                <button
                                    onClick={() => setShareModalConfig({
                                        isOpen: true,
                                        documentType: isClient ? 'CLIENT_STATEMENT' : 'VENDOR_STATEMENT',
                                        partyId,
                                        actionType: 'SHARE',
                                        channel: 'WHATSAPP'
                                    })}
                                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Statement On-Screen Live Document Preview */}
                    <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white p-8 space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">JEZZY ENTERPRISES</h2>
                                <p className="text-xs font-bold text-slate-500">MP 4/3 IIA, MOONIYUR, VELIMUKKU PO, MALAPPURAM DIST - 676317</p>
                                <p className="text-xs font-bold text-slate-500">GSTIN: 32BMAPJ5504M1Z9 | Phone: +91 85531 85300</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                                    Official Account Statement
                                </span>
                                <p className="text-xs font-bold text-slate-400 mt-2">
                                    Date: {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date())}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Holder</p>
                                <p className="text-base font-black text-slate-900">{summary?.name}</p>
                                {summary?.gstin && <p className="text-xs font-mono font-bold text-slate-600">GSTIN: {summary.gstin}</p>}
                                <p className="text-xs font-bold text-slate-500">{summary?.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Closing Balance</p>
                                <p className="text-2xl font-black italic text-slate-950">
                                    {formatCurrency(Math.abs(summary?.currentBalance || 0))} {summary?.currentBalance >= 0 ? 'Dr' : 'Cr'}
                                </p>
                            </div>
                        </div>

                        {/* Chronological Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs font-bold">
                                <thead>
                                    <tr className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="p-3 text-left">Date</th>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-left">Ref</th>
                                        <th className="p-3 text-left">Description</th>
                                        <th className="p-3 text-right">Debit (₹)</th>
                                        <th className="p-3 text-right">Credit (₹)</th>
                                        <th className="p-3 text-right">Balance (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {ledger.map((r: any) => (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="p-3 text-slate-900">{new Intl.DateTimeFormat("en-IN", { dateStyle: "short" }).format(new Date(r.date))}</td>
                                            <td className="p-3 text-slate-600">{r.type}</td>
                                            <td className="p-3 text-slate-900 font-mono">{r.reference}</td>
                                            <td className="p-3 text-slate-600">{r.description}</td>
                                            <td className="p-3 text-right text-slate-900">{r.debit > 0 ? formatCurrency(r.debit) : '-'}</td>
                                            <td className="p-3 text-right text-emerald-600">{r.credit > 0 ? formatCurrency(r.credit) : '-'}</td>
                                            <td className="p-3 text-right text-slate-950 font-black">{formatCurrency(Math.abs(r.runningBalance))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Unified Document & Statement Share Modal */}
            {shareModalConfig.isOpen && (
                <InvoiceShareModal
                    isOpen={shareModalConfig.isOpen}
                    onClose={() => setShareModalConfig(prev => ({ ...prev, isOpen: false }))}
                    documentType={shareModalConfig.documentType}
                    invoiceId={shareModalConfig.invoiceId}
                    partyId={shareModalConfig.partyId}
                    actionType={shareModalConfig.actionType}
                    channel={shareModalConfig.channel}
                />
            )}
        </div>
    );
}
