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
      // Sequence Generation
      const lastSequence = await tx.purchase.findFirst({
        orderBy: { sequenceNumber: 'desc' },
        select: { sequenceNumber: true },
      });
      
      const nextSequence = (lastSequence?.sequenceNumber || 0) + 1;
      const purchaseNo = `PUR-${new Date().getFullYear()}-${String(nextSequence).padStart(3, '0')}`;

      return await tx.purchase.create({
        data: {
          ...purchaseData,
          purchaseNo,
          sequenceNumber: nextSequence,
          createdById: userId,
          lineItems: {
            create: items.map((item: any) => ({
              description: item.description,
              qty: item.qty,
              rate: item.rate,
              taxPercent: item.taxPercent,
              taxAmount: item.taxAmount,
              totalAmount: item.totalAmount,
              hsn: item.hsn,
              productId: item.productId,
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
