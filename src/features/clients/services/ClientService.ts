import { ClientRepository } from "../repositories/ClientRepository";
import { validateData } from "@/lib/validation";
import { clientSchema } from "../validators/clientSchema";
import { serializePrisma } from "@/utils/serialization";
import { recordAuditLog } from "@/lib/audit";

const clientRepo = new ClientRepository();

export class ClientService {
  static async createClient(userId: string, rawData: any) {
    const validatedData = await validateData(clientSchema, rawData);
    
    const client = await clientRepo.model.create({
      data: {
        ...validatedData,
        createdById: userId,
      }
    });

    await recordAuditLog(clientRepo.db, {
      userId,
      action: "CLIENT_CREATED",
      entityType: "Client",
      entityId: client.id,
    });

    return serializePrisma(client);
  }

  static async updateClient(userId: string, clientId: string, rawData: any) {
    const validatedData = await validateData(clientSchema, rawData);
    
    const client = await clientRepo.model.update({
      where: { id: clientId },
      data: validatedData
    });

    await recordAuditLog(clientRepo.db, {
      userId,
      action: "CLIENT_UPDATED",
      entityType: "Client",
      entityId: client.id,
    });

    return serializePrisma(client);
  }

  static async deleteClient(userId: string, clientId: string) {

    return await clientRepo.softDelete(clientId, userId);
  }

  static async getAllActive(search?: string) {
    const clients = await clientRepo.findAll({
      where: {
        deletedAt: null,
        ...(search ? {
            OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { gst: { contains: search } }
            ]
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    return serializePrisma(clients);
  }
}
