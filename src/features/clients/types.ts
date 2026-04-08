export interface Client {
    id: string;
    name: string;
    gst?: string | null;
    email?: string | null;
    phone?: string | null;
    address1: string;
    address2?: string | null;
    pinCode?: string | null;
    state: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}