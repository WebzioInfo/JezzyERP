import { VendorRepository } from "../repositories/VendorRepository";
import { db } from "@/db/prisma/client";

const vendorRepo = new VendorRepository();

export class VendorService {
  async getAllVendors() {
    return await vendorRepo.findAll();
  }

  async getVendorById(id: string) {
    return await vendorRepo.findById(id);
  }

  async createVendor(data: any) {
    return await vendorRepo.model.create({
      data: {
        ...data,
        active: true
      }
    });
  }

  async updateVendor(id: string, data: any) {
    return await vendorRepo.model.update({
      where: { id },
      data
    });
  }

  async deleteVendor(id: string) {
    return await vendorRepo.model.update({
      where: { id },
      data: { deletedAt: new Date(), active: false }
    });
  }
}
