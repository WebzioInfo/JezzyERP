import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";
import { FinanceService } from "./FinanceService";
import { AllocationService } from "./AllocationService";
import { Prisma } from "@prisma/client";
import { roundTo2 } from "@/utils/financial";

export type AccountType = 'CASH' | 'BANK' | 'CLIENT' | 'SUPPLIER' | 'EXPENSE' | 'PURCHASE' | 'REVENUE' | 'LOAN' | 'ADVANCE' | 'EQUITY';
export const AccountType = {
  CASH: 'CASH' as AccountType,
  BANK: 'BANK' as AccountType,
  CLIENT: 'CLIENT' as AccountType,
  SUPPLIER: 'SUPPLIER' as AccountType,
  EXPENSE: 'EXPENSE' as AccountType,
  PURCHASE: 'PURCHASE' as AccountType,
  REVENUE: 'REVENUE' as AccountType,
  LOAN: 'LOAN' as AccountType,
  ADVANCE: 'ADVANCE' as AccountType,
  EQUITY: 'EQUITY' as AccountType,
};

// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
export type PaymentMethod = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI' | 'OTHER';
export const PaymentMethod = {
  CASH: 'CASH' as const,
  CHEQUE: 'CHEQUE' as const,
  BANK_TRANSFER: 'BANK_TRANSFER' as const,
  UPI: 'UPI' as const,
  OTHER: 'OTHER' as const,
};

export class PaymentService {
  /**
   * Records a new payment (Received from Client or Made to Supplier).
   */
  static async recordPayment(data: {
    partyId: string;
    partyType: 'CLIENT' | 'SUPPLIER';
    invoiceId?: string | null;
    purchaseId?: string | null;
    amount: number;
    paidAt: Date;
    method: PaymentMethod;
    reference?: string | null;
    notes?: string | null;
    recordedBy?: string | null;
  }) {
    if (data.amount <= 0) throw new Error("Payment amount must be positive.");

    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Resolve Accounts
      const partyAccount = await FinanceService.getPartyAccount(data.partyId, data.partyType, tx);
      const liquidityAccount = data.method === 'CASH'
        ? await FinanceService.getSystemAccount(AccountType.CASH, tx)
        : await FinanceService.getSystemAccount(AccountType.BANK, tx);

      if (!partyAccount || !liquidityAccount) {
        throw new Error("Financial accounts not properly initialized for this entity.");
      }

      // 2. Safety Check for Outgoing Payments (to Suppliers)
      if (data.partyType === 'SUPPLIER') {
        const guard = await FinanceService.validateAccountBalance(liquidityAccount.id, data.amount);
        if (guard.level === 'BLOCK') throw new Error(guard.message);
      }

      // 3. Create the payment record
      const payment = await (tx as any).payment.create({
        data: {
          clientId: data.partyType === 'CLIENT' ? data.partyId : undefined,
          // vendorId omitted — column not yet migrated to DB
          invoiceId: data.invoiceId ?? undefined,
          // purchaseId omitted — column not yet migrated to DB
          amount: roundTo2(data.amount),
          paidAt: data.paidAt,
          method: data.method,
          reference: data.reference ?? undefined,
          notes: data.notes ?? undefined,
          recordedBy: data.recordedBy ?? undefined,
        },
        select: {
          id: true,
          clientId: true,
          invoiceId: true,
          // purchaseId omitted
          amount: true,
          paidAt: true,
          method: true,
          reference: true,
          notes: true,
          recordedBy: true,
          createdAt: true,
          // vendorId omitted
        }
      });



      // 4. Record Double-Entry in Ledger
      const isClient = data.partyType === 'CLIENT';
      await FinanceService.recordTransaction(tx as any, {
        debitAccountId: isClient ? liquidityAccount.id : partyAccount.id,
        creditAccountId: isClient ? partyAccount.id : liquidityAccount.id,
        amount: data.amount,
        referenceType: 'PAYMENT',
        referenceId: payment.id,
        description: `${isClient ? 'Payment Received' : 'Payment Made'} via ${data.method}${data.reference ? ' (Ref: ' + data.reference + ')' : ''}`,
        date: data.paidAt,
      });

      // 5. Auto-allocation
      if (isClient) {
        await AllocationService.allocateClientPayment(tx, payment.id, data.partyId, data.amount);
      }

      // 6. Audit Log
      await (tx as any).auditLog.create({
        data: {
          userId: data.recordedBy ?? null,
          action: isClient ? "PAYMENT_RECEIVED" : "PAYMENT_MADE",
          entityType: "Payment",
          entityId: payment.id,
          newValue: {
            amount: data.amount,
            method: data.method,
            partyId: data.partyId,
          },
        }
      });

      return serializePrisma(payment);
    }, {
      timeout: 60000,
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  /**
   * Fetches all payments with related details.
   */
  static async getAllPayments() {
    const payments = await (db.payment as any).findMany({
      orderBy: { paidAt: "desc" },
      select: {
        id: true,
        clientId: true,
        invoiceId: true,
        // purchaseId omitted
        amount: true,
        paidAt: true,
        method: true,
        reference: true,
        notes: true,
        recordedBy: true,
        createdAt: true,
        // vendorId omitted
        client: { select: { name: true } },
        invoice: { select: { invoiceNo: true } },
        // purchase omitted
      },
    });
    return serializePrisma(payments);
  }


}