import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BillingEngine } from "@/features/billing/components/BillingEngine";
import { ClientService } from "@/features/clients/services/ClientService";
import { ProductService } from "@/features/inventory/services/ProductService";
import { ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";

export default async function NewQuotationPage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const [clients, products] = await Promise.all([
        ClientService.getAllActive(),
        ProductService.getAllActive()
    ]);

    if (clients.length === 0) {
        return (
            <div className="max-w-md mx-auto py-16">
                <Card className="text-center">
                    <CardContent className="p-8">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <ClipboardList className="w-6 h-6 text-slate-400" />
                        </div>
                        <h2 className="text-base font-semibold text-slate-900">No Clients Found</h2>
                        <p className="text-xs text-slate-500 mt-1 mb-6">
                            You must register at least one client before generating a quotation.
                        </p>
                        <Link href="/clients">
                            <Button>Go to Clients</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link 
                        href="/quotations" 
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-1 font-medium"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Quotation</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Generate a formal pricing proposal or estimate for a client</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-medium text-amber-800">Quotation Mode</span>
                </div>
            </div>

            <BillingEngine clients={clients} products={products} mode="QUOTATION" />
        </div>
    );
}
