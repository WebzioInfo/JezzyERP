import { PurchaseService } from "@/features/procurement/services/PurchaseService";
import { VendorService } from "@/features/procurement/services/VendorService";
import { ProductService } from "@/features/inventory/services/ProductService";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { PurchaseEngine } from "@/features/procurement/components/PurchaseEngine";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/core/Button";

export default async function PurchaseEditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { id } = await params;
    const purchaseService = new PurchaseService();
    const vendorService = new VendorService();
    const productService = new ProductService();

    const [purchase, vendors, products] = await Promise.all([
        purchaseService.getPurchaseById(id),
        vendorService.getAllVendors(),
        ProductService.getAllActive()
    ]);

    if (!purchase) notFound();

    // Map purchase data to store format
    const initialData = {
        id: purchase.id,
        entityId: purchase.vendorId,
        invoiceNo: (purchase as any).invoiceNo || (purchase as any).purchaseNo,
        date: purchase.date,
        gstType: purchase.gstType,
        ewayBill: purchase.ewayBill,
        ewayBillUrl: purchase.ewayBillUrl,
        vehicleNo: purchase.vehicleNo,
        notes: purchase.notes,
        isFreightCollect: purchase.isFreightCollect,
        freightAmount: purchase.freightAmount,
        freightTaxPercent: purchase.freightTaxPercent,
        items: purchase.lineItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            description: item.description,
            qty: item.qty,
            rate: item.rate,
            taxPercent: item.taxPercent,
            taxAmount: item.taxAmount,
            totalAmount: item.totalAmount,
            hsn: item.hsn,
            unit: item.unit,
            pkgCount: item.pkgCount,
            pkgType: item.pkgType
        }))
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <Link href={`/purchases/${id}`}>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg border border-slate-200">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Edit Purchase
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">Update details for purchase bill {purchase.purchaseNo}</p>
                    </div>
                </div>
            </div>

            <PurchaseEngine 
                vendors={vendors} 
                products={products} 
                initialData={initialData} 
            />
        </div>
    );
}
