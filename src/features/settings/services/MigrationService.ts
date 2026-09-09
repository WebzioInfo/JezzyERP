import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { StockService, StockLogType } from "@/features/inventory/services/StockService";
import { FinanceService, AccountType } from "@/features/billing/services/FinanceService";
import { AllocationService } from "@/features/billing/services/AllocationService";
import { calculateBillingTotals, roundTo2 } from "@/utils/financials";
import { serializePrisma } from "@/utils/serialization";

// Custom error to propagate dry-run execution reports during transaction rollback
export class DryRunRollback extends Error {
  constructor(public result: { successCount: number; errorCount: number; logs: any[] }) {
    super("Dry Run Rollback");
    this.name = "DryRunRollback";
  }
}

// Zod validation schemas for migration inputs
const accountImportSchema = z.object({
  name: z.string().min(2, "Account name is required"),
  type: z.enum(["CASH", "BANK", "CLIENT", "SUPPLIER", "EXPENSE", "PURCHASE", "REVENUE", "LOAN", "ADVANCE", "EQUITY"]),
  openingBalance: z.preprocess((val) => Number(val || 0), z.number().default(0)),
});

const clientImportSchema = z.object({
  name: z.string().min(2, "Client name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")).nullish(),
  phone: z.string().optional().nullish(),
  gst: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").optional().or(z.literal("")).nullish(),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional().nullish(),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().length(6, "Pin Code must be 6 digits").optional().or(z.literal("")).nullish(),
});

const productImportSchema = z.object({
  sku: z.string().optional().nullish(),
  description: z.string().min(2, "Description is required"),
  hsn: z.string().optional().nullish(),
  sellingRate: z.preprocess((val) => Number(val || 0), z.number().nonnegative("Selling rate must be positive")),
  gstRate: z.preprocess((val) => Number(val || 0), z.number().min(0).max(100, "GST rate must be between 0 and 100")),
  purchaseRate: z.preprocess((val) => Number(val || 0), z.number().nonnegative("Purchase rate must be positive").optional().default(0)),
  qtyPerBox: z.preprocess((val) => Number(val || 0), z.number().nonnegative().optional().default(0)),
  unit: z.string().optional().default("NOS"),
  pkgType: z.string().optional().default("BOX"),
});

const stockImportSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  quantity: z.preprocess((val) => Number(val || 0), z.number().nonnegative("Quantity must be positive")),
  notes: z.string().optional().nullish(),
});

const invoiceImportSchema = z.object({
  invoiceNo: z.string().optional().nullish(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  clientName: z.string().min(2, "Client name is required"),
  sku: z.string().min(1, "Product SKU is required"),
  qty: z.preprocess((val) => Number(val || 0), z.number().positive("Quantity must be positive")),
  rate: z.preprocess((val) => Number(val || 0), z.number().nonnegative("Rate must be positive")),
  taxPercent: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).max(100).optional()),
  ewayBill: z.string().optional().nullish(),
  vehicleNo: z.string().optional().nullish(),
});

const purchaseImportSchema = z.object({
  purchaseNo: z.string().optional().nullish(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  vendorName: z.string().min(2, "Vendor name is required"),
  sku: z.string().min(1, "Product SKU is required"),
  qty: z.preprocess((val) => Number(val || 0), z.number().positive("Quantity must be positive")),
  rate: z.preprocess((val) => Number(val || 0), z.number().nonnegative("Rate must be positive")),
  taxPercent: z.preprocess((val) => val ? Number(val) : undefined, z.number().min(0).max(100).optional()),
  ewayBill: z.string().optional().nullish(),
  vehicleNo: z.string().optional().nullish(),
  paymentMethod: z.enum(["CASH", "BANK", "CREDIT"]).optional().default("CREDIT"),
});

const paymentImportSchema = z.object({
  partyName: z.string().min(2, "Party name is required"),
  partyType: z.enum(["CLIENT", "SUPPLIER"]),
  amount: z.preprocess((val) => Number(val || 0), z.number().positive("Amount must be positive")),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  method: z.enum(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "OTHER"]),
  reference: z.string().optional().nullish(),
  notes: z.string().optional().nullish(),
});

