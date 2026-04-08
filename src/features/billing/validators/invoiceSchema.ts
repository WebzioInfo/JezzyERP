import { z } from "zod";

export const invoiceLineItemSchema = z.object({
    productId: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    hsn: z.string().optional(),
    qty: z.number().positive("Quantity must be greater than 0"),
    rate: z.number().positive("Rate must be greater than 0"),
    taxPercent: z.number().min(0, "GST % cannot be negative"),
    taxAmount: z.number().min(0),
    unit: z.string().optional().default("NOS"),
    pkgCount: z.number().int().min(0).optional().default(0),
    pkgType: z.string().optional().default("BOX"),
    totalAmount: z.number().positive(),
});

export const invoiceSchema = z.object({
    clientId: z.string().min(1, "Please select a client"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    invoiceNo: z.string().optional(),
    gstType: z.enum(["CGST_SGST", "IGST", "NO_GST"]),

    // Totals
    subTotal: z.number().min(0),
    taxTotal: z.number().min(0),
    grandTotal: z.number().min(0),

    // Logistics
    ewayBill: z.string().optional(),
    vehicleNo: z.string().optional(),
    dispatchedThrough: z.string().optional(),

    // Address Snapshots
    billingAddress: z.object({
        name: z.string(),
        address1: z.string(),
        address2: z.string().optional(),
        state: z.string(),
        pinCode: z.string().optional(),
        phone: z.string().optional(),
        gst: z.string().optional()
    }).optional(),
    shippingAddress: z.object({
        name: z.string(),
        address1: z.string(),
        address2: z.string().optional(),
        state: z.string(),
        pinCode: z.string().optional(),
        phone: z.string().optional(),
        gst: z.string().optional()
    }).optional(),
    shippingSameAsBilling: z.boolean().default(true),

    items: z.array(invoiceLineItemSchema).min(1, "At least one item is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
