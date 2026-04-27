import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";
import { recordAuditLog } from "@/lib/audit";

// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
export type PaymentMethod = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI' | 'OTHER';
export const PaymentMethod = {
  CASH: 'CASH' as const,
  CHEQUE: 'CHEQUE' as const,
  BANK_TRANSFER: 'BANK_TRANSFER' as const,
  UPI: 'UPI' as const,
  OTHER: 'OTHER' as const,
};

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export const InvoiceStatus = {
  DRAFT: 'DRAFT' as const,
  SENT: 'SENT' as const,
  PARTIAL: 'PARTIAL' as const,
  PAID: 'PAID' as const,
  OVERDUE: 'OVERDUE' as const,
  CANCELLED: 'CANCELLED' as const,
};

export class PaymentService {
  /**
   * Records a new payment against an invoice and updates the invoice status.
   */
  static async recordPayment(data: {
    invoiceId: string;
    amount: number;
    paidAt: Date;
    method: PaymentMethod;
    reference?: string | null;
    notes?: string | null;
    recordedBy?: string | null;
  }) {
    return await db.$transaction(async (tx) => {
      // 1. Create the payment record
      const payment = await tx.payment.create({
        data: {
          invoiceId: data.invoiceId,
          amount: data.amount,
          paidAt: data.paidAt,
          method: data.method,
          reference: data.reference,
          notes: data.notes,
          recordedBy: data.recordedBy,
        },
      });

      // 2. Fetch current totals
      const aggregate = await tx.payment.aggregate({
        where: { invoiceId: data.invoiceId },
        _sum: { amount: true }
      });

      const totalPaid = Number(aggregate._sum?.amount || 0);

      // 3. Fetch invoice grand total
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId },
        select: { grandTotal: true },
      });

      if (!invoice) throw new Error("Invoice not found");

      const grandTotal = invoice.grandTotal.toNumber();
      const newStatus = totalPaid >= grandTotal ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL;

      // 4. Update the invoice status and amountPaid
      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          amountPaid: totalPaid,
          status: newStatus,
        },
      });

      // 5. Create audit log
      await recordAuditLog(tx, {
        userId: data.recordedBy ?? null,
        action: "PAYMENT_RECORDED",
        entityType: "Payment",
        entityId: payment.id,
        details: {
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
          newInvoiceStatus: newStatus,
        },
      });

      return serializePrisma(payment);
    });
  }

  /**
   * Fetches all payments with invoice and client details.
   */
  static async getAllPayments() {
    const payments = await db.payment.findMany({
      where: { },
      orderBy: { paidAt: "desc" },
      include: {
        invoice: {
          select: {
            invoiceNo: true,
            client: { select: { name: true } },
          },
        },
      },
    });
    return serializePrisma(payments);
  }
}
