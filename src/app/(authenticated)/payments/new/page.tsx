"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useActionState, Suspense } from "react";
import { recordPaymentAction } from "@/features/billing/actions/billing";
import { 
  ArrowLeft, CreditCard, Calendar, 
  Hash, FileText, Loader2, CheckCircle2, 
  AlertCircle, Info
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/financials";

/**
 * Main form component for recording a payment.
 */
function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get("invoiceId");
  
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch Invoice Preview (Simple Client-Side Fetch) ──
  useEffect(() => {
    if (!invoiceId) {
      setLoading(false);
      return;
    }

    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        if (res.ok) {
          const data = await res.json();
          setInvoice(data);
        }
      } catch (err) {
        console.error("Failed to fetch invoice", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [invoiceId]);

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const amount = parseFloat(formData.get("amount") as string);
      const data = {
        invoiceId: invoiceId!,
        amount,
        method: formData.get("method") as string,
        reference: formData.get("reference") as string,
        notes: formData.get("notes") as string,
        paidAt: formData.get("paidAt") as string,
      };

      const res = await recordPaymentAction(data);
      if (res && 'error' in res) return { error: res.error };
      if (res && 'success' in res) {
        // Show success and redirect
        router.push(`/invoices/${invoiceId}?success=payment_recorded`);
        router.refresh();
        return { success: true };
      }
      return prevState;
    },
    null
  );

  if (!invoiceId) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto mt-12 bg-slate-50 border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
           <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Missing Invoice Link</h2>
        <p className="text-sm text-slate-400 mt-2 mb-8">
           Payments must be recorded against a specific invoice. Usually, you would click "Record Payment" from an invoice's detail page.
        </p>
        <Link href="/invoices">
           <button className="btn-primary gap-2">
              <FileText className="w-4 h-4" /> Go to Invoices
           </button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500 italic">Verifying invoice details...</p>
       </div>
    );
  }

  const balanceDue = invoice ? invoice.grandTotal - invoice.amountPaid : 0;

  return (
    <div className="space-y-8 animate-fade-up max-w-3xl mx-auto pb-20">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/invoices/${invoiceId}`} 
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Invoice {invoice?.invoiceNo}
        </Link>
        <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-200 shadow-sm">
           New Payment Record
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left Column: Form ── */}
        <div className="space-y-6">
          <div className="card p-0 overflow-hidden shadow-lg border-primary-100 ring-4 ring-primary-500/5">
            <div className="bg-primary-600 p-6 text-white relative">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                   <CreditCard className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold font-display">Record Collection</h3>
                <p className="text-primary-100 text-xs mt-1">Enter the details of the incoming funds</p>
            </div>
            
            <form action={formAction} className="p-6 space-y-6">
              {state?.error && (
                <div className="p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-danger-800 italic">Entry Error</p>
                    <p className="text-sm text-danger-700 mt-0.5">{state.error}</p>
                  </div>
                </div>
              )}

              {/* Amount & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="label">Amount Received (₹)</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                       <input 
                        type="number" 
                        name="amount" 
                        step="0.01"
                        required
                        defaultValue={balanceDue > 0 ? balanceDue : ""}
                        placeholder="0.00"
                        className="input-field pl-8 font-bold text-slate-900 text-base"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="label">Payment Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        type="date" 
                        name="paidAt" 
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="input-field pl-10"
                       />
                    </div>
                 </div>
              </div>

              {/* Method & Reference */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                 <div className="space-y-1.5">
                    <label className="label">Payment Method</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {['CASH', 'UPI', 'BANK', 'CHEQUE'].map(m => (
                          <label key={m} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer group hover:border-primary-500/30 ${m === 'BANK' ? 'bg-primary-50 border-primary-500' : 'bg-white border-slate-100'}`}>
                             <input type="radio" name="method" value={m} className="sr-only" defaultChecked={m === 'BANK'} />
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${m === 'BANK' ? 'text-primary-700' : 'text-slate-400 group-hover:text-slate-600'}`}>{m}</span>
                          </label>
                       ))}
                    </div>
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="label">Reference / UTR / Cheque No.</label>
                    <div className="relative">
                       <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        type="text" 
                        name="reference" 
                        placeholder="e.g. UPI-1234567890"
                        className="input-field pl-10"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                 <label className="label">Internal Notes (Optional)</label>
                 <textarea 
                  name="notes" 
                  rows={2}
                  placeholder="e.g. Partial payment for October supplies"
                  className="input-field resize-none"
                 />
              </div>

              <button 
                type="submit" 
                disabled={pending}
                className="btn-primary w-full h-12 text-base gap-2 rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
              >
                {pending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    Confirm Payment <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right Column: Context ── */}
        <div className="space-y-6">
          {/* Invoice Summary Card */}
          <div className="card border-0 bg-slate-900 text-white relative overflow-hidden ring-4 ring-slate-100">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <FileText className="w-32 h-32 rotate-12" />
             </div>
             <div className="relative z-10">
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Linked Invoice</h4>
               <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">{invoice?.invoiceNo}</p>
                    <p className="text-sm text-slate-400 mt-1">{invoice?.client.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                     <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Billed</p>
                        <p className="text-lg font-bold">{formatCurrency(invoice?.grandTotal)}</p>
                     </div>
                     <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-lg font-bold text-success-400">{formatCurrency(invoice?.amountPaid)}</p>
                     </div>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Balance Remaining</p>
                     <p className="text-2xl font-black text-warning-400 italic">
                        {formatCurrency(balanceDue)}
                     </p>
                  </div>
               </div>
             </div>
          </div>

          {/* Help Card */}
          <div className="card border-0 bg-sky-50 p-6 border-l-4 border-sky-500">
             <div className="flex gap-4">
                <Info className="w-6 h-6 text-sky-600 shrink-0" />
                <div className="space-y-2">
                   <h5 className="font-bold text-sky-900 text-sm">Beginner Tip</h5>
                   <p className="text-xs text-sky-700 leading-relaxed">
                      Entering an amount **equal to or greater** than the Balance Remaining will automatically mark the invoice as **PAID**. 
                      <br /><br />
                      Smaller amounts will mark the invoice as **PARTIAL** to help you track outstanding dues.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={
       <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500 italic">Pre-fetching payment forms...</p>
       </div>
    }>
      <PaymentForm />
    </Suspense>
  );
}
