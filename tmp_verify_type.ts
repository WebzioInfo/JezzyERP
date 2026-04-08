import { Product } from "@prisma/client";

const p: Product = {} as any;
const rate = p.gstRate.toNumber();
console.log(rate);
