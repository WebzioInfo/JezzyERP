import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Purchase } from "@prisma/client";

export class PurchaseRepository extends BaseRepository<Purchase> {
  public model = this.db.purchase;

  async getLatestSequence() {
    const lastPurchase = await this.model.findFirst({
      orderBy: { sequenceNumber: 'desc' },
      select: { sequenceNumber: true },
    });
    return lastPurchase?.sequenceNumber || 0;
  }

  async createWithItems(data: any) {
    return await this.model.create({
      data: {
        ...data,
        lineItems: {
          create: data.lineItems
        }
      },
      include: { lineItems: true }
    });
  }

  async findWithItems(id: string) {
    return await this.model.findUnique({
      where: { id, deletedAt: null },
      include: { lineItems: true, vendor: true }
    });
  }

  async softDelete(id: string, userId?: string): Promise<Purchase> {
    const existing = await this.model.findUnique({ where: { id } });
    if (!existing) throw new Error("Purchase record not found");
    
    return await this.model.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        purchaseNo: `${existing.purchaseNo}-DEL-${Date.now()}`,
        sequenceNumber: -1 * Math.floor(Date.now() / 1000)
      },
    }) as unknown as Purchase;
  }

  async restore(id: string): Promise<Purchase> {
    const existing = await this.model.findUnique({ where: { id } });
    if (!existing) throw new Error("Purchase record not found");

    let originalPurchaseNo = existing.purchaseNo;
    if (originalPurchaseNo.includes("-DEL-")) {
      originalPurchaseNo = originalPurchaseNo.split("-DEL-")[0];
    }

    const restoredSequence = Math.abs(existing.sequenceNumber);

    return await this.model.update({
      where: { id },
      data: { 
        deletedAt: null,
        purchaseNo: originalPurchaseNo,
        sequenceNumber: restoredSequence
      },
    }) as unknown as Purchase;
  }
}
