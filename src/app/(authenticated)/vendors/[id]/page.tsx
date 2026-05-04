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
  TrendingDown,
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

export default async function VendorDetailPage({ params }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  const vendor = await db.vendor.findUnique({
    where: { id },
    include: {
      purchases: {
        where: { deletedAt: null },
        orderBy: { date: "desc" },
        include: { allocations: true }
      }
    }
  });

  if (!vendor) notFound();

  let totalPurchased = 0;
  let totalPaid = 0;

  vendor.purchases.forEach(pur => {
    totalPurchased += Number(pur.grandTotal);
    totalPaid += (pur as any).allocations.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
  });

  const pendingAmount = totalPurchased - totalPaid;

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto pb-24">
      {/* ── Back Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Link
          href="/vendors"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Vendors
        </Link>
      </div>

      {/* ── Vendor Details & KPIs ── */}
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
             <h2 className="text-2xl font-black italic uppercase tracking-tight">{vendor.name}</h2>
             {vendor.gst && (
                <div className="inline-flex items-center gap-1 mt-3 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                   <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest font-mono">GST: {vendor.gst}</span>
                </div>
             )}
          </div>
          <CardContent className="p-8 space-y-6">
            {vendor.email && (
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <Mail className="w-3.5 h-3.5" /> Email
                 </div>
                 <p className="text-sm font-bold text-slate-900 truncate">{vendor.email}</p>
               </div>
            )}
            {vendor.phone && (
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <Phone className="w-3.5 h-3.5" /> Phone
                 </div>
                 <p className="text-sm font-bold text-slate-900">{vendor.phone}</p>
               </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" /> Address
              </div>
              <p className="text-sm font-bold text-slate-900">
                 {vendor.address1}<br />
                 {vendor.address2 && <>{vendor.address2}<br /></>}
                 {vendor.state} - {vendor.pinCode}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card className="border-0 shadow-xl shadow-blue-900/5 ring-1 ring-blue-500/10 overflow-hidden relative group bg-blue-50/50">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingDown className="w-32 h-32 text-blue-900" />
             </div>
             <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600/80 mb-2">Total Procured</p>
                <h3 className="text-4xl font-black italic text-blue-900 tabular-nums tracking-tighter">{formatCurrency(totalPurchased)}</h3>
                <div className="mt-4 flex items-center gap-2 text-blue-700/80 text-xs font-bold uppercase tracking-widest">
                   <CreditCard className="w-4 h-4" /> Lifetime Purchases
                </div>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-xl shadow-rose-900/5 ring-1 ring-rose-500/10 overflow-hidden relative group bg-rose-50/50">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-32 h-32 text-rose-900" />
             </div>
             <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600/80 mb-2">Pending Payable</p>
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
         <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6">Purchase Activity</h3>
         <Card className="border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-[2.5rem]">
           <CardContent className="p-0">
             {vendor.purchases.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50">
                   <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <h4 className="text-lg font-black text-slate-800 italic uppercase">No Purchases Found</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Create a purchase order to see history.</p>
                </div>
             ) : (
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                         <tr className="bg-slate-900">
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Purchase #</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total</th>
                            <th className="text-center px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {vendor.purchases.map(pur => (
                            <tr key={pur.id} className="hover:bg-slate-50/80 transition-all group">
                               <td className="px-8 py-6">
                                  <span className="font-extrabold text-slate-900 text-base tracking-tight">{pur.purchaseNo}</span>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                                     <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                     {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(pur.date))}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <span className="text-sm font-black text-slate-900 italic tracking-tighter tabular-nums">{formatCurrency(pur.grandTotal.toNumber())}</span>
                               </td>
                               <td className="px-8 py-6 text-center">
                                  <div className="flex justify-center scale-110">
                                     <StatusBadge status={pur.status} />
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <Link href={`/purchases`}>
                                     <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm ml-auto group-hover:bg-blue-50 group-hover:text-blue-600">
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
