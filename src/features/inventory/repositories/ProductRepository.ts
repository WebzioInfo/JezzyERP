import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Product } from "../types";

export class ProductRepository extends BaseRepository<Product> {
  public model = this.db.product;
}
