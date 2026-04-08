import { db } from "@/db/prisma/client";

export abstract class BaseRepository<T extends { id: string; deletedAt?: Date | null }> {
  public db = db;
  protected abstract model: any;

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findActive(): Promise<T[]> {
    return await this.model.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(options: { where?: any; take?: number; skip?: number; include?: any; orderBy?: any } = {}): Promise<T[]> {
    const { where, take = 50, skip, ...rest } = options;
    return await this.model.findMany({
      where: { 
        deletedAt: null,
        ...where 
      },
      take,
      skip,
      ...rest,
    });
  }

  async count(where: any = {}): Promise<number> {
    return await this.model.count({
      where: { deletedAt: null, ...where },
    });
  }

  async softDelete(id: string, userId?: string): Promise<T> {
    return await this.model.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        updatedById: userId 
      },
    });
  }
}
