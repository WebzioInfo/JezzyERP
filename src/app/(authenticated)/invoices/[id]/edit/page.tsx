import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BillingEngine } from "@/features/billing/components/BillingEngine";
import { ClientService } from "@/features/clients/services/ClientService";
import { ProductService } from "@/features/inventory/services/ProductService";
import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: PageProps) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { id } = await params;

    // Fetch the invoice with items
    const invoice = await db.invoice.findUnique({
        where: { id },
        select: {
            id: true,
            clientId: true,
            invoiceNo: true,
            date: true,
            gstType: true,
            subTotal: true,
            taxTotal: true,
            grandTotal: true,
            status: true,
            ewayBill: true,
            ewayBillUrl: true,
            vehicleNo: true,
            notes: true,
            billingName: true,
            billingAddress1: true,
            billingAddress2: true,
            billingState: true,
            billingPinCode: true,
            billingPhone: true,
            billingGst: true,
            shippingName: true,
            shippingAddress1: true,
            shippingAddress2: true,
            shippingState: true,
            shippingPinCode: true,
            shippingSameAsBilling: true,
            lineItems: {
                include: { product: true }
            }
        }
    });

    if (!invoice) notFound();

    // Restrictions: Optionally prevent editing PAID invoices
    if (invoice.status === "PAID") {
        redirect(`/invoices/${id}?error=Cannot edit a paid invoice`);
    }

    // Parallel fetch relations needed for the invoice dropdowns
    const [clients, products] = await Promise.all([
        ClientService.getAllActive(),
        ProductService.getAllActive()
    ]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Edit Invoice <span className="text-primary-600">#{invoice.invoiceNo}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Update items, customer information, or terms for this invoice.
                    </p>
                </div>
            </div>

            <BillingEngine 
                clients={clients} 
                products={products} 
                initialData={serializePrisma(invoice)} 
            />
        </div>
    );
}
