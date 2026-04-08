import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import {
   ArrowLeft, FileDown, CheckCircle2, Send,
   Clock, Building2, Phone, Mail, MapPin,
   Hash, Calendar, Edit, FileText, ArrowRight,
   TrendingUp, ShieldCheck, HelpCircle, XCircle,
   ClipboardList, Info
} from "lucide-react";
import { QuotationActions } from "@/features/billing/components/QuotationActions";
import { StatusBadge } from "@/features/billing/components/StatusBadge";

interface PageProps {
   params: Promise<{ id: string }>;
}


export default async function QuotationDetailPage({ params }: PageProps) {
   const session = await verifySessionCookie();
   if (!session) redirect("/login");

   const { id } = await params;

   const quotation = await db.quotation.findUnique({
      where: { id, deletedAt: null },
      include: {
         client: true,
         lineItems: { orderBy: { id: "asc" } },
      },
   });

   if (!quotation) notFound();

   const grandTotal = quotation.grandTotal.toNumber();

   return (
      <div className="space-y-8 animate-fade-up max-w-6xl mx-auto pb-24">
         {/* ── Back + Actions Header ── */}
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <Link
               href="/quotations"
               className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest group"
            >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               Exit to Terminal
            </Link>

            <QuotationActions
               quotationId={quotation.id}
               status={quotation.status}
               convertedInvoiceId={quotation.convertedInvoiceId}
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left Column: Proposal Details ── */}
            <div className="lg:col-span-8 space-y-8">
               <div className="card border-0 shadow-2xl ring-1 ring-slate-200 p-0 overflow-hidden rounded-[2.5rem] group">
                  {/* ── Header Strip ── */}
                  <div className="px-10 py-8 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                     <div className="absolute right-0 top-0 p-20 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                        <ClipboardList className="w-64 h-64 text-white" />
                     </div>

                     <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-2">
                           <h2 className="text-3xl font-black text-white tracking-tight italic font-display">{quotation.quotationNo}</h2>
                           <StatusBadge status={quotation.status} />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] italic flex items-center gap-2">
                           <Calendar className="w-4 h-4" /> Proposed on {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(quotation.date))}
                        </p>
                     </div>

                     <div className="relative z-10 text-right">
                        <p className="text-4xl font-black text-white tracking-tight italic">{formatCurrency(grandTotal)}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Estimated Valuation (Incl. GST)</p>
                     </div>
                  </div>

                  {/* ── Client Profile Section ── */}
                  <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                           <Building2 className="w-4 h-4" /> Prospective Entity
                        </h3>
                        <div className="p-6 bg-slate-50 shadow-inner rounded-3xl border border-slate-100 space-y-4 relative overflow-hidden ring-4 ring-slate-500/5">
                           <div className="absolute right-0 top-0 p-4 opacity-5">
                              <Building2 className="w-16 h-16" />
                           </div>
                           <p className="text-lg font-black text-slate-900 italic leading-none">{quotation.client.name}</p>
                           <div className="space-y-3 pt-2 border-t border-slate-200/60">
                              <div className="flex items-start gap-2 text-xs text-slate-600 font-medium italic">
                                 <MapPin className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                                 <span>{quotation.client.address1}{quotation.client.address2 ? `, ${quotation.client.address2}` : ""} — {quotation.client.state}</span>
                              </div>
                              {quotation.client.gst && (
                                 <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
                                    <span>GSTIN: <span className="font-mono text-[10px] font-bold">{quotation.client.gst}</span></span>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                           <Hash className="w-4 h-4" /> Proposal Metadata
                        </h3>
                        <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200 h-full">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">GST Application</p>
                              <p className="text-sm font-black text-slate-800 italic">{quotation.gstType.replace('_', ' + ')}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Offer Validity</p>
                              <p className="text-sm font-black text-amber-700 italic">
                                 {quotation.validUntil
                                    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(quotation.validUntil))
                                    : "Indefinite Offer"
                                 }
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ── Line Items ── */}
                  <div className="border-t border-slate-100">
                     <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                           <tr>
                              <th className="text-left px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Project / Service Description</th>
                              <th className="text-center px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">HSN</th>
                              <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                              <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate</th>
                              <th className="text-right px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                           {quotation.lineItems.map((item: any) => (
                              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-10 py-5">
                                    <p className="font-bold text-slate-900 italic">{item.description}</p>
                                 </td>
                                 <td className="px-6 py-5 text-center text-slate-400 font-mono text-[10px] font-black tracking-widest">{item.hsn || "—"}</td>
                                 <td className="px-6 py-5 text-right font-bold text-slate-700">{item.qty} units</td>
                                 <td className="px-6 py-5 text-right font-bold text-slate-500">{formatCurrency(item.rate.toNumber())}</td>
                                 <td className="px-10 py-5 text-right font-black text-slate-950">{formatCurrency(item.totalAmount.toNumber())}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* ── Footer / Totals ── */}
                  <div className="bg-slate-950 p-10 flex flex-col md:flex-row items-end justify-between gap-10">
                     <div className="w-full md:max-w-md space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-3">
                           <Info className="w-5 h-5 text-slate-500 shrink-0" />
                           <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                              This is a formal quotation from JEZZY ENTERPRISES. All prices are subject to the terms and conditions of supply. Conversion to an invoice will initiate a B2B tax obligation.
                           </p>
                        </div>
                     </div>

                     <div className="w-full md:w-80 space-y-3">
                        <SummaryRow label="Supplied Valuation" value={formatCurrency(quotation.subTotal.toNumber())} />
                        <SummaryRow label="Estimated Taxation" value={formatCurrency(quotation.taxTotal.toNumber())} />
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                           <span className="text-xs font-black uppercase tracking-widest text-slate-500">Proposal Grand Total</span>
                           <span className="text-2xl font-black text-white italic">{formatCurrency(grandTotal)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* ── Right Column: Lifecycle & Conversion ── */}
            <div className="lg:col-span-4 space-y-8">
               {/* Conversion Card */}
               {quotation.status === "ACCEPTED" && (
                  <div className="card p-8 border-0 bg-primary-600 shadow-2xl shadow-primary-500/20 rounded-[2.5rem] relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-10 opacity-10 pointer-events-none group-hover:scale-125 transition-transform">
                        <TrendingUp className="w-40 h-40 text-black" />
                     </div>
                     <div className="relative z-10 space-y-4">
                        <h4 className="text-white font-black text-xl italic leading-tight">Ready for Billing?</h4>
                        <p className="text-primary-100 text-xs font-semibold leading-relaxed italic opacity-80">
                           This proposal has been accepted. One-click conversion will generate a tax-compliant invoice and lock this proposal for audit records.
                        </p>
                        <div className="pt-2">
                           <div className="w-full h-1 bg-white/10 rounded-full mb-6">
                              <div className="w-1/2 h-full bg-white rounded-full animate-progress" />
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Linked Assets */}
               <div className="card border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden rounded-4xl">
                  <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary-600" /> Linked Documents
                     </h3>
                  </div>
                  <div className="p-8 space-y-4">
                     {quotation.convertedInvoiceId ? (
                        <Link href={`/invoices/${quotation.convertedInvoiceId}`} className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-3xl group hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                           <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-indigo-950 uppercase tracking-widest">Linked Invoice</p>
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Formal B2X Asset</p>
                           </div>
                           <ArrowRight className="ml-auto w-4 h-4 text-indigo-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                        </Link>
                     ) : (
                        <div className="py-12 text-center space-y-4 opacity-50">
                           <ArchiveX className="w-10 h-10 text-slate-300 mx-auto" />
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">No linked invoices yet.<br />Accept proposal to convert.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Quick Actions Card */}
               <div className="card p-8 bg-slate-100 border-0 rounded-4xl space-y-4 ring-1 ring-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Financial Summary</h4>
                  <div className="space-y-3">
                     <SummaryItem label="Supplied Goods" value={formatCurrency(quotation.subTotal.toNumber())} />
                     <SummaryItem label="Aggregate Tax" value={formatCurrency(quotation.taxTotal.toNumber())} />
                     <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Final Estimate</span>
                        <span className="text-base font-black text-primary-600 italic">{formatCurrency(grandTotal)}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex justify-between items-center">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
         <span className="text-sm font-black text-slate-300 italic">{value}</span>
      </div>
   );
}

function SummaryItem({ label, value }: any) {
   return (
      <div className="flex justify-between items-center">
         <span className="text-[10px] font-bold text-slate-500 italic">{label}</span>
         <span className="text-[11px] font-black text-slate-700">{value}</span>
      </div>
   );
}

function ArchiveX(props: any) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <rect width="20" height="5" x="2" y="3" rx="1" />
         <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
         <path d="m9.5 17 5-5" />
         <path d="m9.5 12 5 5" />
      </svg>
   );
}
