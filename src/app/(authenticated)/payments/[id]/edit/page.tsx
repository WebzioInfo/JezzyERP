import { db } from "@/db/prisma/client";
import { verifySessionCookie } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import EditPaymentForm from "./EditPaymentForm";

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await verifySessionCookie();
  if (!session) redirect("/login");

  const { id } = await params;
  const payment = await (db.payment as any).findUnique({
    where: { id },
    include: { client: true, invoice: true }
  });

  if (!payment) return notFound();

  // Convert Decimal to number for the client component
  const paymentData = {
      ...payment,
      amount: Number(payment.amount)
  };

  return <EditPaymentForm payment={paymentData} />;
}
