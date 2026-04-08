import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BillingEngine } from "@/features/billing/components/BillingEngine";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/core/Card";
import { FileText } from "lucide-react";
import { ClientService } from "@/features/clients/services/ClientService";
import { ProductService } from "@/features/inventory/services/ProductService";

export default async function NewInvoicePage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    // Parallel fetch relations needed for the invoice dropdowns via services
    const [clients, products] = await Promise.all([
        ClientService.getAllActive(),
        ProductService.getAllActive()
    ]);

    if (clients.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <Card className="text-center p-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <CardTitle className="mb-2">No Clients Found</CardTitle>
                    <p className="text-slate-500 mb-6">You must add at least one client to your directory before generating an invoice.</p>
                    <a href="/dashboard/clients" className="inline-flex justify-center items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
                        Go to Clients Directory
                    </a>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Create Invoice
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Generate a new B2B tax invoice. This action is irreversible once sent.
                    </p>
                </div>
            </div>

            <BillingEngine clients={clients} products={products} />
        </div>
    );
}
