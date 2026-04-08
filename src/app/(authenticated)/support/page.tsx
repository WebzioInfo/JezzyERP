import { SUPPORT_ARTICLES } from "@/features/support/data/articles";
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
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function SupportPage() {
  const categories = [
    { name: "Billing", icon: <CreditCard className="w-5 h-5" />, count: 5, color: "text-primary-600" },
    { name: "Inventory", icon: <BookOpen className="w-5 h-5" />, count: 3, color: "text-amber-600" },
    { name: "Account", icon: <UserCheck className="w-5 h-5" />, count: 4, color: "text-emerald-600" },
    { name: "Platform", icon: <ShieldCheck className="w-5 h-5" />, count: 2, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-10 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 animate-in stagger-1">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Help Center</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Professional documentation and expert assistance</p>
        </div>
        <div className="w-full md:w-96 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for articles, guides..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border-0 ring-1 ring-slate-200 rounded-3xl focus:ring-2 focus:ring-primary-500 transition-all shadow-sm group-focus-within:shadow-md"
          />
        </div>
      </div>

      {/* ── Category Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in stagger-2">
        {categories.map((cat) => (
          <div key={cat.name} className="clay-card p-6 border-0 group hover:scale-[1.05] transition-all cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/5 mb-4 group-hover:scale-110 transition-transform ${cat.color}`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-slate-900">{cat.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{cat.count} Articles Available</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in stagger-3">
        {/* ─ Article List (2/3) ─ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Popular Articles
            </h2>
          </div>
          <ErrorBoundary name="Article List">
            <div className="space-y-4">
              {SUPPORT_ARTICLES.map((article) => (
                <Link key={article.id} href={`/support/${article.id}`}>
                  <div className="clay-card p-6 border-0 hover:scale-[1.01] transition-all group cursor-pointer flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-md text-slate-500">
                          {article.category}
                        </span>
                        <h4 className="font-bold text-slate-900 truncate">{article.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{article.excerpt}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors ml-4 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </ErrorBoundary>
        </div>

        {/* ─ Contact Column (1/3) ─ */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            Still Need Help?
          </h2>
          <div className="clay-card p-8 border-0 bg-slate-900 text-white relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
             <LifeBuoy className="w-10 h-10 text-primary-400 mb-6" />
             <h3 className="text-lg font-bold mb-2">Expert Consultations</h3>
             <p className="text-sm text-slate-300 mb-8 leading-relaxed">
               Can't find what you're looking for? Our professionals are available for one-on-one sessions during standard business hours.
             </p>
             <button className="w-full py-4 rounded-2xl bg-primary-600 font-bold hover:bg-primary-500 transition-colors shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-2 text-sm italic tracking-tight">
               Talk to an Expert < ChevronRight className="w-4 h-4" />
             </button>
          </div>

          <div className="clay-card p-6 border-0 bg-white group cursor-pointer">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                   <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 text-sm">Priority Support Escalation</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">EST. Response: 2 Hours</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
