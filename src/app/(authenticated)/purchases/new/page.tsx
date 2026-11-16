import { verifySessionVerified } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PurchasePageClient } from "@/features/procurement/components/PurchasePageClient";
import { Card, CardTitle, CardContent } from "@/ui/core/Card";
import { Button } from "@/ui/core/Button";
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
            <div className="max-w-md mx-auto py-16">
                <Card className="text-center">
                    <CardContent className="p-8">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <CardTitle className="mb-2 text-base font-semibold text-slate-900">No Vendors Found</CardTitle>
                        <p className="text-slate-500 mb-6 text-xs leading-relaxed">
                            You must register at least one vendor before creating a purchase bill.
                        </p>
                        <Link href="/vendors">
                            <Button>Add Vendor</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <PurchasePageClient vendors={vendors} products={products} />
    );
}
