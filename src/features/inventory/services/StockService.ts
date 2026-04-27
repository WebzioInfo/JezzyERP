import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";
import { serializePrisma } from "@/utils/serialization";

// Re-defining StockLogType locally because the Prisma generator is failing to export it on Windows
export type StockLogType = 'ADD' | 'REMOVE' | 'UPDATE' | 'MANUAL' | 'ADJUSTMENT' | 'RETURN';
export const StockLogType = {
  ADD: 'ADD' as const,
  REMOVE: 'REMOVE' as const,
  UPDATE: 'UPDATE' as const,
  MANUAL: 'MANUAL' as const,
  ADJUSTMENT: 'ADJUSTMENT' as const,
  RETURN: 'RETURN' as const,
};

export class StockService {
  /**
   * Records a stock movement and updates the current stock level.
   */
  static async recordChange(params: {
    productId: string;
    type: StockLogType;
    quantityChange: number;
    referenceId?: string;
    notes?: string;
    tx?: Prisma.TransactionClient;
  }) {
    const { productId, type, quantityChange, referenceId, notes, tx } = params;
    const prisma: any = tx || db;

    // 1. Get current stock
    const currentStock = await prisma.stock.findUnique({
      where: { productId }
    });

    const quantityBefore = currentStock ? Number(currentStock.quantity) : 0;
    const quantityAfter = quantityBefore + quantityChange;

    // 2. Update or Create Stock
    await prisma.stock.upsert({
      where: { productId },
      create: { 
        productId, 
        quantity: quantityAfter 
      },
      update: { 
        quantity: quantityAfter 
      }
    });

    // 3. Create Log
    await prisma.stockLog.create({
      data: {
        productId,
        type,
        quantityBefore,
        quantityChange,
        quantityAfter,
        referenceId,
        notes
      }
    });

    return quantityAfter;
  }

  /**
   * Fetches current stock levels for all products.
   */
  static async getInventoryLevels() {
    const stocks = await (db as any).stock.findMany();
    const stockMap: Record<string, number> = {};
    stocks.forEach((s: any) => {
      stockMap[s.productId] = Number(s.quantity);
    });
    return stockMap;
  }

  /**
   * Fetches stock logs for a specific product or all products.
   */
  static async getStockLogs(productId?: string, limit = 50) {
    const logs = await (db as any).stockLog.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        product: {
          select: { description: true, sku: true }
        }
      }
    });
    return serializePrisma(logs);
  }

  /**
   * Recalculates stock for all products based on Purchase and Invoice history.
   * Use this for initialization or if data becomes inconsistent.
   */
  static async syncAllInventory() {
    return await db.$transaction(async (tx: any) => {
      // Clear current stock and logs
      await tx.stockLog.deleteMany();
      await tx.stock.deleteMany();

      const products = await tx.product.findMany({ where: { deletedAt: null } });
      const purchaseLines = await tx.purchaseLineItem.findMany({
        where: { purchase: { deletedAt: null } },
        select: { productId: true, qty: true, purchaseId: true }
      });
      const invoiceLines = await tx.invoiceLineItem.findMany({
        where: { invoice: { deletedAt: null } },
        select: { productId: true, qty: true, invoiceId: true }
      });

      // Process Purchases
      for (const line of purchaseLines) {
        if (line.productId) {
          await this.recordChange({
            productId: line.productId,
            type: StockLogType.ADD,
            quantityChange: Number(line.qty),
            referenceId: line.purchaseId,
            notes: "Initial Sync - Purchase",
            tx
          });
        }
      }

      // Process Invoices
      for (const line of invoiceLines) {
        if (line.productId) {
          await this.recordChange({
            productId: line.productId,
            type: StockLogType.REMOVE,
            quantityChange: -Number(line.qty),
            referenceId: line.invoiceId,
            notes: "Initial Sync - Invoice",
            tx
          });
        }
      }

      return { success: true, productCount: products.length };
    }, { timeout: 30000 });
  }

  /**
   * Deletes a stock log entry and reverses its effect on the current stock level.
   */
  static async deleteStockLog(logId: string) {
    return await db.$transaction(async (tx: any) => {
      const log = await tx.stockLog.findUnique({ where: { id: logId } });
      if (!log) throw new Error("Stock log not found");

      // Reverse the change in current stock
      await tx.stock.update({
        where: { productId: log.productId },
        data: {
          quantity: { decrement: Number(log.quantityChange) }
        }
      });

      // Delete the log
      await tx.stockLog.delete({ where: { id: logId } });

      return { success: true };
    }, { timeout: 30000 });
  }

  /**
   * Updates an existing stock log and adjusts the current stock level.
   */
  static async updateStockLog(logId: string, newQuantityChange: number, newNotes?: string) {
    return await db.$transaction(async (tx: any) => {
      const oldLog = await tx.stockLog.findUnique({ where: { id: logId } });
      if (!oldLog) throw new Error("Stock log not found");

      const diff = newQuantityChange - Number(oldLog.quantityChange);

      // Adjust the current stock by the difference
      await tx.stock.update({
        where: { productId: oldLog.productId },
        data: {
          quantity: { increment: diff }
        }
      });

      // Update the log
      const updatedLog = await tx.stockLog.update({
        where: { id: logId },
        data: {
          quantityChange: newQuantityChange,
          quantityAfter: Number(oldLog.quantityAfter) + diff,
          notes: newNotes !== undefined ? newNotes : oldLog.notes
        }
      });

      return serializePrisma(updatedLog);
    }, { timeout: 30000 });
  }
}
