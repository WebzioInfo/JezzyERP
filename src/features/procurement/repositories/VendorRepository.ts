import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Vendor } from "@prisma/client";

export class VendorRepository extends BaseRepository<Vendor> {
  public model = this.db.vendor;

  async findAll() {
    return await this.model.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string) {
    return await this.model.findUnique({
      where: { id, deletedAt: null }
    });
  }
}
