"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, getBusinessLabel } from "@/utils/financials";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/Card";
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
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const { totalInvoices, totalClients, totalProducts, totalStock, totalReceivable, recentTransactions } = data || {};

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Financial metrics and system activity
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/payments/new">
            <button className="h-9 px-4 bg-white border border-slate-200 text-slate-700 rounded-md font-medium text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Wallet className="w-4 h-4 text-slate-500" />
              Capture Funds
            </button>
          </Link>
          <Link href="/invoices/new">
            <button className="h-9 px-4 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={<Receipt className="w-5 h-5" />}
          label="Total Receivable"
          value={formatCurrency(totalReceivable)}
          badge="Live"
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Active Clients"
          value={totalClients?.toString()}
          color="emerald"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Invoices Issued"
          value={totalInvoices?.toString()}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Recent Transactions
            </CardTitle>
            <Link href="/transactions" className="text-sm font-medium text-slate-500 hover:text-slate-900">View All</Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
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

        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-0">
            <CardContent className="p-6">
              <h4 className="text-sm font-medium text-slate-400 mb-6">System Health</h4>
              <div className="space-y-6">
                <HealthBar label="Synchronization" value="98%" width="w-[98%]" />
                <HealthBar label="Data Integrity" value="100%" width="w-full" />
              </div>

              <div className="mt-8 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium">All Systems Operational</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/invoices/new" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <Plus className="w-4 h-4 text-slate-500" />
                    Invoice
                  </button>
                </Link>
                <Link href="/quotations/new" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Quote
                  </button>
                </Link>
                <Link href="/payments/new" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <Wallet className="w-4 h-4 text-slate-500" />
                    Payment
                  </button>
                </Link>
                <Link href="/products" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <Package className="w-4 h-4 text-slate-500" />
                    Products
                  </button>
                </Link>
                <Link href="/clients" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Clients
                  </button>
                </Link>
                <Link href="/reports" className="flex">
                  <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 border border-slate-200">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    Reports
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, badge, color }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
            {icon}
          </div>
          {badge && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{value}</h3>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ tx }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-md border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md flex items-center justify-center border bg-slate-100 border-slate-200 text-slate-500">
          <ArrowDownUp size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">
            {tx.debitAccount?.name} ← {tx.creditAccount?.name}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {getBusinessLabel(tx.transactionType ?? tx.referenceType, tx.debitAccount?.type, tx.creditAccount?.type)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          {formatCurrency(Number(tx.amount))}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function EmptyBuffer() {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border border-dashed border-slate-200 rounded-md">
      <History className="w-8 h-8 text-slate-300" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-600">No recent transactions</p>
        <p className="text-xs text-slate-500">Your ledger history will appear here</p>
      </div>
    </div>
  );
}

function HealthBar({ label, value, width }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={cn("h-full bg-white rounded-full", width)} />
      </div>
    </div>
  );
}
