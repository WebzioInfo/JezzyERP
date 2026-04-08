import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";
import { recordAuditLog } from "@/lib/audit";

export class QuotationService {
  /**
   * Creates a new quotation with line items.
   */
  static async createQuotation(userId: string | null, data: any) {
    return await db.$transaction(async (tx) => {
      // 1. Get next sequence number for quotations
      const lastQuo = await tx.quotation.findFirst({
        orderBy: { sequenceNumber: "desc" },
      });
      const nextSeq = (lastQuo?.sequenceNumber || 0) + 1;
      const quoNo = `QUO-2026-${nextSeq.toString().padStart(3, "0")}`;

      // 2. Create the quotation
      const quotation = await tx.quotation.create({
        data: {
          clientId: data.clientId,
          sequenceNumber: nextSeq,
          quotationNo: quoNo,
          date: new Date(data.date),
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          gstType: data.gstType,
          subTotal: data.subTotal,
          taxTotal: data.taxTotal,
          grandTotal: data.grandTotal,
          notes: data.notes,
          createdById: userId,

          // Address snapshots
          billingName: data.billingAddress?.name,
          billingAddress1: data.billingAddress?.address1,
          billingAddress2: data.billingAddress?.address2,
          billingState: data.billingAddress?.state,
          billingPinCode: data.billingAddress?.pinCode,
          billingPhone: data.billingAddress?.phone,
          billingGst: data.billingAddress?.gst,
          shippingSameAsBilling: data.shippingSameAsBilling,
          shippingName: data.shippingSameAsBilling ? data.billingAddress?.name : data.shippingAddress?.name,
          shippingAddress1: data.shippingSameAsBilling ? data.billingAddress?.address1 : data.shippingAddress?.address1,
          shippingAddress2: data.shippingSameAsBilling ? data.billingAddress?.address2 : data.shippingAddress?.address2,
          shippingState: data.shippingSameAsBilling ? data.billingAddress?.state : data.shippingAddress?.state,
          shippingPinCode: data.shippingSameAsBilling ? data.billingAddress?.pinCode : data.shippingAddress?.pinCode,

          lineItems: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              description: item.description,
              hsn: item.hsn,
              qty: parseFloat(item.qty),
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              totalAmount: item.totalAmount,
            })),
          },
        },
      });

      // 3. Audit Log
      await recordAuditLog(tx, {
        userId,
        action: "QUOTATION_CREATED",
        entityType: "Quotation",
        entityId: quotation.id,
        details: { quotationNo: quoNo, grandTotal: data.grandTotal },
      });

      return serializePrisma(quotation);
    }, { timeout: 15000 });
  }

  /**
   * Fetches all quotations including client name.
   */
  static async getAllQuotations() {
    const quotations = await db.quotation.findMany({
      where: { deletedAt: null },
      orderBy: { date: "desc" },
      include: {
        client: { select: { name: true } },
      },
    });
    return serializePrisma(quotations);
  }

  /**
   * Converts a quotation into an invoice.
   */
  static async convertToInvoice(userId: string | null, quotationId: string) {
    return await db.$transaction(async (tx) => {
      const quotation = await tx.quotation.findUnique({
        where: { id: quotationId },
        include: { lineItems: true },
      });

      if (!quotation) throw new Error("Quotation not found");
      if (quotation.status === "CONVERTED") throw new Error("Already converted");

      // 1. Get next invoice sequence
      const lastInv = await tx.invoice.findFirst({
        orderBy: { sequenceNumber: "desc" },
      });
      const nextSeq = (lastInv?.sequenceNumber || 0) + 1;
      const invNo = `INV-2026-${nextSeq.toString().padStart(3, "0")}`;

      // 2. Create the Invoice
      const invoice = await tx.invoice.create({
        data: {
          clientId: quotation.clientId,
          sequenceNumber: nextSeq,
          invoiceNo: invNo,
          date: new Date(),
          gstType: quotation.gstType,
          subTotal: quotation.subTotal,
          taxTotal: quotation.taxTotal,
          grandTotal: quotation.grandTotal,
          status: "DRAFT",
          createdById: userId,

          // Transfer address snapshots from quotation
          billingName: quotation.billingName,
          billingAddress1: quotation.billingAddress1,
          billingAddress2: quotation.billingAddress2,
          billingState: quotation.billingState,
          billingPinCode: quotation.billingPinCode,
          billingPhone: quotation.billingPhone,
          billingGst: quotation.billingGst,
          shippingSameAsBilling: quotation.shippingSameAsBilling,
          shippingName: quotation.shippingName,
          shippingAddress1: quotation.shippingAddress1,
          shippingAddress2: quotation.shippingAddress2,
          shippingState: quotation.shippingState,
          shippingPinCode: quotation.shippingPinCode,

          lineItems: {
            create: quotation.lineItems.map((item) => ({
              productId: item.productId,
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              totalAmount: item.totalAmount,
            })),
          },
        },
      });

      // 3. Update Quotation status
      await tx.quotation.update({
        where: { id: quotationId },
        data: {
          status: "CONVERTED",
          convertedInvoiceId: invoice.id,
        },
      });

      // 4. Audit Log
      await recordAuditLog(tx, {
        userId,
        action: "QUOTATION_CONVERTED",
        entityType: "Quotation",
        entityId: quotationId,
        details: { quotationNo: quotation.quotationNo, invoiceNo: invNo },
      });

      return serializePrisma(invoice);
    }, { timeout: 15000 });
  }
}
