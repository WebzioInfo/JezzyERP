import { z } from "zod";

const coerceRate = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? 0 : val),
  z.coerce.number().min(0)
);

export const productSchema = z.object({
  sku: z.string().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  hsn: z.string().optional().nullable(),
  purchaseRate: coerceRate,
  sellingRate: coerceRate,
  gstRate: z.coerce.number().min(0, "GST rate must be positive"),
  unit: z.string().nullish().transform(v => v || ""),
  notes: z.string().optional().nullable(),
  pkgType: z.string().nullish().transform(v => v || ""),
  qtyPerBox: z.coerce.number().min(0).default(0),
  active: z.boolean().optional().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
