import type { Metadata } from "next";
import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TransferForm } from "./TransferForm";
import { Button } from "@/ui/core/Button";
import { Wallet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Internal Transfer | Finance",
  description: "Move funds between accounts securely",
};

export default async function TransferPage() {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const accounts = await (db as any).account.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Internal Account Transfer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Transfer funds between your bank, cash, and liquidity accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/accounts">
            <Button variant="outline" size="sm">
              <Wallet className="mr-2 h-4 w-4" />
              <span>View Accounts</span>
            </Button>
          </Link>
        </div>
      </div>

      <TransferForm accounts={accounts} />
    </div>
  );
}
