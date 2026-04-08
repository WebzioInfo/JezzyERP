import { BaseRepository } from "@/lib/repositories/BaseRepository";
import { Client } from "../types";

export class ClientRepository extends BaseRepository<Client> {
  public model = this.db.client;
}
