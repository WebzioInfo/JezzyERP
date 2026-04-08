import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { ClientTable } from "@/features/clients/components/ClientTable";
import { ClientService } from "@/features/clients/services/ClientService";
import { Building2 } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function ClientsPage({ searchParams }: PageProps) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const query = (await searchParams).q;
    const clients = await ClientService.getAllActive(query);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Page Header (Informational) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic">
                        Relationship <span className="text-primary-600">Master</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
                        Enterprise-grade directory for managing corporate identities, billing protocols, and taxation endpoints.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 bg-white px-8 py-6 rounded-[2.5rem] border border-slate-200/40 shadow-2xl transition-all hover:border-primary-100/50">
                    <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center shadow-inner">
                        <Building2 className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Index Density</div>
                        <div className="text-3xl font-black text-slate-900 leading-none tracking-tighter italic">{clients.length} <span className="text-sm font-bold text-slate-300 not-italic uppercase tracking-widest ml-1">Nodes</span></div>
                    </div>
                </div>
            </div>

            {/* Main Listing Area */}
            <div className="w-full">
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}
