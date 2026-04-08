import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Invoice } from "@/types/invoice";

export class InvoiceRepository extends BaseRepository<Invoice> {
  public model = this.db.invoice;

  async getLatestSequence() {
    const lastInvoice = await this.model.findFirst({
      orderBy: { sequenceNumber: 'desc' },
      select: { sequenceNumber: true },
    });
    return lastInvoice?.sequenceNumber || 0;
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
      include: { lineItems: true, client: true }
    });
  }

  async updateWithItems(id: string, data: any) {
    const { lineItems, ...invoiceData } = data;
    
    return await this.db.$transaction(async (tx) => {
      // 0. Ensure invoice exists and is not deleted
      const existing = await tx.invoice.findUnique({
        where: { id, deletedAt: null }
      });
      if (!existing) throw new Error("Invoice record not found or inaccessible.");

      // 1. Delete existing items
      await tx.invoiceLineItem.deleteMany({
        where: { invoiceId: id }
      });

      // 2. Update invoice and create new items
      return await tx.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          lineItems: {
            create: lineItems
          }
        },
        include: { lineItems: true }
      });
    }, { timeout: 15000 });
  }
}
