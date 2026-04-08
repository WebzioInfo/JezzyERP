import { Product } from "@/features/inventory/types";


export const calculateTotals = (products: Product[]) => {
  return products.reduce(
    (acc, p) => {
      const qty = p.qty ?? 0;
      const rate = Number(p.rate) || 0;
      const gstRate = Number(p.gstRate) || 0;

      const amount = qty * rate;

      acc.subTotal += amount;
      acc.gstTotal += (amount * gstRate) / 100;

      return acc;
    },
    { subTotal: 0, gstTotal: 0 }
  );
};
