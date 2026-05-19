import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { serializePrisma } from "@/utils/serialization";
import { EditLoanClient } from "./EditLoanClient";

export default async function EditLoanPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;

  const loan = await (db as any).loan.findUnique({
    where: { id },
  });

  if (!loan) {
    notFound();
  }

  // Find the ledger entry to determine if BANK or CASH
  const ledgerEntry = await (db as any).ledgerEntry.findFirst({
    where: {
      referenceId: id,
      referenceType: { in: ['LOAN_TAKEN', 'LOAN_GIVEN'] }
    },
    include: {
      debitAccount: true,
      creditAccount: true
    }
  });

  const isBank = ledgerEntry?.debitAccount?.type === 'BANK' || ledgerEntry?.creditAccount?.type === 'BANK';
  const paymentMethod = isBank ? 'BANK' : 'CASH';

  return (
    <EditLoanClient 
      loan={serializePrisma(loan)} 
      initialPaymentMethod={paymentMethod} 
    />
  );
}
