import { Product } from "@/features/inventory/types";
import { Client } from "@/features/clients/types";

export type Address = {
  name: string;
  address1: string;
  address2?: string | null;
  gst?: string | null;
  phone?: string | null;
  state: string;
  pinCode?: string | null;
};

export type Logistics = {
  ewayBill?: string | null;
  vehicleNo?: string | null;
  dispatchedThrough?: string | null;
};

export type Invoice = {
  id: string;
  clientId: string;
  invoiceNo: string;
  date: Date;
  gstType: "CGST_SGST" | "IGST" | "NO_GST";
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  status: string;
  logistics?: Logistics;
  notes?: string | null;
  client?: Client;
  lineItems?: any[];
  deletedAt?: Date | null;

  // Address Snapshots
  billingAddress?: Address;
  shippingAddress?: Address;
  shippingSameAsBilling?: boolean;
};

export type Quotation = {
  id: string;
  clientId: string;
  quotationNo: string;
  date: Date;
  validUntil?: Date | null;
  gstType: "CGST_SGST" | "IGST" | "NO_GST";
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: string;
  notes?: string | null;
  client?: Client;
  lineItems?: any[];
  deletedAt?: Date | null;

  // Address Snapshots
  billingAddress?: Address;
  shippingAddress?: Address;
  shippingSameAsBilling?: boolean;
};
