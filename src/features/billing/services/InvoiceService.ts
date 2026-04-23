import { Prisma } from "@prisma/client";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { validateData } from "@/lib/validation";
import { invoiceSchema } from "../validators/invoiceSchema";
import { serializePrisma } from "@/utils/serialization";
import { db } from "@/db/prisma/client";
import { recordAuditLog } from "@/lib/audit";

const invoiceRepo = new InvoiceRepository();

export class InvoiceService {
  async createInvoice(userId: string, rawData: any) {
    // 1. Validation
    const validatedData = await validateData(invoiceSchema, rawData);

    return await invoiceRepo.db.$transaction(async (tx: Prisma.TransactionClient) => {
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
                date: { gte: fyStart, lte: fyEnd }
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
          subTotal: validatedData.subTotal,
          taxTotal: validatedData.taxTotal,
          grandTotal: validatedData.grandTotal,
          ewayBill: validatedData.ewayBill,
          vehicleNo: validatedData.vehicleNo,
          dispatchedThrough: validatedData.dispatchedThrough,
          isFreightCollect: validatedData.isFreightCollect,
          freightAmount: validatedData.freightAmount ?? 0,
          freightTaxPercent: validatedData.freightTaxPercent ?? 0,

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

          lineItems: {
            create: validatedData.items.map((item: any) => ({
              product: item.productId ? { connect: { id: item.productId } } : undefined,
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              unit: item.unit || "NOS",
              pkgCount: item.pkgCount || 0,
              pkgType: item.pkgType || "BOX",
              qtyPerBox: item.qtyPerBox || 0,
              totalAmount: item.totalAmount
            }))
          }
        }
      });

      // 4. Audit
      await recordAuditLog(tx, {
        userId,
        action: "INVOICE_CREATED",
        entityType: "Invoice",
        entityId: invoice.id,
        details: { invoiceNo }
      });

      return serializePrisma(invoice);
    }, { timeout: 15000 });
  }

  async getInvoices() {
    const invoices = await invoiceRepo.findAll({
      include: { client: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    return serializePrisma(invoices);
  }

  async updateInvoice(invoiceId: string, userId: string, rawData: any) {
    const validatedData = await validateData(invoiceSchema, rawData);
    
    const invoice = await invoiceRepo.updateWithItems(invoiceId, {
      date: new Date(validatedData.date),
      gstType: validatedData.gstType,
      subTotal: validatedData.subTotal,
      taxTotal: validatedData.taxTotal,
      grandTotal: validatedData.grandTotal,
      ewayBill: validatedData.ewayBill,
      vehicleNo: validatedData.vehicleNo,
      invoiceNo: validatedData.invoiceNo,
      dispatchedThrough: validatedData.dispatchedThrough,
      isFreightCollect: validatedData.isFreightCollect,
      freightAmount: validatedData.freightAmount ?? 0,
      freightTaxPercent: validatedData.freightTaxPercent ?? 0,

      // Use Prisma relation syntax for client
      client: { connect: { id: validatedData.clientId } },

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

      lineItems: validatedData.items.map((item: any) => ({
        product: item.productId ? { connect: { id: item.productId } } : undefined,
        description: item.description,
        hsn: item.hsn,
        qty: item.qty,
        rate: item.rate,
        taxPercent: item.taxPercent,
        taxAmount: item.taxAmount,
        unit: item.unit || "NOS",
        pkgCount: item.pkgCount || 0,
        pkgType: item.pkgType || "BOX",
        qtyPerBox: item.qtyPerBox || 0,
        totalAmount: item.totalAmount
      }))
    });

    // Audit
    await recordAuditLog(db, {
      userId,
      action: "INVOICE_UPDATED",
      entityType: "Invoice",
      entityId: invoice.id,
      details: { invoiceNo: invoice.invoiceNo }
    });

    return serializePrisma(invoice);
  }

  async softDeleteInvoice(invoiceId: string, userId: string) {
    const invoice = await invoiceRepo.softDelete(invoiceId, userId);
    
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
    const invoice = await invoiceRepo.model.update({
      where: { id: invoiceId },
      data: { deletedAt: null } as any
    });

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