export class MigrationService {
  /**
   * Orchestrates the data migration import within a database transaction context.
   */
  static async runImport(tx: Prisma.TransactionClient, module: string, data: any[], dryRun: boolean) {
    let successCount = 0;
    let errorCount = 0;
    const logs: any[] = [];

    try {
      if (module === "ACCOUNTS") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = accountImportSchema.parse(row);
            
            // Check uniqueness
            const existing = await tx.account.findUnique({
              where: { name: parsed.name }
            });
            if (existing) {
              throw new Error(`Account '${parsed.name}' already exists.`);
            }

            await tx.account.create({
              data: {
                name: parsed.name,
                type: parsed.type,
                openingBalance: parsed.openingBalance,
              }
            });

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Account '${parsed.name}' created successfully.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      } 
      else if (module === "CLIENTS") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = clientImportSchema.parse(row);

            const existing = await tx.client.findFirst({
              where: { name: parsed.name, deletedAt: null }
            });
            if (existing) {
              throw new Error(`Client '${parsed.name}' already exists.`);
            }

            const client = await tx.client.create({
              data: {
                name: parsed.name,
                email: parsed.email || null,
                phone: parsed.phone || null,
                gst: parsed.gst || null,
                address1: parsed.address1,
                address2: parsed.address2 || null,
                state: parsed.state,
                pinCode: parsed.pinCode || null,
              }
            });

            // Initialize ledger account
            await FinanceService.getPartyAccount(client.id, "CLIENT", tx);

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Client '${parsed.name}' imported and ledger account initialized.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      } 
      else if (module === "VENDORS") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = clientImportSchema.parse(row); // Identical structure to client

            const existing = await tx.vendor.findFirst({
              where: { name: parsed.name, deletedAt: null }
            });
            if (existing) {
              throw new Error(`Vendor '${parsed.name}' already exists.`);
            }

            const vendor = await tx.vendor.create({
              data: {
                name: parsed.name,
                email: parsed.email || null,
                phone: parsed.phone || null,
                gst: parsed.gst || null,
                address1: parsed.address1,
                address2: parsed.address2 || null,
                state: parsed.state,
                pinCode: parsed.pinCode || null,
              }
            });

