import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils";
import { PaymentService } from "@/features/billing/services/PaymentService";
import {
  CreditCard,
  Plus,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default async function PaymentsPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const payments = await PaymentService.getAllPayments();

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Records</h1>
          <p className="page-subtitle">Track all incoming payments from clients</p>
        </div>
        <Link href="/invoices">
          <button className="btn-primary h-10 px-5 gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Record New Payment
          </button>
        </Link>
      </div>

      {/* ── Payments Table ── */}
      <div className="card p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {payments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/30">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-inner">
              <CreditCard className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-bold text-slate-600 text-lg">No payments recorded yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-8 max-w-sm mx-auto">
              Record payments against your invoices to track your cash flow and update invoice statuses automatically.
            </p>
            <Link href="/invoices">
              <button className="btn-secondary h-10 px-6 font-semibold">
                Go to Invoices to Start
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Date Paid</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Invoice #</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Client</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Method</th>
                  <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Reference No</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        <span className="font-medium text-slate-700">
                          {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(p.paidAt))}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/invoices/${p.invoiceId}`} className="flex items-center gap-1.5 text-primary-600 font-bold hover:underline">
                        {p.invoice.invoiceNo}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800">{p.invoice.client.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-success-500" />
                         <span className="text-slate-600 font-medium capitalize">{p.method.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-slate-500 font-mono text-xs">{p.reference || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <p className="font-bold text-success-700 text-base">{formatCurrency(p.amount.toNumber())}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <Link href={`/invoices/${p.invoiceId}`}>
                        <button className="btn-ghost h-8 w-8 p-0 rounded-lg group-hover:bg-slate-100">
                           <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors mx-auto" />
                        </button>
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Summary Stats (Optional Row) ── */}
      {payments.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card bg-success-50/50 border-success-100 flex items-center justify-between p-4">
                <div>
                   <p className="text-xs font-bold text-success-600 uppercase tracking-widest mb-1">Total Collected Today</p>
                   <p className="text-xl font-bold text-success-800">
                      {formatCurrency(payments
                        .filter((p: any) => new Date(p.paidAt).toDateString() === new Date().toDateString())
                        .reduce((sum: number, p: any) => sum + p.amount.toNumber(), 0))}
                   </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center shrink-0">
                   <CreditCard className="w-5 h-5 text-success-600" />
                </div>
            </div>
         </div>
      )}
    </div>
  );
}
