import { ProductRepository } from "../repositories/ProductRepository";
import { validateData } from "@/lib/validation";
import { productSchema } from "../validators/productSchema";
import { serializePrisma } from "@/utils/serialization";
import { recordAuditLog } from "@/lib/audit";

const productRepo = new ProductRepository();

export class ProductService {
  static async createProduct(userId: string, data: any) {
    const validatedData = await validateData(productSchema, data);
    const product = await productRepo.model.create({
      data: validatedData
    });

    await recordAuditLog(productRepo.db, {
      userId,
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      details: validatedData,
    });

    return product;
  }

  static async updateProduct(userId: string, productId: string, rawData: any) {
    const validatedData = await validateData(productSchema, rawData);
    
    const product = await productRepo.model.update({
      where: { id: productId },
      data: validatedData,
    });

    await recordAuditLog(productRepo.db, {
      userId,
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: productId,
      details: validatedData,
    });

    return product;
  }

  static async deleteProduct(userId: string, productId: string) {
    return await productRepo.softDelete(productId, userId);
  }

  static async getAllActive() {
    const products = await productRepo.findAll({
      where: { deletedAt: null },
      orderBy: { description: 'asc' }
    });

    return serializePrisma(products);
  }
}
