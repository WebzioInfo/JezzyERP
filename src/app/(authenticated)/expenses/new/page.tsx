import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExpenseForm } from "@/features/billing/components/ExpenseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewExpensePage() {
    const session = await verifySessionCookie();
    if (!session) redirect("/login");

    // Fetch potential source accounts (Bank, Cash, Founder)
    const accounts = await (db.account as any).findMany({
        where: {
            type: { in: ['BANK', 'CASH', 'EQUITY'] }
        },
        orderBy: { type: 'asc' }
    });

    return (
        <div className="space-y-8 animate-fade-up max-w-2xl mx-auto pb-24">
            <Link href="/expenses" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Expense Hub
            </Link>

            <ExpenseForm accounts={accounts} />
        </div>
    );
}
