import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StockService } from "@/features/inventory/services/StockService";
import { StockLogTable } from "@/features/inventory/components/StockLogTable";
import { Card } from "@/ui/core/Card";
import {
    Layers,
    AlertTriangle,
    History as HistoryIcon,
} from "lucide-react";
import { InventoryClient } from "@/app/(authenticated)/inventory/InventoryClient";
import { serializePrisma } from "@/utils/serialization";

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

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic">
                        Stock <span className="text-primary-600">Dynamics</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
                        Real-time synchronization of physical assets across procurement pipelines and sales fulfillment.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <InventoryClient products={productList} />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900 border-0 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <Layers className="text-primary-400 mb-6 w-8 h-8" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400/60 mb-2">Total Reserve</div>
                    <div className="text-4xl font-black italic tracking-tighter tabular-nums">
                        {Object.values(inventoryLevels).reduce((a, b) => a + b, 0).toLocaleString()}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Units across catalog</div>
                </Card>

                <Card className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-xl group hover:shadow-2xl transition-all">
                    <AlertTriangle className="text-rose-500 mb-6 w-8 h-8" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Critical Alerts</div>
                    <div className="text-4xl font-black italic tracking-tighter tabular-nums text-rose-600">
                        {lowStockItems}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Items below threshold</div>
                </Card>

                <Card className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-xl">
                    <HistoryIcon className="text-primary-600 mb-6 w-8 h-8" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Recent Velocity</div>
                    <div className="text-4xl font-black italic tracking-tighter tabular-nums">
                        {stockLogs.length}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Operations in 24h</div>
                </Card>

                <Card className="bg-emerald-900 border-0 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                    <div className="text-emerald-400 mb-6 text-xl font-black italic tracking-tighter">₹</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 mb-2">Inventory Value</div>
                    <div className="text-3xl font-black italic tracking-tighter tabular-nums">
                        ₹ {totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">At current cost rates</div>
                </Card>
            </div>

            {/* Logs Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 font-display italic uppercase tracking-tight">Audit <span className="text-primary-600">Trails</span></h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Recent Ledger Movements</p>
                    </div>
                </div>

                <StockLogTable logs={stockLogs} />
            </div>
        </div>
    );
}
