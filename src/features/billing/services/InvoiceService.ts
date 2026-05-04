import { Prisma } from "@prisma/client";
import { StockLogType } from "@/features/inventory/services/StockService";

// Local Enum Overrides (Hard Fix for Prisma Stale-ness on Windows)
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { validateData } from "@/lib/validation";
import { invoiceSchema } from "../validators/invoiceSchema";
import { serializePrisma } from "@/utils/serialization";
import { db } from "@/db/prisma/client";
import { recordAuditLog } from "@/lib/audit";
import { StockService } from "@/features/inventory/services/StockService";
import { FinanceService } from "./FinanceService";
import { AllocationService } from "./AllocationService";
import { calculateInvoiceStatus } from "@/utils/financial-status";

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
import { roundTo2 } from "@/utils/financial";

const invoiceRepo = new InvoiceRepository();

export class InvoiceService {
  async createInvoice(userId: string, rawData: any) {
    // 1. Validation
    const validatedData = await validateData(invoiceSchema, rawData);
    const dbAny = db as any;

    return await dbAny.$transaction(async (tx: any) => {
      // 2. Sequence Generation
      const lastSequence = await tx.invoice.findFirst({
        orderBy: { sequenceNumber: 'desc' },
        select: { sequenceNumber: true },
      });
      
      const nextSequence = (lastSequence?.sequenceNumber || 0) + 1;
      
      let invoiceNo = validatedData.invoiceNo;
      if (!invoiceNo) {
        const settings = await tx.companySetting.findFirst();
        const prefix = settings?.invoicePrefix || "B2B";
        
        // Indian FY runs April 1 -> March 31
        const docDate = new Date(validatedData.date);
        const year = docDate.getFullYear();
        const month = docDate.getMonth(); // 0-indexed; March = 2, April = 3
        const fyStartYear = month >= 3 ? year : year - 1;
        const fyEndYear = fyStartYear + 1;
        const fy = `${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;
        const fyStart = new Date(fyStartYear, 3, 1);
        const fyEnd = new Date(fyEndYear, 2, 31, 23, 59, 59, 999);

        // Count invoices in this FY to get next sequence
        const countThisFY = await tx.invoice.count({
            where: {
                date: { gte: fyStart, lte: fyEnd },
                deletedAt: null
            }
        });

        const seq = String(countThisFY + 1).padStart(2, '0');
        invoiceNo = `JE/${prefix}/${seq}/${fy}`;
      }

      // 3. Persistence
      const invoice = await tx.invoice.create({
        data: {
          createdById: userId,
          clientId: validatedData.clientId,
          sequenceNumber: nextSequence,
          invoiceNo: invoiceNo,
          date: new Date(validatedData.date),
          gstType: validatedData.gstType,
          subTotal: roundTo2(validatedData.subTotal),
          taxTotal: roundTo2(validatedData.taxTotal),
          grandTotal: roundTo2(validatedData.grandTotal),
          ewayBill: validatedData.ewayBill,
          ewayBillUrl: validatedData.ewayBillUrl,
          vehicleNo: validatedData.vehicleNo,
          dispatchedThrough: validatedData.dispatchedThrough,
          isFreightCollect: validatedData.isFreightCollect,
          freightAmount: roundTo2(validatedData.freightAmount ?? 0),
          freightTaxPercent: roundTo2(validatedData.freightTaxPercent ?? 0),

          // Address snapshots
          billingName: validatedData.billingAddress?.name,
          billingAddress1: validatedData.billingAddress?.address1,
          billingAddress2: validatedData.billingAddress?.address2,
          billingState: validatedData.billingAddress?.state,
          billingPinCode: validatedData.billingAddress?.pinCode,
          billingPhone: validatedData.billingAddress?.phone,
          billingGst: validatedData.billingAddress?.gst,
          shippingSameAsBilling: validatedData.shippingSameAsBilling,
          shippingName: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.name : validatedData.shippingAddress?.name,
          shippingAddress1: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.address1 : validatedData.shippingAddress?.address1,
          shippingAddress2: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.address2 : validatedData.shippingAddress?.address2,
          shippingState: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.state : validatedData.shippingAddress?.state,
          shippingPinCode: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.pinCode : validatedData.shippingAddress?.pinCode,

          isFinalized: true, // Auto-finalize for now unless it's a quote conversion
          lineItems: {
            create: validatedData.items.map((item: any) => ({
              product: item.productId ? { connect: { id: item.productId } } : undefined,
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: roundTo2(item.rate),
              taxPercent: roundTo2(item.taxPercent),
              taxAmount: roundTo2(item.taxAmount),
              unit: item.unit ?? "",
              pkgCount: item.pkgCount || 0,
              pkgType: item.pkgType ?? "",
              qtyPerBox: item.qtyPerBox || 0,
              totalAmount: roundTo2(item.totalAmount)
            }))
          }
        } as any
      });

      // 4. Record Double-Entry in Ledger
      const clientAccount = await FinanceService.getPartyAccount(invoice.clientId, 'CLIENT');
      const salesAccount = await FinanceService.getSystemAccount(AccountType.REVENUE);

      if (!clientAccount || !salesAccount) {
          throw new Error("Financial accounts not found. Accounting failed.");
      }

      await FinanceService.recordTransaction(tx, {
          debitAccountId: clientAccount.id,
          creditAccountId: salesAccount.id,
          amount: invoice.grandTotal,
          referenceType: 'INVOICE',
          referenceId: invoice.id,
          description: `Sales Invoice ${invoice.invoiceNo}`,
          date: invoice.date,
      });

      // 5. Consume any unallocated advance payments via Allocation Engine
      await AllocationService.consumeClientAdvance(tx, invoice.clientId, invoice.id);
      await AllocationService.syncDocumentStatus(tx, invoice.id, 'INVOICE');

      // 6. Hardened Audit Log
      await recordAuditLog(tx, {
        userId,
        action: "INVOICE_CREATED",
        entityType: "Invoice",
        entityId: invoice.id,
        newValue: {
          invoiceNo,
          grandTotal: invoice.grandTotal,
          clientId: invoice.clientId
        },
        changes: {
          after: { invoiceNo, grandTotal: invoice.grandTotal }
        }
      });

      // 5. Stock Movement
      for (const item of validatedData.items) {
        if (item.productId) {
          await StockService.recordChange({
            productId: item.productId,
            type: StockLogType.REMOVE,
            quantityChange: -Number(item.qty),
            referenceId: invoice.id,
            notes: `Invoice ${invoiceNo} Created`,
            tx
          });
        }
      }

      return serializePrisma(invoice);
    }, { 
        timeout: 60000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable 
    });


  }

  async getInvoices(params: { page?: number; take?: number } = {}) {
    const { page = 1, take = 50 } = params;
    const skip = (page - 1) * take;

    const invoices = await (db.invoice as any).findMany({
      select: {
        id: true,
        invoiceNo: true,
        date: true,
        grandTotal: true,
        isFinalized: true,
        status: true,
        client: { select: { name: true } },
        allocations: { select: { amount: true } }
      },
      orderBy: { date: 'desc' },
      take,
      skip,
    });


    const transformed = invoices.map((inv: any) => ({
        ...inv,
        status: calculateInvoiceStatus({
            grandTotal: inv.grandTotal,
            isFinalized: inv.isFinalized,
            allocations: inv.allocations
        })
    }));

    return serializePrisma(transformed);
  }


  async updateInvoice(invoiceId: string, userId: string, rawData: any) {
    const validatedData = await validateData(invoiceSchema, rawData);
    
    // 1. Fetch OLD invoice before update to capture previous stock levels
    const oldInvoice = await db.invoice.findUnique({
        where: { id: invoiceId },
        include: { lineItems: true }
    });
    if (!oldInvoice) throw new Error("Invoice not found");

    return await db.$transaction(async (tx: any) => {
      // 2. REVERSAL PHASE: Void old ledger entries to prevent balance leakage
      await (tx as any).ledgerEntry.deleteMany({
        where: { referenceId: invoiceId, referenceType: 'INVOICE' }
      });

      // 3. RECORDING PHASE: Update the Invoice record
      const invoice = await invoiceRepo.updateWithItems(invoiceId, {
        date: new Date(validatedData.date),
        gstType: validatedData.gstType,
        subTotal: roundTo2(validatedData.subTotal),
        taxTotal: roundTo2(validatedData.taxTotal),
        grandTotal: roundTo2(validatedData.grandTotal),
        ewayBill: validatedData.ewayBill,
        ewayBillUrl: validatedData.ewayBillUrl,
        vehicleNo: validatedData.vehicleNo,
        invoiceNo: validatedData.invoiceNo,
        dispatchedThrough: validatedData.dispatchedThrough,
        isFreightCollect: validatedData.isFreightCollect,
        freightAmount: roundTo2(validatedData.freightAmount ?? 0),
        freightTaxPercent: roundTo2(validatedData.freightTaxPercent ?? 0),
        client: { connect: { id: validatedData.clientId } },
        billingName: validatedData.billingAddress?.name,
        billingAddress1: validatedData.billingAddress?.address1,
        billingAddress2: validatedData.billingAddress?.address2,
        billingState: validatedData.billingAddress?.state,
        billingPinCode: validatedData.billingAddress?.pinCode,
        billingPhone: validatedData.billingAddress?.phone,
        billingGst: validatedData.billingAddress?.gst,
        shippingSameAsBilling: validatedData.shippingSameAsBilling,
        shippingName: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.name : validatedData.shippingAddress?.name,
        shippingAddress1: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.address1 : validatedData.shippingAddress?.address1,
        shippingAddress2: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.address2 : validatedData.shippingAddress?.address2,
        shippingState: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.state : validatedData.shippingAddress?.state,
        shippingPinCode: validatedData.shippingSameAsBilling ? validatedData.billingAddress?.pinCode : validatedData.shippingAddress?.pinCode,
        lineItems: validatedData.items.map((item: any) => ({
          product: item.productId ? { connect: { id: item.productId } } : undefined,
          description: item.description,
          hsn: item.hsn,
          qty: item.qty,
          rate: roundTo2(item.rate),
          taxPercent: roundTo2(item.taxPercent),
          taxAmount: roundTo2(item.taxAmount),
          unit: item.unit ?? "",
          pkgCount: item.pkgCount || 0,
          pkgType: item.pkgType ?? "",
          qtyPerBox: item.qtyPerBox || 0,
          totalAmount: roundTo2(item.totalAmount)
        }))
      }, tx);

      // 4. LEDGER PHASE: Record new double-entry records
      const clientAccount = await FinanceService.getPartyAccount(invoice.clientId, 'CLIENT', tx);
      const salesAccount = await FinanceService.getSystemAccount(AccountType.REVENUE, tx);

      if (clientAccount && salesAccount) {
          await FinanceService.recordTransaction(tx, {

              debitAccountId: clientAccount.id,
              creditAccountId: salesAccount.id,
              amount: invoice.grandTotal,
              referenceType: 'INVOICE',
              referenceId: invoice.id,
              description: `Sales Invoice ${invoice.invoiceNo} (Updated)`,
              date: invoice.date,
          });
      }

      // 5. ALLOCATION PHASE: Recalculate settlement standing
      // Trigger a re-sync of the status based on existing allocations + any new advances
      await AllocationService.consumeClientAdvance(tx, invoice.clientId, invoice.id);
      await AllocationService.syncDocumentStatus(tx, invoice.id, 'INVOICE');

      // 6. STOCK PHASE: Adjust inventory levels
      // 6. STOCK PHASE: Optimized Net Change Adjustment
      const stockChanges = new Map<string, number>();
      
      // Calculate reversals
      if (oldInvoice) {
        for (const item of (oldInvoice as any).lineItems) {
            if (item.productId) {
                stockChanges.set(item.productId, (stockChanges.get(item.productId) || 0) + Number(item.qty));
            }
        }
      }
      
      // Calculate new levels
      for (const item of validatedData.items) {
        if (item.productId) {
            stockChanges.set(item.productId, (stockChanges.get(item.productId) || 0) - Number(item.qty));
        }
      }

      // Record only non-zero net changes
      for (const [productId, netChange] of stockChanges.entries()) {
        if (Math.abs(netChange) > 0.0001) {
            await StockService.recordChange({
                productId,
                type: netChange > 0 ? StockLogType.ADD : StockLogType.REMOVE,
                quantityChange: netChange,
                referenceId: invoiceId,
                notes: `Invoice ${invoice.invoiceNo} Updated (Net Adjustment)`,
                tx
            });
        }
      }

      // 7. AUDIT PHASE: Track detailed JSON changes
      await recordAuditLog(tx, {
        userId,
        action: "INVOICE_UPDATED",
        entityType: "Invoice",
        entityId: invoice.id,
        changes: {
            before: { grandTotal: oldInvoice.grandTotal, clientId: oldInvoice.clientId },
            after: { grandTotal: invoice.grandTotal, clientId: invoice.clientId }
        }
      });

      return serializePrisma(invoice);
    }, { 
        timeout: 60000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable 
    });


  }

  async softDeleteInvoice(invoiceId: string, userId: string) {
    const invoice = await invoiceRepo.softDelete(invoiceId, userId);
    
    // 1. Reverse Ledger (Delete double-entry records)
    await (db as any).ledgerEntry.deleteMany({
      where: { referenceId: invoiceId, referenceType: 'INVOICE' }
    });

    // 2. Reverse Stock
    await (db as any).$transaction(async (tx: any) => {
        const fullInvoice = await tx.invoice.findUnique({
            where: { id: invoiceId },
            include: { lineItems: true }
        });
        if (fullInvoice) {
            for (const item of fullInvoice.lineItems) {
                if (item.productId) {
                    await StockService.recordChange({
                        productId: item.productId,
                        type: StockLogType.ADD,
                        quantityChange: Number(item.qty),
                        referenceId: invoiceId,
                        notes: `Invoice ${fullInvoice.invoiceNo} Trashed (Stock Restored)`,
                        tx
                    });
                }
            }
        }
    }, { timeout: 30000 });
    
    await recordAuditLog(db, {
      userId,
      action: "INVOICE_TRASHED",
      entityType: "Invoice",
      entityId: invoiceId,
      details: { invoiceNo: invoice.invoiceNo }
    });

    return serializePrisma(invoice);
  }

  async restoreInvoice(invoiceId: string, userId: string) {
    const existing = await invoiceRepo.model.findUnique({
      where: { id: invoiceId }
    });
    if (!existing) throw new Error("Invoice not found");

    // Remove the -DEL- suffix if present
    let originalInvoiceNo = existing.invoiceNo;
    if (originalInvoiceNo.includes("-DEL-")) {
      originalInvoiceNo = originalInvoiceNo.split("-DEL-")[0];
    }

    // Handle sequenceNumber restoration
    // We try to restore to a positive one if it was negative, but we need to find a gap or just use the absolute value if it doesn't conflict
    let restoredSequence = Math.abs(existing.sequenceNumber);
    
    // Check if the number or sequence is already taken
    const conflict = await invoiceRepo.model.findFirst({
      where: {
        OR: [
          { invoiceNo: originalInvoiceNo, deletedAt: null },
          { sequenceNumber: restoredSequence, deletedAt: null }
        ],
        NOT: { id: invoiceId }
      }
    });

    if (conflict) {
      throw new Error(`Cannot restore: Invoice number ${originalInvoiceNo} or sequence ${restoredSequence} is already taken by another active invoice.`);
    }

    const invoice = await (invoiceRepo.model as any).update({
      where: { id: invoiceId },
      data: { 
        deletedAt: null,
        invoiceNo: originalInvoiceNo,
        sequenceNumber: restoredSequence
      },
      include: { lineItems: true }
    });

    await (db as any).$transaction(async (tx: any) => {
        // 1. Re-create Ledger Entry (Double Entry)
        const clientAccount = await FinanceService.getPartyAccount(invoice.clientId, 'CLIENT');
        const salesAccount = await FinanceService.getSystemAccount(AccountType.REVENUE);

        if (clientAccount && salesAccount) {
            await FinanceService.recordTransaction(tx, {
                debitAccountId: clientAccount.id,
                creditAccountId: salesAccount.id,
                amount: invoice.grandTotal,
                referenceType: 'INVOICE',
                referenceId: invoice.id,
                description: `Sales Invoice ${invoice.invoiceNo} (Restored)`,
                date: invoice.date,
            });
        }

        // 2. Trigger auto-adjustment
        await AllocationService.consumeClientAdvance(tx, invoice.clientId, invoice.id);

        // 3. Subtract Stock again
        for (const item of (invoice as any).lineItems) {
            if (item.productId) {
                await StockService.recordChange({
                    productId: item.productId,
                    type: StockLogType.REMOVE,
                    quantityChange: -Number(item.qty),
                    referenceId: invoiceId,
                    notes: `Invoice ${invoice.invoiceNo} Restored`,
                    tx
                });
            }
        }
    }, { timeout: 30000 });

    await recordAuditLog(db, {
      userId,
      action: "INVOICE_RESTORED",
      entityType: "Invoice",
      entityId: invoiceId,
      details: { invoiceNo: invoice.invoiceNo }
    });

    return serializePrisma(invoice);
  }

  async permanentlyDeleteInvoice(invoiceId: string, userId: string) {
    // Audit before deletion
    const invoice = await invoiceRepo.model.findUnique({ where: { id: invoiceId } });
    if (invoice) {
        await recordAuditLog(db, {
            userId,
            action: "INVOICE_PERMANENTLY_DELETED",
            entityType: "Invoice",
            entityId: invoiceId,
            details: { invoiceNo: invoice.invoiceNo }
        });
    }

    return await invoiceRepo.model.delete({
      where: { id: invoiceId }
    });
  }
}
