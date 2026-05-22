import { ZodSchema } from "zod";

export class ValidationError extends Error {
  constructor(public errors: any) {
    super("Validation Failed");
    this.name = "ValidationError";
  }
}

export async function validateData<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

export function handleActionError(error: any) {
  console.error("Action Error:", error);
  
  if (error instanceof ValidationError) {
    return { error: "Validation failed", fields: error.errors };
  }
  
  // Handle Prisma Unique Constraint Violations gracefully
  if (error?.code === 'P2002') {
    const target = error.meta?.target;
    const targetStr = Array.isArray(target) ? target.join(', ') : (target || 'field');
    
    if (targetStr.includes('sku')) {
      return { error: "A product with this SKU already exists in your catalog. SKUs must be unique." };
    }
    if (targetStr.includes('invoiceNo')) {
      return { error: "This Invoice Number is already in use." };
    }
    return { error: `A record with this unique value already exists (${targetStr}).` };
  }
  
  return { error: error.message || "An unexpected error occurred" };
}
