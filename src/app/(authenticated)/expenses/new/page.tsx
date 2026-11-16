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
        <div className="space-y-6 max-w-2xl mx-auto pb-12">
            <Link href="/expenses" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Expenses</span>
            </Link>

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Record Expense</h1>
                <p className="text-sm text-slate-500 mt-0.5">Enter details for operational expenses and payments</p>
            </div>

            <ExpenseForm accounts={accounts} />
        </div>
    );
}
