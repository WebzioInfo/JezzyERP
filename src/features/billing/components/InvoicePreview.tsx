import { formatDateDMY } from '@/utils/date';
import { numberToWords } from '@/utils/financials';
import { Invoice } from '@/types/invoice';
import React from 'react';


interface Props {
  invoice: any;
}


export default function InvoicePreview({ invoice }: Props) {
  const showGST = invoice.gstType !== "NO_GST";

  const billing = {
    name: invoice.billingName || invoice.client?.name || "N/A",
    address1: invoice.billingAddress1 || invoice.client?.address1 || "N/A",
    address2: invoice.billingAddress2 || invoice.client?.address2 || "",
    state: invoice.billingState || invoice.client?.state || "N/A",
    pinCode: invoice.billingPinCode || invoice.client?.pinCode || "",
    phone: invoice.billingPhone || invoice.client?.phone || "",
    gst: invoice.billingGst || invoice.client?.gst || ""
  };

  const ship = invoice.shippingSameAsBilling
    ? billing
    : {
      name: invoice.shippingName || "N/A",
      address1: invoice.shippingAddress1 || "N/A",
      address2: invoice.shippingAddress2 || "",
      state: invoice.shippingState || "N/A",
      pinCode: invoice.shippingPinCode || "",
    };

  const items = invoice.lineItems || invoice.products || [];

  const subTotal = items.reduce(
    (s: number, p: any) => s + (p.qty || 0) * Number(p.rate || 0),
    0
  );

  const gstTotal = showGST
    ? items.reduce(
      (s: number, p: any) => s + Number(p.taxAmount || 0),
      0
    )
    : 0;

  let cgst = 0,
    sgst = 0,
    igst = 0;

  if (invoice.gstType === "CGST_SGST") {
    cgst = gstTotal / 2;
    sgst = gstTotal / 2;
  }

  if (invoice.gstType === "IGST") {
    igst = gstTotal;
  }

  const gross = subTotal + gstTotal;
  const rounded = Math.round(gross);
  const roundOff = rounded - gross;

  return (
    <div className="bg-white p-12 text-sm max-w-4xl mx-auto border shadow-sm print:shadow-none print:border-0" style={{ fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* HEADER WITH LOGO & TITLE */}
      <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-100">
        <div className="flex items-start gap-5">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-32 h-20 object-contain"
          />
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">JEZZY Enterprises</h2>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              MP 4/3 IIA, MOONIYUR<br />
              VELIMUKKU PO, MALAPPURAM DIST - 676317<br />
              <span className="text-slate-900">GSTIN: 32BMAPJ5504M1Z9</span><br />
              Mobile: +91 85531 85300 | Email: jezzyenterprises@gmail.com
            </div>
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-4xl font-black text-slate-900 leading-none italic mb-1 uppercase tracking-tighter">Tax Invoice</h1>
          <div className="inline-flex h-1.5 w-24 bg-primary-600 rounded-full" />
        </div>
      </div>

      {/* INVOICE INFO & ADDRESSES */}
      <div className="grid grid-cols-12 gap-8 mb-10">
        {/* Left Side: Addresses */}
        <div className="col-span-8 flex gap-12">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Bill To</h3>
            <div className="space-y-1">
              <div className="text-base font-black text-slate-950 italic underline decoration-primary-500/30 underline-offset-4">{billing.name}</div>
              <div className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-[220px]">
                {billing.address1}<br />
                {billing.address2 && <>{billing.address2}<br /></>}
                {billing.pinCode && <>{billing.pinCode}<br /></>}
                {showGST && billing.gst && (
                  <div className="mt-1 font-bold text-slate-900 uppercase">GSTIN: {billing.gst}</div>
                )}
                {billing.phone && <div className="mt-1">P: {billing.phone}</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Ship To</h3>
            <div className="space-y-1">
              <div className="text-base font-black text-slate-900 italic underline decoration-emerald-500/30 underline-offset-4">{ship.name}</div>
              <div className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-[220px]">
                {ship.address1}<br />
                {ship.address2 && <>{ship.address2}<br /></>}
                {ship.pinCode && <>{ship.pinCode}<br /></>}
                <div className="mt-1 font-bold text-slate-400 uppercase tracking-widest">State Code: 29</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Meta */}
        <div className="col-span-4 space-y-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Invoice #</span>
              <span className="font-black text-slate-900 font-mono tracking-tighter">{invoice.invoiceNo}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Date</span>
              <span className="font-black text-slate-900 italic">{formatDateDMY(invoice.date)}</span>
            </div>
          </div>

          {/* Transport details in small pills? */}
          <div className="flex flex-wrap gap-2">
            {invoice.wayBill && (
              <div className="bg-slate-100 px-2 py-1 rounded text-[9px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">EWB: {invoice.wayBill}</div>
            )}
            {invoice.vehicleNo && (
              <div className="bg-slate-100 px-2 py-1 rounded text-[9px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">V#: {invoice.vehicleNo}</div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="rounded-3xl border border-slate-100 overflow-hidden mb-10 shadow-sm">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-950 text-white font-mono uppercase tracking-[0.2em] text-[9px]">
              <th className="p-4 text-center border-r border-white/10">Sl</th>
              <th className="p-4 text-left border-r border-white/10">Description of Goods</th>
              <th className="p-4 text-center border-r border-white/10">HSN</th>
              <th className="p-4 text-center border-r border-white/10">Qty</th>
              <th className="p-4 text-right border-r border-white/10">Rate</th>
              {showGST && <th className="p-4 text-center border-r border-white/10">GST %</th>}
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-center border-r border-slate-100 font-bold text-slate-400">{i + 1}</td>
                <td className="p-4 border-r border-slate-100 font-bold text-slate-900 italic">{p.description}</td>
                <td className="p-4 text-center border-r border-slate-100 font-mono text-slate-400">{p.hsn || '-'}</td>
                <td className="p-4 text-center border-r border-slate-100 font-black text-slate-800">{p.qty || 0} {p.unit || "NOS"}</td>
                <td className="p-4 text-right border-r border-slate-100 font-bold">Rs. {Number(p.rate || 0).toFixed(2)}</td>
                {showGST && (
                  <td className="p-4 text-center border-r border-slate-100 font-bold">{Number(p.taxPercent || p.gstRate || 0)}%</td>
                )}
                <td className="p-4 text-right font-black text-slate-950">
                  Rs. {((p.qty || 0) * Number(p.rate || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALS & WORDS */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Sum in Narrative</p>
            <div className="text-[11px] font-bold text-slate-800 leading-relaxed italic border-l-4 border-slate-900 pl-3">
              {numberToWords(rounded)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
            <span>Subtotal Value</span>
            <span className="text-slate-900 font-black">Rs. {subTotal.toFixed(2)}</span>
          </div>

          {cgst > 0 && (
            <>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
                <span>Central GST (9%)</span>
                <span className="text-slate-900 font-black">Rs. {cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4 font-mono">
                <span>State GST (9%)</span>
                <span className="text-slate-900 font-black">Rs. {sgst.toFixed(2)}</span>
              </div>
            </>
          )}

          {igst > 0 && (
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
              <span>Integrated GST (18%)</span>
              <span className="text-slate-900 font-black">Rs. {igst.toFixed(2)}</span>
            </div>
          )}

          {Math.abs(roundOff) > 0.01 && (
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4 italic">
              <span>Mathematical Round Off</span>
              <span className="text-slate-500">{roundOff.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-6 px-4 bg-slate-950 text-white rounded-4xl shadow-xl ring-4 ring-slate-950/5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Grand Valuation</span>
            <span className="text-3xl font-black italic tracking-tighter">Rs. {rounded.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* BANK DETAILS & SIGNATURE */}
      <div className="grid grid-cols-2 gap-12 text-[10px] items-end border-t border-slate-100 pt-12">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 italic">
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
            Electronic Settlement Details
          </h3>
          <div className="space-y-2 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-widest">A/C Name</span>
              <span className="font-black text-slate-900 italic">JEZZY ENTERPRISES</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Bank Entity</span>
              <span className="font-black text-slate-900 italic uppercase">FEDERAL BANK</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5 font-mono">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Identifier 1</span>
              <span className="font-black text-slate-900 font-mono tracking-tighter text-xs underline decoration-primary-500/20 underline-offset-4">16470200011150 </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">IFSC PROTOCOL</span>
              <span className="font-black text-slate-900 font-mono tracking-widest text-xs uppercase">FDRL0001647</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-12">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Authorized Endorsement</div>
            <div className="text-xs font-black text-slate-900 uppercase italic tracking-widest">For JEZZY ENTERPRISES</div>
          </div>

          <div className="flex justify-end pr-0">
            <div className="w-56 h-px bg-slate-200 relative">
              <div className="absolute top-1 right-0 text-[8px] font-black uppercase tracking-widest text-slate-400">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] font-mono">
          System Generated Tax Instrument. Compliance Verified v4.0. No Physical Signature Required.
        </p>
      </div>
    </div>
  );
}
