import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/features/inventory/components/ProductForm";
import { ProductTable } from "@/features/inventory/components/ProductTable";
import { Package, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";
import { serializePrisma } from "@/utils/serialization";

export default async function ProductsPage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const rawProducts = await db.product.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });

    const products = serializePrisma(rawProducts);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Page Header (Informational) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display italic">
                        Inventory <span className="text-primary-600">Master</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed italic">
                        Centralized repository for billable products, service units, HSN/SAC compliance codes, and pricing logic.
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-6 bg-white px-8 py-6 rounded-[2.5rem] border border-slate-200/40 shadow-2xl transition-all hover:border-primary-100/50">
                    <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center shadow-inner">
                        <Package className="h-8 w-8 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Catalog Depth</div>
                        <div className="text-3xl font-black text-slate-900 leading-none tracking-tighter italic">{products.length} <span className="text-sm font-bold text-slate-300 not-italic uppercase tracking-widest ml-1">Items</span></div>
                    </div>
                </div>
            </div>

            {/* Main Listing Area */}
            <div className="w-full">
                <ProductTable products={products} />
            </div>

            {/* Bottom Insight */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-slate-200/50">
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary-400 mb-4">Pricing Logic</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">Standard rates are enforced for consistent billing, but can be adjusted dynamically during the final invoicing handshake.</p>
                </div>
                <div className="p-8 bg-emerald-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Tax Compliance</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">HSN and SAC codes are validated against current GST protocols to ensure audit-readiness across all financial documents.</p>
                </div>
                <div className="p-8 bg-white border border-slate-200/60 rounded-[2.5rem] text-slate-900 shadow-xl relative overflow-hidden group">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Quick Statistics</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 italic">Unique HSN Codes</span>
                            <span className="text-xl font-black">{new Set(products.map((p: any) => p.hsn).filter(Boolean)).size}</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-500 italic">Billable Services</span>
                            <span className="text-xl font-black">{products.filter((p: any) => !p.sku).length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
