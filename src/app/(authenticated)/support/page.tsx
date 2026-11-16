import {
  LifeBuoy,
  MessageCircle,
  FileText,
  CreditCard,
  TrendingUp,
  Package,
  FileSearch,
  Building2
} from "lucide-react";
import { Card, CardContent } from "@/ui/core/Card";

export default function SupportPage() {
  const guideSections = [
    {
      title: "Sales Cycle",
      subtitle: "From Quote to Cash",
      icon: <FileText className="w-5 h-5 text-primary-600" />,
      explanation: "Start with a Quotation (Estimate) for your client. Once approved, convert it to an Invoice. Finally, track the Payment to close the deal.",
      features: ["Drafting Quotes", "GST Invoicing", "Payment Tracking"]
    },
    {
      title: "Procurement",
      subtitle: "Stock Acquisition",
      icon: <Package className="w-5 h-5 text-amber-600" />,
      explanation: "Record your Purchase Bills from vendors. The system automatically adds these items to your Inventory and updates your Outgoing Credit (Payable).",
      features: ["Vendor Ledger", "Purchase Entry", "Auto-Stock Update"]
    },
    {
      title: "Inventory",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      subtitle: "Smart Tracking",
      explanation: "Monitor live stock levels. The system calculates 'Purchases minus Sales' to give you an exact count. Get alerts when items are 'Out of Stock'.",
      features: ["SKU Management", "Stock Levels", "Shortage Alerts"]
    },
    {
      title: "Finance",
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      subtitle: "Credit Analysis",
      explanation: "View your Incoming Credits (money clients owe you) and Outgoing Credits (money you owe vendors) in a single financial dashboard.",
      features: ["AR/AP Tracking", "Tax Reports", "Profit Analysis"]
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Hero Section */}
      <div className="rounded-xl bg-slate-900 p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5 text-primary-400" />
            <span>ERP User Guide & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How Your ERP System Works
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            JEZZY ERP coordinates your commercial operations across three core pillars: procurement, sales billing, and double-entry financial accounting.
          </p>
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guideSections.map((section, i) => (
          <Card key={i} className="hover:border-slate-300 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
                  <p className="text-xs text-primary-600 font-medium">{section.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {section.explanation}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {section.features.map((f, fi) => (
                  <span key={fi} className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700">
                    {f}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Explanation */}
      <Card>
        <CardContent className="p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Standard Business Workflow</h2>
            <p className="text-xs text-slate-500">How everyday transactions flow through your organization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Step 1 */}
            <div className="space-y-3 p-4 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold mx-auto">1</div>
              <h3 className="font-semibold text-sm text-slate-900">Procurement & Stock</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Record Purchases from vendors. Inward inventory is automatically added to product stock balances.</p>
            </div>
            {/* Step 2 */}
            <div className="space-y-3 p-4 rounded-lg bg-primary-50/50">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mx-auto">2</div>
              <h3 className="font-semibold text-sm text-slate-900">Sales & Billing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Create Quotations and convert to GST Invoices. Outward items decrement stock and record accounts receivable.</p>
            </div>
            {/* Step 3 */}
            <div className="space-y-3 p-4 rounded-lg bg-emerald-50/50">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mx-auto">3</div>
              <h3 className="font-semibold text-sm text-slate-900">Payments & Ledger</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Record client collections and vendor payouts. Real-time trial balance and statement ledgers update automatically.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-lg font-bold">Technical Support & Architecture</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              For technical queries, feature enhancements, custom migrations, or maintenance support, please contact the development desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="p-4 rounded-lg bg-white/10 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Support Desk</p>
                <p className="text-sm font-bold text-white">8089864422</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/10 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-emerald-500 flex items-center justify-center shrink-0">
                <FileSearch className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Email Inquiry</p>
                <p className="text-sm font-bold text-white">info@webziointernational.in</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">JezzyERP Enterprise Architecture &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
