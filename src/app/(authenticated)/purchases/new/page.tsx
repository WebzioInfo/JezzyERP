import { verifySessionVerified } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { PurchasePageClient } from "@/features/procurement/components/PurchasePageClient";
import { Card, CardTitle } from "@/ui/core/Card";
import { Package } from "lucide-react";
import { VendorService } from "@/features/procurement/services/VendorService";
import { ProductService } from "@/features/inventory/services/ProductService";

export default async function NewPurchasePage() {
    const session = await verifySessionVerified();
    if (!session) redirect("/login");

    const vendorService = new VendorService();
    const [vendors, products] = await Promise.all([
        vendorService.getAllVendors(),
        ProductService.getAllActive()
    ]);

    if (vendors.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <Card className="text-center p-8 bg-white border border-slate-200 rounded-4xl shadow-xl">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <CardTitle className="mb-2 uppercase tracking-tighter italic">No Suppliers Identified</CardTitle>
                    <p className="text-slate-500 mb-6 italic text-sm">You must add at least one vendor to your supply chain directory before recording a purchase.</p>
                    <a href="/vendors" className="inline-flex justify-center items-center rounded-2xl bg-primary-600 px-6 py-3 text-sm font-black uppercase italic tracking-widest text-white shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all">
                        Initialize Supplier
                    </a>
                </Card>
            </div>
        );
    }

    return (
        <PurchasePageClient vendors={vendors} products={products} />
    );
}
