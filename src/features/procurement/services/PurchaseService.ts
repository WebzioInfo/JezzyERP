import { PurchaseRepository } from "../repositories/PurchaseRepository";
import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";
import { StockService, StockLogType } from "@/features/inventory/services/StockService";
import { serializePrisma } from "@/utils/serialization";

const purchaseRepo = new PurchaseRepository();

export class PurchaseService {
  async getAllPurchases() {
    const purchases = await purchaseRepo.model.findMany({
      where: { deletedAt: null },
      include: { vendor: true },
      orderBy: { date: 'desc' }
    });
    return serializePrisma(purchases);
  }

  async getPurchaseById(id: string) {
    const purchase = await purchaseRepo.findWithItems(id);
    return serializePrisma(purchase);
  }

  async createPurchase(userId: string, data: any) {
    const { items, grandTotal, ...purchaseData } = data;

    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Sequence Generation per Financial Year
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const fyStart = new Date(month >= 3 ? year : year - 1, 3, 1);
      const fyEnd = new Date(month >= 3 ? year + 1 : year, 2, 31, 23, 59, 59);
      const fyStr = month >= 3 ? `${year % 100}-${(year + 1) % 100}` : `${(year - 1) % 100}-${year % 100}`;

      const countThisFY = await tx.purchase.count({
        where: { date: { gte: fyStart, lte: fyEnd }, deletedAt: null }
      });
      
      const nextSequence = countThisFY + 1;
      const purchaseNo = `JE/PUR/${String(nextSequence).padStart(2, '0')}/${fyStr}`;

      const purchase = await tx.purchase.create({
        data: {
          ...purchaseData,
          grandTotal: Math.round(Number(grandTotal)),
          purchaseNo,
          sequenceNumber: nextSequence,
          createdById: userId,
          isFreightCollect: data.isFreightCollect || false,
          freightAmount: data.freightAmount || 0,
          freightTaxPercent: data.freightTaxPercent || 0,
          lineItems: {
            create: items.map((item: any) => ({
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
            }))
          }
        },
        include: { lineItems: true }
      });

      // Update Stock (Inward)
      for (const item of purchase.lineItems) {
        if (item.productId) {
          await StockService.recordChange({
            productId: item.productId,
            type: StockLogType.ADD,
            quantityChange: Number(item.qty),
            referenceId: purchase.id,
            notes: `Purchase ${purchase.purchaseNo} Recorded`,
            tx
          });
        }
      }

      return serializePrisma(purchase);
    }, { timeout: 30000 });
  }

  async deletePurchase(id: string) {
    const purchase = await purchaseRepo.softDelete(id);
    
    // Reverse Stock (Remove)
    await db.$transaction(async (tx) => {
        const fullPurchase = await tx.purchase.findUnique({
            where: { id },
            include: { lineItems: true }
        });
        if (fullPurchase) {
            for (const item of fullPurchase.lineItems) {
                if (item.productId) {
                    await StockService.recordChange({
                        productId: item.productId,
                        type: StockLogType.REMOVE,
                        quantityChange: -Number(item.qty),
                        referenceId: id,
                        notes: `Purchase ${fullPurchase.purchaseNo} Trashed (Stock Removed)`,
                        tx
                    });
                }
            }
        }
    }, { timeout: 30000 });

    return serializePrisma(purchase);
  }

  async restorePurchase(id: string, userId: string) {
    const purchase = await purchaseRepo.restore(id);

    // Re-apply Stock (ADD)
    await db.$transaction(async (tx) => {
        const fullPurchase = await tx.purchase.findUnique({
            where: { id },
            include: { lineItems: true }
        });
        if (fullPurchase) {
            for (const item of fullPurchase.lineItems) {
                if (item.productId) {
                    await StockService.recordChange({
                        productId: item.productId,
                        type: StockLogType.ADD,
                        quantityChange: Number(item.qty),
                        referenceId: id,
                        notes: `Purchase ${fullPurchase.purchaseNo} Restored`,
                        tx
                    });
                }
            }
        }
    }, { timeout: 30000 });

    return serializePrisma(purchase);
  }

  async permanentlyDeletePurchase(id: string, userId: string) {
    return await purchaseRepo.model.delete({
      where: { id }
    });
  }
}
