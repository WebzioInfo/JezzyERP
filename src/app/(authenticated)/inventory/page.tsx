import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StockService } from "@/features/inventory/services/StockService";
import { StockLogTable } from "@/features/inventory/components/StockLogTable";
import { Card, CardContent } from "@/ui/core/Card";
import {
    Layers,
    AlertTriangle,
    Package,
    IndianRupee,
} from "lucide-react";
import { InventoryClient } from "@/app/(authenticated)/inventory/InventoryClient";
import { serializePrisma } from "@/utils/serialization";
import { formatCurrency } from "@/utils/financials";

export default async function InventoryPage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const [products, stockLogs, inventoryLevels] = await Promise.all([
        db.product.findMany({
            where: { deletedAt: null },
            select: { id: true, description: true, sku: true, sellingRate: true, purchaseRate: true },
            orderBy: { description: "asc" }
        }),
        StockService.getStockLogs(undefined, 20),
        StockService.getInventoryLevels()
    ]);

    // Simple aggregations
    const productList = serializePrisma(products);
    const totalItems = productList.length;
    const lowStockItems = productList.filter((p: any) => (inventoryLevels[p.id] || 0) <= 5).length;
    const totalStockValue = productList.reduce((acc: number, p: any) => acc + (Number(p.purchaseRate) * (inventoryLevels[p.id] || 0)), 0);
    const totalUnits = Object.values(inventoryLevels).reduce((a: number, b: number) => a + b, 0);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                        Stock Management
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Real-time tracking of physical warehouse assets, stock entries, and manual adjustments
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <InventoryClient products={productList} />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Total Stock Units</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tabular-nums">
                            {totalUnits.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Total count across all items</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Catalog Items</span>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                <Package className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tabular-nums">
                            {totalItems}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Active catalog products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Inventory Valuation</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <IndianRupee className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tabular-nums">
                            {formatCurrency(totalStockValue)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Calculated at purchase rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Low Stock Alerts</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold tabular-nums ${lowStockItems > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                            {lowStockItems}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Items at or below 5 units</p>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Feed Table */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">Stock Movement & Adjustment Logs</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Historical audit trail of all manual and automated stock events</p>
                    </div>
                </div>

                <StockLogTable logs={stockLogs} />
            </div>
        </div>
    );
}
