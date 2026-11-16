import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";
import {
   ArrowLeft,
   Building2,
   MapPin,
   Calendar,
   FileText,
   ArrowRight,
   ShieldCheck,
   ArchiveX,
   Receipt,
   CheckCircle2,
   XCircle
} from "lucide-react";
import { QuotationActions } from "@/features/billing/components/QuotationActions";
import { StatusBadge } from "@/features/billing/components/StatusBadge";
import { Card, CardContent } from "@/ui/core/Card";
import {
   Table,
   TableHeader,
   TableBody,
   TableRow,
   TableHead,
   TableCell
} from "@/ui/core/Table";

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
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
         {/* Back + Actions Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
               href="/quotations"
               className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               <span>Back to Quotations</span>
            </Link>

            <QuotationActions
               quotationId={quotation.id}
               status={quotation.status}
               convertedInvoiceId={quotation.convertedInvoiceId}
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Proposal Details */}
            <div className="lg:col-span-8 space-y-6">
               <Card>
                  {/* Header Strip */}
                  <div className="px-6 py-5 bg-slate-900 text-white rounded-t-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-xl font-bold tracking-tight">{quotation.quotationNo}</h2>
                           <StatusBadge status={quotation.status} />
                        </div>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5 font-medium">
                           <Calendar className="w-3.5 h-3.5" /> Proposed on {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(quotation.date))}
                        </p>
                     </div>

                     <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold tabular-nums text-white">{formatCurrency(grandTotal)}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Estimated Total (Incl. GST)</p>
                     </div>
                  </div>

                  {/* Client & Metadata Section */}
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100">
                     <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                           <Building2 className="w-3.5 h-3.5" /> Client Information
                        </p>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                           <p className="text-sm font-bold text-slate-900">{quotation.client.name}</p>
                           <div className="text-xs text-slate-600 space-y-1">
                              <p className="flex items-start gap-1.5">
                                 <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                 <span>{quotation.client.address1}{quotation.client.address2 ? `, ${quotation.client.address2}` : ""}, {quotation.client.state}</span>
                              </p>
                              {quotation.client.gst && (
                                 <p className="flex items-center gap-1.5 font-mono text-[11px]">
                                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>GSTIN: {quotation.client.gst}</span>
                                 </p>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                           Quotation Terms
                        </p>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-3">
                           <div>
                              <p className="text-[10px] uppercase font-medium text-slate-400">GST Application</p>
                              <p className="text-xs font-semibold text-slate-800">{quotation.gstType.replace('_', ' + ')}</p>
                           </div>
                           <div>
                              <p className="text-[10px] uppercase font-medium text-slate-400">Offer Validity</p>
                              <p className="text-xs font-semibold text-slate-800">
                                 {quotation.validUntil
                                    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(quotation.validUntil))
                                    : "Standard 30 Days"
                                 }
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Line Items */}
                  <div className="p-0">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Item & Description</TableHead>
                              <TableHead className="text-center w-24">HSN</TableHead>
                              <TableHead className="text-right w-20">Qty</TableHead>
                              <TableHead className="text-right w-24">Rate</TableHead>
                              <TableHead className="text-right w-20">Tax %</TableHead>
                              <TableHead className="text-right w-28">Total</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {quotation.lineItems.map((item) => (
                              <TableRow key={item.id}>
                                 <TableCell className="font-medium text-slate-900 text-sm">
                                    {item.description}
                                 </TableCell>
                                 <TableCell className="text-center font-mono text-xs text-slate-500">
                                    {item.hsn || "—"}
                                 </TableCell>
                                 <TableCell className="text-right tabular-nums text-slate-700">
                                    {item.qty.toNumber()} {item.unit || ""}
                                 </TableCell>
                                 <TableCell className="text-right tabular-nums text-slate-700">
                                    {formatCurrency(item.rate.toNumber())}
                                 </TableCell>
                                 <TableCell className="text-right tabular-nums text-slate-500">
                                    {item.taxPercent.toNumber()}%
                                 </TableCell>
                                 <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                                    {formatCurrency(item.totalAmount.toNumber())}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               </Card>
            </div>

            {/* Right Column: Actions & Document Chain */}
            <div className="lg:col-span-4 space-y-6">
               {quotation.status === 'ACCEPTED' && (
                  <Card className="bg-emerald-50 border border-emerald-200">
                     <CardContent className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-xs font-semibold text-emerald-900">Quotation Accepted</p>
                           <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                              The client has approved this quotation. Convert it to a GST invoice using the actions above.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {quotation.status === 'REJECTED' && (
                  <Card className="bg-rose-50 border border-rose-200">
                     <CardContent className="p-4 flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-xs font-semibold text-rose-900">Quotation Rejected</p>
                           <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                              This quotation has been declined by the client and archived.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Linked Document Card */}
               <Card>
                  <CardContent className="p-5 space-y-3">
                     <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                        <FileText className="w-4 h-4 text-primary-600" />
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Linked Documents</h3>
                     </div>

                     {quotation.convertedInvoiceId ? (
                        <Link 
                           href={`/invoices/${quotation.convertedInvoiceId}`} 
                           className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100/70 transition-colors"
                        >
                           <Receipt className="w-5 h-5 text-indigo-600" />
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-indigo-900">Converted to Invoice</p>
                              <p className="text-[11px] text-indigo-600 truncate">View generated sales invoice</p>
                           </div>
                           <ArrowRight className="w-4 h-4 text-indigo-400" />
                        </Link>
                     ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                           <p>No converted invoices yet.</p>
                           <p className="text-[11px] mt-0.5">Accept quotation to convert to invoice.</p>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Cost Summary Card */}
               <Card>
                  <CardContent className="p-5 space-y-3">
                     <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                        Financial Estimate Summary
                     </h3>
                     <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                           <span>Taxable Value</span>
                           <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(quotation.subTotal.toNumber())}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                           <span>Estimated GST Total</span>
                           <span className="font-medium text-emerald-600 tabular-nums">+{formatCurrency(quotation.taxTotal.toNumber())}</span>
                        </div>
                        <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center">
                           <span className="font-semibold text-slate-900">Grand Total</span>
                           <span className="text-base font-bold text-primary-600 tabular-nums">{formatCurrency(grandTotal)}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}