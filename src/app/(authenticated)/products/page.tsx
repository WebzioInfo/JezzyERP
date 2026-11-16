import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductTable } from "@/features/inventory/components/ProductTable";
import { serializePrisma } from "@/utils/serialization";
import { StockService } from "@/features/inventory/services/StockService";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { q: searchQuery = "" } = await searchParams;

    const [rawProducts, inventoryLevels] = await Promise.all([
        db.product.findMany({
            where: { 
                deletedAt: null,
                ...(searchQuery && {
                    OR: [
                        { sku: { contains: searchQuery } },
                        { description: { contains: searchQuery } },
                    ]
                })
            },
            orderBy: { createdAt: "desc" },
        }),
        StockService.getInventoryLevels()
    ]);

    const products = serializePrisma(rawProducts).map((p: any) => ({
        ...p,
        currentStock: inventoryLevels[p.id] || 0
    }));

    return (
        <div className="space-y-5 pb-12">
            <div className="w-full">
                <ProductTable products={products} />
            </div>
        </div>
    );
}
