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
}
