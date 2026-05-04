import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { calculateInvoiceStatus } from "@/utils/financial-status";
import { serializePrisma } from "@/utils/serialization";
import { InvoiceDetailClient } from "@/features/billing/components/InvoiceDetailClient";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  const invoice = await (db.invoice as any).findFirst({
    where: { id, deletedAt: null },
    include: {
      client: true,
      allocations: true,
      lineItems: { 
        orderBy: { id: "asc" },
        include: { product: true }
      },
      payments: { 
        orderBy: { paidAt: "desc" },
        select: {
          id: true,
          amount: true,
          paidAt: true,
          method: true,
          reference: true,
          notes: true,
          createdAt: true
        }
      },
    },
  });

  if (!invoice) notFound();

  const transformed = {
      ...invoice,
      status: calculateInvoiceStatus({
          grandTotal: invoice.grandTotal,
          isFinalized: invoice.isFinalized,
          allocations: invoice.allocations
      })
  };

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl mx-auto pb-24">
      {/* ── Back Header ── */}
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/invoices"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Exit to Terminal
        </Link>
      </div>

      <InvoiceDetailClient invoice={serializePrisma(transformed)} />
    </div>
  );
}

