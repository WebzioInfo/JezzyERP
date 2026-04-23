import { PurchaseRepository } from "../repositories/PurchaseRepository";
import { db } from "@/db/prisma/client";
import { Prisma } from "@prisma/client";

const purchaseRepo = new PurchaseRepository();

export class PurchaseService {
  async getAllPurchases() {
    return await purchaseRepo.model.findMany({
      where: { deletedAt: null },
      include: { vendor: true },
      orderBy: { date: 'desc' }
    });
  }

  async getPurchaseById(id: string) {
    return await purchaseRepo.findWithItems(id);
  }

  async createPurchase(userId: string, data: any) {
    const { items, ...purchaseData } = data;

    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Sequence Generation per Financial Year
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const fyStart = new Date(month >= 3 ? year : year - 1, 3, 1);
      const fyEnd = new Date(month >= 3 ? year + 1 : year, 2, 31, 23, 59, 59);
      const fyStr = month >= 3 ? `${year % 100}-${(year + 1) % 100}` : `${(year - 1) % 100}-${year % 100}`;

      const countThisFY = await tx.purchase.count({
        where: { date: { gte: fyStart, lte: fyEnd } }
      });
      
      const nextSequence = countThisFY + 1;
      const purchaseNo = `JE/PUR/${String(nextSequence).padStart(2, '0')}/${fyStr}`;

      return await tx.purchase.create({
        data: {
          ...purchaseData,
          purchaseNo,
          sequenceNumber: nextSequence, // Note: This might not be globally unique but that's okay if we use it with FY
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
    });
  }

  async deletePurchase(id: string) {
    return await purchaseRepo.model.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
