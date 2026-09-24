import { db } from "@/db/prisma/client";
import { serializePrisma } from "@/utils/serialization";

export interface SearchResultItem {
  id: string;
  type: 'CLIENT' | 'VENDOR' | 'INVOICE' | 'PURCHASE' | 'PRODUCT' | 'PAYMENT';
  title: string;
  subtitle: string;
  amount?: string;
  status?: string;
  date?: string;
  url: string;
}

export class GlobalSearchService {
  static async search(query: string, companyId?: string): Promise<SearchResultItem[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.trim();

    // Run parallel database queries for efficiency
    const [clients, vendors, invoices, purchases, products, payments] = await Promise.all([
      // 1. Clients / Customers
      db.client.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
            { gst: { contains: q } }
          ]
        },
        take: 5
      }),

      // 2. Vendors / Suppliers
      db.vendor.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
            { gst: { contains: q } }
          ]
        },
        take: 5
      }),

      // 3. Sales Invoices
      db.invoice.findMany({
        where: {
          deletedAt: null,
          OR: [
            { invoiceNo: { contains: q } },
            { billingName: { contains: q } },
            { vehicleNo: { contains: q } }
          ]
        },
        take: 6,
        orderBy: { createdAt: 'desc' }
      }),

      // 4. Purchase Invoices
      db.purchase.findMany({
        where: {
          deletedAt: null,
          OR: [
            { purchaseNo: { contains: q } },
            { vendor: { name: { contains: q } } }
          ]
        },
        include: { vendor: { select: { name: true } } },
        take: 6,
        orderBy: { createdAt: 'desc' }
      }),

      // 5. Products Catalog
      db.product.findMany({
        where: {
          deletedAt: null,
          OR: [
            { description: { contains: q } },
            { sku: { contains: q } },
            { hsn: { contains: q } }
          ]
        },
        take: 5
      }),

      // 6. Payment Receipts
      db.payment.findMany({
        where: {
          deletedAt: null,
          OR: [
            { reference: { contains: q } },
            { notes: { contains: q } }
          ]
        },
        take: 5,
        orderBy: { paidAt: 'desc' }
      })
    ]);

    const results: SearchResultItem[] = [];

    // Map Clients
    clients.forEach((c) => {
      results.push({
        id: c.id,
        type: 'CLIENT',
        title: c.name,
        subtitle: `Customer • GST: ${c.gst || 'N/A'} • ${c.phone || c.email || 'No contact'}`,
        status: c.active ? 'ACTIVE' : 'INACTIVE',
        url: `/clients/${c.id}`
      });
    });

    // Map Vendors
    vendors.forEach((v) => {
      results.push({
        id: v.id,
        type: 'VENDOR',
        title: v.name,
        subtitle: `Supplier • GST: ${v.gst || 'N/A'} • ${v.phone || v.email || 'No contact'}`,
        status: v.active ? 'ACTIVE' : 'INACTIVE',
        url: `/vendors/${v.id}`
      });
    });

    // Map Invoices
    invoices.forEach((inv) => {
      const amt = `₹${inv.grandTotal.toNumber().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      const dt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(inv.date));
      results.push({
        id: inv.id,
        type: 'INVOICE',
        title: `Invoice #${inv.invoiceNo}`,
        subtitle: `${inv.billingName || 'Customer'} • ${dt}`,
        amount: amt,
        status: inv.isFinalized ? 'FINALIZED' : 'DRAFT',
        date: dt,
        url: `/invoices/${inv.id}`
      });
    });

    // Map Purchases
    purchases.forEach((pur: any) => {
      const amt = `₹${pur.grandTotal.toNumber().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      const dt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(pur.date));
      results.push({
        id: pur.id,
        type: 'PURCHASE',
        title: `Purchase #${pur.purchaseNo}`,
        subtitle: `${pur.vendor?.name || 'Vendor'} • ${dt}`,
        amount: amt,
        date: dt,
        url: `/purchases/${pur.id}`
      });
    });

    // Map Products
    products.forEach((p) => {
      const rate = `₹${p.sellingRate.toNumber().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      results.push({
        id: p.id,
        type: 'PRODUCT',
        title: p.description,
        subtitle: `SKU: ${p.sku || 'N/A'} • HSN: ${p.hsn || 'N/A'}`,
        amount: rate,
        status: p.active ? 'IN STOCK' : 'INACTIVE',
        url: `/products`
      });
    });

    // Map Payments
    payments.forEach((pay) => {
      const amt = `₹${pay.amount.toNumber().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      const dt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(pay.paidAt));
      results.push({
        id: pay.id,
        type: 'PAYMENT',
        title: `Payment ${pay.method}`,
        subtitle: `Ref: ${pay.reference || pay.id} • ${dt}`,
        amount: amt,
        date: dt,
        url: `/payments`
      });
    });

    return serializePrisma(results);
  }
}
