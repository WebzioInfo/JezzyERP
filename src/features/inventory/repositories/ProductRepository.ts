import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Product } from "../types";

export class ProductRepository extends BaseRepository<Product> {
  public model = this.db.product;

  async softDelete(id: string, userId?: string): Promise<Product> {
    const existing = await this.model.findUnique({ where: { id } });
    if (!existing) throw new Error("Product not found");
    
    return await this.model.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        sku: existing.sku ? `${existing.sku}-DEL-${Date.now()}` : null
      },
    }) as unknown as Product;
  }
}
