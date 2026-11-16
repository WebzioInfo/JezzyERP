import { Card, CardContent } from "@/ui/core/Card";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PurchaseTable } from "@/features/procurement/components/PurchaseTable";
import { Plus, Upload, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/financials";
import { db } from "@/db/prisma/client";
import { LiveSearch } from "@/components/common/LiveSearch";
import { Button } from "@/ui/core/Button";

export default async function PurchasesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    const { q: searchQuery = "" } = await searchParams;

    const purchases = await db.purchase.findMany({
        where: {
            deletedAt: null,
            ...(searchQuery && {
                OR: [
                    { purchaseNo: { contains: searchQuery } },
                    { vendor: { name: { contains: searchQuery } } },
                ]
            })
        },
        include: { vendor: true },
        orderBy: { date: "desc" }
    });

    const totalInputGst = purchases.reduce((sum, p) => sum + p.taxTotal.toNumber(), 0);
    const totalPurchaseValue = purchases.reduce((sum, p) => sum + p.grandTotal.toNumber(), 0);

    return (
        <div className="space-y-5 pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                        Purchases & Bills
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Track inward supplier bills, input tax credit (ITC) claims, and payables
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link href="/purchases/import">
                        <Button variant="outline" size="md">
                            <Upload className="w-4 h-4 mr-1.5 text-slate-500" />
                            Import Invoices
                        </Button>
                    </Link>
                    <Link href="/purchases/new">
                        <Button variant="primary" size="md">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Log Purchase
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Mini-strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium">Total Procurement Value</p>
                        <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{formatCurrency(totalPurchaseValue)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium">Input Tax Credit (ITC)</p>
                        <p className="text-lg font-bold text-emerald-700 tabular-nums mt-0.5">{formatCurrency(totalInputGst)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 font-medium">Recorded Bills</p>
                        <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{purchases.length} bills</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Filter */}
            <Card>
                <CardContent className="p-3.5">
                    <LiveSearch 
                        placeholder="Search by bill number or supplier name..." 
                        className="w-full"
                    />
                </CardContent>
            </Card>

            {/* Main Listing Area */}
            <div className="w-full">
                <PurchaseTable purchases={purchases} />
            </div>
        </div>
    );
}
