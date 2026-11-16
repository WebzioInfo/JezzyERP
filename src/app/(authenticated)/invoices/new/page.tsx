import { Suspense } from "react";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BillingEngine } from "@/features/billing/components/BillingEngine";
import { Card, CardTitle } from "@/ui/core/Card";
import { FileText, Users } from "lucide-react";
import { ClientService } from "@/features/clients/services/ClientService";
import { ProductService } from "@/features/inventory/services/ProductService";
import Link from "next/link";
import { Button } from "@/ui/core/Button";

export default async function NewInvoicePage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    // Parallel fetch relations needed for the invoice dropdowns via services
    const [clients, products] = await Promise.all([
        ClientService.getAllActive(undefined, {
            id: true, name: true, gst: true, email: true, phone: true, 
            address1: true, address2: true, state: true, pinCode: true
        }),
        ProductService.getAllActive({
            id: true, sku: true, description: true, hsn: true, 
            gstRate: true, unit: true, sellingRate: true, qtyPerBox: true
        })
    ]);

    if (clients.length === 0) {
        return (
            <div className="max-w-xl mx-auto py-16">
                <Card className="text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <FileText className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-base mb-1">No Clients Found</CardTitle>
                    <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                        You need at least one registered client before creating a tax invoice.
                    </p>
                    <Link href="/clients">
                        <Button variant="primary" size="md">
                            <Users className="w-4 h-4 mr-1.5" />
                            Go to Clients Directory
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                        Create Invoice
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generate a new B2B tax invoice with automated GST and ledger allocation.
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 rounded-xl" />}>
                <BillingEngine clients={clients as any} products={products as any} />
            </Suspense>
        </div>
    );
}
