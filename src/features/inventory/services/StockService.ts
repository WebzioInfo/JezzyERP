import { db } from "@/db/prisma/client";

export class StockService {
  static async getInventoryLevels() {
    const [products, purchaseLines, invoiceLines] = await Promise.all([
      db.product.findMany({ where: { deletedAt: null } }),
      db.purchaseLineItem.findMany({
        where: { purchase: { deletedAt: null } },
        select: { productId: true, qty: true }
      }),
      db.invoiceLineItem.findMany({
        where: { invoice: { deletedAt: null } },
        select: { productId: true, qty: true }
      })
    ]);

    const stockMap: Record<string, number> = {};

    // Initial state: 0 for all active products
    products.forEach(p => stockMap[p.id] = 0);

    // Add Purchases (Inward)
    purchaseLines.forEach(line => {
      if (line.productId && stockMap[line.productId] !== undefined) {
        stockMap[line.productId] += line.qty.toNumber();
      }
    });

    // Subtract Sales (Outward)
    invoiceLines.forEach(line => {
      if (line.productId && stockMap[line.productId] !== undefined) {
        stockMap[line.productId] -= line.qty.toNumber();
      }
    });

    return stockMap;
  }
}
