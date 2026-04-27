import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import { PaymentService } from "@/features/billing/services/PaymentService";
import { db } from "@/db/prisma/client";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/ui/core/Card";
import { LiveSearch } from "@/components/common/LiveSearch";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { q: searchQuery = "" } = await searchParams;

  const [invoices, purchases, clients] = await Promise.all([
    db.invoice.findMany({
      where: { deletedAt: null, status: { notIn: ["PAID", "CANCELLED"] } },
      select: { grandTotal: true, amountPaid: true }
    }),
    db.purchase.findMany({
      where: { deletedAt: null, status: { notIn: ["PAID", "CANCELLED"] } },
      select: { grandTotal: true, amountPaid: true }
    }),
    db.client.findMany({
      where: { active: true },
      include: {
        invoices: {
          where: { deletedAt: null },
          select: { grandTotal: true, amountPaid: true }
        }
      }
    })
  ]);

  const incomingCredit = invoices.reduce((sum, inv) => sum + (inv.grandTotal.toNumber() - inv.amountPaid.toNumber()), 0);
  const outgoingCredit = purchases.reduce((sum, pur) => sum + (pur.grandTotal.toNumber() - pur.amountPaid.toNumber()), 0);
  
  const clientData = clients.map(client => {
    let billed = 0;
    let paid = 0;
    client.invoices.forEach(inv => {
      billed += inv.grandTotal.toNumber();
      paid += inv.amountPaid.toNumber();
    });
    return {
      id: client.id,
      name: client.name,
      billed,
      paid,
      pending: billed - paid
    };
  }).filter(c => c.billed > 0).sort((a, b) => b.pending - a.pending);

  const filteredClients = searchQuery 
    ? clientData.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clientData;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic uppercase">
            Credit <span className="text-primary-600">Dynamics</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
            Monitor accounts receivable (Incoming) and accounts payable (Outgoing) credits.
          </p>
        </div>

        <Link href="/invoices">
          <button className="h-16 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Plus className="w-5 h-5" />
            <span>Record Payment</span>
          </button>
        </Link>
      </div>

      {/* ── Credit Summaries ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-0 bg-emerald-600 text-white shadow-2xl shadow-emerald-900/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="w-32 h-32" />
          </div>
          <CardContent className="p-10 relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <ArrowUpRight className="w-5 h-5" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Incoming Credit (Receivable)</span>
            </div>
            <h2 className="text-5xl font-black italic tabular-nums">{formatCurrency(incomingCredit)}</h2>
            <p className="mt-4 text-emerald-100 font-bold text-sm uppercase tracking-widest italic">Outstanding revenue from {invoices.length} active invoices</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-rose-600 text-white shadow-2xl shadow-rose-900/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingDown className="w-32 h-32" />
          </div>
          <CardContent className="p-10 relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <ArrowDownRight className="w-5 h-5" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Outgoing Credit (Payable)</span>
            </div>
            <h2 className="text-5xl font-black italic tabular-nums">{formatCurrency(outgoingCredit)}</h2>
            <p className="mt-4 text-rose-100 font-bold text-sm uppercase tracking-widest italic">Pending settlements for {purchases.length} purchase bills</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <LiveSearch 
          placeholder="Filter by Client Name..." 
          className="flex-1 w-full"
        />
      </div>

      {/* ── Client Payments List ── */}
      <Card className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="text-center py-32 bg-slate-50/30">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-slate-800 font-black text-2xl font-display uppercase italic tracking-tighter">No Client Data Found</h3>
              <p className="text-sm font-bold text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">Adjust search parameters or issue new invoices.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client Name</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Billed</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amount Paid</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending Balance</th>
                    <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-8 py-6">
                        <Link href={`/clients/${client.id}`} className="group/link">
                          <span className="font-black text-slate-900 text-sm group-hover/link:text-primary-600 transition-colors uppercase tracking-tight">{client.name}</span>
                        </Link>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-slate-600 tabular-nums">{formatCurrency(client.billed)}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-emerald-600 tabular-nums">{formatCurrency(client.paid)}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`text-lg font-black tabular-nums italic tracking-tighter ${client.pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {formatCurrency(client.pending)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/clients/${client.id}`}>
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm ml-auto">
                            <ChevronRight className="w-4 h-4" />
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
  );
}
