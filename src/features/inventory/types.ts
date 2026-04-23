export interface Product {
    id: string;
    description: string;
    sku?: string | null;
    hsn?: string | null;
    purchaseRate: number;
    sellingRate: number;
    gstRate: number;
    unit?: string;
    notes?: string | null;
    pkgType?: string;
    qtyPerBox: number | any;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}