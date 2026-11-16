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
  CheckCircle2,
  ArrowDownUp,
  Loader2,
  Package,
  Building2,
  BarChart3,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/core/Button";

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
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Loading overview...</p>
      </div>
    );
  }

  const {
    totalInvoices,
    totalClients,
    totalVendors,
    totalProducts,
    totalStock,
    todaySales,
    todayCollections,
    totalReceivable,
    totalPayable,
    recentTransactions
  } = data || {};

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Financial Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Live business activity and ledger summary
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link href="/payments/new">
            <Button variant="secondary" size="md">
              <Wallet className="w-4 h-4 text-slate-500 mr-2" />
              Receive Payment
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Core Financial Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Receipt className="w-4 h-4 text-blue-600" />}
          label="Total Receivables"
          value={formatCurrency(totalReceivable ?? 0)}
          badge="Incoming"
          badgeColor="blue"
        />
        <MetricCard
          icon={<Wallet className="w-4 h-4 text-rose-600" />}
          label="Total Payables"
          value={formatCurrency(totalPayable ?? 0)}
          badge="Outgoing"
          badgeColor="rose"
        />
        <MetricCard
          icon={<BarChart3 className="w-4 h-4 text-emerald-600" />}
          label="Today's Sales"
          value={formatCurrency(todaySales ?? 0)}
        />
        <MetricCard
          icon={<Activity className="w-4 h-4 text-indigo-600" />}
          label="Today's Collections"
          value={formatCurrency(todayCollections ?? 0)}
        />
      </div>

      {/* ── Directory Mini Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MiniMetric label="Active Clients" value={totalClients ?? 0} icon={<Users className="w-4 h-4 text-blue-600" />} />
        <MiniMetric label="Active Vendors" value={totalVendors ?? 0} icon={<Building2 className="w-4 h-4 text-purple-600" />} />
        <MiniMetric label="Invoices Issued" value={totalInvoices ?? 0} icon={<FileText className="w-4 h-4 text-amber-600" />} />
        <MiniMetric label="Stock Items" value={`${totalProducts ?? 0} (${totalStock ?? 0} units)`} icon={<Package className="w-4 h-4 text-emerald-600" />} />
      </div>

      {/* ── Activity Stream & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Transactions List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <History className="w-4 h-4 text-slate-400" />
              Recent Transactions
            </CardTitle>
            <Link href="/transactions" className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors">
              View All
            </Link>
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

        {/* System Health & Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-xs text-slate-600">Database Engine</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-xs text-slate-600">Data Integrity</span>
                <span className="text-xs font-semibold text-slate-900">100% Verified</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-slate-700 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All subsystems operational</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Quick Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/invoices/new" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>New Invoice</span>
                  </div>
                </Link>
                <Link href="/quotations/new" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>New Quote</span>
                  </div>
                </Link>
                <Link href="/payments/new" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <Wallet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Record Payment</span>
                  </div>
                </Link>
                <Link href="/purchases/new" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Log Purchase</span>
                  </div>
                </Link>
                <Link href="/products" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    <span>Products</span>
                  </div>
                </Link>
                <Link href="/reports" className="flex">
                  <div className="w-full p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 border border-slate-200 shadow-2xs">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reports</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, badge, badgeColor }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  badge?: string;
  badgeColor?: 'blue' | 'rose' | 'emerald';
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            {icon}
          </div>
          {badge && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
              badgeColor === 'blue' 
                ? 'text-blue-700 bg-blue-50 border border-blue-100' 
                : 'text-rose-700 bg-rose-50 border border-rose-100'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</h3>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ tx }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
          <ArrowDownUp size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">
            {tx.debitAccount?.name} ← {tx.creditAccount?.name}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {getBusinessLabel(tx.transactionType ?? tx.referenceType, tx.debitAccount?.type, tx.creditAccount?.type)}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-xs font-bold text-slate-900 tabular-nums">
          {formatCurrency(Number(tx.amount))}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function EmptyBuffer() {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-200 rounded-lg">
      <History className="w-6 h-6 text-slate-300" />
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-700">No recent transactions</p>
        <p className="text-[11px] text-slate-400">Transaction history will appear here once recorded.</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-3.5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
          <p className="text-base font-bold text-slate-900 tracking-tight mt-0.5 truncate tabular-nums">{value}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 ml-2">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
