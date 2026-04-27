import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  CreditCard,
  FileText,
  ChevronRight,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/ui/core/Card";
import { StatusBadge } from "@/features/billing/components/StatusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  const client = await db.client.findUnique({
    where: { id },
    include: {
      invoices: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
      }
    }
  });

  if (!client) notFound();

  let totalBilled = 0;
  let totalPaid = 0;

  client.invoices.forEach(inv => {
    totalBilled += inv.grandTotal.toNumber();
    totalPaid += inv.amountPaid.toNumber();
  });

  const pendingAmount = totalBilled - totalPaid;

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto pb-24">
      {/* ── Back Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Link
          href="/clients"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Clients
        </Link>
      </div>

      {/* ── Client Details & KPIs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <Card className="col-span-1 lg:col-span-1 border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <Building2 className="w-32 h-32" />
             </div>
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Building2 className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-2xl font-black italic uppercase tracking-tight">{client.name}</h2>
             {client.gst && (
                <div className="inline-flex items-center gap-1 mt-3 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest font-mono">GST: {client.gst}</span>
                </div>
             )}
          </div>
          <CardContent className="p-8 space-y-6">
            {client.email && (
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <Mail className="w-3.5 h-3.5" /> Email
                 </div>
                 <p className="text-sm font-bold text-slate-900 truncate">{client.email}</p>
               </div>
            )}
            {client.phone && (
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <Phone className="w-3.5 h-3.5" /> Phone
                 </div>
                 <p className="text-sm font-bold text-slate-900">{client.phone}</p>
               </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" /> Address
              </div>
              <p className="text-sm font-bold text-slate-900">
                 {client.address1}<br />
                 {client.address2 && <>{client.address2}<br /></>}
                 {client.state} - {client.pinCode}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card className="border-0 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-500/10 overflow-hidden relative group bg-emerald-50/50">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-32 h-32 text-emerald-900" />
             </div>
             <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/80 mb-2">Total Turnover</p>
                <h3 className="text-4xl font-black italic text-emerald-900 tabular-nums tracking-tighter">{formatCurrency(totalBilled)}</h3>
                <div className="mt-4 flex items-center gap-2 text-emerald-700/80 text-xs font-bold uppercase tracking-widest">
                   <CreditCard className="w-4 h-4" /> Lifetime Value
                </div>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-xl shadow-rose-900/5 ring-1 ring-rose-500/10 overflow-hidden relative group bg-rose-50/50">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-32 h-32 text-rose-900" />
             </div>
             <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600/80 mb-2">Pending Balance</p>
                <h3 className="text-4xl font-black italic text-rose-900 tabular-nums tracking-tighter">{formatCurrency(pendingAmount)}</h3>
                <div className="mt-4 flex items-center gap-2 text-rose-700/80 text-xs font-bold uppercase tracking-widest">
                   <CreditCard className="w-4 h-4" /> Amount Paid: {formatCurrency(totalPaid)}
                </div>
             </CardContent>
           </Card>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div>
         <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6">Commercial Activity</h3>
         <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
           <CardContent className="p-0">
             {client.invoices.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50">
                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <h4 className="text-lg font-black text-slate-800 italic uppercase">No Invoices Found</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Create an invoice to see history.</p>
                </div>
             ) : (
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                         <tr className="bg-slate-900">
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Invoice #</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</th>
                            <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {client.invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                               <td className="px-8 py-6">
                                  <span className="font-extrabold text-slate-900 text-base tracking-tight">{inv.invoiceNo}</span>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                                     <Calendar className="w-3.5 h-3.5 text-primary-500" />
                                     {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(inv.date))}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <span className="text-sm font-black text-slate-900 italic tracking-tighter tabular-nums">{formatCurrency(inv.grandTotal.toNumber())}</span>
                               </td>
                               <td className="px-8 py-6 text-center">
                                  <div className="flex justify-center scale-110">
                                     <StatusBadge status={inv.status} />
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <Link href={`/invoices/${inv.id}`}>
                                     <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm ml-auto group-hover:bg-primary-50 group-hover:text-primary-600">
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
    </div>
  );
}
