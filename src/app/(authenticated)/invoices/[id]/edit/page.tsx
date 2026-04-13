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
            lineItems: true
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
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic uppercase">
                        Edit Invoice <span className="text-primary-600">#{invoice.invoiceNo}</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Modify the details of this tax invoice. Changes will be reflected in the final document immediately after saving.
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
