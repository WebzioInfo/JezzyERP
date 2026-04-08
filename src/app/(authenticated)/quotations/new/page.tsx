import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BillingEngine } from "@/features/billing/components/BillingEngine";
import { ClientService } from "@/features/clients/services/ClientService";
import { ProductService } from "@/features/inventory/services/ProductService";
import { ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewQuotationPage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const [clients, products] = await Promise.all([
        ClientService.getAllActive(),
        ProductService.getAllActive()
    ]);

    if (clients.length === 0) {
        return (
            <div className="card p-12 text-center max-w-lg mx-auto mt-12 bg-slate-50 border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">No Clients Found</h2>
                <p className="text-sm text-slate-400 mt-2 mb-8">
                    You must add at least one client to your directory before generating a quotation.
                </p>
                <Link href="/clients">
                    <button className="btn-primary gap-2">
                        Go to Clients Directory
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="page-header flex items-center justify-between">
                <div>
                     <Link 
                        href="/quotations" 
                        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Quotations
                    </Link>
                    <h1 className="page-title italic">Create New Quotation</h1>
                    <p className="page-subtitle italic">Build an estimate/proposal for a client. Non-GST binding.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Proposal Mode Active</span>
                </div>
            </div>

            <BillingEngine clients={clients} products={products} mode="QUOTATION" />
        </div>
    );
}
