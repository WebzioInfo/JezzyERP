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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Clients
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Manage your customer database and billing profiles.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-4 bg-white px-4 py-3 rounded-md border border-slate-200 shadow-sm">
                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <div className="text-xs font-medium text-slate-500 mb-0.5">Total Clients</div>
                        <div className="text-xl font-semibold text-slate-900 leading-none">{clients.length}</div>
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
