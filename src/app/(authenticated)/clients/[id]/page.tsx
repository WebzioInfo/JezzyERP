import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PartyAccountService } from "@/features/billing/services/PartyAccountService";
import { PartyAccountView } from "@/features/billing/components/PartyAccountView";
import { serializePrisma } from "@/utils/serialization";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  // Check if client exists
  const clientExists = await db.client.findFirst({
    where: { id, deletedAt: null }
  });

  if (!clientExists) redirect("/clients");

  // Fetch initial account overview on the server
  let initialAccountData = null;
  try {
    const rawData = await PartyAccountService.getAccountOverview(id, "CLIENT");
    initialAccountData = serializePrisma(rawData);
  } catch (err) {
    console.error("[CLIENT_ACCOUNT_OVERVIEW_ERROR]", err);
  }

  return (
    <div className="space-y-8 animate-fade-up max-w-7xl mx-auto pb-24">
      {/* ── Back Header ── */}
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/clients"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-widest group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Clients Terminal
        </Link>
      </div>

      {/* ── Complete ERP Customer Account / Ledger / Statement View ── */}
      <PartyAccountView 
        partyId={id} 
        partyType="CLIENT" 
        initialData={initialAccountData} 
      />
    </div>
  );
}
