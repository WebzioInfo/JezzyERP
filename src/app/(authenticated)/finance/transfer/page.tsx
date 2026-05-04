import type { Metadata } from "next";
import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TransferForm } from "./TransferForm";
import { Button } from "@/ui/core/Button";
import { Wallet } from "lucide-react";
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
          Internal Transfer
        </h2>
        <div className="flex items-center space-x-2">
          <Link href="/finance/accounts">
            <Button variant="outline" className="rounded-2xl font-bold uppercase text-[10px] tracking-widest border-2">
              <Wallet className="mr-2 h-4 w-4" /> View Accounts
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <TransferForm accounts={accounts} />
        </div>
      </div>
    </div>
  );
}
