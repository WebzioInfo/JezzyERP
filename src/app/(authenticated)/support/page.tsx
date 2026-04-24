import {
  BookOpen,
  LifeBuoy,
  Search,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
  CreditCard,
  UserCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Package,
  FileSearch,
  RefreshCw,
  Trash2,
  Building2
} from "lucide-react";
import Link from "next/link";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Card, CardContent } from "@/ui/core/Card";

export default function SupportPage() {
  const guideSections = [
    {
      title: "Sales Cycle",
      subtitle: "From Quote to Cash",
      icon: <FileText className="w-6 h-6 text-primary-600" />,
      explanation: "Start with a Quotation (Estimate) for your client. Once approved, convert it to an Invoice. Finally, track the Payment to close the deal.",
      features: ["Drafting Quotes", "GST Invoicing", "Payment Tracking"]
    },
    {
      title: "Procurement",
      subtitle: "Stock Acquisition",
      icon: <Package className="w-6 h-6 text-amber-600" />,
      explanation: "Record your Purchase Bills from vendors. The system automatically adds these items to your Inventory and updates your Outgoing Credit (Payable).",
      features: ["Vendor Ledger", "Purchase Entry", "Auto-Stock Update"]
    },
    {
      title: "Inventory",
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      subtitle: "Smart Tracking",
      explanation: "Monitor live stock levels. The system calculates 'Purchases minus Sales' to give you an exact count. Get alerts when items are 'Out of Stock'.",
      features: ["SKU Management", "Stock Levels", "Shortage Alerts"]
    },
    {
      title: "Finance",
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      subtitle: "Credit Analysis",
      explanation: "View your Incoming Credits (money clients owe you) and Outgoing Credits (money you owe vendors) in a single financial dashboard.",
      features: ["AR/AP Tracking", "Tax Reports", "Profit Analysis"]
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 lg:p-20 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -m-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-md">
            <LifeBuoy className="w-4 h-4 text-primary-400" />
            Beginner's Masterclass
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight font-display italic leading-none mb-6">
            Understand your <span className="text-primary-400 underline decoration-primary-500/30 underline-offset-8">Workflow</span> like a Pro.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed italic max-w-2xl">
            JEZZY ERP simplifies complex business logic into three easy steps: Buy, Sell, and Track. This guide explains every component of your new ecosystem.
          </p>
        </div>
      </div>

      {/* ── Workflow Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guideSections.map((section, i) => (
          <div key={i} className="clay-card p-10 border-0 bg-white group hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors shadow-inner">
                {section.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display italic uppercase tracking-tighter">{section.title}</h3>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{section.subtitle}</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 uppercase text-xs tracking-wider italic">
              {section.explanation}
            </p>
            <div className="flex flex-wrap gap-2">
              {section.features.map((f, fi) => (
                <span key={fi} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tight border border-slate-100">
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Workflow Explanation ── */}
      <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter font-display italic uppercase mb-12 text-center">Standard <span className="text-primary-600">Business Workflow</span></h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-xl">1</div>
            <h4 className="font-black uppercase tracking-widest text-sm italic">Stock Entry</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Add Products to your catalog and record Purchases to fill your inventory.</p>
          </div>
          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-xl">2</div>
            <h4 className="font-black uppercase tracking-widest text-sm italic">Sales Operations</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Generate Invoices for your clients. Every sale automatically reduces your stock level.</p>
          </div>
          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto shadow-xl">3</div>
            <h4 className="font-black uppercase tracking-widest text-sm italic">Analysis</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Monitor the Payments dashboard to see who owes you money and who you need to pay.</p>
          </div>
        </div>
      </div>

      {/* ── Contact Section (Webzio) ── */}
      <div className="bg-slate-950 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5">
          <Building2 className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-4xl font-black italic tracking-tight mb-4">Technical <span className="text-primary-400">Consultancy</span></h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              This ERP system is developed and maintained by **Webzio Technology**. If you encounter any bugs, need new features, or require professional training, please reach out to our technical desk.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="clay-card p-8 bg-white/5 border border-white/10 flex items-center gap-6 group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Support Line</p>
                <h4 className="text-xl font-black italic tracking-tighter text-slate-700">8089864422</h4>
              </div>
            </div>

            <div className="clay-card p-8 bg-white/5 border border-white/10 flex items-center gap-6 group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Official Inquiry</p>
                <h4 className="text-xl font-black italic tracking-tighter text-slate-700">info@webziointernational.in</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Built with Excellence by Webzio Technology &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}
