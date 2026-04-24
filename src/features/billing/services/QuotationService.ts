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
      // Indian FY runs April 1 -> March 31
      const docDate = new Date(data.date);
      const year = docDate.getFullYear();
      const month = docDate.getMonth(); // 0-indexed; March = 2, April = 3
      const fyStartYear = month >= 3 ? year : year - 1;
      const fyEndYear = fyStartYear + 1;
      const fy = `${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;
      const fyStart = new Date(fyStartYear, 3, 1);
      const fyEnd = new Date(fyEndYear, 2, 31, 23, 59, 59, 999);

      // Count quotations in this FY to get next sequence
      const countThisFY = await tx.quotation.count({
          where: {
              date: { gte: fyStart, lte: fyEnd },
              deletedAt: null
          }
      });

      const seq = String(countThisFY + 1).padStart(2, '0');
      const quoNo = `JE/QUO/${seq}/${fy}`;

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
          isFreightCollect: data.isFreightCollect || false,
          freightAmount: data.freightAmount || 0,
          freightTaxPercent: data.freightTaxPercent || 0,
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
              product: item.productId ? { connect: { id: item.productId } } : undefined,
              description: item.description,
              hsn: item.hsn,
              qty: parseFloat(item.qty),
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              pkgCount: item.pkgCount || 0,
              pkgType: item.pkgType || "BOX",
              qtyPerBox: item.qtyPerBox || 0,
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
      // Indian FY runs April 1 -> March 31
      const docDate = new Date(); // Use current date for converted invoice
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
      const settings = await tx.companySetting.findFirst();
      const prefix = settings?.invoicePrefix || "B2B";
      const invNo = `JE/${prefix}/${seq}/${fy}`;

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
          isFreightCollect: quotation.isFreightCollect,
          freightAmount: quotation.freightAmount,
          freightTaxPercent: quotation.freightTaxPercent,

          lineItems: {
            create: quotation.lineItems.map((item: any) => ({
              product: item.productId ? { connect: { id: item.productId } } : undefined,
              description: item.description,
              qty: item.qty,
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              totalAmount: item.totalAmount,
              hsn: item.hsn,
              pkgCount: item.pkgCount || 0,
              pkgType: item.pkgType || "BOX",
              qtyPerBox: item.qtyPerBox || 0,
            }))
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

  /**
   * Soft deletes a quotation.
   */
  static async softDeleteQuotation(quotationId: string, userId: string | null) {
    return await db.quotation.update({
      where: { id: quotationId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Restores a soft-deleted quotation.
   */
  static async restoreQuotation(quotationId: string, userId: string | null) {
    return await db.quotation.update({
      where: { id: quotationId },
      data: { deletedAt: null },
    });
  }

  /**
   * Permanently deletes a quotation.
   */
  static async permanentlyDeleteQuotation(quotationId: string, userId: string | null) {
    return await db.quotation.delete({
      where: { id: quotationId },
    });
  }
}
