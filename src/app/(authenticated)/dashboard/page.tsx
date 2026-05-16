"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, getBusinessLabel } from "@/utils/financials";
import { Card, CardContent } from "@/ui/core/Card";
import {
  Users,
  FileText,
  Activity,
  Receipt,
  Plus,
  History,
  Wallet,
  Target,
  CheckCircle2,
  ArrowDownUp,
  Loader2,
  Package,
  Building2,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing Neural Engine...</p>
      </div>
    );
  }

  const { totalInvoices, totalClients, totalProducts, totalStock, totalReceivable, recentTransactions } = data || {};

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">
            Mission <span className="text-primary-600">Control</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            Real-time Neural Engine Sync
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/invoices/new">
            <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3 group active:scale-95">
              <Plus className="w-4 h-4" />
              Initialize Invoice
            </button>
          </Link>
          <Link href="/payments/new">
            <button className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-slate-900 transition-all shadow-xl flex items-center gap-3 active:scale-95">
              <Wallet className="w-4 h-4 text-primary-500" />
              Capture Funds
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard
          icon={<Receipt className="w-7 h-7" />}
          label="Total Receivable"
          value={formatCurrency(totalReceivable)}
          badge="LIVE"
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-7 h-7" />}
          label="Active Entities"
          value={totalClients?.toString()}
          color="emerald"
        />
        <MetricCard
          icon={<FileText className="w-7 h-7" />}
          label="Invoices Issued"
          value={totalInvoices?.toString()}
          color="amber"
        />
        <MetricCard
          icon={<Target className="w-7 h-7" />}
          label="Products in Stock"
          value={totalStock?.toLocaleString() || "0"}
          badge={`${totalProducts || 0} SKUs`}
          dark
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card className="lg:col-span-2 border-0 shadow-2xl ring-1 ring-slate-100 rounded-[3rem] overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                <History className="w-4 h-4" />
                Neural Activity Ledger
              </h3>
              <Link href="/transactions" className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">Full Audit →</Link>
            </div>

            <div className="space-y-4">
              {!recentTransactions || recentTransactions.length === 0 ? (
                <EmptyBuffer />
              ) : (
                recentTransactions.map((tx: any) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-0 shadow-2xl ring-1 ring-slate-100 rounded-[3rem] overflow-hidden bg-primary-600 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-40 h-40" />
            </div>
            <CardContent className="p-10 relative z-10">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-8">System Health</h4>
              <div className="space-y-8">
                <HealthBar label="Synchronization" value="98%" width="w-[98%]" />
                <HealthBar label="Data Integrity" value="100%" width="w-full" />
              </div>

              <div className="mt-12 flex items-center gap-3 px-5 py-3 bg-white/10 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Quantum Secured</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions Command Post</h4>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/invoices/new" className="flex">
                <button className="w-full p-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-primary-100 shadow-sm active:scale-95">
                  <Plus className="w-5 h-5 text-primary-600" />
                  New Invoice
                </button>
              </Link>
              <Link href="/quotations/new" className="flex">
                <button className="w-full p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-amber-100 shadow-sm active:scale-95">
                  <FileText className="w-5 h-5 text-amber-600" />
                  New Quotation
                </button>
              </Link>
              <Link href="/payments/new" className="flex">
                <button className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-emerald-100 shadow-sm active:scale-95">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  Capture Funds
                </button>
              </Link>
              <Link href="/products" className="flex">
                <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-purple-100 shadow-sm active:scale-95">
                  <Package className="w-5 h-5 text-purple-600" />
                  Catalog SKUs
                </button>
              </Link>
              <Link href="/clients" className="flex">
                <button className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-indigo-100 shadow-sm active:scale-95">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  Active Entities
                </button>
              </Link>
              <Link href="/reports" className="flex">
                <button className="w-full p-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border border-rose-100 shadow-sm active:scale-95">
                  <BarChart3 className="w-5 h-5 text-rose-600" />
                  System Reports
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, badge, color, dark }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <Card className={cn("border-0 shadow-2xl ring-1 ring-slate-100 rounded-[2.5rem] overflow-hidden group", dark && "bg-slate-900 text-white")}>
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border", dark ? "bg-white/10 text-white border-white/10" : colorMap[color])}>
            {icon}
          </div>
          {badge && (
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
              {badge}
            </span>
          )}
        </div>
        <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-1", dark ? "text-white/40" : "text-slate-400")}>{label}</p>
        <h3 className="text-4xl font-black tracking-tighter italic tabular-nums">{value}</h3>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ tx }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-blue-50 border-blue-100 text-blue-500">
          <ArrowDownUp size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
            {tx.debitAccount?.name} ← {tx.creditAccount?.name}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {getBusinessLabel(tx.transactionType ?? tx.referenceType, tx.debitAccount?.type, tx.creditAccount?.type)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black tracking-tighter italic tabular-nums text-slate-900">
          {formatCurrency(Number(tx.amount))}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(tx.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function EmptyBuffer() {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
        <History size={40} />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Zero Activity</p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">No ledger entries detected in neural buffer</p>
      </div>
    </div>
  );
}

function HealthBar({ label, value, width }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className={cn("h-full bg-white rounded-full", width)} />
      </div>
    </div>
  );
}