            // Initialize ledger account
            await FinanceService.getPartyAccount(vendor.id, "SUPPLIER", tx);

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Vendor '${parsed.name}' imported and ledger account initialized.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      } 
      else if (module === "PRODUCTS") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = productImportSchema.parse(row);
            const sku = parsed.sku || `PROD-${Date.now()}-${i}`;

            const existing = await tx.product.findFirst({
              where: {
                OR: [{ sku }, { description: parsed.description }],
                deletedAt: null
              }
            });
            if (existing) {
              throw new Error(`Product SKU '${sku}' or description already exists.`);
            }

            const product = await tx.product.create({
              data: {
                sku,
                description: parsed.description,
                hsn: parsed.hsn || null,
                sellingRate: parsed.sellingRate,
                gstRate: parsed.gstRate,
                purchaseRate: parsed.purchaseRate,
                qtyPerBox: parsed.qtyPerBox,
                unit: parsed.unit,
                pkgType: parsed.pkgType,
              }
            });

            // Auto-initialize stock level to 0
            await tx.stock.create({
              data: {
                productId: product.id,
                quantity: 0
              }
            });

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Product '${parsed.description}' added with SKU '${sku}'.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      }
      else if (module === "OPENING_STOCK") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = stockImportSchema.parse(row);
            
            const product = await tx.product.findFirst({
              where: { sku: parsed.sku, deletedAt: null }
            });
            if (!product) {
              throw new Error(`Product with SKU '${parsed.sku}' not found.`);
            }

            await StockService.recordChange({
              productId: product.id,
              type: StockLogType.MANUAL,
              quantityChange: parsed.quantity,
              notes: parsed.notes || "Opening Stock Import",
              tx
            });

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Updated Opening Stock for SKU '${parsed.sku}': +${parsed.quantity}.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      }
      else if (module === "INVOICES") {
        // Flat rows grouping logic by document identifier (invoiceNo or date + clientName)
        const groups = new Map<string, any[]>();
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const sourceRow = i + 2;
          try {
            const parsed = invoiceImportSchema.parse(row);
            const key = parsed.invoiceNo || `${parsed.date}_${parsed.clientName}`;
            if (!groups.has(key)) {
              groups.set(key, []);
            }
            groups.get(key)!.push({ parsed, sourceRow });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }

        for (const [key, groupRows] of groups.entries()) {
          const first = groupRows[0].parsed;
          const rowsList = groupRows.map(r => r.sourceRow).join(", ");
          try {
            // Find Client
            const client = await tx.client.findFirst({
              where: { name: first.clientName, deletedAt: null }
            });
            if (!client) throw new Error(`Client '${first.clientName}' not found.`);

            // Verify invoice uniqueness if custom number provided
            if (first.invoiceNo) {
              const dup = await tx.invoice.findFirst({
                where: { invoiceNo: first.invoiceNo, deletedAt: null }
              });
              if (dup) throw new Error(`Invoice number '${first.invoiceNo}' is already taken.`);
            }

            let invoiceNo = first.invoiceNo;
            let nextSequence;
            const match = invoiceNo ? invoiceNo.match(/(?:JE[-/]B2B[-/]|JE[-/])(\d+)/i) : null;
            if (match) {
              nextSequence = parseInt(match[1], 10);
            } else {
              const lastSequence = await tx.invoice.findFirst({
                orderBy: { sequenceNumber: 'desc' },
                select: { sequenceNumber: true },
              });
              nextSequence = (lastSequence?.sequenceNumber || 0) + 1;
            }
            if (!invoiceNo) {
              const settings = await tx.companySetting.findFirst();
              const prefix = settings?.invoicePrefix || "B2B";
              const docDate = new Date(first.date);
              const year = docDate.getFullYear();
              const month = docDate.getMonth();
              const fyStartYear = month >= 3 ? year : year - 1;
              const fyEndYear = fyStartYear + 1;
              const fy = `${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;
              const fyStart = new Date(fyStartYear, 3, 1);
              const fyEnd = new Date(fyEndYear, 2, 31, 23, 59, 59, 999);

              const countThisFY = await tx.invoice.count({
                where: { date: { gte: fyStart, lte: fyEnd }, deletedAt: null }
              });
              const seq = String(countThisFY + 1).padStart(2, '0');
              invoiceNo = `JE/${prefix}/${seq}/${fy}`;
            }

            // Resolve products & build items
            const itemsToCreate = [];
            const billingCalculationItems = [];
            for (const itemRow of groupRows) {
              const r = itemRow.parsed;
              const product = await tx.product.findFirst({
                where: { sku: r.sku, deletedAt: null }
              });
              if (!product) throw new Error(`Product SKU '${r.sku}' not found for row.`);

              const taxPercent = r.taxPercent !== undefined ? r.taxPercent : Number(product.gstRate);
              const taxableAmount = roundTo2(r.qty * r.rate);
              const taxAmount = roundTo2((taxableAmount * taxPercent) / 100);
              const totalAmount = roundTo2(taxableAmount + taxAmount);

              itemsToCreate.push({
                productId: product.id,
                description: product.description,
                hsn: product.hsn,
                qty: r.qty,
                rate: r.rate,
                taxPercent,
                taxAmount,
                totalAmount,
                unit: product.unit,
                qtyPerBox: Number(product.qtyPerBox || 0),
              });

              billingCalculationItems.push({
                qty: r.qty,
                rate: r.rate,
                taxPercent,
              });
            }

            // Perform final document level arithmetic
            const billingTotals = calculateBillingTotals(billingCalculationItems);

            const invoice = await tx.invoice.create({
              data: {
                clientId: client.id,
                sequenceNumber: nextSequence,
                invoiceNo,
                date: new Date(first.date),
                gstType: "CGST_SGST", // default mapping
                subTotal: billingTotals.subTotal,
                taxTotal: billingTotals.taxTotal,
                grandTotal: billingTotals.grandTotal,
                ewayBill: first.ewayBill || null,
                vehicleNo: first.vehicleNo || null,
                isFinalized: true,
                billingName: client.name,
                billingAddress1: client.address1,
                billingAddress2: client.address2,
                billingState: client.state,
                billingPinCode: client.pinCode,
                billingPhone: client.phone,
                billingGst: client.gst,
                lineItems: {
                  create: itemsToCreate
                }
              } as any
            });

            // Ledger Posting
            const clientAccount = await FinanceService.getPartyAccount(client.id, 'CLIENT', tx);
            const salesAccount = await FinanceService.getSystemAccount(AccountType.REVENUE, tx);
            if (!clientAccount || !salesAccount) throw new Error("Chart of Accounts accounts not initialized.");

            await FinanceService.recordTransaction(tx, {
              debitAccountId: clientAccount.id,
              creditAccountId: salesAccount.id,
              amount: invoice.grandTotal,
              referenceType: 'INVOICE',
              referenceId: invoice.id,
              description: `Sales Invoice ${invoice.invoiceNo} (Imported)`,
              date: invoice.date,
            });

            // Auto-consume advance and sync status
            await AllocationService.consumeClientAdvance(tx, client.id, invoice.id);
            await AllocationService.syncDocumentStatus(tx, invoice.id, 'INVOICE');

            // Stock movements
            for (const item of itemsToCreate) {
              await StockService.recordChange({
                productId: item.productId,
                type: StockLogType.REMOVE,
                quantityChange: -Number(item.qty),
                referenceId: invoice.id,
                notes: `Invoice ${invoice.invoiceNo} Import`,
                tx
              });
            }

            successCount += groupRows.length;
            logs.push({ status: "SUCCESS", sourceRow: groupRows[0].sourceRow, message: `Invoice '${invoiceNo}' successfully imported with ${groupRows.length} item(s) from row(s) [${rowsList}].` });
          } catch (err: any) {
            errorCount += groupRows.length;
            logs.push({ status: "ERROR", sourceRow: groupRows[0].sourceRow, message: `Grouping Failure for rows [${rowsList}]: ${err.message}` });
          }
        }
      }
      else if (module === "PURCHASES") {
        // Grouping logic for purchases
        const groups = new Map<string, any[]>();
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const sourceRow = i + 2;
          try {
            const parsed = purchaseImportSchema.parse(row);
            const key = parsed.purchaseNo || `${parsed.date}_${parsed.vendorName}`;
            if (!groups.has(key)) {
              groups.set(key, []);
            }
            groups.get(key)!.push({ parsed, sourceRow });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }

        for (const [key, groupRows] of groups.entries()) {
          const first = groupRows[0].parsed;
          const rowsList = groupRows.map(r => r.sourceRow).join(", ");
          try {
            const vendor = await tx.vendor.findFirst({
              where: { name: first.vendorName, deletedAt: null }
            });
            if (!vendor) throw new Error(`Vendor '${first.vendorName}' not found.`);

            if (first.purchaseNo) {
              const dup = await tx.purchase.findFirst({
                where: { purchaseNo: first.purchaseNo, deletedAt: null }
              });
              if (dup) throw new Error(`Purchase number '${first.purchaseNo}' already exists.`);
            }

            // Sequence resolution
            const now = new Date(first.date);
            const month = now.getMonth();
            const year = now.getFullYear();
            const fyStart = new Date(month >= 3 ? year : year - 1, 3, 1);
            const fyEnd = new Date(month >= 3 ? year + 1 : year, 2, 31, 23, 59, 59);
            const fyStr = month >= 3 ? `${year % 100}-${(year + 1) % 100}` : `${(year - 1) % 100}-${year % 100}`;

            const countThisFY = await tx.purchase.count({
              where: { date: { gte: fyStart, lte: fyEnd }, deletedAt: null }
            });
            const purchaseNo = first.purchaseNo || `JE/PUR/${String(countThisFY + 1).padStart(2, '0')}/${fyStr}`;

            const itemsToCreate = [];
            const billingCalculationItems = [];
            for (const itemRow of groupRows) {
              const r = itemRow.parsed;
              const product = await tx.product.findFirst({
                where: { sku: r.sku, deletedAt: null }
              });
              if (!product) throw new Error(`Product SKU '${r.sku}' not found for row.`);

              const taxPercent = r.taxPercent !== undefined ? r.taxPercent : Number(product.gstRate);
              const taxableAmount = roundTo2(r.qty * r.rate);
              const taxAmount = roundTo2((taxableAmount * taxPercent) / 100);
              const totalAmount = roundTo2(taxableAmount + taxAmount);

              itemsToCreate.push({
                productId: product.id,
                description: product.description,
                hsn: product.hsn,
                qty: r.qty,
                rate: r.rate,
                taxPercent,
                taxAmount,
                totalAmount,
                unit: product.unit,
              });

              billingCalculationItems.push({
                qty: r.qty,
                rate: r.rate,
                taxPercent,
              });
            }

            const totals = calculateBillingTotals(billingCalculationItems);

            const purchase = await tx.purchase.create({
              data: {
                vendorId: vendor.id,
                sequenceNumber: countThisFY + 1,
                purchaseNo,
                date: new Date(first.date),
                subTotal: totals.subTotal,
                taxTotal: totals.taxTotal,
                grandTotal: totals.grandTotal,
                ewayBill: first.ewayBill || null,
                vehicleNo: first.vehicleNo || null,
                isFinalized: true,
                lineItems: {
                  create: itemsToCreate
                }
              } as any
            });

            // Ledger postings
            const vendorAccount = await FinanceService.getPartyAccount(vendor.id, 'SUPPLIER', tx);
            const purchaseAccount = await FinanceService.getSystemAccount(AccountType.PURCHASE, tx);
            if (!vendorAccount || !purchaseAccount) throw new Error("Procurement ledger accounts not initialized.");

            let sourceAccount = null;
            const isCashPurchase = first.paymentMethod && first.paymentMethod !== 'CREDIT';
            if (isCashPurchase) {
              sourceAccount = first.paymentMethod === 'CASH'
                ? await FinanceService.getSystemAccount(AccountType.CASH, tx)
                : await FinanceService.getSystemAccount(AccountType.BANK, tx);
              if (!sourceAccount) throw new Error("Liquidity account not initialized.");
            }

            await FinanceService.recordTransaction(tx, {
              debitAccountId: purchaseAccount.id,
              creditAccountId: isCashPurchase && sourceAccount ? sourceAccount.id : vendorAccount.id,
              amount: purchase.grandTotal,
              referenceType: 'PURCHASE',
              referenceId: purchase.id,
              description: `Inventory Purchase ${purchaseNo} (Imported)`,
              date: purchase.date,
            });

            // Stock movements
            for (const item of itemsToCreate) {
              await StockService.recordChange({
                productId: item.productId,
                type: StockLogType.ADD,
                quantityChange: Number(item.qty),
                referenceId: purchase.id,
                notes: `Purchase ${purchase.purchaseNo} Import`,
                tx
              });
            }

            successCount += groupRows.length;
            logs.push({ status: "SUCCESS", sourceRow: groupRows[0].sourceRow, message: `Purchase '${purchaseNo}' successfully imported with ${groupRows.length} item(s) from row(s) [${rowsList}].` });
          } catch (err: any) {
            errorCount += groupRows.length;
            logs.push({ status: "ERROR", sourceRow: groupRows[0].sourceRow, message: `Grouping Failure for rows [${rowsList}]: ${err.message}` });
          }
        }
      }
      else if (module === "PAYMENTS") {
        for (let i = 0; i < data.length; i++) {
          const sourceRow = i + 2;
          const row = data[i];
          try {
            const parsed = paymentImportSchema.parse(row);
            
            let partyAccount = null;
            let clientId = null;
            let vendorId = null;

            if (parsed.partyType === "CLIENT") {
              const client = await tx.client.findFirst({
                where: { name: parsed.partyName, deletedAt: null }
              });
              if (!client) throw new Error(`Client '${parsed.partyName}' not found.`);
              clientId = client.id;
              partyAccount = await FinanceService.getPartyAccount(client.id, "CLIENT", tx);
            } else {
              const vendor = await tx.vendor.findFirst({
                where: { name: parsed.partyName, deletedAt: null }
              });
              if (!vendor) throw new Error(`Vendor '${parsed.partyName}' not found.`);
              vendorId = vendor.id;
              partyAccount = await FinanceService.getPartyAccount(vendor.id, "SUPPLIER", tx);
            }

            const liquidityAccount = parsed.method === 'CASH'
              ? await FinanceService.getSystemAccount(AccountType.CASH, tx)
              : await FinanceService.getSystemAccount(AccountType.BANK, tx);

            if (!partyAccount || !liquidityAccount) throw new Error("Ledger accounts not initialized.");

            // Safety check for supplier payments
            if (parsed.partyType === 'SUPPLIER') {
              const guard = await FinanceService.validateAccountBalance(liquidityAccount.id, parsed.amount);
              if (guard.level === 'BLOCK') throw new Error(guard.message);
            }

            // Create record
            const payment = await (tx as any).payment.create({
              data: {
                clientId,
                vendorId,
                amount: roundTo2(parsed.amount),
                paidAt: new Date(parsed.paidAt),
                method: parsed.method,
                reference: parsed.reference || null,
                notes: parsed.notes || null,
              }
            });

            // Post Ledger
            const isClient = parsed.partyType === 'CLIENT';
            await FinanceService.recordTransaction(tx, {
              debitAccountId: isClient ? liquidityAccount.id : partyAccount.id,
              creditAccountId: isClient ? partyAccount.id : liquidityAccount.id,
              amount: parsed.amount,
              referenceType: 'PAYMENT',
              referenceId: payment.id,
              description: `${isClient ? 'Payment Received' : 'Payment Made'} via ${parsed.method} (Imported)`,
              date: new Date(parsed.paidAt),
            });

            // Allocation matching
            if (isClient && clientId) {
              await AllocationService.allocateClientPayment(tx, payment.id, clientId, parsed.amount);
            } else if (!isClient && vendorId) {
              await AllocationService.allocateVendorPayment(tx, payment.id, vendorId, parsed.amount);
            }

            successCount++;
            logs.push({ status: "SUCCESS", sourceRow, message: `Payment of Rs. ${parsed.amount} successfully processed.` });
          } catch (err: any) {
            errorCount++;
            logs.push({ status: "ERROR", sourceRow, message: err.errors ? err.errors[0].message : err.message });
          }
        }
      }

      if (dryRun) {
        throw new DryRunRollback({ successCount, errorCount, logs });
      }

      return { successCount, errorCount, logs };
    } catch (err) {
      if (err instanceof DryRunRollback) {
        throw err;
      }
      throw err;
    }
  }

  /**
   * Post-Import Reconciliation auditor to ensure Ledger & Stock integrity.
   */
  static async reconcileBalances() {
    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Audit Stock Levels
      const products = await tx.product.findMany({ where: { deletedAt: null } });
      const stockDiscrepancies = [];

      for (const p of products) {
        const purchaseSums = await tx.purchaseLineItem.aggregate({
          where: { productId: p.id, purchase: { deletedAt: null } },
          _sum: { qty: true }
        });
        const invoiceSums = await tx.invoiceLineItem.aggregate({
          where: { productId: p.id, invoice: { deletedAt: null } },
          _sum: { qty: true }
        });
        const manualSums = await tx.stockLog.aggregate({
          where: { productId: p.id, type: "MANUAL" },
          _sum: { quantityChange: true }
        });

        const derivedStock = Number(purchaseSums._sum.qty || 0) - Number(invoiceSums._sum.qty || 0) + Number(manualSums._sum.qty || manualSums._sum.quantityChange || 0);
        
        const currentStock = await tx.stock.findUnique({ where: { productId: p.id } });
        const actualStock = currentStock ? Number(currentStock.quantity) : 0;

        if (Math.abs(derivedStock - actualStock) > 0.001) {
          stockDiscrepancies.push({ sku: p.sku, description: p.description, actual: actualStock, expected: derivedStock });
          
          // Re-sync correct stock value
          await tx.stock.upsert({
            where: { productId: p.id },
            create: { productId: p.id, quantity: derivedStock },
            update: { quantity: derivedStock }
          });
        }
      }

      // 2. Audit Ledger Balance (Debits = Credits)
      const debits = await (tx as any).ledgerEntry.aggregate({
        where: { debitAccountId: { not: null } },
        _sum: { amount: true }
      });
      const credits = await (tx as any).ledgerEntry.aggregate({
        where: { creditAccountId: { not: null } },
        _sum: { amount: true }
      });

      const totalDebits = debits._sum.amount?.toNumber() || 0;
      const totalCredits = credits._sum.amount?.toNumber() || 0;
      const ledgerImbalance = Math.abs(totalDebits - totalCredits);

      return {
        success: true,
        reconciledAt: new Date().toISOString(),
        stockAudit: {
          scanned: products.length,
          correctedCount: stockDiscrepancies.length,
          discrepancies: stockDiscrepancies
        },
        ledgerAudit: {
          totalDebits,
          totalCredits,
          imbalance: ledgerImbalance,
          balanced: ledgerImbalance < 0.01
        }
      };
    }, { timeout: 60000 });
  }
}
