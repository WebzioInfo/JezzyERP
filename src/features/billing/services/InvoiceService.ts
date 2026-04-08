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
        
        // JE/B2B/01/24-25 Format
        const docDate = new Date(validatedData.date);
        const year = docDate.getFullYear();
        const month = docDate.getMonth(); // 0-11
        
        let fy = "";
        if (month >= 3) { // April is index 3
            fy = `${String(year).slice(-2)}-${String(year+1).slice(-2)}`;
        } else {
            fy = `${String(year-1).slice(-2)}-${String(year).slice(-2)}`;
        }
        
        const seq = String(nextSequence).padStart(2, '0');
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
              productId: item.productId,
              description: item.description,
              hsn: item.hsn,
              qty: item.qty,
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              unit: item.unit || "NOS",
              pkgCount: item.pkgCount || 0,
              pkgType: item.pkgType || "BOX",
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
      clientId: validatedData.clientId,
      date: new Date(validatedData.date),
      gstType: validatedData.gstType,
      subTotal: validatedData.subTotal,
      taxTotal: validatedData.taxTotal,
      grandTotal: validatedData.grandTotal,
      ewayBill: validatedData.ewayBill,
      vehicleNo: validatedData.vehicleNo,
      invoiceNo: validatedData.invoiceNo,
      dispatchedThrough: validatedData.dispatchedThrough,

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
        productId: item.productId,
        description: item.description,
        hsn: item.hsn,
        qty: item.qty,
        rate: item.rate,
        taxPercent: item.taxPercent,
        taxAmount: item.taxAmount,
        unit: item.unit || "NOS",
        pkgCount: item.pkgCount || 0,
        pkgType: item.pkgType || "BOX",
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
}
